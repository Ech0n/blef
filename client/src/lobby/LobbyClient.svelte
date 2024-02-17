<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { io, type Socket } from "socket.io-client";
    import { createEventDispatcher } from 'svelte';
    import type { Player } from '../model/Player';
    import { playerStore } from '../game/stores';

    export let gameId: string;
    const dispatch = createEventDispatcher();
    let socket: Socket;

    let gameView: Promise<typeof import('../game/GameClient.svelte')> | undefined;
    let players: Player[] = [];
    let player: Player;


    const unsubscribe = playerStore.subscribe(value => {
        player = value!;
    });

    onDestroy(() => {
        unsubscribe();
    });


    onMount(() => {
        const serverUrl: string = "http://localhost:5678";
        socket = io(serverUrl);

        socket.emit("joinGameToServer", gameId);

        // Listen for messages from the server
        socket.on("joinGameToClient", (data: { players?: Player[]; newPlayer?: Player }) => {
            if (!data) {
                dispatch('leave'); // Very scuffed way to force quit after joining wrong lobby by gameID
            }
            if (data.players) {
                players = data.players;
            }
            if (data.newPlayer) {
                players = [...players, data.newPlayer];
            }
        });

        socket.on("startGameToClient", (data: { start: boolean }) => {
            if (data && data.start) {
                gameView = import('../game/GameClient.svelte');
            }
        });

        socket.on("playerLeftGameToPlayers", (data: { playerId: string }) => { // Players = Host and Clients
            console.log("Player disconnected", data);
            if (!data) {
                return;
            }

            // Tag the disconnected player as not connected
            players = players.map(player => {
                if (player.id === data.playerId) {
                    return { ...player, isOnline: false };
                }
                return player;
            });
        });

    });

    function leaveGame(): void {
        socket.emit("playerLeftGameToServer", player.id); 
        players = [];

        dispatch("leave"); // To parent
        console.log("Left the game and returned to the main menu");
    }

</script>

<h1>
    {#if gameView}
        {#await gameView then { default: GameClient }}
            <GameClient {gameId} {socket} on:leave={leaveGame} />
        {/await}
    {:else}
        Game ID: {#if gameId}{gameId}{/if}
        <br>
        <ul>
            {#each players as {id, name, isOnline}}
                <li>
                    ID: {id}  NAME: {name} ONLINE: {isOnline}
                </li>
            {/each}
            <button on:click={leaveGame}>Leave</button>
        </ul>
    {/if}
</h1>
