<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { io, type Socket } from 'socket.io-client';
    import { createEventDispatcher } from 'svelte';
    import { playerStore } from '../game/stores';
    import { SocketEventsCommon, SocketEventsFromClient } from '../../../src/types/socketEvents';
    import { Player } from '../../../common/player';
    import type { gameInfo, gameStartPayload } from '../../../common/payloads';
    import type { Card, CardCountTable } from '../model/Card';
    import LobbyPlayerList from './LobbyPlayerList.svelte';
    import { config } from '../../../config';
    import WinnerModal from './WinnerModal.svelte';
    import { Game } from '../game/Game';
    import { start } from 'repl';
    import { getDefaultFormatCodeSettings } from 'typescript';

    export let gameId: string;
    export let socket: Socket;
    export let players: Player[] = [];
    export let thisPlayerId: string;
    export let startedGameInfo: gameInfo['startedGameInfo'];

    const dispatch = createEventDispatcher();

    let game: Game;
    let gameView: Promise<typeof import('../game/GameView.svelte')> | undefined;
    let currentPlayer: Player;
    let gameStartData: gameStartPayload;
    let showModal: boolean = false;
    let winnerUsername: string = '';

    const unsubscribe = playerStore.subscribe((value) => {
        currentPlayer = value!;
    });

    onDestroy(() => {
        unsubscribe();
    });

    onMount(() => {
        //console.log('started game info? ', startedGameInfo);
        if (startedGameInfo) {
            let hands: { [key: string]: Card[] } = {};
            hands[thisPlayerId] = startedGameInfo.newHand;
            gameStartData = {
                startingPlayerId: startedGameInfo.currentPlayer,
                newHands: hands,
            };
            game = new Game(players, gameStartData, thisPlayerId);
            game.previousBet = startedGameInfo.currentBet;
            //console.log('players ', game.players, players);
            gameView = import('../game/GameView.svelte');
        }

        socket.on(SocketEventsCommon.newPlayerJoined, (data: { username: string; uid: string }) => {
            // let searchForPlayer = players.find((el) => el.username === data.username);
            // if (searchForPlayer) {
            //     return;
            // }
            console.debug('New player in lobby name:', data.username);
            let newPlayer = new Player(data.uid, data.username);
            newPlayer.isOnline = true;
            players = [...players, newPlayer];
        });

        socket.on(SocketEventsCommon.gameStarted, (data: gameStartPayload) => {
            console.debug('reveived game start message', data);
            if (data && data.startingPlayerId) {
                gameStartData = data;
                //console.log('gsdata ', gameStartData, thisPlayerId, gameStartData.newHands[thisPlayerId]);
                game = new Game(players, gameStartData, thisPlayerId);
                game.gameClosed = false;

                gameView = import('../game/GameView.svelte');
            }
        });

        socket.on(SocketEventsCommon.gameClosed, () => {
            dispatch('gameClosed');
        });

        socket.on(SocketEventsCommon.playerLeftGame, (data: { uid: string }) => {
            // Players = Host and Clients
            if (!data) {
                return;
            }
            if (data.uid == thisPlayerId) {
                players = [];
                dispatch('gameClosed'); // To parent
                return;
            }

            //if game is started
            if (gameView) {
                let playerThatLeft = players.find((pl) => pl.uid === data.uid);
                if (playerThatLeft) {
                    playerThatLeft.isOnline = false;
                }
            } else {
                // Tag the disconnected player as not connected
                players = players.filter((pl) => {
                    return pl.uid !== data.uid;
                });
                players = players;
            }
        });

        socket.on(SocketEventsCommon.kickPlayer, (uid: string) => {
            players = players.filter((player) => player.uid !== uid);
        });
    });

    function leaveGame(): void {
        socket.emit(SocketEventsFromClient.leaveGame);
    }

    function showWinner(winner: any): void {
        if (winner.detail && winner.detail.username) {
            winnerUsername = winner.detail.username;
            showModal = true;
        }
        gameView = undefined;
    }

    function notifyHostThatPlayerReady() {
        //console.log('why twice?');
        socket.emit(SocketEventsFromClient.playerReady, thisPlayerId);
    }
</script>

<div class="main-content" style="top: {gameView ? '10px' : '100px'};">
    {#if gameView}
        {#await gameView then { default: GameClient }}
            <GameClient on:leave={leaveGame} on:gameFinished={showWinner} {gameId} {socket} {thisPlayerId} isHost={false} kickPlayer={() => {}} {game} closeGame={() => {}} />
        {/await}
    {:else}
        Join Game ID: {#if gameId}
            {gameId}
        {/if}
        <div>
            <LobbyPlayerList {players} {thisPlayerId} />

            <button class="start-close" on:click={leaveGame}>Leave</button>
        </div>
    {/if}
</div>
<WinnerModal
    {showModal}
    {winnerUsername}
    close={() => {
        showModal = false;
        gameView = undefined;
        notifyHostThatPlayerReady();
    }}
/>

<style>
    .main-content {
        position: absolute;
        min-height: calc(95% - 100px);
        font-size: 40px;
        font-weight: bold;
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
