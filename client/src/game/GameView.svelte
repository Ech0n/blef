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

    function hit() {
        showModal = true; // Show the modal when hit is clicked
    }

    // This function is called when the modal is closed and we have selected a bet
    function handleBetSelection(event: CustomEvent) {
        const { detail } = event; // get the selected hand details
        selectedHand = detail; // Assuming the detail contains the hand selection information
        // You can now use selectedHand to make a move or bet in your game
        socket.emit(SocketEvents.hit, { move: selectedHand }); // Adjust according to your data structure
        closeCardModal();  // Close the modal after selection
    }

    function check() {
        socket.emit(SocketEvents.checkToServer);
    }

    function closeCardModal() { // Add a function to close the modal
        showModal = false;
    }

    function getBetName() {
        if (!game.previousBet) {
            return "<to jest pierwszy ruch>";
        }
        return game.previousBet.constructor.name;
    }
</script>

<h3>{#if gameId} Game ID: {gameId} {/if}</h3>
<p>Players:</p>
<ul>
    {#each game.players as {id, name}}
        <li>NAME: {name}</li>
    {/each}
</ul>
{#if game.currentPlayer == thisPlayerId}
    <p>Your turn</p>
    <button on:click={hit}>Raise</button>
    <button on:click={check}>Check</button>
{/if}

<p>Bet:</p>
{getBetName()}

{#if showModal}
    <CardModal on:close={closeCardModal} on:select={handleBetSelection} />
{/if}

<style>
    li {
        font-size: 20px;
    }
    p {
        font-size: 25px;
    }
</style>
