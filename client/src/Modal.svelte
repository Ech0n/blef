<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte';

    const dispatch = createEventDispatcher();

    export let showModal: boolean = false;
    export let mode: 'join' | 'create' = 'join'; // Add a mode prop to determine which form to show
    let gameId: string = '';
    let username: string = '';
    let errorMessage: string = ''; // Add an error message state

    onMount(() => {
        let usernameFromStorage = sessionStorage.getItem('username');
        if (usernameFromStorage) {
            username = usernameFromStorage;
        }
    });

    function closeModal() {
        showModal = false;
        dispatch('close');
    }

    function action() {
        if (username.trim() === '') {
            errorMessage = 'Please enter your name.';
            return; // Stop the action if username is empty
        }
        sessionStorage.setItem('username', username);
        if (mode === 'join') {
            if (gameId.trim() === '') {
                errorMessage = 'Please enter a game ID.';
                return; // Stop the action if gameId is empty
            }
            dispatch('joinGame', { username, gameId });
        } else {
            dispatch('createGame', { username });
        }
        closeModal(); // Close the modal only if everything is correct
    }
</script>

{#if showModal}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="modal-backdrop">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="modal p15" on:click|stopPropagation>
            <div class="modal-header">
                <h2>
                    {mode === 'join' ? 'Join game:' : 'Create game:'}
                </h2>
            </div>
            <div class="container">
                {#if errorMessage}
                    <p class="error">{errorMessage}</p>
                {/if}
                {#if mode === 'join'}
                    <input type="text" placeholder="Enter Game ID" bind:value={gameId} maxlength="10" />
                {/if}
                <input type="text" placeholder="Enter Your Name" bind:value={username} maxlength="14" />

                <button class="start-close" on:click={action}>{mode === 'join' ? 'Join Game' : 'Create Game'}</button>
                <button class="start-close" on:click={closeModal}>Cancel</button>
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
        background-color: rgba(0, 0, 0, 0.3);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .modal {
        background-color: rgb(31, 31, 31);
        border-radius: 30px;
        border-width: 5px;
        max-width: 400px;
        margin: 10px;
    }

    h2 {
        margin: 20px;
        margin-top: 0px;
        font-size: 30px;
    }
</style>
