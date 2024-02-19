<script lang="ts">
    import { onMount, createEventDispatcher } from 'svelte';
    import { io } from "socket.io-client";
    import type { Socket } from 'socket.io-client';
    import { GameServer } from './GameServer';
    import { SocketEvents } from '../../../src/types/socketEvents';
    import { Player } from '../../../definitions/player';
    import CardModal from './CardModals.svelte'; // Make sure this path is correct
    import { Game } from './Game';

    export let gameId: string;
    export let socket: Socket;
    export let initialPlayerList: Player[];
    export let startingPlayerId: string; // Ensure this is correctly named
    export let thisPlayerId: string;
    export let isHost:boolean|undefined = false;

    const dispatch = createEventDispatcher();
    const serverUrl: string = "http://localhost:5678";
    let game: Game = (isHost) ? new GameServer(initialPlayerList, startingPlayerId) : new Game(initialPlayerList, startingPlayerId);

    let showModal = false; // State for showing/hiding the modal
    let selectedHand; // Hold the selected hand from the modal

    const cardFullNames: { [key: string]: string } = {
        '2': 'Two', '3': 'Three', '4': 'Four', '5': 'Five', '6': 'Six', '7': 'Seven', '8': 'Eight', 
        '9': 'Nine', '10': 'Ten', 'J': 'Jack', 'Q': 'Queen', 'K': 'King', 'A': 'Ace'
    };

    let mesg = (isHost)? "thisa host" : "this not a hosta"
    console.log(mesg)
    onMount(() => {
        
        if (!socket) {
            socket = io(serverUrl);
        }

        socket.on('gameState', (data) => {
            dispatch('update', data);
        });

        socket.on(SocketEvents.hit, (data: { move: any }) => {
            // console.log("received hit data:", data.move, "; current player now: ", game.currentPlayer);
            game.hit(data.move);
            game = game
        });

        if(isHost)
        {
            socket.on(SocketEvents.checkToServer, (data) => {
                let checkResult = game.validateCheck();
                console.log("Valuidated check this is what goes further ",checkResult)

                game = game
                socket.emit(SocketEvents.checkToPlayers,checkResult)
            });
        }
            

        socket.on(SocketEvents.checkToPlayers, (data:any) => {
            console.log("received check data:",data)
            game.check(data);
            game = game

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

    function check(): void {
        socket.emit(SocketEvents.checkToServer);
    }

    function getBetName(): string {
        if (!game.previousBet) {
            return "Error has occured.";
        }

        const { selectedRanking, primaryCard, secondaryCard, selectedColor, startingCard } = game.previousBet;
        let currentBet: string = selectedRanking;

        if (['One', 'Pair', 'Three', 'Four'].includes(selectedRanking)) {
            let cardName = cardFullNames[primaryCard];
            return currentBet + " " + cardName + ((selectedRanking !== 'One') ? "s" : ""); 
        }


        if (['Double', 'Full'].includes(selectedRanking)) {
            let primaryCardName = cardFullNames[primaryCard];
            let secondaryCardName = cardFullNames[secondaryCard]
            return currentBet + " of 3 " + primaryCardName + " and 2 " + secondaryCardName; 
        }

        if (['Flush', 'Street'].includes(selectedRanking)) {
            let cardName = cardFullNames[startingCard];
            return currentBet + " starting from " + cardName + (selectedRanking === 'Flush') ? (" in color " + selectedColor) : "";
        }

        if (selectedRanking === 'Royal') {
            return selectedRanking + " Flush of color " + selectedColor;
        }

        return selectedRanking;
    }

</script>

<h3>{#if gameId} Game ID: {gameId} {/if}</h3>
<p>Players:</p>
<ul>
    {#each game.players as {username,loses}}
        <li>NAME: {username} ❤️{5-loses}</li>
    {/each}
</ul>
{#if game.currentPlayer == thisPlayerId}
    <p>Your turn</p>
    <button on:click={() => showModal = true}>Raise</button>
    <button on:click={check}>Check</button>
{/if}

<p>Bet:</p>
{#if game.previousBet}
    {getBetName()}
    {:else}
    No best has been made yet
{/if}
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
