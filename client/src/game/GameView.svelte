<script lang="ts">
    import { onMount, createEventDispatcher, onDestroy } from 'svelte';
    import { io } from 'socket.io-client';
    import type { Socket } from 'socket.io-client';
    import { GameServer } from './GameServer';
    import { SocketEvents } from '../../../src/types/socketEvents';
    import { Player } from '../../../common/player';
    import CardModal from './CardModals.svelte';
    import { Game } from './Game';
    import type { checkToPlayersPayload, gameStartPayload } from '../../../common/payloads';
    import type { CardCountTable } from '../model/Card';
    import CardImageHandler from './CardImageHandler';
    import { config } from '../../../config';

    export let gameId: string;
    export let socket: Socket;
    export let initialPlayerList: Player[];

    export let thisPlayerId: string;
    export let isHost: boolean | undefined = false;
    export let gameStartData: gameStartPayload;
    export let cardCounts: CardCountTable;

    const dispatch = createEventDispatcher();
    const serverUrl: string = config.BACKEND_SERVER_ADDRESS;
    let game: Game = isHost ? new GameServer(initialPlayerList, gameStartData, thisPlayerId, cardCounts) : new Game(initialPlayerList, gameStartData, thisPlayerId);
    let eliminated = false;
    let showModal: boolean = false;
    let betName: string = '';
    let selectedHand;
    let countdown: number = 45;
    let timerInterval: ReturnType<typeof setInterval>;

    const cardImageHandler = new CardImageHandler();
    const cardFullNames: { [key: string]: string } = {
        '2': 'Two',
        '3': 'Three',
        '4': 'Four',
        '5': 'Five',
        '6': 'Six',
        '7': 'Seven',
        '8': 'Eight',
        '9': 'Nine',
        '10': 'Ten',
        'J': 'Jack',
        'Q': 'Queen',
        'K': 'King',
        'A': 'Ace',
    };

    onDestroy(() => {
        clearInterval(timerInterval);
    });

    onMount(() => {
        if (!socket) {
            socket = io(serverUrl);
        }

        socket.on('gameState', (data) => {
            dispatch('update', data);
        });

        if (game.currentPlayer === thisPlayerId) {
            // startTimer();
        }

        socket.on(SocketEvents.hit, (data: { move: any }) => {
            game.hit(data.move);
            game = game;
            if (game.currentPlayer === thisPlayerId) {
                // startTimer();
            }
        });

        if (isHost) {
            socket.on(SocketEvents.checkToServer, (data) => {
                let checkResult = game.validateCheck();
                console.log('Valuidated check this is what goes further ', checkResult);
                game = game;
                socket.emit(SocketEvents.checkToPlayers, checkResult);
                game.eliminatedPlayers.forEach((pl) => {
                    if (pl.uid == thisPlayerId) {
                        eliminated = true;
                    }
                });
                if (game.players.length == 1) {
                    dispatch('gameFinished', game.players[0]);
                }
            });
        } else {
            socket.on(SocketEvents.checkToPlayers, (data: checkToPlayersPayload) => {
                console.log('received check data!', data);
                game.check(data);
                game = game;
                game.eliminatedPlayers.forEach((pl) => {
                    if (pl.uid == thisPlayerId) {
                        eliminated = true;
                    }
                });
                if (game.players.length == 1) {
                    dispatch('gameFinished', game.players[0]);
                }
            });
            socket.on(SocketEvents.kickPlayer, (playerId: string) => {
                console.log('kick player ', playerId);
                game.removePlayer(playerId);
                game = game;
                dispatch('playerLeft', playerId);
            });
        }
    });
    // TODO: On finished game when new game is tarted players are not initalized properly
    // This function is called when the modal is closed and we have selected a bet
    function handleBetSelection(event: CustomEvent) {
        const { detail } = event;
        selectedHand = detail;
        clearInterval(timerInterval);
        socket.emit(SocketEvents.hit, { move: selectedHand });
        showModal = false;
    }

    function check(): void {
        clearInterval(timerInterval);
        socket.emit(SocketEvents.checkToServer);
    }

    function startTimer() {
        countdown = 45;
        timerInterval = setInterval(() => {
            countdown -= 1;
            if (countdown <= 0) {
                clearInterval(timerInterval);

                if (!game.previousBet) {
                    const forcedBet = {
                        selectedRanking: 'royal', // Default value, change as needed
                        primaryCard: '',
                        secondaryCard: '',
                        selectedColor: 'spade', // Default value, change as needed
                        startingCard: '',
                    };
                    const betEvent = new CustomEvent(SocketEvents.hit, { detail: forcedBet });
                    console.log('Timer finished: Bet');
                    handleBetSelection(betEvent);
                } else {
                    console.log('Timer finished: Check');
                    check();
                }
            }
        }, 1000);
    }

    function getBetName(): string {
        if (!game.previousBet) {
            return 'Error has occured.';
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
            return currentBet + ' ' + cardName + (selectedRanking !== 'One' ? 's' : '');
        }

        if (['Double', 'Full'].includes(selectedRanking)) {
            let primaryCardName = cardFullNames[primaryCard];
            let secondaryCardName = cardFullNames[secondaryCard];
            return currentBet + ' of 3 ' + primaryCardName + 's and 2 ' + secondaryCardName + 's';
        }

        if (['Flush', 'Street'].includes(selectedRanking)) {
            let cardName = cardFullNames[startingCard];
            return currentBet + ' starting from ' + cardName + (selectedRanking === 'Flush' ? ' in color ' + selectedColor : '');
        }

        if (selectedRanking === 'Royal') {
            return selectedRanking + ' Flush of ' + selectedColor;
        }

        return selectedRanking;
    }

    // Reactive statements in Svelte btw :O
    $: if (game.previousBet) {
        betName = getBetName();
    }
