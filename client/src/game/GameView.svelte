<script lang="ts">
    import { onMount, createEventDispatcher, onDestroy } from 'svelte';
    import { io } from 'socket.io-client';
    import type { Socket } from 'socket.io-client';
    import { GameServer } from './GameServer';
    import { SocketEventsCommon, SocketEventsFromHost } from '../../../src/types/socketEvents';
    import { Player } from '../../../common/player';
    import CardModal from './CardModals.svelte';
    import { Game } from './Game';
    import type { checkToPlayersPayload, gameStartPayload } from '../../../common/payloads';
    import type { CardCountTable } from '../model/Card';
    import CardImageHandler from './CardImageHandler';
    import { config } from '../../../config';
    import { count, time } from 'console';
    import { select_option } from 'svelte/internal';
    import { start } from 'repl';

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
    let countdown: number = 30;
    let roundTimer: ReturnType<typeof setInterval> | undefined;
    let showButtons: boolean = true;

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

    onMount(() => {
        if (!socket) {
            socket = io(serverUrl);
        }

        socket.on('gameState', (data) => {
            dispatch('update', data);
        });

        socket.on(SocketEventsCommon.hit, (data: { move: any }) => {
            countdown = 30;
            if (isHost) {
                stopRoundTimer();
                sleep(2000).then(() => {
                    if (!game.gameClosed) {
                        startRoundTimer();
                    }
                });
            }

            if (!game.gameClosed) {
                game.hit(data.move);
                game = game;

                showButtons = false; // This is necessary to avoid spamming check
                sleep(3000).then(() => {
                    showButtons = true;
                });
            } else {
                stopRoundTimer();
            }
        });

        if (isHost) {
            game.gameClosed = false;
            startRoundTimer();

            socket.on(SocketEventsCommon.checkToServer, (data) => {
                let checkResult = game.validateCheck();
                game = game;
                socket.emit(SocketEventsCommon.checkToPlayers, checkResult);
                game.eliminatedPlayers.forEach((pl) => {
                    if (pl.uid == thisPlayerId) {
                        eliminated = true;
                    }
                });

                if (game.players.length == 1) {
                    game.gameClosed = true;
                    stopRoundTimer();
                    dispatch('gameFinished', game.players[0]);
                }

                if (!game.gameClosed) {
                    stopRoundTimer();
                    startRoundTimer();
                }
            });
        } else {
            // ********************************************
            // |      NON-HOST SOCKET FUNCTIONALITY       |
            // ********************************************
            socket.on(SocketEventsCommon.checkToPlayers, (data: checkToPlayersPayload) => {
                game.check(data);
                game = game; // I dont think it changes anything
                game.eliminatedPlayers.forEach((pl) => {
                    if (pl.uid == thisPlayerId) {
                        eliminated = true;
                    }
                });

                if (game.players.length == 1) {
                    dispatch('gameFinished', game.players[0]);
                }

                countdown = 30; // Not necessary but let it stay
            });

            socket.on(SocketEventsCommon.kickPlayer, (playerId: string) => {
                game.removePlayer(playerId);
                game = game; // I dont think it changes anything
                dispatch('playerLeft', playerId);
            });

            socket.on(SocketEventsCommon.updateTimerToPlayers, (update: number) => {
                countdown = update;
            });
        }
    });

    function endOfTimerHandler() {
        if (countdown <= 0) {
            sleep(2000).then(() => {
                if (countdown <= 0) {
                    if (game.previousBet) {
                        check();
                    } else {
                        const forcedBet = {
                            selectedRanking: 'royal',
                            primaryCard: '',
                            secondaryCard: '',
                            selectedColor: 'spade',
                            startingCard: '',
                        };

                        const forcedBetEvent = new CustomEvent('forcedBetEvent', {
                            detail: forcedBet,
                        });

                        handleBetSelection(forcedBetEvent);
                    }
                }
            });
        }
    }

    // TODO: On finished game when new game is tarted players are not initalized properly
    // This function is called when the modal is closed and we have selected a bet
    function handleBetSelection(event: CustomEvent) {
        const { detail } = event;
        selectedHand = detail;
        socket.emit(SocketEventsCommon.hit, { move: selectedHand });
        showModal = false;
    }

    function check(): void {
        socket.emit(SocketEventsCommon.checkToServer);
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
            return currentBet + (selectedRanking === 'Pair' ? ' of ' : ' ') + cardName + (selectedRanking !== 'One' ? 's' : '');
        }

        if (['Double', 'Full'].includes(selectedRanking)) {
            let primaryCardName = cardFullNames[primaryCard];
            let secondaryCardName = cardFullNames[secondaryCard];
            return currentBet + (selectedRanking === 'Full' ? ' of 3 ' : ' of 2 ') + primaryCardName + 's and 2 ' + secondaryCardName + 's';
        }

        if (['Flush', 'Street'].includes(selectedRanking)) {
            let cardName = cardFullNames[startingCard];
            return currentBet + ' starting from ' + cardName + (selectedRanking === 'Flush' ? ' in color ' + selectedColor : 's');
        }

        if (selectedRanking === 'Royal') {
            return selectedRanking + ' Flush of ' + selectedColor + 's';
        }

        return selectedRanking + ' ' + selectedColor + 's';
    }

    function startRoundTimer(): void {
        if (roundTimer) {
            return;
        }
        countdown = 30;
        roundTimer = setInterval(() => {
            if (countdown > 0) {
                countdown--;
            } else {
                endOfTimerHandler();
                clearInterval(roundTimer);
                roundTimer = undefined;
            }
            socket.emit(SocketEventsFromHost.timerUpdate, countdown);
        }, 1000);
    }

    function stopRoundTimer(): void {
        if (roundTimer) {
            clearInterval(roundTimer);
        }
        roundTimer = undefined;
    }

    function sleep(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

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
{#if game.currentPlayer == thisPlayerId && showButtons}
    <p>Your turn</p>
    <div style="display:flex; justify-content:center">
        <button class="start-close" on:click={() => (showModal = true)}>Raise</button>
        <button id="check-button" class="start-close" on:click={check}>Check</button>
    </div>
{/if}

<div class="bet-container">
    <div>
        <p>Current bet:</p>
        {#if game.previousBet}
            {betName}
        {:else}
            No bet has been made yet
        {/if}
    </div>
    <div class="timer-container">
        0:{countdown < 10 ?
            countdown < 0 ?
                '00'
            :   '0' + countdown
        :   countdown}
    </div>
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
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
    }

    .timer-container {
        color: aliceblue;
        font-size: 50px;
        background-color: rgb(27, 23, 23);
        padding: 15px 20px;
        border: 2px solid rgb(32, 32, 32);
        border-radius: 15px;
        margin: 25px 0 0 20px;
        max-height: 100px;
    }
</style>
