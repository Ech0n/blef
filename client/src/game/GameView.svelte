<script lang="ts">
    import { onMount, createEventDispatcher, onDestroy } from 'svelte';
    import { io } from 'socket.io-client';
    import type { Socket } from 'socket.io-client';
    import { SocketEventsCommon, SocketEventsFromHost } from '../../../src/types/socketEvents';
    import CardModal from './CardModals.svelte';
    import { Game } from './Game';
    import type { checkToPlayersPayload, hitPayload } from '../../../common/payloads';
    import { cardCountTableToIterableArray, type CardCountTable, cardToRankTranslation } from '../model/Card';
    import CardImageHandler from './CardImageHandler';
    import { config } from '../../../config';
    import HelpModal from '../HelpModal.svelte';

    export let gameId: string;
    export let socket: Socket;
    export let kickPlayer: (uid: string) => void | undefined;
    export let closeGame: () => void | undefined;

    export let thisPlayerId: string;
    export let isHost: boolean | undefined = false;
    export let game: Game;

    const dispatch = createEventDispatcher();
    const serverUrl: string = config.BACKEND_SERVER_ADDRESS;
    let eliminated = false;
    let showModal: boolean = false;
    let betName: string = '';
    let selectedHand;
    let countdown: number = 30;
    let roundTimer: ReturnType<typeof setInterval> | undefined;
    let showButtons: boolean = true;
    let previousCards: CardCountTable;
    let readyPreviousCards: any = [];
    let showHelpModal: boolean = false;

    //TODO : When game ends tehere should be a cleanup of socket listeners

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
        // console.log('Im destroun this !!!');
        socket.removeAllListeners(SocketEventsCommon.hit);
        socket.removeAllListeners(SocketEventsCommon.checkToServer);
        socket.removeAllListeners(SocketEventsCommon.checkToPlayers);
        socket.removeAllListeners(SocketEventsCommon.kickPlayer);
        socket.removeAllListeners(SocketEventsCommon.checkToPlayers);
        socket.removeAllListeners(SocketEventsCommon.checkToPlayers);
    });

    onMount(() => {
        if (!socket) {
            socket = io(serverUrl);
        }

        socket.on(SocketEventsCommon.hit, (data: hitPayload) => {
            countdown = 30;
            console.log('hit data is here', data);
            if (isHost) {
                stopRoundTimer();
                sleep(2000).then(() => {
                    if (!game.gameClosed) {
                        startRoundTimer();
                    }
                });
            }
            console.log('is gameCLosed: ', game.gameClosed);
            if (!game.gameClosed) {
                game.hit(data.move);
                game = game;
                // showButtons = false; // This is necessary to avoid spamming check
                // sleep(3000).then(() => {
                //     showButtons = true;
                // });
                showButtons = true;
            } else {
                stopRoundTimer();
            }
        });

        socket.on(SocketEventsCommon.kickPlayer, (playerId: string) => {
            if (playerId === thisPlayerId) {
                dispatch('leave');
            } else {
                game.removePlayer(playerId);
                game = game; // I dont think it changes anything
                dispatch('playerLeft', playerId);
            }
        });

        if (isHost) {
            // ********************************************
            // |         HOST SOCKET FUNCTIONALITY        |
            // ********************************************

            console.log('host');

            game.gameClosed = false;
            startRoundTimer();

            socket.on(SocketEventsCommon.checkToServer, (data) => {
                if (game.previousBet) {
                    previousCards = game.getCardCount();
                    constructReadyCards();
                }

                let checkResult = game.validateCheck();
                game = game;
                socket.emit(SocketEventsCommon.checkToPlayers, checkResult);
                // console.log(previousCards);
                socket.emit(SocketEventsFromHost.cardListToPlayers, previousCards);
                console.log('sending to players: ', previousCards, checkResult);
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
            console.log('non host');
            socket.on(SocketEventsCommon.checkToPlayers, (data: checkToPlayersPayload) => {
                console.log('recieved check', data);
                game.check(data);
                // OPTIMIZE maybe shoudld fix
                game = game; // I dont think it changes anything //UGLY
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

            socket.on(SocketEventsCommon.updateTimerToPlayers, (update: number) => {
                countdown = update;
            });

            socket.on(SocketEventsCommon.updateCardCountToPlayers, (oldCards: CardCountTable) => {
                previousCards = oldCards;
                constructReadyCards();
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

                        socket.emit(SocketEventsCommon.hit, { move: forcedBet });
                        showModal = false;
                    }
                }
            });
        }
    }

    // TODO: On finished game when new game is tarted players are not initalized properly
    // This function is called when the modal is closed and we have selected a bet
    function handleBetSelection(event: CustomEvent) {
        if (countdown > 0) {
            const { detail } = event;
            selectedHand = detail;
            socket.emit(SocketEventsCommon.hit, { move: selectedHand });
        }
        showModal = false;
    }

    function check(): void {
        console.log(isHost);
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
        // console.log('prevbet', game.previousBet);
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    function constructReadyCards() {
        let iterableCards = cardCountTableToIterableArray(previousCards);
        readyPreviousCards = [];

        const cardNumberToString: { [key: number]: string } = {
            11: 'j',
            12: 'q',
            13: 'k',
            14: 'a',
        };
        const IndexToColor: { [key: number]: string } = {
            4: 'spade',
            3: 'heart',
            2: 'club',
            1: 'diamond',
        };

        for (let [cardNumber, colorCounts] of iterableCards) {
            for (let [color, isThereColor] of colorCounts) {
                if (isThereColor == 1) {
                    let stringCardNumber = cardNumberToString[cardNumber] || cardNumber.toString();
                    let readyCardNumber = cardToRankTranslation[stringCardNumber].string;
                    readyPreviousCards.push(readyCardNumber + ' ' + IndexToColor[color]);
                }
            }
        }
    }

    const shortenUsername = (username: string) => {
        return username.length > 5 ? `${username.slice(0, 5)}...` : username;
    };

    $: if (game.previousBet) {
        betName = getBetName();
    }
</script>

<!-- -------------------------------------------- -->
<!-- |             HTML SVELTE CODE             | -->
<!-- -------------------------------------------- -->
<div class="game-container">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
        class="helper"
        on:click={() => {
            showHelpModal = true;
        }}
    >
        <!-- Man autoformatter... what the fuck is this-->
        ❔
    </div>
    <h3>
        {#if gameId}
            Game ID: {gameId}
            {#if isHost && kickPlayer !== undefined}
                <button class="kick-button" style="padding: 7px 4px 1px 4px; font-size: 32px" on:click={() => closeGame()}>Close Game</button>
            {/if}
        {/if}
    </h3>
    <ul>
        {#each game.players as { username, loses, uid }}
            <div class="player-names">
                {#if uid === game.currentPlayer}
                    <strong>
                        > <span class="full-name">{username}</span>
                        <span class="short-name">{shortenUsername(username)}</span>
                    </strong>
                {:else}
                    <span class="full-name">{username}</span>
                    <span class="short-name">{shortenUsername(username)}</span>
                {/if}
                | {1 + loses} Cards 🂠
                {#if isHost && kickPlayer !== undefined && thisPlayerId !== uid}
                    <button class="kick-button" on:click={() => kickPlayer(uid)}>Kick</button>
                {/if}
            </div>
        {/each}
        {#each game.eliminatedPlayers as { username }}
            <p class="eliminated">{username}</p>
        {/each}
    </ul>
    <div>
        {#if !eliminated}
            <div class="cards-container">
                <div class={previousCards ? 'cards-width-with-prev' : 'cards-width-default'}>
                    <p>Your hand:</p>
                    <div class="hand">
                        {#each game.hand as card}
                            <!-- svelte-ignore a11y-missing-attribute -->
                            <img src={cardImageHandler.getCardImage(card[0] + ' ' + card[1])} />
                        {/each}
                    </div>
                </div>
                {#if previousCards}
                    <div class="prev-cards-width">
                        <p style="font-size: 15px">Cards from previous round:</p>
                        <div class="prev-cards-container">
                            {#each readyPreviousCards as card}
                                <!-- svelte-ignore a11y-missing-attribute -->
                                <img src={cardImageHandler.getCardImage(card)} />
                                <br />
                            {/each}
                        </div>
                    </div>
                {/if}
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
    <div class="center-items">
        <div class="bet-container">
            <div class="bet-name-container">
                <p>Current bet:</p>
                {#if game.previousBet}
                    {betName}
                {:else}
                    <p class="stronger">No bet has been made yet</p>
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
    </div>
    {#if showModal}
        <CardModal on:close={() => (showModal = false)} on:select={handleBetSelection} previousBet={game.previousBet} />
    {/if}
    {#if showHelpModal}
        <HelpModal on:close={() => (showHelpModal = false)} />
    {/if}
</div>

<style>
    .helper {
        position: absolute;
        top: 1%;
        right: 1%;
        cursor: pointer;
        color: black;
        border: 2px solid gray;
        padding: 3px 0;
        border-radius: 100px;
    }
    .kick-button {
        background-color: rgb(214, 4, 4);
        padding: 4px;
        font-size: 26px;
    }
    .game-container {
        position: absolute;
        top: 70px;
        left: 0;
        width: 100%;
    }
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
    .center-items {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .bet-container {
        width: fit-content;
        background-color: rgb(26, 25, 25);
        padding: 5px 30px 15px 30px;
        margin: 15px 10%;
        border-radius: 10px;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
    }
    .bet-name-container {
        background-color: rgb(32, 31, 32);
        margin-top: 10px;
        padding: 0 15px 10px 15px;
        border-radius: 10px;
        border: 2px solid rgb(46, 45, 45);
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

    .cards-container {
        width: 100%;
        display: flex;
        margin-bottom: 20px;
    }
    .prev-cards-container {
        display: flex;
        flex-wrap: wrap;
        gap: 3px;
        justify-content: center;
        align-items: center;
        position: relative;
        right: 5%;
    }
    .prev-cards-container img {
        width: 80px;
    }
    .cards-width-default {
        margin-left: 10%;
        width: 80%; /* Assume full width when there are no previous cards or for smaller screens */
    }
    .cards-width-with-prev {
        margin-left: 10%;
        width: 80%; /* Default width when previous cards exist */
    }
    .player-names {
        white-space: nowrap;
        font-size: 32px;
    }
    .stronger {
        font-size: 45px;
    }
    .short-name {
        display: none; /* Hide shortened names by default */
    }

    @media (max-width: 500px) {
        .full-name {
            display: none; /* Hide full names on narrow screens */
        }
        .short-name {
            display: inline; /* Show shortened names on narrow screens */
        }
        .stronger {
            font-size: 15px;
        }
        .timer-container {
            font-size: 40px;
            margin-left: 10px;
        }
        .bet-name-container {
            width: 200px;
        }
    }

    @media (max-width: 800px) {
        .cards-width-with-prev {
            margin-left: 0;
            width: 100%;
        }
        .prev-cards-container img {
            width: 45px;
        }
        .hand img {
            width: 100px;
        }
        .player-names {
            font-size: 24px;
        }
        strong {
            font-size: 28px;
        }
        .stronger {
            font-size: 20px;
        }
        .helper {
            top: 0;
            font-size: 30px;
            padding: 2px 0px;
        }
    }
</style>
