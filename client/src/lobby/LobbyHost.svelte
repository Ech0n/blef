<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import { io, Socket } from "socket.io-client";
    import { Player } from '../model/Player';
    import { playerStore } from '../game/stores';
    import {SocketEvents} from '../../../src/types/socketEvents'

    export let usernameInput:string;
    
    let socket: Socket;
    let gameId: string;
    let player: Player | null;
    let startinPlayerId: string
    let host:Player

    let gameView: Promise<typeof import('../game/GameHostView.svelte')> | undefined;
    let players: Player[] = [];


    const unsubscribe = playerStore.subscribe(value => {
        player = value;
    });

    onDestroy(() => {
        unsubscribe();
    });


    onMount(() => {
        const serverUrl: string = "http://localhost:5678";
        socket = io(serverUrl);

        socket.emit(SocketEvents.createGameToServer,{username:usernameInput});

        socket.on(SocketEvents.createGameToHost, (data: {gameId:string,hostId:string}) => {
            console.log("User created a game, its id is:", data);
            gameId = data.gameId;
            host = new Player(data.hostId,usernameInput)
            players = [...players,host]
        });

        socket.on(SocketEvents.newPlayerJoinedGameToHost, (data: { username: string,uid:string }) => {
            console.log("join event", data);
            if (!data) {
                throw "No data from server"
            }
            players = [...players, new Player(data.uid,data.username)];

        });

        socket.on(SocketEvents.playerLeftGameToPlayers, (data: { playerId: string }) => {
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


        socket.on(SocketEvents.startGameToHost, (data: boolean) => {
            if (data) {
                gameView = import('../game/GameHostView.svelte');
            }
        });

    });

    function startGame(): void {
        //TODO: Randomize starting player?
        startinPlayerId = players[0].id
        socket.emit(SocketEvents.startGameToServer,{startingPlayerId:startinPlayerId});
    }

    function closeGame(): void {
        socket.emit(SocketEvents.gameClosedToServer, { gameId });

        gameView = undefined; 
        players = [];
    }
</script>

<h1>
    {#if gameView}
        {#await gameView then { default: GameView }}
            <GameView {gameId} {socket} on:leave={closeGame} initialPlayerList={players} {startinPlayerId}/>
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
