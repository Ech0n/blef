<script lang="ts">
    import { onMount, createEventDispatcher } from 'svelte';
    import { io } from "socket.io-client";
    import type { Socket } from 'socket.io-client';
    import type { Player } from '../model/Player';
    import { GameServer } from './GameServer';
    import { SocketEvents } from '../../../src/types/socketEvents';
    import * as HandRankings from '../../../src/types/HandRankings';
    import CardModal from './CardModals.svelte'; // Make sure this path is correct

    export let gameId: string;
    export let socket: Socket;
    export let initialPlayerList: Player[];
    export let startingPlayerId: string; // Ensure this is correctly named
    export let thisPlayerId: string;

    const dispatch = createEventDispatcher();
    const serverUrl: string = "http://localhost:5678";
    let game: GameServer = new GameServer(initialPlayerList, startingPlayerId);
    let showModal = false; // State for showing/hiding the modal
    let selectedHand; // Hold the selected hand from the modal

    onMount(() => {
        if (!socket) {
            socket = io(serverUrl);
        }

        socket.on('gameState', (data) => {
            dispatch('update', data);
        });

        socket.on(SocketEvents.hit, (data: { move: HandRankings.IChecker }) => {
            let move = new HandRankings.OneChecker(data.move.high);
            game.hit(move);
            console.log("received hit data:", data.move, "; current player now: ", game.currentPlayer);
        });

        socket.on(SocketEvents.checkToPlayers, () => {
            game.checkAndDeal();
        });
    });

    // This function is called when the modal is closed and we have selected a bet
    function handleBetSelection(event: CustomEvent) {
        const { detail } = event;
        selectedHand = detail;
        console.log("AAAAAAAAAAAAAAAAAAAAA"); // https://www.youtube.com/watch?v=-UGFq6jAlZg
        socket.emit(SocketEvents.hit, { move: selectedHand });
        showModal = false; 
    }

    function check() {
        socket.emit(SocketEvents.checkToServer);
    }

    function getBetName() {
        if (!game.previousBet) {
            return "<First move placeholder>";
        }
        return game.previousBet.constructor.name;
    }
</script>

<h3>{#if gameId} Game ID: {gameId} {/if}</h3>
<p>Players:</p>
<ul>
    {#each game.players as {name}}
        <li>NAME: {name}</li>
    {/each}
</ul>
{#if game.currentPlayer == thisPlayerId}
    <p>Your turn</p>
    <button on:click={() => showModal = true}>Raise</button>
    <button on:click={check}>Check</button>
{/if}

<p>Bet:</p>
{getBetName()}

{#if showModal}
    <CardModal on:close={() => showModal = false} on:select={handleBetSelection} />
{/if}

<style>
    li {
        font-size: 20px;
    }
    p {
        font-size: 25px;
    }
</style>
