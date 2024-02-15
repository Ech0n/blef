<script lang="ts">
    import { onMount } from 'svelte';
    import { io, type Socket } from "socket.io-client";
    import { createEventDispatcher } from 'svelte';
    import type { Player } from '../model/Player';

    export let gameId: string;
    const dispatch = createEventDispatcher();
    let socket: Socket;

    let gameView: Promise<typeof import('../game/GameClient.svelte')> | undefined;
    let players: Player[] = [];

    onMount(() => {
        const serverUrl: string = "http://localhost:5678";
        socket = io(serverUrl);

        // Listen for messages from the server
        socket.on("join", (data: { players?: Player[]; newPlayer?: Player }) => {
            if (!data) {
                dispatch('leave');
            }
            if (data.players) {
                players = data.players;
            }
            if (data.newPlayer) {
                players = [...players, data.newPlayer];
            }
        });

        socket.on("start", (data: { start: boolean }) => {
            if (data && data.start) {
                gameView = import('../game/GameClient.svelte');
            }
        });

        socket.emit("join", gameId);
    });

    function leaveGame(): void {
        // Implement the leave game logic here
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
            {#each players as {id, name}}
                <li>
                    ID: {id}  NAME: {name}
                </li>
            {/each}
            <button on:click={leaveGame}>Leave</button>
        </ul>
    {/if}
</h1>
