<script lang="ts">
    import { createEventDispatcher, onDestroy, onMount } from 'svelte';
    import { io, Socket } from 'socket.io-client';
    import { Player } from '../../../common/player';
    import { SocketEventsCommon, SocketEventsFromClient, SocketEventsFromHost } from '../../../src/types/socketEvents';
    import { initalizeGame, type CardCountTable, initalizeCountTable } from '../model/Card';
    import type { gameStartPayload, reconnectRequestPayload, reconnectResponsePayload, gameInfo, joinRequest, joinGameResponsePayload } from '../../../common/payloads';
    import LobbyPlayerList from './LobbyPlayerList.svelte';
    import WinnerModal from './WinnerModal.svelte';
    import { GameServer } from '../game/GameServer';

    export let gameId: string;
    export let socket: Socket;
    export let players: Player[] = [];
    export let thisPlayerId: string;

    let gameView: Promise<typeof import('../game/GameView.svelte')> | undefined;
    let gameStartData: gameStartPayload;
    let showModal: boolean = false;
    let winnerUsername: string = '';
    let game: GameServer;
    let readyPlayers: number = 1;
    let waitingPlayers: number = 0;
    let cardCounts: CardCountTable = initalizeCountTable();
    const dispatch = createEventDispatcher();

    onMount(() => {
        socket.on(SocketEventsCommon.newPlayerJoined, (data: { username: string; uid: string; isOnline: boolean }) => {
            console.log('Join event', data);
            if (!data) {
                throw 'No data from server';
            }
            let searchForPlayer = players.find((el) => el.username === data.username);
            if (searchForPlayer) {
                return;
            }
            if (gameView) {
                waitingPlayers++;
            } else {
                readyPlayers++;
            }
            let newPlayer: Player = new Player(data.uid, data.username);
            newPlayer.isOnline = data.isOnline;

            players = [...players, newPlayer];

            console.log(players);
        });
        socket.on(SocketEventsFromClient.joinRequest, (data: joinRequest) => {
            console.log('recevied request to join: ', data);
            let response: joinGameResponsePayload = {
                didJoin: false,
                request: data,
            };
            if (!data || !data.requesterUid) {
                socket.emit(SocketEventsFromHost.joinResponse, response);
                return;
            }

            let playersList = players;
            let wasPlayerFound = playersList.find((el) => {
                return el.username === data.requesterUsername;
            });

            console.log('Found player : ', wasPlayerFound, 'players', playersList);
            if (!wasPlayerFound) {
                if (gameView) {
                    socket.emit(SocketEventsFromHost.joinResponse, response);

                    return;
                }

                let newPlayer = new Player(data.requesterUid, data.requesterUsername);
                newPlayer.isOnline = true;
                playersList = [...players, newPlayer];
            } else {
                //Its not udnefined
                //@ts-ignore
                response.request.requesterUid = wasPlayerFound.uid;
                if (!gameView || wasPlayerFound.isOnline) {
                    socket.emit(SocketEventsFromHost.joinResponse, response);
                    return;
                } else {
                    wasPlayerFound.isOnline = true;
                }
            }

            response.didJoin = true;
            let gameInfo: gameInfo = { players: playersList, thisPlayerId: data.requesterUid, thisPlayerName: data.requesterUsername, gameStarted: false };

            if (gameView) {
                let hand = game.hands.get(data.requesterUid);
                if (hand) {
                    console.log('Couldnt find cards for reconnecting player');
                    gameInfo.gameStarted = true;

                    gameInfo.startedGameInfo = {
                        currentBet: game.previousBet,
                        currentPlayer: game.currentPlayer,
                        newHand: hand,
                    };
                }
            }
            response.gameInfo = gameInfo;

            console.log('sent response: ', response);
            socket.emit(SocketEventsFromHost.joinResponse, response);
        });
        socket.on(SocketEventsFromClient.reconnectToGame, (reconnectRequestPayload: reconnectRequestPayload) => {
            console.log('request here ', reconnectRequestPayload);
            let reconnectingPlayer = players.find((pl) => {
                return pl.uid === reconnectRequestPayload.requesterUid;
            });

            let response: reconnectResponsePayload = {
                didReconnect: Boolean(reconnectingPlayer),
                reconnectRequest: reconnectRequestPayload,
            };
            if (reconnectingPlayer) {
                let gameInfo: gameInfo = {
                    players: players,
                    thisPlayerId: reconnectingPlayer.uid,
                    thisPlayerName: reconnectingPlayer.username,
                    gameStarted: false,
                };
                if (gameView) {
                    let hand = game.hands.get(reconnectingPlayer.uid);
                    if (!hand) {
                        console.log('Couldnt find cards for reconnecting player');
                        return;
                    }
                    gameInfo.gameStarted = true;

                    gameInfo.startedGameInfo = {
                        currentBet: game.previousBet,
                        currentPlayer: game.currentPlayer,
                        newHand: hand,
                    };
                }

                response.gameInfo = gameInfo;
            }
            console.log('response to request ', response);
            socket.emit(SocketEventsFromHost.reconnectToGame, response);
        });

        socket.on(SocketEventsCommon.playerLeftGame, (data: { uid: string }) => {
            console.log('player disconnected', data.uid);
            if (!data) {
                return;
            }

            //if game is started
            if (gameView) {
                let playerThatLeft = players.find((pl) => pl.uid === data.uid);
                if (playerThatLeft) {
                    playerThatLeft.isOnline = false;
                }
                players = players;
                console.log(players);
            } else {
                let wasInLobby: boolean = false;
                for (let player of players) {
                    if (player.uid === data.uid) {
                        wasInLobby = true;
                        break;
                    }
                }

                players = players.filter((pl) => {
                    return pl.uid !== data.uid;
                });
                players = players;

                if (wasInLobby) readyPlayers--;
            }
        });

        socket.on(SocketEventsCommon.gameStarted, (data: gameStartPayload) => {
            if (data) {
                gameStartData = data;
                game = new GameServer(players, gameStartData, thisPlayerId, cardCounts);
                game.gameClosed = false;
                gameView = import('../game/GameView.svelte');
            }
        });

        socket.on(SocketEventsCommon.playerReady, (readyPlayerId: string) => {
            console.log('this player ready here!');
            readyPlayers++;
        });

        socket.on(SocketEventsCommon.gameClosed, () => {
            dispatch('gameClosed');
        });
    });

    function startGame(): void {
        if (players.length >= 2 && players.length <= 5 && readyPlayers == players.length) {
            let initializationData = initalizeGame(players);
            cardCounts = initializationData.cardCounts;
            let startPayload = initializationData.payload;
            socket.emit(SocketEventsCommon.gameStarted, startPayload);
        } else {
            console.log(readyPlayers);
            throw 'Invalid amount of players to start the game or not everyone is ready';
        }
    }

    function closeGame(): void {
        socket.emit(SocketEventsCommon.gameClosed, { gameId });

        gameView = undefined;
        players = [];
    }

    function kickPlayer(uid: string) {
        socket.emit(SocketEventsFromHost.kickPlayer, uid);
        players = players.filter((player) => player.uid !== uid);
    }

    function showWinner(winner: any): void {
        readyPlayers = 1 + waitingPlayers;
        waitingPlayers = 0;
        if (winner.detail && winner.detail.username) {
            winnerUsername = winner.detail.username;
            showModal = true;
        }
        gameView = undefined;
    }
</script>

<div class="main-content">
    {#if gameView}
        {#await gameView then { default: GameView }}
            <GameView on:leave={closeGame} on:gameFinished={showWinner} {gameId} {socket} {thisPlayerId} isHost {kickPlayer} {game} {closeGame} />
        {/await}
    {:else}
        Game ID: {#if gameId}
            {gameId}
        {/if}
        <br />
        Players:
        <LobbyPlayerList {players} {thisPlayerId} />
        <div>
            <button class="start-close" on:click={startGame}>Start Game</button>
            <button class="start-close" on:click={closeGame}>Close Game</button>
        </div>
    {/if}
</div>
<WinnerModal
    {showModal}
    {winnerUsername}
    close={() => {
        showModal = false;
        gameView = undefined;
    }}
/>

<style>
    .main-content {
        position: absolute;
        top: 100px;
        min-height: calc(95% - 100px);
        font-size: 40px;
        font-weight: bold;
        margin-top: 0.67em;
        margin-bottom: 0.67em;
        margin-left: 0;
        margin-right: 0;
        font-family: inherit;
        line-height: 1.2;
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 100%;
    }

    .start-close {
        margin-bottom: 10px;
        color: aliceblue;
    }
</style>
