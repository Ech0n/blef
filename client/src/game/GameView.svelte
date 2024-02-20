<script lang="ts">
    import { onMount, createEventDispatcher } from 'svelte';
    import { io } from "socket.io-client";
    import type { Socket } from 'socket.io-client';
    import { GameServer } from './GameServer';
    import { SocketEvents } from '../../../src/types/socketEvents';
    import { Player } from '../../../common/player';
    import CardModal from './CardModals.svelte';
    import { Game } from './Game';
    import type { checkToPlayersPayload, gameStartPayload } from '../../../common/payloads';

    export let gameId: string;
    export let socket: Socket;
    export let initialPlayerList: Player[];
    export let thisPlayerId: string;
    export let isHost:boolean|undefined = false;
    export let gameStartData: gameStartPayload

    const dispatch = createEventDispatcher();
    const serverUrl: string = "http://localhost:5678";
    let game: Game = (isHost) ? new GameServer(initialPlayerList, gameStartData,thisPlayerId) : new Game(initialPlayerList, gameStartData,thisPlayerId);

    let showModal: boolean = false;
    let betName: string = '';
    let selectedHand;

    const cardFullNames: { [key: string]: string } = {
        '2': 'Two', '3': 'Three', '4': 'Four', '5': 'Five', '6': 'Six', '7': 'Seven', '8': 'Eight', 
        '9': 'Nine', '10': 'Ten', 'J': 'Jack', 'Q': 'Queen', 'K': 'King', 'A': 'Ace'
    };

    onMount(() => {
        if (!socket) {
            socket = io(serverUrl);
        }

        socket.on('gameState', (data) => {
            dispatch('update', data);
        });

        socket.on(SocketEvents.hit, (data: { move: any }) => {
            game = game;
            game.hit(data.move);
        });

        if (isHost) {
            socket.on(SocketEvents.checkToServer, (data) => {
                let checkResult = game.validateCheck();
                console.log("Valuidated check this is what goes further ",checkResult);
                game = game;
                socket.emit(SocketEvents.checkToPlayers,checkResult);
            });
        }else{
            socket.on(SocketEvents.checkToPlayers, (data:checkToPlayersPayload) => {
                console.log("received check data!",data)
                game.check(data);
                game = game

            });
        }
            


    });

    // This function is called when the modal is closed and we have selected a bet
    function handleBetSelection(event: CustomEvent) {
        const { detail } = event;
        selectedHand = detail;
        console.debug("AAAAAAAAAAAAAAAAAAAAA"); // https://www.youtube.com/watch?v=-UGFq6jAlZg
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
            return (currentBet + " " + cardName + ((selectedRanking !== 'One') ? "s" : "")); 
        }


        if (['Double', 'Full'].includes(selectedRanking)) {
            let primaryCardName = cardFullNames[primaryCard];
            let secondaryCardName = cardFullNames[secondaryCard]
            return (currentBet + " of 3 " + primaryCardName + "s and 2 " + secondaryCardName + "s"); 
        }

        if (['Flush', 'Street'].includes(selectedRanking)) {
            let cardName = cardFullNames[startingCard];
            return (currentBet + " starting from " + cardName + ((selectedRanking === 'Flush') ? (" in color " + selectedColor) : ""));
        }

        if (selectedRanking === 'Royal') {
            return selectedRanking + " Flush of " + selectedColor;
        }

        return selectedRanking;
    }

    // Reactive statements in Svelte btw :O
    $: if (game.previousBet) {
        betName = getBetName();
    }

</script>

<h3>{#if gameId} Game ID: {gameId} {/if}</h3>
<p>Players:</p>
<ul>
    {#each game.players as {username, loses, uid}}
        {#if (uid ===  game.currentPlayer)}
            <strong> > {username}</strong>
        {:else}
            {username}
        {/if}
        ❤️ {5 - loses} <br>
    {/each}
</ul>
<div>
    <p>Your cards:</p>
    <div class="hand">
        {#each game.hand as card}
            <div class="card">
                {card[0]} {card[1]} 
            </div>
        {/each}
    </div>
</div>
{#if game.currentPlayer == thisPlayerId}
    <p>Your turn</p>
    <button on:click={() => showModal = true}>Raise</button>
    <button on:click={check}>Check</button>
{/if}

<p>Current bet:</p>
{#if game.previousBet}
    {betName}
{:else}
    No best has been made yet
{/if}
{#if showModal}
    <CardModal on:close={() => showModal = false} on:select={handleBetSelection} />
{/if}

<style>
    .hand {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: row;
        flex-wrap: wrap; 
        gap: 15px;
    }
    .card {
        padding: 30px;
        padding-left: 50px;
        padding-right: 50px;
        border-radius: 10px;
        background-color: whitesmoke;
        color:black
    }
    strong {
        font-weight: 900;
        color: rgb(3, 0, 0);
    }
    p {
        font-size: 20px;
    }
</style>
