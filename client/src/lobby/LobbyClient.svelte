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

    export let usernameInput: string;
    export let gameId: string;
    const dispatch = createEventDispatcher();
    let socket: Socket;

    let gameView: Promise<typeof import('../game/GameView.svelte')> | undefined;
    let players: Player[] = [];
    let currentPlayer: Player;
    let gameStartData: gameStartPayload;
    let thisPlayerId: string;
    let _: CardCountTable; // This is completely useless and made to avoid errors

    const unsubscribe = playerStore.subscribe((value) => {
        currentPlayer = value!;
    });

    onDestroy(() => {
        unsubscribe();
    });

    onMount(() => {
        const serverUrl: string = config.BACKEND_SERVER_ADDRESS || 'http://localhost:5678';
        socket = io(serverUrl);

        socket.emit(SocketEventsCommon.joinGame, {
            gameId: gameId,
            username: usernameInput,
        });

        // Listen for messages from the server
        socket.on(
            SocketEventsCommon.joinGame,
            (data: {
                players?: {
                    uid: string;
                    username: string;
                    isOnline: boolean;
                }[];
                thisPlayerId: string;
                thisPlayerName: string;
            }) => {
                if (!data) {
                    dispatch('gameClosed'); // Very scuffed way to force quit after joining wrong lobby by gameID
                }

                if (data.players) {
                    players = data.players.map((el) => {
                        let newPlayer: Player = new Player(el.uid, el.username);
                        newPlayer.isOnline = el.isOnline;
                        return newPlayer;
                    });
                }

                if (data.thisPlayerId && data.thisPlayerName) {
                    // This if is wrong. If data does not exist error should be thrown // Then do it shaking my head
                    players = [...players, new Player(data.thisPlayerId, data.thisPlayerName)];
                    thisPlayerId = data.thisPlayerId;
                }
            }
        );

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

            // Tag the disconnected player as not connected
            players = players.filter((pl) => {
                return pl.uid !== data.uid;
            });
            players = players;
        });
    });

    function leaveGame(): void {
        socket.emit(SocketEventsFromClient.leaveGame);
    }

    function showWinnner(winner: any): void {
        gameView = undefined;
        if (winner.detail && winner.detail.username) {
            alert('Wygrał gracz: ' + winner.detail.username);
        }
    }
</script>

<h1>
    {#if gameView}
        {#await gameView then { default: GameClient }}
            <GameClient
                on:leave={leaveGame}
                on:gameFinished={showWinnner}
                {gameId}
                {socket}
                initialPlayerList={players}
                {thisPlayerId}
                isHost={false}
                {gameStartData}
                cardCounts={_}
            />
        {/await}
    {:else}
        Game ID: {#if gameId}
            {gameId}
        {/if}
        <div>
            <LobbyPlayerList {players} thisPlayer={currentPlayer} />

            <button class="start-close" on:click={leaveGame}>Leave</button>
        </div>
    {/if}
</h1>

<style>
    .start-close {
        color: aliceblue;
    }
</style>
