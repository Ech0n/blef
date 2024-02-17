<!-- Modal.svelte -->
<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let showModal: boolean = false;
  export let mode: 'join' | 'create' = 'join'; // Add a mode prop to determine which form to show
  let gameId: string = '';
  let username: string = '';

  function closeModal() {
      showModal = false;
      dispatch('close');
  }

  function action() {
      if (mode === 'join') {
          dispatch('joinGame', { username, gameId });
      } else {
          dispatch('createGame', { username });
      }
      closeModal();
  }
</script>

{#if showModal}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="modal-backdrop" on:click={closeModal}>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="modal" on:click|stopPropagation>
      <div class="modal-header">
          <h2>{mode === 'join' ? 'Provide game ID:' : 'Enter Your Name:'}</h2>
      </div>
      <div class="modal-body">
          {#if mode === 'join'}
              <input type="text" placeholder="Enter Game ID" bind:value={gameId} />
          {/if}
          <input type="text" placeholder="Enter Your Name" bind:value={username} />
          <button on:click={action}>{mode === 'join' ? 'Join Game' : 'Create Game'}</button>
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
  