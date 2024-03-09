<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { io, type Socket } from 'socket.io-client';
    import { createEventDispatcher } from 'svelte';
    import { playerStore } from '../game/stores';
    import { SocketEventsCommon, SocketEventsFromClient } from '../../../src/types/socketEvents';
    import { Player } from '../../../common/player';
    import type { gameStartPayload } from '../../../common/payloads';
    import type { CardCountTable } from '../model/Card';
    import LobbyPlayerList from './LobbyPlayerList.svelte';
    import { config } from '../../../config';
    import WinnerModal from './WinnerModal.svelte';

    export let gameId: string;
    export let socket: Socket;
    export let players: Player[] = [];
    export let thisPlayerId: string;
    const dispatch = createEventDispatcher();

    let gameView: Promise<typeof import('../game/GameView.svelte')> | undefined;
    let currentPlayer: Player;
    let gameStartData: gameStartPayload;
    let showModal: boolean = false;
    let winnerUsername: string = '';
    let _: CardCountTable; // This is completely useless and made to avoid errors

    const unsubscribe = playerStore.subscribe((value) => {
        currentPlayer = value!;
    });

    onDestroy(() => {
        unsubscribe();
    });

    onMount(() => {
        socket.on(SocketEventsCommon.newPlayerJoined, (data: { username: string; uid: string }) => {
            console.debug('New player in lobby name:', data.username);
            let newPlayer = new Player(data.uid, data.username);
            newPlayer.isOnline = true;
            players = [...players, newPlayer];
        });

        socket.on(SocketEventsCommon.gameStarted, (data: gameStartPayload) => {
            console.debug('reveived game start message', data);
            if (data && data.startingPlayerId) {
                gameStartData = data;
                gameView = import('../game/GameView.svelte');
            }
        });

        socket.on(SocketEventsCommon.gameClosed, () => {
            dispatch('gameClosed');
        });

        socket.on(SocketEventsCommon.playerLeftGame, (data: { uid: string }) => {
            // Players = Host and Clients
            if (!data) {
                return;
            }
            if (data.uid == thisPlayerId) {
                players = [];
                dispatch('gameClosed'); // To parent
                return;
            }

            //if game is started
            if (gameView) {
                let playerThatLeft = players.find((pl) => pl.uid === data.uid);
                if (playerThatLeft) {
                    playerThatLeft.isOnline = false;
                }
            } else {
                // Tag the disconnected player as not connected
                players = players.filter((pl) => {
                    return pl.uid !== data.uid;
                });
                players = players;
            }
        });
    });

    function leaveGame(): void {
        socket.emit(SocketEventsFromClient.leaveGame);
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
        {#await gameView then { default: GameClient }}
            <GameClient
                on:leave={leaveGame}
                on:gameFinished={showWinner}
                {gameId}
                {socket}
                initialPlayerList={players}
                {thisPlayerId}
                isHost={false}
                {gameStartData}
                cardCounts={_}
                kickPlayer={() => {}}
            />
        {/await}
    {:else}
        Game ID: {#if gameId}
            {gameId}
        {/if}
        <div>
            <LobbyPlayerList {players} {thisPlayerId} />

            <button class="start-close" on:click={leaveGame}>Leave</button>
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
    .start-close {
        color: aliceblue;
    }
</style>
