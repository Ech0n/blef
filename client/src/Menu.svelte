<script lang="ts">
  import Modal from './Modal.svelte';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let showModal: boolean = false;
  let mode: 'join' | 'create' = 'join'; // Default mode

  function joinGame(event: any): void {
    console.log('Joining game with ID:', event.detail.gameId);
    dispatch('joinGame', { gameId: event.detail.gameId , username: event.detail.username});
    showModal = false; // Close the modal in the parent component
  }
  
  function createGame(event: any): void {
    console.log('Creating game with user name:', event.detail.username);
    dispatch('createGame', { username: event.detail.username });
  }
</script>

<div>
  <button class="start-close" on:click={() => { showModal = true; mode = 'join'; }}>Join Game</button>
  <button class="start-close" on:click={() => { showModal = true; mode = 'create'; }}>Create Game</button>
  <Modal {showModal} {mode} on:close={() => showModal = false} on:joinGame={joinGame} on:createGame={createGame}/>
</div>

<style>
  .start-close {
      color: aliceblue;
  }
</style>
