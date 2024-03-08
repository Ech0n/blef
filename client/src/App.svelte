<script lang="ts">
    import Menu from './Menu.svelte';
    import { Player } from '../../common/player';
    import { playerStore } from './game/stores';
    import { config } from '../../config';
    import { io, type Socket } from 'socket.io-client';
    import { SocketEventsCommon } from '../../src/types/socketEvents';
    import type { joinGameResponsePayload } from '../../common/payloads';
    import Navbar from './Navbar.svelte';
    import Home from './Home.svelte';

    let gameView: Promise<any> | undefined;
    let activeView: string = 'menu';
    let gameId: string | null = null;
    let player: Player | null = null;
    let username = '';
    const serverUrl: string = config.BACKEND_SERVER_ADDRESS || 'http://localhost:5678';
    let socket: Socket;
    let players: Player[] = [];
    let thisPlayerId: string;

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

        // Listen for messages from the server
        socket.on(SocketEventsCommon.joinGame, (data: joinGameResponsePayload) => {
            console.log(data);
            if (!data || !data.didJoin || !data.gameInfo) {
                //TODO: Some kind of toast saying "Could not connect to game" and possibly information why
                return;
            }

            if (data.gameInfo.players) {
                players = data.gameInfo.players.map((el) => {
                    let newPlayer: Player = new Player(el.uid, el.username);
                    newPlayer.isOnline = el.isOnline;
                    return newPlayer;
                });
            }

            if (data.gameInfo.thisPlayerId && data.gameInfo.thisPlayerName) {
                // This if is wrong. If data does not exist error should be thrown // Then do it shaking my head
                players = [...players, new Player(data.gameInfo.thisPlayerId, data.gameInfo.thisPlayerName)];
                thisPlayerId = data.gameInfo.thisPlayerId;
            }
            playerStore.set(player);
            gameView = import('./lobby/LobbyClient.svelte');
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

    function handleViewChange(data: any): void {
        // console.log("It doesnt get here");
        if (gameView !== undefined) {
            // Ignore calls from navbar methods in game.
            return;
        }
        const { newView } = data.detail.detail;
        activeView = newView;
    }
</script>

<main>
    <Navbar on:viewChange={handleViewChange} {activeView} />
    <div class="main-content">
        {#if gameView}
            {#await gameView then { default: LobbyView }}
                <LobbyView {gameId} usernameInput={username} on:gameClosed={leaveGame} {socket} {thisPlayerId} {players} />
            {/await}
        {:else if activeView === 'menu'}
            <Menu on:joinGame={joinGame} on:createGame={hostGame} />
        {:else if activeView === 'settings'}
            <!-- Currently its called settings but It would more likely be account in near future -->
        {:else if activeView === 'info'}
            <Home />
        {/if}
    </div>
</main>

<style>
    .main-content {
        height: calc(100% - 70px);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
</style>
