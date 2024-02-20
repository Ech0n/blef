<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { io, type Socket } from "socket.io-client";
    import { createEventDispatcher } from 'svelte';
    import { playerStore } from '../game/stores';
    import { SocketEvents } from '../../../src/types/socketEvents';
    import { Player } from '../../../common/player';
    import type { gameStartPayload } from '../../../common/payloads';
    import type { CardCountTable } from '../model/Card';
    import LobbyPlayerList from './LobbyPlayerList.svelte';

    export let usernameInput:string;
    export let gameId: string;
    const dispatch = createEventDispatcher();
    let socket: Socket;

    let gameView: Promise<typeof import('../game/GameView.svelte')> | undefined;
    let players: Player[] = [];
    let currentPlayer: Player;
    let gameStartData: gameStartPayload;
    let thisPlayerId: string
    let _: CardCountTable; // This is completely useless and made to avoid errors

    const unsubscribe = playerStore.subscribe(value => {
        currentPlayer = value!;
    });

    onDestroy(() => {
        unsubscribe();
    });


    onMount(() => {
        const serverUrl: string = "http://localhost:5678";
        socket = io(serverUrl);

        socket.emit(SocketEvents.joinGame, {gameId:gameId, username:usernameInput} );

        // Listen for messages from the server
        socket.on(SocketEvents.joinGame,
        (data: { players?: {uid: string, username: string, isOnline: boolean} []; thisPlayerId: string; thisPlayerName: string; }) => {
            if (!data) {
                dispatch('leave'); // Very scuffed way to force quit after joining wrong lobby by gameID
            }

            if (data.players) {
                players = data.players.map((el) => {
                    let newPlayer: Player = new Player(el.uid, el.username);
                    newPlayer.isOnline = el.isOnline;
                    return newPlayer
                });
            }

            if (data.thisPlayerId && data.thisPlayerName) { // This if is wrong. If data does not exist error should be thrown // Then do it shaking my head
                players = [...players, new Player(data.thisPlayerId,data.thisPlayerName)];
                thisPlayerId = data.thisPlayerId
            }
        });

        socket.on(SocketEvents.newPlayerJoined, (data: {username:string; uid:string} ) => {
            console.debug("New player in lobby name:", data.username)
            let newPlayer = new Player(data.uid, data.username);
            newPlayer.isOnline = true;
            players = [...players, newPlayer];
        })

        socket.on(SocketEvents.gameStarted, (data:gameStartPayload)  => {
            console.debug("reveived game start message",data)
            if (data && data.startingPlayerId) {
                gameStartData = data
                gameView = import("../game/GameView.svelte")
            }
        });

        socket.on(SocketEvents.playerLeftGame, (data: { playerId: string }) => { // Players = Host and Clients
            if (!data) {
                return;
            }

            // Tag the disconnected player as not connected
            players = players.map(player => {
                if (player.uid === data.playerId) {
                    return { ...player, isOnline: false };
                }
                return player;
            });
        });

    });

    function leaveGame(): void {
        socket.emit(SocketEvents.playerLeftGame, currentPlayer.uid); 
        players = [];

        dispatch("leave"); // To parent
    }

    function showWinnner(winner: any): void
    {
        gameView = undefined
        if(winner.detail && winner.detail.username) {
            alert("Wygrał gracz: "+winner.detail.username)
        }
    }
</script>

<h1>
    {#if gameView}
        {#await gameView then { default: GameClient }}
            <GameClient on:leave={leaveGame} on:gameFinished={showWinnner} {gameId} {socket} initialPlayerList={players} {thisPlayerId} isHost={false} {gameStartData} cardCounts={_} />
        {/await}
    {:else}
        Game ID: {#if gameId} {gameId} {/if}
        <br>
        <div>
            <LobbyPlayerList {players} thisPlayer={currentPlayer}/>

            <button class="start-close" on:click={leaveGame}>Leave</button>
        </div>
    {/if}
</h1>

<style>
    .start-close {
        color: aliceblue;
    }
</style>
