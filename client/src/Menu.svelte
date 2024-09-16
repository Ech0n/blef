<script lang="ts">
    import Modal from './Modal.svelte'
    import { createEventDispatcher } from 'svelte'

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
        class="button"
        on:click="{() => {
            showModal = true
            mode = 'join'
        }}">Join Game</button
    >
    <button
        class="button"
        on:click="{() => {
            showModal = true
            mode = 'create'
        }}">Create Game</button
    >
    <button
        class="button"
        on:click="{() => {
            window.alert('not implemented!')
        }}">How to play?</button
    >
    <Modal {showModal} {mode} on:close="{() => (showModal = false)}" on:joinGame="{joinGame}" on:createGame="{createGame}" />
</div>

<style>
    .container {
        display: flex;
        row-gap: 15px;
        flex-direction: column;
    }
    .button {
        color: aliceblue;
        margin-bottom: 10px;
    }
</style>
