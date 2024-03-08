<script lang="ts">
    import witcherGoodGame from '../assets/giphy.gif';

    export let showModal: boolean;
    export let winnerUsername: string;
    export let close: () => void;
</script>

{#if showModal}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="modal" on:click={close}>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class="modal-content" on:click|stopPropagation>
            <span class="close" on:click={close}>&times;</span>
            <p>Congratulations, {winnerUsername} won!</p>
            <img src={witcherGoodGame} alt="Wiedzmak" />
        </div>
    </div>
{/if}

<style>
    .modal {
        position: fixed;
        z-index: 2;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: rgba(0, 0, 0, 0.4);
    }

    .modal-content {
        background-color: rgb(29, 27, 27);
        padding: 30px;
        border: 2px solid rgb(0, 0, 22);
        border-radius: 10px;
        box-shadow: 10px 10px 5px rgb(0, 0, 0);
        width: 70%;
        height: 80%;
        margin-top: 50px;
        margin-left: 12.5%;
    }
    .modal-content img {
        margin-top: 100px;
        scale: 1.5;
    }

    .close {
        color: #aaa;
        float: right;
        font-size: 28px;
        font-weight: bold;
    }

    .close:hover,
    .close:focus {
        color: black;
        text-decoration: none;
        cursor: pointer;
    }
    p {
        font-size: 50px;
        color: aliceblue;
    }
</style>
