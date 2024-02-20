<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import { io, Socket } from "socket.io-client";
    import { Player } from '../../../common/player';
    import {SocketEvents} from '../../../src/types/socketEvents'
    import { playerStore } from '../game/stores';
    import { initalizeGame } from '../model/Card';
    import type { gameStartPayload } from '../../../common/payloads';
    import e from 'express';
    import LobbyPlayerList from './LobbyPlayerList.svelte';

    export let usernameInput:string;
    
    let socket: Socket;
    let gameId: string;
    let player: Player | null;
    let host: Player
    let thisPlayerId: string;
    let gameView: Promise<typeof import('../game/GameView.svelte')> | undefined;
    let gameStartData: gameStartPayload;
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
            console.log("User created a game, its id is:", data.gameId);
            gameId = data.gameId;
            host = new Player(data.hostId, usernameInput)
            host.isOnline = true;
            players = [...players, host]
            thisPlayerId = data.hostId
        });

        socket.on(SocketEvents.newPlayerJoined, (data: {username: string, uid: string, isOnline: boolean }) => {
            console.log("Join event", data.username);
            if (!data) {
                throw "No data from server"
            }

            let newPlayer: Player = new Player(data.uid, data.username);
            newPlayer.isOnline = data.isOnline;

            players = [...players, newPlayer];
        });

        socket.on(SocketEvents.playerLeftGame, (data: { playerId: string }) => {
            console.log("player disconnected", data.playerId);
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


        socket.on(SocketEvents.gameStarted, (data: gameStartPayload) => {
            if (data) {
                gameStartData = data
                gameView = import('../game/GameView.svelte');
            }
        });
    });

    function startGame(): void {
        //TODO: Randomize starting player?
        let startPayload = initalizeGame(players)
        socket.emit(SocketEvents.gameStarted,startPayload);
    }

    function closeGame(): void {
        socket.emit(SocketEvents.gameClosed, { gameId });

        gameView = undefined; 
        players = [];
    }

    function kickPlayer(id:string){
        socket.emit(SocketEvents.kickPlayer,id)
    }
</script>

<h1>
    {#if gameView}
        {#await gameView then { default: GameView }}
            <GameView {gameId} {socket} on:leave={closeGame} initialPlayerList={players}  {thisPlayerId} {gameStartData} isHost />
        {/await}
        <p>host options:</p>
        <p>kick player:</p>
        <div class="hostPlayerToolContainer">
            {#each players as player}
                {#if player.uid != thisPlayerId}
                    <div class= "playerItemForHost">
                         {player.username} 
                         {#if player.isOnline}
                            🟢 
                         {:else}
                            🔴
                         {/if}
                         <button class="kick-button" on:click={()=>kickPlayer(player.uid)}>kick :)</button>
                    </div>
                {/if}
            {/each}
        </div>
        
    {:else}
        Game ID: {#if gameId} {gameId} {/if}
        <br>
        Players:
        <LobbyPlayerList {players} thisPlayer={host}/>
        <div>
            <button on:click={startGame}>Start Game</button>
            <button on:click={closeGame}>Close Game</button>
        </div>
    {/if}
</h1>

<style>
    p{
        font-size:15px;
    }
    .hostPlayerToolContainer{

    }
    .playerItemForHost{
        font-size:13px;

    }
    .kick-button{
        font-size:13px;
        font-size: 1rem;
        background-color: brown;
    }
</style>