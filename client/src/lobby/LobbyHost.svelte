<script lang="ts">
    import { createEventDispatcher, onDestroy, onMount } from 'svelte';
    import { io, Socket } from 'socket.io-client';
    import { Player } from '../../../common/player';
    import { SocketEventsCommon, SocketEventsFromClient, SocketEventsFromHost } from '../../../src/types/socketEvents';
    import { playerStore } from '../game/stores';
    import { initalizeGame, type CardCountTable, initalizeCountTable } from '../model/Card';
    import type { gameStartPayload, reconnectRequestPayload, reconnectResponsePayload, gameInfo } from '../../../common/payloads';
    import LobbyPlayerList from './LobbyPlayerList.svelte';
    import { config } from '../../../config';
    import WinnerModal from './WinnerModal.svelte';
    import { GameServer } from '../game/GameServer';
    import { Game } from '../game/Game';

    export let gameId: string;
    export let socket: Socket;
    export let players: Player[] = [];
    export let thisPlayerId: string;

    let player: Player | null;
    let host: Player;
    let gameView: Promise<typeof import('../game/GameView.svelte')> | undefined;
    let gameStartData: gameStartPayload;
    let showModal: boolean = false;
    let winnerUsername: string = '';
    let game: GameServer;

    let cardCounts: CardCountTable = initalizeCountTable();

    const dispatch = createEventDispatcher();

    const unsubscribe = playerStore.subscribe((value) => {
        player = value;
    });

    onDestroy(() => {
        unsubscribe();
    });

    onMount(() => {
        socket.on(SocketEventsCommon.newPlayerJoined, (data: { username: string; uid: string; isOnline: boolean }) => {
            console.log('Join event', data.username);
            if (!data) {
                throw 'No data from server';
            }

            let newPlayer: Player = new Player(data.uid, data.username);
            newPlayer.isOnline = data.isOnline;

            players = [...players, newPlayer];
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
                    if (!game.previousBet) {
                        throw 'There should be a previous bet!?';
                    }
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
                // Tag the disconnected player as not connected
                players = players.filter((pl) => {
                    return pl.uid !== data.uid;
                });
                players = players;
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

        socket.on(SocketEventsCommon.gameClosed, () => {
            dispatch('gameClosed');
        });
    });

    function startGame(): void {
        //TODO: Randomize starting player?
        let initializationData = initalizeGame(players);
        cardCounts = initializationData.cardCounts;
        let startPayload = initializationData.payload;
        socket.emit(SocketEventsCommon.gameStarted, startPayload);
    }

    function closeGame(): void {
        console.warn('THIS SHIT IS CALLED');
        socket.emit(SocketEventsCommon.gameClosed, { gameId });

        gameView = undefined;
        players = [];
    }

    function kickPlayer(id: string) {
        socket.emit(SocketEventsCommon.kickPlayer, id);
    }

    function showWinner(winner: any): void {
        if (winner.detail && winner.detail.username) {
            winnerUsername = winner.detail.username;
            showModal = true;
        }
        gameView = undefined;
    }
</script>

<h1>
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
</h1>
<WinnerModal
    {showModal}
    {winnerUsername}
    close={() => {
        showModal = false;
        gameView = undefined;
    }}
/>

<style>
    p {
        font-size: 15px;
    }
    .start-close {
        color: aliceblue;
    }
</style>
