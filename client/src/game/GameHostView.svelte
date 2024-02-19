<script lang="ts">
    import { onMount } from 'svelte';
    import { io } from "socket.io-client";
    import { createEventDispatcher } from 'svelte';
    import type { Socket } from 'socket.io-client';
    import type { Player } from '../model/Player';
    import { GameServer } from './GameServer';
    import { Game } from './Game';
    import { SocketEvents } from '../../../src/types/socketEvents';
    import * as HandRankings from '../../../src/types/HandRankings';
    import { Rank } from '../model/Card';

    export let gameId: string;
    export let socket: Socket;
    export let initialPlayerList: Player[];
    export let startinPlayerId: string;
    export let thisPlayerId: string;

    const dispatch = createEventDispatcher();
    const serverUrl: string = "http://localhost:5678";
    let game: GameServer = new GameServer(initialPlayerList,startinPlayerId)

    onMount(() => {
        if (!socket) {
            socket = io(serverUrl);
        }

        // socket.emit('joinGame', { gameId }); // Send a join game event to the server

        socket.on('gameState', (data) => {
            dispatch('update', data);
        });

        socket.on(SocketEvents.hitToPlayers,(data:{move:HandRankings.IChecker})=>{
            let move = new HandRankings.OneChecker(data.move.high)
            game.hit(move)
            console.log("received hit data:",data.move,"; current player now: ",game.currentPlayer)
            game = game
        })

        socket.on(SocketEvents.checkToPlayers,()=>{
            game.checkAndDeal()                
            game = game

        })
        
    });
    function hit(){
        let bet = new HandRankings.OneChecker(Rank.Ace)
        socket.emit(SocketEvents.hitToServer,{move:bet})
    }
    function check(){
        socket.emit(SocketEvents.checkToServer)
    }
    function getBetName(){
        if(!game.previousBet){
            return "<to jest pierwszy ruch>"
        }
        return game.previousBet.constructor.name;
    }
</script>

<h3>{#if gameId}Game ID: {gameId}{/if}</h3>
<p>Players:</p>
<ul>
    {#each game.players as {id, name}}
        <li>
            NAME: {name}
        </li>
    {/each}
</ul>
{#if game.currentPlayer == thisPlayerId}
    <p>ur turn</p>


    <button on:click={hit} >hit</button>
    <button on:click={check}>check</button>
{/if}
    <p>bet:</p>
    {getBetName()}
<style>
    li{
        font-size:15px;
    }
    p{
        font-size:20px;
    }
</style>