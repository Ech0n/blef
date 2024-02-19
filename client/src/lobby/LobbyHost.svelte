<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import { io, Socket } from "socket.io-client";
    import { Player } from '../../../definitions/player';
    import { playerStore../../../common/player
    import {SocketEvents} from '../../../src/types/socketEvents'

    export let usernameInput:string;
    
    let socket: Socket;
    let gameId: string;
    let player: Player | null;
    let startingPlayerId: string
    let host:Player
    let thisPlayerId: string;
    let gameView: Promise<typeof import('../game/GameView.svelte')> | undefined;
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

        socket.emit(SocketEvents.createGame, {username: usernameInput});

        socket.on(SocketEvents.createGame, (data: {gameId:string,hostId:string}) => {
            console.log("User created a game, its id is:", data);
            gameId = data.gameId;
            host = new Player(data.hostId, usernameInput)
            host.isOnline = true;
            players = [...players, host]
            thisPlayerId = data.hostId
        });

        socket.on(SocketEvents.newPlayerJoined, (data: {username: string, uid: string, isOnline: boolean }) => {
            console.log("Join event", data);
            if (!data) {
                throw "No data from server"
            }

            let newPlayer: Player = new Player(data.uid, data.username);
            newPlayer.isOnline = data.isOnline;

            players = [...players, newPlayer];
        });

        socket.on(SocketEvents.playerLeftGame, (data: { playerId: string }) => {
            console.log("player disconnected", data);
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


        socket.on(SocketEvents.gameStarted, (data: boolean) => {
            if (data) {
                gameView = import('../game/GameView.svelte');
            }
        });
    });

    function startGame(): void {
        //TODO: Randomize starting player?
        startingPlayerId = players[0].uid
        socket.emit(SocketEvents.gameStarted,{startingPlayerId: startingPlayerId});
    }

    function closeGame(): void {
        socket.emit(SocketEvents.gameClosed, { gameId });

        gameView = undefined; 
        players = [];
    }
</script>

<h1>
    {#if gameView}
        {#await gameView then { default: GameView }}
            <GameView {gameId} {socket} on:leave={closeGame} initialPlayerList={players} {startingPlayerId} {thisPlayerId}  isHost />
        {/await}
    {:else}
        Game ID: {#if gameId} {gameId} {/if}
        <br>
        Players:
        <ul>
            {#each players as player}
                <li>
                    <strong>ID:</strong> {player.uid}  <br>
                    <strong>NAME:</strong> {player.username} <br>
                    <strong>ONLINE:</strong> {player.isOnline ? 'Yes' : 'No'}
                </li>
            {/each}
        </ul>
        
        <div>
            <button on:click={startGame}>Start Game</button>
            <button on:click={closeGame}>Close Game</button>
        </div>
    {/if}
</h1>
