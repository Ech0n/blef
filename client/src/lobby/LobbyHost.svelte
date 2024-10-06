<script lang="ts">
    import { ConnectionHandler } from 'src/ConnectoinHandler'
    import { AppState } from 'src/StateTypes'
    import { createEventDispatcher, onMount } from 'svelte'
    import { toasts } from 'svelte-toasts'
    import type { GameState, gameStartPayload, playerJoinedPayload } from '../../../common/payloads'
    import { SocketEventsCommon, SocketEventsFromHost } from '../../../src/types/socketEvents'
    import { GameServer } from '../game/GameServer'
    import { playersStore, readyPlayersCounter } from '../game/stores'
    import { initalizeCountTable, initalizeGame, type CardCountTable } from '../model/Card'
    import LobbyCodeContainer from './LobbyCodeContainer.svelte'
    import LobbyPlayerList from './LobbyPlayerList.svelte'
    import WinnerModal from './WinnerModal.svelte'

    export let connectionHandler: ConnectionHandler
    export let appState: AppState
    export let gameState: GameState

    let gameId: string
    let gameView: Promise<typeof import('../game/GameView.svelte')> | undefined
    let gameStartData: gameStartPayload
    let showModal: boolean = false
    let winnerUsername: string = ''
    let game: GameServer
    let readyPlayers: number
    let waitingPlayers: number = 0
    let botCounter: number = 0
    let cardCounts: CardCountTable = initalizeCountTable()
    const dispatch = createEventDispatcher()

    readyPlayersCounter.subscribe((val) => (readyPlayers = val))

    onMount(() => {
        if (appState.gameId) gameId = appState.gameId
        connectionHandler.setupLobbyListeners(
            game,
            (data: gameStartPayload) => {
                if (!data) {
                    throw 'no game start data!'
                }
                game = new GameServer(gameState.players, data, gameState.thisPlayerId, cardCounts)
                game.gameClosed = false
                gameView = import('../game/GameView.svelte')
            },
            () => {
                dispatch('gameClosed')
            }
        )

        // socket.on(SocketEventsFromClient.reconnectToGame, (reconnectRequestPayload: reconnectRequestPayload) => {
        //     let reconnectingPlayer = players.find((pl) => {
        //         return pl.uid === reconnectRequestPayload.requesterUid
        //     })

        //     let response: reconnectResponsePayload = {
        //         didReconnect: Boolean(reconnectingPlayer),
        //         reconnectRequest: reconnectRequestPayload,
        //     }
        //     if (reconnectingPlayer) {
        //         let gameState: GameState = {
        //             players: players,
        //             thisPlayerId: reconnectingPlayer.uid,
        //             thisPlayerName: reconnectingPlayer.username,
        //             gameStarted: false,
        //         }
        //         if (gameView) {
        //             let hand = game.hands.get(reconnectingPlayer.uid)
        //             if (!hand) {
        //                 return
        //             }
        //             gameState.gameStarted = true

        //             gameState.startedGameInfo = {
        //                 currentBet: game.previousBet,
        //                 currentPlayer: game.currentPlayer,
        //                 newHand: hand,
        //             }
        //         }

        //         response.gameState = gameState
        //     }
        //     socket.emit(SocketEventsFromHost.reconnectToGame, response)
        // })
    })

    function startGame(): void {
        if (gameState.players.length >= 2 && gameState.players.length <= 5 && readyPlayers == gameState.players.length) {
            let initializationData = initalizeGame(gameState.players)
            cardCounts = initializationData.cardCounts
            let startPayload = initializationData.payload
            connectionHandler.connection?.socket.emit(SocketEventsCommon.gameStarted, startPayload)
            toasts.info({ placement: 'top-right', description: 'Game has started' })
        } else {
            console.log(readyPlayers)
            toasts.warning({ placement: 'top-right', description: 'Invalid amount of players to start the game or not everyone is ready' })
        }
    }

    function closeGame(): void {
        connectionHandler.connection?.socket.emit(SocketEventsCommon.gameClosed, { gameId: appState.gameId })

        gameView = undefined
        gameState.players = []
        playersStore.set([])
        toasts.info({ placement: 'top-right', description: 'Game closed' })
    }

    function kickPlayer(uid: string) {
        connectionHandler.connection?.socket.emit(SocketEventsFromHost.kickPlayer, uid)
        gameState.players = gameState.players.filter((player) => player.uid !== uid)
        playersStore.set(gameState.players)
        return null
    }

    function showWinner(winner: any): void {
        readyPlayersCounter.update((val) => 1 + waitingPlayers)
        waitingPlayers = 0
        if (winner.detail && winner.detail.username) {
            winnerUsername = winner.detail.username
            showModal = true
        }
        gameView = undefined
    }
    function addBot(): void {
        botCounter++
        let botName = 'bot' + botCounter.toString()

        const payload: playerJoinedPayload = {
            username: botName,
            uid: botName,
            isOnline: true,
            isBot: true,
        }

        connectionHandler.connection?.socket.emit(SocketEventsFromHost.addBot, payload)
    }
</script>

<div class="container view">
    {#if gameView && connectionHandler.connection}
        {#await gameView then { default: GameView }}
            <GameView
                on:leave="{closeGame}"
                on:gameFinished="{showWinner}"
                thisPlayerId="{gameState.thisPlayerId}"
                {gameId}
                socket="{connectionHandler.connection.socket}"
                isHost
                {game}
                {connectionHandler}
            />
        {/await}
    {:else}
        <LobbyCodeContainer gameId="{appState.gameId}" />
        <LobbyPlayerList thisPlayerId="{gameState.thisPlayerId}" isHost="{true}" handlePlayerKick="{kickPlayer}" />
        <div class="responsive">
            <button class="default-button" on:click="{closeGame}">Close Game</button>
            <button class="default-button" on:click="{startGame}">Start Game</button>
            <button class="default-button" on:click="{addBot}">Add Ai opponent</button>
        </div>
    {/if}
</div>
<WinnerModal
    {showModal}
    {winnerUsername}
    close="{() => {
        showModal = false
        gameView = undefined
    }}"
/>

<style lang="scss">
</style>