</script>

<h3>
    {#if gameId}
        Game ID: {gameId}
    {/if}
</h3>
<ul>
    {#each game.players as { username, loses, uid }}
        <div style="white-space: nowrap; font-size: 32px">
            {#if uid === game.currentPlayer}
                <strong> > {username}</strong>
            {:else}
                {username}
            {/if}
            | {1 + loses} Cards 🂠
        </div>
    {/each}
    {#each game.eliminatedPlayers as { username }}
        <p class="eliminated">{username}</p>
    {/each}
</ul>
<div>
    {#if !eliminated}
        <p>Your cards:</p>
        <div class="hand">
            {#each game.hand as card}
                <!-- svelte-ignore a11y-missing-attribute -->
                <img src={cardImageHandler.getCardImage(card[0] + ' ' + card[1])} />
            {/each}
        </div>
    {/if}
</div>
{#if game.currentPlayer == thisPlayerId}
    <p>Your turn</p>
    <div style="display: flex">
        <button class="start-close" on:click={() => (showModal = true)}>Raise</button>
        <button class="start-close" on:click={check}>Check</button>
        {#if countdown > 0}
            <p class="timer-container">{countdown}</p>
        {/if}
    </div>
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
    <CardModal on:close={() => (showModal = false)} on:select={handleBetSelection} previousBet={game.previousBet} />
{/if}

<style>
    .eliminated {
        color: rgb(167, 167, 167);
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
        margin: 0px 15px;
        color: aliceblue;
        font-size: 35px;
        max-height: 100px;
    }

    .bet-container {
        background-color: rgb(26, 25, 25);
        padding: 5px 15px 15px 15px;
        margin: 15px 0;
        border-radius: 10px;
    }

    .timer-container {
        margin: 0 0 5px 20px;
        color: aliceblue;
        font-size: 50px;
        background-color: rgb(26, 25, 25);
        padding: 15px 20px;
        border-radius: 15px;
    }
</style>
