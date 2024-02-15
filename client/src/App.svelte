<script lang="ts">
  import type { Socket } from "socket.io-client";
  import Menu from "./Menu.svelte"
  // No need to import LobbyClient or LobbyHost here since we're dynamically importing them

  let showModal: boolean = false;
  let emojisList: Array<string>;
  let socket: Socket;

  let gameView: Promise<any> | undefined;
  let gameId: string | null = null;

  async function doPost(): Promise<void> {
    socket.emit("message", "HAHAHAHAH");
  }

  function joinGame(event: CustomEvent): void {
    console.log(event.detail.gameId);
    gameId = event.detail.gameId;
    gameView = import('./lobby/LobbyClient.svelte');
  }

  function hostGame(): void {
    gameView = import('./lobby/LobbyHost.svelte');
  }

  function leaveGame(): void {
    gameView = undefined;
    gameId = null;
  }
</script>

<main>
  {#if gameView}
    {#await gameView then { default: LobbyView }}
      <LobbyView {gameId} on:leave={leaveGame} />
    {/await}
  {:else}
    <Menu on:joinGame={joinGame} on:createGame={hostGame}/>
  {/if}
</main>