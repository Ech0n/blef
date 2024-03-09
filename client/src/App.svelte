<script lang="ts">
    import Menu from './Menu.svelte';
    import { Player } from '../../common/player';
    import { playerStore } from './game/stores';
    import { config } from '../../config';
    import { io, type Socket } from 'socket.io-client';
    import { SocketEventsCommon, SocketEventsFromClient, SocketEventsFromHost, SocketEventsFromServer } from '../../src/types/socketEvents';
    import type { gameInfo, joinGameResponsePayload, reconnectRequestPayload, reconnectResponsePayload } from '../../common/payloads';
    import { onMount } from 'svelte';
    import session from 'express-session';

    let gameView: Promise<any> | undefined;
    let gameId: string | null = null;
    let player: Player | null = null;
    let username = '';
    const serverUrl: string = config.BACKEND_SERVER_ADDRESS || 'http://localhost:5678';
    let socket: Socket;
    let players: Player[] = [];
    let thisPlayerId: string;

    function commonListeners(socket: Socket) {
        socket.on(SocketEventsFromServer.playerReconnected, (data: { uid: string }) => {
            let player = players.find((pl) => {
                return pl.uid === data.uid;
            });
            if (!player) {
                return;
            }
            console.log('rejoined playere ', player);

            player.isOnline = true;
        });
    }

    function loadClientGameView(gameInfo: gameInfo) {
        if (gameInfo.players) {
            players = gameInfo.players.map((el) => {
                let newPlayer: Player = new Player(el.uid, el.username);
                newPlayer.isOnline = el.isOnline;
                return newPlayer;
            });
        }

        if (gameInfo.thisPlayerId && gameInfo.thisPlayerName) {
            // This if is wrong. If data does not exist error should be thrown // Then do it shaking my head
            players = [...players, new Player(gameInfo.thisPlayerId, gameInfo.thisPlayerName)];
            thisPlayerId = gameInfo.thisPlayerId;
        }
        gameView = import('./lobby/LobbyClient.svelte');
    }

    function joinGame(event: CustomEvent): void {
        gameId = event.detail.gameId;
        if (!player) {
            username = event.detail.username;
            const newId = Date.now().toString(); // Placeholder ID generation TODO
            player = new Player(newId, event.detail.username);
            player.isOnline = true; // Set the player as online upon joining
        }
        socket = io(serverUrl);

        socket.emit(SocketEventsCommon.joinGame, {
            gameId: gameId,
            username: username,
        });

        commonListeners(socket);

        // Listen for messages from the server
        socket.on(SocketEventsCommon.joinGame, (data: joinGameResponsePayload) => {
            console.log(data);
            if (!data || !data.didJoin || !data.gameInfo) {
                //TODO: Some kind of toast saying "Could not connect to game" and possibly information why
                return;
            }

            if (gameId) {
                sessionStorage.setItem('gameId', gameId);
            }
            sessionStorage.setItem('uid', data.gameInfo.thisPlayerId);
            playerStore.set(player);

            loadClientGameView(data.gameInfo);
        });
    }

    function hostGame(event: CustomEvent): void {
        console.log(event.detail.username);
        if (!player) {
            const newId = Date.now().toString(); // Placeholder ID generation TODO
            username = event.detail.username;
            player = new Player(newId, event.detail.username);
            player.isOnline = true; // Set the player as online upon game creation
        }
        socket = io(serverUrl);
        socket.emit(SocketEventsCommon.createGame, { username: username });
        commonListeners(socket);

        socket.on(SocketEventsCommon.createGame, (data: { gameId: string; hostId: string }) => {
            console.log('User created a game, its id is:', data.gameId);
            gameId = data.gameId;
            let host = new Player(data.hostId, username);
            host.isOnline = true;
            players = [host];
            thisPlayerId = data.hostId;
        });
        playerStore.set(player);
        gameView = import('./lobby/LobbyHost.svelte');
    }

    function leaveGame(): void {
        gameView = undefined;
        gameId = null;
        player = null; // Reset player status or keep for reconnection purposes
        playerStore.set(null);
    }

    function checkForReconnect() {
        //TODO: consider using svelte builtin store for this
        let sessionGameId = sessionStorage.getItem('gameId');
        let sessionUid = sessionStorage.getItem('uid');
        if (!sessionUid || !sessionGameId) {
            console.log('reconnection failed no data in session  ', sessionUid, sessionGameId);

            return;
        }

        socket = io(serverUrl);
        const request: reconnectRequestPayload = {
            requesterUid: sessionUid,
            gameId: sessionGameId,
        };
        socket.emit(SocketEventsFromClient.reconnectToGame, request);
        socket.on(SocketEventsFromHost.reconnectToGame, (response: reconnectResponsePayload) => {
            console.log('reconnection response ', response);

            if (!response.didReconnect || !response.gameInfo) {
                socket.disconnect();
                return;
            }
            loadClientGameView(response.gameInfo);
        });
    }

    onMount(() => {
        checkForReconnect();
    });
</script>

<main>
    {#if gameView}
        {#await gameView then { default: LobbyView }}
            <LobbyView {gameId} usernameInput={username} on:gameClosed={leaveGame} {socket} {thisPlayerId} {players} />
        {/await}
    {:else}
        <Menu on:joinGame={joinGame} on:createGame={hostGame} />
    {/if}
</main>
