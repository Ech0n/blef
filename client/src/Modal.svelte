<!-- Modal.svelte -->
<script lang="ts">
    import { createEventDispatcher } from 'svelte';
  
    const dispatch = createEventDispatcher();
  
    export let showModal: boolean = false;
    let gameId: string = '';
  
    function closeModal() {
      showModal = false;
      dispatch('close'); // Notify parent component that modal is closed
    }
  
    function joinGame() {
      dispatch('joinGame', { gameId }); // Send gameId back to parent
      closeModal(); // Close the modal after joining the game
    }
  </script>
  
  {#if showModal}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="modal-backdrop" on:click={closeModal}>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="modal" on:click|stopPropagation>
      <div class="modal-header">
        <h2>Provide game ID:</h2>
      </div>
      <div class="modal-body">
        <input type="text" placeholder="Enter Game ID" bind:value={gameId} />
        <button on:click={joinGame}>Join Game</button>
        <button on:click={closeModal}>Close</button>
      </div>
    </div>
  </div>
  {/if}
  
  <style>
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
    }
  
    .modal {
      background-color: white;
      padding: 20px;
      border-radius: 5px;
    }
  </style>
  