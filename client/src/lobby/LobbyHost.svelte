<script lang="ts">
    import { createEventDispatcher, onDestroy, onMount } from 'svelte';
    import { io, Socket } from 'socket.io-client';
    import { Player } from '../../../common/player';
    import { SocketEventsCommon } from '../../../src/types/socketEvents';
    import { playerStore } from '../game/stores';
    import { initalizeGame, type CardCountTable, initalizeCountTable } from '../model/Card';
    import type { gameStartPayload } from '../../../common/payloads';
    import LobbyPlayerList from './LobbyPlayerList.svelte';
    import { config } from '../../../config';
    import WinnerModal from './WinnerModal.svelte';

    export let usernameInput: string;

    let socket: Socket;
    let gameId: string;
    let player: Player | null;
    let host: Player;
    let thisPlayerId: string;
    let gameView: Promise<typeof import('../game/GameView.svelte')> | undefined;
    let gameStartData: gameStartPayload;
    let players: Player[] = [];
    let showModal: boolean = false;
    let winnerUsername: string = '';

    let cardCounts: CardCountTable = initalizeCountTable();

    const dispatch = createEventDispatcher();

    const unsubscribe = playerStore.subscribe((value) => {
        player = value;
    });

    onDestroy(() => {
        unsubscribe();
    });

    onMount(() => {
        socket = io(config.BACKEND_SERVER_ADDRESS || 'http://localhost:5678');

        socket.emit(SocketEventsCommon.createGame, { username: usernameInput });

        socket.on(SocketEventsCommon.createGame, (data: { gameId: string; hostId: string }) => {
            console.log('User created a game, its id is:', data.gameId);
            gameId = data.gameId;
            host = new Player(data.hostId, usernameInput);
            host.isOnline = true;
            players = [...players, host];
            thisPlayerId = data.hostId;
        });

        socket.on(SocketEventsCommon.newPlayerJoined, (data: { username: string; uid: string; isOnline: boolean }) => {
            console.log('Join event', data.username);
            if (!data) {
                throw 'No data from server';
            }

            let newPlayer: Player = new Player(data.uid, data.username);
            newPlayer.isOnline = data.isOnline;

            players = [...players, newPlayer];
        });

        socket.on(SocketEventsCommon.playerLeftGame, (data: { uid: string }) => {
            console.log('player disconnected', data.uid);
            if (!data) {
                return;
            }

            players = players.filter((pl) => {
                return pl.uid !== data.uid;
            });
        });

        socket.on(SocketEventsCommon.gameStarted, (data: gameStartPayload) => {
            if (data) {
                gameStartData = data;
                gameView = import('../game/GameView.svelte');
            }
        });

        socket.on(SocketEventsCommon.gameClosed, () => {
            dispatch('gameClosed');
        });
    });

    function startGame(): void {
        //TODO: Randomize starting player?
        let initializationData = initalizeGame(players);
        cardCounts = initializationData.cardCounts;
        let startPayload = initializationData.payload;
        socket.emit(SocketEventsCommon.gameStarted, startPayload);
    }

    function closeGame(): void {
        socket.emit(SocketEventsCommon.gameClosed, { gameId });

        gameView = undefined;
        players = [];
    }

    function kickPlayer(id: string) {
        socket.emit(SocketEventsCommon.kickPlayer, id);
    }

    function showWinner(winner: any): void {
        if (winner.detail && winner.detail.username) {
            winnerUsername = winner.detail.username;
            showModal = true;
        }
    }
</script>

<h1>
    {#if gameView}
        {#await gameView then { default: GameView }}
            <GameView on:leave={closeGame} on:gameFinished={showWinner} {gameId} {socket} initialPlayerList={players} {thisPlayerId} {gameStartData} isHost {cardCounts} kickPlayer={kickPlayer} />
        {/await}
    {:else}
        Game ID: {#if gameId}
            {gameId}
        {/if}
        <br />
        Players:
        <LobbyPlayerList {players} thisPlayer={host} />
        <div>
            <button class="start-close" on:click={startGame}>Start Game</button>
            <button class="start-close" on:click={closeGame}>Close Game</button>
        </div>
    {/if}
</h1>
<WinnerModal
    {showModal}
    {winnerUsername}
    close={() => {
        showModal = false;
        gameView = undefined;
    }}
/>

<style>
    p {
        font-size: 15px;
    }
    .playerItemForHost {
        font-size: 13px;
    }
    .kick-button {
        font-size: 13px;
        font-size: 1rem;
        background-color: brown;
    }
    .start-close {
        color: aliceblue;
    }
</style>
