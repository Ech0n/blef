<script lang="ts">
    import type { Socket } from 'socket.io-client'
    import { io } from 'socket.io-client'
    import { createEventDispatcher, onDestroy, onMount } from 'svelte'
    import { toasts } from 'svelte-toasts'
    import type { checkToPlayersPayload, hitPayload } from '../../../common/payloads'
    import { SocketEventsCommon, SocketEventsFromHost } from '../../../common/socketEvents'
    import { cardCountTableToIterableArray, cardToRankTranslation, type CardCountTable } from '../model/Card'
    import CardImageHandler from './CardImageHandler'
    import CardModal from './CardModals.svelte'
    import CardsInHand from './CardsInHand.svelte'
    import GameClock from './components/GameClock.svelte'
    import PlayerCarousel from './components/PlayerCarousel.svelte'
    import { AiEngine } from './AiEngine'
    import { ConnectionHandler } from 'src/ConnectoinHandler'
    import { HandInfo } from './HandRankings'
    import { GameServer } from './GameServer'
    import { Game } from './Game'

    export let gameId: string
    export let socket: Socket
    export let connectionHandler: ConnectionHandler

    export let thisPlayerId: string
    export let isHost: boolean | undefined = false
    export let game: Game

    const dispatch = createEventDispatcher()
    let eliminated = false
    let showModal: boolean = false
    let betName: string = ''
    let selectedHand: HandInfo
    let countdown: number = 60
    let roundTimer: ReturnType<typeof setInterval> | undefined
    let showButtons: boolean = true
    let previousCards: CardCountTable
    let readyPreviousCards: any = []
    let showHelpModal: boolean = false
    let carouselNextPlayer: () => Promise<void>
    let carouselSetup: (arg?: number) => void

    let aiEngine: AiEngine = new AiEngine(connectionHandler)

    const cardImageHandler = new CardImageHandler()
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
    }

    onDestroy(() => {
        socket.removeAllListeners(SocketEventsCommon.hit)
        socket.removeAllListeners(SocketEventsCommon.checkToServer)
        socket.removeAllListeners(SocketEventsCommon.checkToPlayers)
        socket.removeAllListeners(SocketEventsCommon.kickPlayer)
        socket.removeAllListeners(SocketEventsCommon.checkToPlayers)
        socket.removeAllListeners(SocketEventsCommon.checkToPlayers)
    })

    onMount(() => {
        connectionHandler.setupGame(game)

        socket.on(SocketEventsCommon.hit, (data: hitPayload) => {
            countdown = 60
            showButtons = false
            showModal = false
            if (isHost) {
                stopRoundTimer()
                sleep(2000).then(() => {
                    if (!game.gameClosed) {
                        startRoundTimer()
                        showButtons = true
                    }
                })
            } else {
                sleep(2000).then(() => {
                    if (!game.gameClosed) {
                        showButtons = true
                    }
                })
            }
            if (!game.gameClosed) {
                game.hit(data.move)
                carouselNextPlayer()
                game = game
                // showButtons = false; // This is necessary to avoid spamming check // so why is it commented out? // i dont remember maybe it wasnt necessary later on?
            } else {
                stopRoundTimer()
            }

            if (game.currentPlayer === thisPlayerId) {
                toasts.info('Your turn!')
            }
            if (isHost) {
                aiEngine.passHitInfo(data.move)
                console.log('hand info passed to ai engine')
                if (game.players[game.currentPlayerIndx].isBot) {
                    console.log('current player is a bot')
                    let botsDeck = (game as GameServer).hands.get(game.currentPlayer)
                    if (botsDeck) {
                        aiEngine.decide(botsDeck)
                        console.log('got bot to decide on move')
                    }
                } else {
                    console.log(game.players[game.currentPlayerIndx])
                }
            }
        })

        socket.on(SocketEventsCommon.kickPlayer, (playerId: string) => {
            if (playerId === thisPlayerId) {
                dispatch('leave')
            } else {
                game.removePlayer(playerId)
                game = game
                dispatch('playerLeft', playerId)
            }
        })

        if (isHost) {
            // ********************************************
            // |         HOST SOCKET FUNCTIONALITY        |
            // ********************************************
            game.gameClosed = false
            startRoundTimer()

            socket.on(SocketEventsCommon.checkToServer, (data) => {
                if (game.previousBet) {
                    previousCards = game.getCardCount()
                    constructReadyCards()
                }

                let checkResult = game.validateCheck()
                game = game
                //console.log(game)
                socket.emit(SocketEventsCommon.checkToPlayers, checkResult)
                socket.emit(SocketEventsFromHost.cardListToPlayers, previousCards)
                game.eliminatedPlayers.forEach((pl) => {
                    if (pl.uid == thisPlayerId) {
                        eliminated = true
                    }
                })

                if (game.players.length == 1) {
                    game.gameClosed = true
                    stopRoundTimer()
                    dispatch('gameFinished', game.players[0])
                }

                if (!game.gameClosed) {
                    stopRoundTimer()
                    startRoundTimer()
                }

                toasts.info(`${game.playerThatLost?.username} lost this round`)
                carouselSetup(game.currentPlayerIndx)
                aiEngine.check()
                if (game.players[game.currentPlayerIndx].isBot) {
                    let botsDeck = (game as GameServer).hands.get(game.currentPlayer)
                    if (botsDeck) aiEngine.decide(botsDeck)
                }
            })
        } else {
            // ********************************************
            // |      NON-HOST SOCKET FUNCTIONALITY       |
            // ********************************************
            socket.on(SocketEventsCommon.checkToPlayers, (data: checkToPlayersPayload) => {
                console.log('recieved CHeck')
                let nextMove = game.check(data)
                game = game
                //console.log(game)
                game.eliminatedPlayers.forEach((pl) => {
                    if (pl.uid === thisPlayerId) {
                        eliminated = true
                    }
                })

                if (game.players.length === 1) {
                    dispatch('gameFinished', game.players[0])
                }

                toasts.info(`${game.playerThatLost?.username} lost this round`)
                carouselSetup(game.currentPlayerIndx)
            })

            socket.on(SocketEventsCommon.kickPlayer, (playerId: string) => {
                game.removePlayer(playerId)
                game = game
                dispatch('playerLeft', playerId)
            })

            socket.on(SocketEventsCommon.updateTimerToPlayers, (update: number) => {
                countdown = update
            })

            socket.on(SocketEventsCommon.updateCardCountToPlayers, (oldCards: CardCountTable) => {
                previousCards = oldCards
                constructReadyCards()
            })
        }
    })

    function endOfTimerHandler() {
        if (countdown <= 0) {
            sleep(2000).then(() => {
                if (countdown <= 0) {
                    if (game.previousBet) {
                        check()
                    } else {
                        const forcedBet = {
                            selectedRanking: 'royal',
                            primaryCard: '',
                            secondaryCard: '',
                            selectedColor: 'spade',
                            startingCard: '',
                        }

                        socket.emit(SocketEventsCommon.hit, { move: forcedBet })
                        showModal = false
                    }
                }
            })
        }
    }

    // TODO: On finished game when new game is started players are not initalized properly
    // This function is called when the modal is closed and we have selected a bet
    function handleBetSelection(event: CustomEvent) {
        if (countdown > 0) {
            const { detail } = event
            selectedHand = detail
            console.log('send hit ', selectedHand)
            connectionHandler.sendHitEvent(selectedHand)
        }
        showModal = false
    }

    function check(): void {
        socket.emit(SocketEventsCommon.checkToServer)
    }

    function getBetName(): string {
        if (!game.previousBet) {
            return 'Error has occured.'
        }

        const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)
        let { selectedRanking, primaryCard, secondaryCard, selectedColor, startingCard } = game.previousBet
        selectedRanking = capitalize(selectedRanking)
        primaryCard = capitalize(primaryCard)
        secondaryCard = capitalize(secondaryCard)
        selectedColor = capitalize(selectedColor)
        startingCard = capitalize(startingCard)

        let currentBet: string = selectedRanking

        if (['One', 'Pair', 'Three', 'Four'].includes(selectedRanking)) {
            let cardName = cardFullNames[primaryCard]
            return currentBet + (selectedRanking === 'Pair' ? ' of ' : ' ') + cardName + (selectedRanking !== 'One' ? 's' : '')
        }

        if (['Double', 'Full'].includes(selectedRanking)) {
            let primaryCardName = cardFullNames[primaryCard]
            let secondaryCardName = cardFullNames[secondaryCard]
            return currentBet + (selectedRanking === 'Full' ? ' of 3 ' : ' of 2 ') + primaryCardName + 's and 2 ' + secondaryCardName + 's'
        }

        if (['Flush', 'Street'].includes(selectedRanking)) {
            let cardName = cardFullNames[startingCard]
            return currentBet + ' starting from ' + cardName + (selectedRanking === 'Flush' ? ' in color ' + selectedColor : 's')
        }

        if (selectedRanking === 'Royal') {
            return selectedRanking + ' Flush of ' + selectedColor + 's'
        }

        return selectedRanking + ' ' + selectedColor + 's'
    }

    function startRoundTimer(): void {
        if (roundTimer) {
            return
        }
        countdown = 60
        roundTimer = setInterval(() => {
            if (countdown > 0) {
                countdown--
            } else {
                endOfTimerHandler()
                clearInterval(roundTimer)
                roundTimer = undefined
            }
            socket.emit(SocketEventsFromHost.timerUpdate, countdown)
        }, 1000)
    }

    function stopRoundTimer(): void {
        if (roundTimer) {
            clearInterval(roundTimer)
        }
        roundTimer = undefined
    }

    function sleep(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }

    function constructReadyCards() {
        let iterableCards = cardCountTableToIterableArray(previousCards)
        readyPreviousCards = []

        const cardNumberToString: { [key: number]: string } = {
            11: 'j',
            12: 'q',
            13: 'k',
            14: 'a',
        }
        const IndexToColor: { [key: number]: string } = {
            4: 'spade',
            3: 'heart',
            2: 'club',
            1: 'diamond',
        }

        for (let [cardNumber, colorCounts] of iterableCards) {
            for (let [color, isThereColor] of colorCounts) {
                if (isThereColor == 1) {
                    let stringCardNumber = cardNumberToString[cardNumber] || cardNumber.toString()
                    let readyCardNumber = cardToRankTranslation[stringCardNumber].string
                    readyPreviousCards.push(readyCardNumber + ' ' + IndexToColor[color])
                }
            }
        }
    }

    $: if (game.previousBet) {
        betName = getBetName()
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- -------------------------------------------- -->
<!-- |             HTML SVELTE CODE             | -->
<!-- -------------------------------------------- -->
<div class="game-container main">
    {#if gameId}
        <h2 class="gamecode">#{gameId}</h2>
    {/if}
    <div class="main view">
        <span class="group default-area-background p20 bet-container">
            <h2 class="header-underline flat-container bet-header">
                Current Bet
                <GameClock currentTime="{countdown}" />
            </h2>
            <h3 class="bet">
                {#if game.previousBet}
                    {betName}
                {:else}
                    No bet has been made yet
                {/if}
            </h3>
        </span>

        <div class="carousel-container">
            <PlayerCarousel users="{game.players}" bind:next="{carouselNextPlayer}" bind:setup="{carouselSetup}" />
        </div>

        {#if game.currentPlayer === thisPlayerId && showButtons}
            <div class="container above-cards-in-hand">
                <button class="default-button start-close" on:click="{() => (showModal = true)}">Raise</button>
                <button id="check-button" class="default-button start-close" on:click="{check}">Check</button>
            </div>
        {/if}
    </div>
    <CardsInHand hand="{game.hand}" />

    {#if showModal}
        <CardModal on:close="{() => (showModal = false)}" on:select="{handleBetSelection}" previousBet="{game.previousBet}" />
    {/if}
</div>

<style lang="scss">
    .view {
        height: 100%;
        display: flex;
        justify-content: top;
        align-items: center;
        flex-direction: column;
        width: 100%;
        row-gap: 1rem;
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

    .gamecode {
        position: absolute;
        top: 1%;
        left: 10px;
        margin: 10px;
    }

    .bet-header {
        font-size: 4rem;
        text-align: center;
        justify-content: center;
        align-items: center;
    }
    .bet {
        margin-bottom: 1rem;
    }

    .bet-container {
        margin-left: 1rem;
        margin-right: 1rem;
    }

    .start-close {
        margin: 10px 15px;
        color: aliceblue;
        max-height: 100px;
    }

    .above-cards-in-hand {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }

    .carousel-container {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 30vh;
    }

    @media (max-width: 1000px) {
        .gamecode {
            display: none;
        }

        .bet-header {
            font-size: 3.5rem;
        }

        .bet {
            font-size: 2.5rem;
        }

        .carousel-container {
            min-height: 25vh;
        }
    }

    @media (max-width: 600px) {
        .bet-header {
            font-size: 3rem;
            padding: 0.5rem 1.5rem;
        }

        .bet {
            font-size: 2rem;
        }
    }
</style>
