<script lang="ts">
    import { onMount, onDestroy } from 'svelte'
    import { io, type Socket } from 'socket.io-client'
    import { createEventDispatcher, onDestroy, onMount } from 'svelte'
    import { playerStore } from '../game/stores'
    import { SocketEventsCommon, SocketEventsFromClient } from '../../../src/types/socketEvents'
    import { Player } from '../../../common/player'
    import type { GameState, gameStartPayload } from '../../../common/payloads'
    import type { Card } from '../model/Card'
    import LobbyPlayerList from './LobbyPlayerList.svelte'
    import WinnerModal from './WinnerModal.svelte'
    import { Game } from '../game/Game'
    import { ConnectionHandler } from 'src/ConnectoinHandler'
    import { AppState } from 'src/StateTypes'
    import { toasts } from 'svelte-toasts'
    import LobbyCodeContainer from './LobbyCodeContainer.svelte'

    export let connectionHandler: ConnectionHandler
    export let appState: AppState
    export let gameState: GameState

    const dispatch = createEventDispatcher()

    let game: Game
    let gameView: Promise<typeof import('../game/GameView.svelte')> | undefined
    let currentPlayer: Player
    let gameStartData: gameStartPayload
    let showModal: boolean = false
    let winnerUsername: string = ''
    let gameId: string

    const unsubscribe = playerStore.subscribe((value) => {
        currentPlayer = value!
    })

    onDestroy(() => {
        unsubscribe()
    })

    onMount(() => {
        toasts.success({ description: 'Joined a Game!', placement: 'top-right' })
        if (gameState.startedGameInfo) {
            let hands: { [key: string]: Card[] } = {}
            hands[gameState.thisPlayerId] = gameState.startedGameInfo.newHand
            gameStartData = {
                startingPlayerId: gameState.startedGameInfo.currentPlayer,
                newHands: hands,
            }
            game = new Game(gameState.players, gameStartData, gameState.thisPlayerId)
            game.previousBet = gameState.startedGameInfo.currentBet
            gameView = import('../game/GameView.svelte')
        }
        if (appState.gameId) gameId = appState.gameId
        connectionHandler.setupLobbyListeners(
            game,
            (data: gameStartPayload) => {
                game = new Game(gameState.players, data, gameState.thisPlayerId)
                game.gameClosed = false
                gameView = import('../game/GameView.svelte')
            },
            () => {
                dispatch('gameClosed')
            }
        )
    })

    function leaveGame(): void {
        connectionHandler.connection?.socket.emit(SocketEventsFromClient.leaveGame)
    }

    function cleanUpGame(): void {
        gameState.players = []
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
        connectionHandler.connection?.socket.emit(SocketEventsFromClient.playerReady, gameState.thisPlayerId)
    }
</script>

<div class="container">
    {#if gameView && connectionHandler.connection}
        {#await gameView then { default: GameClient }}
            <GameClient
                on:leave="{leaveGame}"
                on:gameFinished="{showWinner}"
                {gameId}
                socket="{connectionHandler.connection.socket}"
                thisPlayerId="{gameState.thisPlayerId}"
                isHost="{false}"
                {game}
                {connectionHandler}
            />
        {/await}
    {:else}
        <LobbyCodeContainer gameId="{appState.gameId}" />
        <LobbyPlayerList thisPlayerId="{gameState.thisPlayerId}" />
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
