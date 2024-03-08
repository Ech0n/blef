<script lang="ts">
    import Menu from './Menu.svelte';
    import { Player } from '../../common/player';
    import { playerStore } from './game/stores';
    import Navbar from './Navbar.svelte';
    import Home from './Home.svelte';

    let gameView: Promise<any> | undefined;
    let activeView: string = 'menu';
    let gameId: string | null = null;
    let player: Player | null = null;
    let username: string = '';

    function joinGame(event: CustomEvent): void {
        gameId = event.detail.gameId;
        if (!player) {
            username = event.detail.username;
            const newId = Date.now().toString(); // Placeholder ID generation TODO
            player = new Player(newId, event.detail.username);
            player.isOnline = true; // Set the player as online upon joining
        }
        playerStore.set(player);
        gameView = import('./lobby/LobbyClient.svelte');
    }

    function hostGame(event: CustomEvent): void {
        console.log(event.detail.username);
        if (!player) {
            const newId = Date.now().toString(); // Placeholder ID generation TODO
            username = event.detail.username;
            player = new Player(newId, event.detail.username);
            player.isOnline = true; // Set the player as online upon game creation
        }
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

<style>
    .main-content {
        height: calc(100% - 70px);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
</style>

<main>
    <Navbar on:viewChange={handleViewChange} {activeView} />
    <div class="main-content">
        {#if gameView}
            {#await gameView then { default: LobbyView }}
                <LobbyView
                    {gameId}
                    usernameInput={username}
                    on:gameClosed={leaveGame}
                />
            {/await}
        {:else}
            {#if activeView === 'menu'}
                <Menu on:joinGame={joinGame} on:createGame={hostGame} />
            {:else if activeView === 'settings'}
                <!-- Currently its called settings but It would more likely be account in near future -->
            {:else if activeView === 'info'}
                <Home/>
            {/if}
        {/if}
    </div>
</main>
