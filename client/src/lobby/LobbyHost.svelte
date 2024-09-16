<script lang="ts">
    import { Socket } from 'socket.io-client'
    import { createEventDispatcher, onMount } from 'svelte'
    import type { gameInfo, gameStartPayload, joinGameResponsePayload, joinRequest, reconnectRequestPayload, reconnectResponsePayload } from '../../../common/payloads'
    import { Player } from '../../../common/player'
    import { SocketEventsCommon, SocketEventsFromClient, SocketEventsFromHost } from '../../../src/types/socketEvents'
    import { GameServer } from '../game/GameServer'
    import { initalizeCountTable, initalizeGame, type CardCountTable } from '../model/Card'
    import LobbyPlayerList from './LobbyPlayerList.svelte'
    import WinnerModal from './WinnerModal.svelte'

    export let gameId: string
    export let socket: Socket
    export let players: Player[] = []
    export let thisPlayerId: string

    let gameView: Promise<typeof import('../game/GameView.svelte')> | undefined
    let gameStartData: gameStartPayload
    let showModal: boolean = false
    let winnerUsername: string = ''
    let game: GameServer
    let readyPlayers: number = 1
    let waitingPlayers: number = 0
    let cardCounts: CardCountTable = initalizeCountTable()
    const dispatch = createEventDispatcher()

    onMount(() => {
        socket.on(SocketEventsCommon.newPlayerJoined, (data: { username: string; uid: string; isOnline: boolean }) => {
            if (!data) {
                throw 'No data from server'
            }
            let searchForPlayer = players.find((el) => el.username === data.username)
            if (searchForPlayer) {
                return
            }
            if (gameView) {
                waitingPlayers++
            } else {
                readyPlayers++
            }
            let newPlayer: Player = new Player(data.uid, data.username)
            newPlayer.isOnline = data.isOnline

            players = [...players, newPlayer]

        })
        socket.on(SocketEventsFromClient.joinRequest, (data: joinRequest) => {
            let response: joinGameResponsePayload = {
                didJoin: false,
                request: data,
            }
            if (!data || !data.requesterUid) {
                socket.emit(SocketEventsFromHost.joinResponse, response)
                return
            }

            let playersList = players
            let wasPlayerFound = playersList.find((el) => {
                return el.username === data.requesterUsername
            })

            if (!wasPlayerFound) {
                if (gameView) {
                    socket.emit(SocketEventsFromHost.joinResponse, response)

                    return
                }

                let newPlayer = new Player(data.requesterUid, data.requesterUsername)
                newPlayer.isOnline = true
                playersList = [...players, newPlayer]
            } else {
                //Its not udnefined
                //@ts-ignore
                response.request.requesterUid = wasPlayerFound.uid
                if (!gameView || wasPlayerFound.isOnline) {
                    socket.emit(SocketEventsFromHost.joinResponse, response)
                    return
                } else {
                    wasPlayerFound.isOnline = true
                }
            }

            response.didJoin = true
            let gameInfo: gameInfo = { players: playersList, thisPlayerId: data.requesterUid, thisPlayerName: data.requesterUsername, gameStarted: false }

            if (gameView) {
                let hand = game.hands.get(data.requesterUid)
                if (hand) {
                    gameInfo.gameStarted = true

                    gameInfo.startedGameInfo = {
                        currentBet: game.previousBet,
                        currentPlayer: game.currentPlayer,
                        newHand: hand,
                    }
                }
            }
            response.gameInfo = gameInfo

            socket.emit(SocketEventsFromHost.joinResponse, response)
        })
        socket.on(SocketEventsFromClient.reconnectToGame, (reconnectRequestPayload: reconnectRequestPayload) => {
            let reconnectingPlayer = players.find((pl) => {
                return pl.uid === reconnectRequestPayload.requesterUid
            })

            let response: reconnectResponsePayload = {
                didReconnect: Boolean(reconnectingPlayer),
                reconnectRequest: reconnectRequestPayload,
            }
            if (reconnectingPlayer) {
                let gameInfo: gameInfo = {
                    players: players,
                    thisPlayerId: reconnectingPlayer.uid,
                    thisPlayerName: reconnectingPlayer.username,
                    gameStarted: false,
                }
                if (gameView) {
                    let hand = game.hands.get(reconnectingPlayer.uid)
                    if (!hand) {
                        return
                    }
                    gameInfo.gameStarted = true

                    gameInfo.startedGameInfo = {
                        currentBet: game.previousBet,
                        currentPlayer: game.currentPlayer,
                        newHand: hand,
                    }
                }

                response.gameInfo = gameInfo
            }
            socket.emit(SocketEventsFromHost.reconnectToGame, response)
        })

        socket.on(SocketEventsCommon.playerLeftGame, (data: { uid: string }) => {
            if (!data) {
                return
            }

            handlePlayerLeaving(data.uid)
        })

        socket.on(SocketEventsCommon.playerLeftGame, (data: { uid: string }) => {
            if (!data) {
                return;
            }
            handlePlayerLeaving(data.uid)
        })
        socket.on(SocketEventsCommon.kickPlayer, (data: { uid: string }) => {
            if (!data) {
                return;
            }
            handlePlayerLeaving(data.uid)
        })

        socket.on(SocketEventsCommon.gameStarted, (data: gameStartPayload) => {
            if (data) {
                gameStartData = data
                game = new GameServer(players, gameStartData, thisPlayerId, cardCounts)
                game.gameClosed = false
                gameView = import('../game/GameView.svelte')
            }
        })

        socket.on(SocketEventsCommon.playerReady, (readyPlayerId: string) => {
            readyPlayers++
        })

        socket.on(SocketEventsCommon.gameClosed, () => {
            dispatch('gameClosed')
        })
    })

    function handlePlayerLeaving(playerId: string):void{
        //if game is started
        if (gameView) {
                let playerThatLeft = players.find((pl) => pl.uid === data.uid)
                if (playerThatLeft) {
                    playerThatLeft.isOnline = false
                }
                players = players
            } else {
                let wasInLobby: boolean = false
                for (let player of players) {
                    if (player.uid === playerId) {
                        wasInLobby = true
                        break
                    }
                }

                players = players.filter((pl) => {
                    return pl.uid !== playerId
                })
                players = players

                if (wasInLobby) readyPlayers--
            }
    }

    function startGame(): void {
        if (players.length >= 2 && players.length <= 5 && readyPlayers == players.length) {
            let initializationData = initalizeGame(players)
            cardCounts = initializationData.cardCounts
            let startPayload = initializationData.payload
            socket.emit(SocketEventsCommon.gameStarted, startPayload)
        } else {
            throw 'Invalid amount of players to start the game or not everyone is ready'
        }
    }

    function closeGame(): void {
        socket.emit(SocketEventsCommon.gameClosed, { gameId })

        gameView = undefined
        players = []
    }


    function kickPlayer(uid: string) {
        socket.emit(SocketEventsFromHost.kickPlayer, uid)
        players = players.filter((player) => player.uid !== uid)

        return null
    }

    function showWinner(winner: any): void {
        readyPlayers = 1 + waitingPlayers
        waitingPlayers = 0
        if (winner.detail && winner.detail.username) {
            winnerUsername = winner.detail.username
            showModal = true
        }
        gameView = undefined
    }
</script>

<div class="container view">
    {#if gameView}
        {#await gameView then { default: GameView }}
            <GameView on:leave="{closeGame}" on:gameFinished="{showWinner}" {gameId} {socket} {thisPlayerId} isHost {kickPlayer} {game} {closeGame} />
        {/await}
    {:else}
        <div class="container group kod">
            {#if gameId}
                <div>game code:</div>
                <div>
                    {gameId}
                </div>
            {/if}
        </div>
        <br />
        <LobbyPlayerList {players} {thisPlayerId} isHost={true} handlePlayerKick={kickPlayer} />
        <div class="responsive">
            <button on:click="{closeGame}">Close Game</button>
            <button on:click="{startGame}">Start Game</button>
        </div>
    {/if}
</div>
<WinnerModal
    {showModal}
    {winnerUsername}
    close="{() => {
        showModal = false
        gameView = undefined
    }}"
/>

<style>
    .kod {
        width: 300px;
    }
</style>
