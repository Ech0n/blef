<script lang="ts">
  import Menu from "./Menu.svelte";
  import { Player } from "./model/Player";
  import { playerStore } from './game/stores';

  let gameView: Promise<any> | undefined;
  let gameId: string | null = null;
  let player: Player | null = null;
  let username = ""

  function joinGame(event: CustomEvent): void {
    gameId = event.detail.gameId;
    if (!player) {
      username = event.detail.username
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
      username = event.detail.username
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
</script>


<main>
  {#if gameView}
    {#await gameView then { default: LobbyView }}
      <LobbyView {gameId} on:leave={leaveGame} usernameInput={username}/>
    {/await}
  {:else}
    <Menu on:joinGame={joinGame} on:createGame={hostGame}/>
  {/if}
</main>