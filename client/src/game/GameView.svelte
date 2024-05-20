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
    import CardsInHand from './CardsInHand.svelte';
    import PlayerCarousel from './components/PlayerCarousel.svelte';
    // import { Siema } from 'siema/dist/siema.min';

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
    // let playerSiema = new Siema();
    let carouselNextPlayer: () => Promise<void>;
    let carouselSetup: (arg0: number) => Promise<void>;

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
        console.log('Im destroun this !!!');
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
                carouselNextPlayer();
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
                carouselSetup(game.currentPlayerIndx);
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

                carouselSetup(game.currentPlayerIndx);
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
        }, 100000);
    }

    function stopRoundTimer(): void {
        if (roundTimer) {
            clearInterval(roundTimer);
        }
        roundTimer = undefined;
    }

    function sleep(ms: number) {
        console.log('prevbet', game.previousBet);
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

    $: if (game.previousBet) {
        betName = getBetName();
    }
</script>

<!-- -------------------------------------------- -->
<!-- |             HTML SVELTE CODE             | -->
<!-- -------------------------------------------- -->
<div class="game-container main">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div id="relatives">
        <div
            class="helper"
            on:click={() => {
                showHelpModal = true;
            }}
        >
            <!-- Man autoformatter... what the fuck is this-->
            ❔
        </div>

        {#if gameId}
            <h3 id="gamecode">#{gameId}</h3>
            <!-- {#if isHost && kickPlayer !== undefined}
                <button class="kick-button" style="padding: 7px 4px 1px 4px; font-size: 32px" on:click={() => closeGame()}>Close Game</button>
            {/if} -->
        {/if}
    </div>
    <div class="main view mainviewview">
        <div class="container">
            <p>
                time left: 0:{countdown < 10 ?
                    countdown < 0 ?
                        '00'
                    :   '0' + countdown
                :   countdown}
            </p>
        </div>
        <div class="group">
            <div>
                <h4>Previous bet:</h4>
                <div class="container">
                    {#if game.previousBet}
                        {betName}
                    {:else}
                        <p class="stronger">No bet has been made yet</p>
                    {/if}
                </div>
            </div>
        </div>

        <PlayerCarousel users={game.players} bind:next={carouselNextPlayer} bind:setup={carouselSetup} />
        <div>
            {#if !eliminated}
                <div class="cards-container">
                    {#if previousCards}
                        <div class="prev-cards-width group">
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
            <div style="responsive">
                <button class="start-close" on:click={() => (showModal = true)}>Raise</button>
                <button id="check-button" class="start-close" on:click={check}>Check</button>
            </div>
        {/if}
        <div class="cardsPlaceHolder"></div>
    </div>
    <CardsInHand hand={game.hand} />

    {#if showModal}
        <CardModal on:close={() => (showModal = false)} on:select={handleBetSelection} previousBet={game.previousBet} />
    {/if}
    {#if showHelpModal}
        <HelpModal on:close={() => (showHelpModal = false)} />
    {/if}
</div>

<style>
    /* FIXME change name */
    .mainviewview {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: column;
        width: 100%;
    }
    .view {
        height: 100%;
    }
    .game-container {
        position: absolute;
        top: 0px;
        left: 0;
        height: 100%;
        overflow: hidden;
        width: 100%;
        display: flex;
        overflow: hidden;
        flex-direction: column;
        justify-content: start;
        background-color: var(--background-color);
        padding-top: 30px;
        row-gap: 20px;
        align-items: center;
    }

    .helper {
        position: absolute;
        top: 1%;
        right: 1%;
        cursor: pointer;
        color: black;
        border: 2px solid gray;
        padding: 5px 0;
        border-radius: 100px;
    }
    #gamecode {
        position: absolute;
        top: 1%;
        left: 10px;
        margin: 10px;
    }

    /* FIXME */
    p {
        font-size: 20px;
    }

    .start-close {
        margin: 10px 15px;
        color: aliceblue;
        max-height: 100px;
    }

    .cardsPlaceHolder {
        height: 150px;
        position: relative;
        bottom: 0px;
        background-color: RED;
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

    .stronger {
        font-size: 45px;
    }

    @media (max-width: 800px) {
        .prev-cards-container img {
            width: 45px;
        }

        .player-names {
            font-size: 24px;
        }

        .stronger {
            font-size: 20px;
        }
        .helper {
            font-size: 30px;
            padding: 4px 0px;
        }
    }
</style>
