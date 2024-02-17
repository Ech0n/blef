<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import { io, type Socket } from "socket.io-client";
    import type { Player } from '../model/Player';
    import { playerStore } from '../game/stores';

    let socket: Socket;
    let gameId: string;
    let player: Player | null;

    let gameView: Promise<typeof import('../game/GameHost.svelte')> | undefined;
    let players: Player[] = [{ id: 'host', name: 'Host', isOnline: true, loses: 0 }];


    const unsubscribe = playerStore.subscribe(value => {
        player = value;
    });

    onDestroy(() => {
        unsubscribe();
    });


    onMount(() => {
        const serverUrl: string = "http://localhost:5678";
        socket = io(serverUrl);

        socket.emit("createGameToServer");

        socket.on("createGameToHost", (data: string) => {
            console.log("User created a game, its id is:", data);
            gameId = data;
        });

        socket.on("playerJoinedGameToHost", (data: { newPlayer?: Player }) => {
            console.log("join event", data);
            if (!data) {
                return;
            }

            if (data.newPlayer) {
                console.log("New player is here", data.newPlayer);
                players = [...players, data.newPlayer];
            }
        });

        socket.on("playerLeftGameToPlayers", (data: { playerId: string }) => {
            console.log("player disconnected", data);
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


        socket.on("startGameToHost", (data: boolean) => {
            if (data) {
                gameView = import('../game/GameHost.svelte');
            }
        });

    });

    function startGame(): void {
        socket.emit("startGameToServer");
    }

    function closeGame(): void {
        socket.emit("gameClosedToServer", { gameId });

        gameView = undefined; 
        players = [];
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
