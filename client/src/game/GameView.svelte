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
    import type { CardCountTable } from '../model/Card';
    import CardImageHandler from './CardImageHandler';

    export let gameId: string;
    export let socket: Socket;
    export let initialPlayerList: Player[];
    export let thisPlayerId: string;
    export let isHost:boolean|undefined = false;
    export let gameStartData: gameStartPayload
    export let cardCounts: CardCountTable

    const dispatch = createEventDispatcher();
    const serverUrl: string = "http://localhost:5678";
    let game: Game = (isHost) ? new GameServer(initialPlayerList, gameStartData,thisPlayerId,cardCounts) : new Game(initialPlayerList, gameStartData,thisPlayerId);
    let eliminated = false
    let showModal: boolean = false;
    let betName: string = '';
    let selectedHand;

    const cardImageHandler = new CardImageHandler();
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
            game.hit(data.move);
            game = game;
        });

        if (isHost) {
            socket.on(SocketEvents.checkToServer, (data) => {
                let checkResult = game.validateCheck();
                console.log("Valuidated check this is what goes further ",checkResult);
                game = game;
                socket.emit(SocketEvents.checkToPlayers,checkResult);
                game.eliminatedPlayers.forEach((pl)=>{
                    if(pl.uid == thisPlayerId)
                    {
                        eliminated = true
                    }
                })
                if(game.players.length == 1)
                {
                    dispatch("gameFinished",game.players[0])
                }
            });
        } else {
            socket.on(SocketEvents.checkToPlayers, (data:checkToPlayersPayload) => {
                console.log("received check data!",data)
                game.check(data);
                game = game
                game.eliminatedPlayers.forEach((pl)=>{
                    if(pl.uid == thisPlayerId)
                    {
                        eliminated = true
                    }
                })
                if(game.players.length == 1)
                {
                    dispatch("gameFinished",game.players[0])
                }
            });
        }
            


    });
    //TODO: On finished game when new game is tarted players are not initalized properly
    // This function is called when the modal is closed and we have selected a bet
    function handleBetSelection(event: CustomEvent) {
        const { detail } = event;
        selectedHand = detail;
        // console.log(selectedHand); // https://www.youtube.com/watch?v=-UGFq6jAlZg
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

        const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
        let { selectedRanking, primaryCard, secondaryCard, selectedColor, startingCard } = game.previousBet;
        selectedRanking = capitalize(selectedRanking);
        primaryCard = capitalize(primaryCard);
        secondaryCard = capitalize(secondaryCard);
        selectedColor = capitalize(selectedColor);
        startingCard = capitalize(startingCard);

        let currentBet: string = selectedRanking;

        if (['One', 'Pair', 'Three', 'Four'].includes(selectedRanking)) {
            let cardName = cardFullNames[primaryCard];
            return (currentBet + " " + cardName + ((selectedRanking !== 'One') ? "s" : "")); 
        }


        if (['Double', 'Full'].includes(selectedRanking)) {
            let primaryCardName = cardFullNames[primaryCard];
            let secondaryCardName = cardFullNames[secondaryCard]
            return (currentBet + " of " + (selectedRanking === 'Double' ? "2 " : "3 ") + primaryCardName + "s and 2 " + secondaryCardName + "s"); 
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
<ul>
    {#each game.players as {username, loses, uid}}
    <div style="white-space: nowrap; font-size: 32px">
        {#if uid === game.currentPlayer}
            <strong> > {username}</strong>
        {:else}
            {username}
        {/if}
        | {1 + loses} Cards 🂠 
    </div>
    {/each}
    {#each game.eliminatedPlayers as {username}}
        <p class="eliminated">{username}</p>
    {/each}
</ul>
<div>
    {#if !eliminated}
    <p>Your cards:</p>
    <div class="hand">
        {#each game.hand as card}
            <!-- svelte-ignore a11y-missing-attribute -->
            <img src={cardImageHandler.getCardImage(card[0] + " " + card[1])}>
        {/each}
    </div>
    {/if}
</div>
{#if game.currentPlayer == thisPlayerId}
    <p>Your turn</p>
    <button class="start-close" on:click={() => showModal = true}>Raise</button>
    <button class="start-close" on:click={check}>Check</button>
{/if}

<div class="bet-container">
    <p>Current bet:</p>
    {#if game.previousBet}
        {betName}
    {:else}
        No bet has been made yet
    {/if}
</div>
{#if showModal}
    <CardModal on:close={() => showModal = false} on:select={handleBetSelection} previousBet={game.previousBet} />
{/if}

<style>
    .eliminated{
        color:rgb(167, 167, 167);
    }
    .hand {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: row;
        flex-wrap: wrap; 
        gap: 15px;
    }
    strong {
        font-weight: 900;
        font-size: 34px;
        color: aliceblue;
        white-space: nowrap;
    }
    p {
        font-size: 20px;
    }
    .start-close {
        color: aliceblue;
        font-size: 35px;
    }
    .bet-container {
        background-color: rgb(26, 25, 25);
        padding: 5px 15px 15px 15px;
        margin: 15px 0;
        border-radius: 10px;
    }
</style>
