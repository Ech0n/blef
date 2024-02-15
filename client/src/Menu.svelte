<script lang="ts">
  import { onMount } from 'svelte';
  import Modal from './Modal.svelte';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let gameId: string = '';

  let showModal = false;

  function joinGame(event: any): void {
    gameId = event.detail.gameId; // Update gameId with the one from the modal
    console.log(`Joining game with ID: ${gameId}`);
    dispatch('joinGame', { gameId });
    showModal = false; // Close the modal in the parent component
  }
  
  function createGame(): void {
    console.log('Creating a new game');
    dispatch('createGame');
  }
</script>

<div>
  <button on:click={() => (showModal = true)}>Join game </button>
  <button on:click={createGame}>Create a game</button>
  <Modal showModal={showModal} on:close={() => showModal = false} on:joinGame={joinGame}/>
</div>
