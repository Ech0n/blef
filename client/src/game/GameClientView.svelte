<script lang="ts">
    import { onMount } from 'svelte';
    import { io } from "socket.io-client";
    import type { Socket } from 'socket.io-client';
    import { Player } from '../model/Player';
    import { Game } from './Game';
    import { start } from 'repl';
    import * as HandRankings from '../../../src/types/HandRankings';
    import { Rank, CardColor } from '../model/Card';
    import { SocketEvents } from '../../../src/types/socketEvents';
    import { GameServer } from './GameServer';

    export let gameId: string | undefined;
    export let socket: Socket;
    export let initialPlayerList: Player[];
    export let thisPlayerId: string;
    export let startinPlayerId: string;

    const serverUrl: string = "http://localhost:5678";
    let game :GameServer= new GameServer(initialPlayerList,startinPlayerId)


    onMount(() => {
        if (!socket) {
            socket = io(serverUrl);
        }

        if (gameId) {
            socket.on('playerHit', (data) => {
                // handle player hit event
            });

            socket.on('gameUpdate', (data) => {
                // handle game updates
            });

            socket.on(SocketEvents.hitToPlayers,(data:{move:HandRankings.IChecker})=>{
                game.hit(data.move)
            console.log("received hit data; current player now: ",game.players[game.currentPlayerIndx].name)
            game = game
            })

            socket.on(SocketEvents.checkToPlayers,()=>{
                game.checkAndDeal()                
            game = game

            })

            socket.emit('joinGame', { gameId });
        }
    });

    function getBetName(){
        if(!game.previousBet){
            return "<to jest pierwszy ruch>"
        }
        return game.previousBet.constructor.name;
    }
    function hit(){
        let bet = new HandRankings.OneChecker(Rank.Ace)
        socket.emit(SocketEvents.hitToServer,{move:bet})
    }
    function check(){
        socket.emit(SocketEvents.checkToServer)
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
<!-- TODO: Export this shiet to some kind of common component for host and client -->
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