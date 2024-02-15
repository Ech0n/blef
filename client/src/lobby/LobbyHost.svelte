<script lang="ts">
    import { onMount } from 'svelte';
    import { io, type Socket } from "socket.io-client";
    import type { Player } from '../model/Player';

    let socket: Socket;
    let gameId: string;

    let gameView: Promise<typeof import('../game/GameHost.svelte')> | undefined;
    let players: Player[] = [{ id: 'host', name: 'Host', isOnline: true }];

    onMount(() => {
        const serverUrl: string = "http://localhost:5678";
        socket = io(serverUrl);

        socket.on("create", (data: string) => {
            console.log("User created a game, its id is:", data);
            gameId = data;
        });

        socket.on("join", (data: { newPlayer?: Player }) => {
            console.log("join event", data);
            if (!data) {
                return;
            }

            if (data.newPlayer) {
                console.log("new player is here", data.newPlayer);
                players = [...players, data.newPlayer];
            }
        });

        socket.on("start", (data: boolean) => {
            if (data) {
                gameView = import('../game/GameHost.svelte');
            }
        });

        socket.emit("create");
    });

    function startGame(): void {
        socket.emit("start");
    }

    function closeGame(): void {
        // Implement leave game logic
        console.log("implement leaving bozo");
    }
</script>

<h1>
    {#if gameView}
        {#await gameView then { default: GameView }}
            <GameView {gameId} {socket} on:leave={closeGame} />
        {/await}
    {:else}
        Game ID: {#if gameId}{gameId}{/if}
        <br>
        Players:
        <ul>
            {#each players as {id, name}}
                <li>
                    ID: {id}  NAME: {name}
                </li>
            {/each}
        </ul>
        <div>
            <button on:click={startGame}>Start Game</button>
            <button on:click={closeGame}>Close Game</button>
        </div>
    {/if}
</h1>
