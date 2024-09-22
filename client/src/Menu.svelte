<script lang="ts">
    import { createEventDispatcher } from 'svelte'
    import Modal from './Modal.svelte'

    const dispatch = createEventDispatcher()

    let showModal: boolean = false
    let mode: 'join' | 'create' = 'join' // Default mode

    function joinGame(event: any): void {
        dispatch('joinGame', {
            gameId: event.detail.gameId,
            username: event.detail.username,
        })
        showModal = false // Close the modal in the parent component
    }

    function createGame(event: any): void {
        dispatch('createGame', { username: event.detail.username })
    }
</script>

<div class="container">
    <button
        class="default-button menu-button"
        on:click="{() => {
            showModal = true
            mode = 'join'
        }}"
    >
        Join Game
    </button>
    <button
        class="default-button menu-button"
        on:click="{() => {
            showModal = true
            mode = 'create'
        }}"
    >
        Create Game
    </button>
    <button
        class="default-button menu-button"
        on:click="{() => {
            window.alert('not implemented!')
        }}"
    >
        How to play?
    </button>
    <Modal {showModal} {mode} on:close="{() => (showModal = false)}" on:joinGame="{joinGame}" on:createGame="{createGame}" />
</div>

<style>
    .container {
        display: flex;
        row-gap: 15px;
        flex-direction: column;
    }
    .menu-button {
        min-width: 14rem;
        color: aliceblue;
        margin-bottom: 10px;
        font-size: 22px;
    }
    .menu-button:focus {
        outline: none;
    }
</style>
