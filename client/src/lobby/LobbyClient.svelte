<script lang="ts">
    import { type Socket } from 'socket.io-client'
    import { createEventDispatcher, onDestroy, onMount } from 'svelte'
    import { toasts } from 'svelte-toasts'
    import type { gameInfo, gameStartPayload } from '../../../common/payloads'
    import { Player } from '../../../common/player'
    import { SocketEventsCommon, SocketEventsFromClient } from '../../../src/types/socketEvents'
    import { Game } from '../game/Game'
    import { playerStore } from '../game/stores'
    import type { Card } from '../model/Card'
    import LobbyCodeContainer from './LobbyCodeContainer.svelte'
    import LobbyPlayerList from './LobbyPlayerList.svelte'
    import WinnerModal from './WinnerModal.svelte'

    export let gameId: string
    export let socket: Socket
    export let players: Player[] = []
    export let thisPlayerId: string
    export let startedGameInfo: gameInfo['startedGameInfo']

    const dispatch = createEventDispatcher()

    let game: Game
    let gameView: Promise<typeof import('../game/GameView.svelte')> | undefined
    let currentPlayer: Player
    let gameStartData: gameStartPayload
    let showModal: boolean = false
    let winnerUsername: string = ''

    const unsubscribe = playerStore.subscribe((value) => {
        currentPlayer = value!
    })

    onDestroy(() => {
        unsubscribe()
    })

    onMount(() => {
        toasts.success({ description: 'Joined a Game!', placement: 'top-right' })

        if (startedGameInfo) {
            let hands: { [key: string]: Card[] } = {}
            hands[thisPlayerId] = startedGameInfo.newHand
            gameStartData = {
                startingPlayerId: startedGameInfo.currentPlayer,
                newHands: hands,
            }
            game = new Game(players, gameStartData, thisPlayerId)
            game.previousBet = startedGameInfo.currentBet
            gameView = import('../game/GameView.svelte')
        }

        socket.on(SocketEventsCommon.newPlayerJoined, (data: { username: string; uid: string }) => {
            toasts.info({ placement: 'top-right', description: `${data.username} just joined!` })
            let newPlayer = new Player(data.uid, data.username)
            newPlayer.isOnline = true
            players = [...players, newPlayer]
        })

        socket.on(SocketEventsCommon.gameStarted, (data: gameStartPayload) => {
            toasts.info({ placement: 'top-right', description: 'Game started!' })
            if (data && data.startingPlayerId) {
                gameStartData = data
                game = new Game(players, gameStartData, thisPlayerId)
                game.gameClosed = false

                gameView = import('../game/GameView.svelte')
            }
        })

        socket.on(SocketEventsCommon.gameClosed, () => {
            dispatch('gameClosed')
        })

        socket.on(SocketEventsCommon.playerLeftGame, (data: { uid: string }) => {
            if (!data) {
                return
            }
            handlePlayerLeaving(data.uid)
        })
        socket.on(SocketEventsCommon.kickPlayer, (data: { uid: string }) => {
            if (!data) {
                return
            }
            handlePlayerLeaving(data.uid)
        })
    })

    function handlePlayerLeaving(playerId: string) {
        console.log(playerId, thisPlayerId)
        if (playerId === thisPlayerId) {
            cleanUpGame()
            return
        }

        if (gameView) {
            let playerThatLeft = players.find((pl) => pl.uid === playerId)
            if (playerThatLeft) {
                playerThatLeft.isOnline = false
            }
        } else {
            // Tag the disconnected player as not connected
            players = players.filter((pl) => {
                return pl.uid !== playerId
            })
            players = players
        }
    }

    function leaveGame(): void {
        socket.emit(SocketEventsFromClient.leaveGame)
    }

    function cleanUpGame(): void {
        players = []
        dispatch('gameClosed') // To parent
    }

    function showWinner(winner: any): void {
        if (winner.detail && winner.detail.username) {
            winnerUsername = winner.detail.username
            showModal = true
        }
        gameView = undefined
    }

    function notifyHostThatPlayerReady() {
        socket.emit(SocketEventsFromClient.playerReady, thisPlayerId)
    }
</script>

<div class="container">
    {#if gameView}
        {#await gameView then { default: GameClient }}
            <GameClient
                on:leave="{leaveGame}"
                on:gameFinished="{showWinner}"
                {gameId}
                {socket}
                {thisPlayerId}
                isHost="{false}"
                kickPlayer="{(_) => null}"
                {game}
                closeGame="{() => {}}"
            />
        {/await}
    {:else}
        <LobbyCodeContainer {gameId} />
        <LobbyPlayerList {players} {thisPlayerId} />
        <button class="default-button" on:click="{leaveGame}">Leave</button>
    {/if}
</div>
<WinnerModal
    {showModal}
    {winnerUsername}
    close="{() => {
        showModal = false
        gameView = undefined
        notifyHostThatPlayerReady()
    }}"
/>

<style>
</style>
