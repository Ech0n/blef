<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    function closeModal(): void {
        dispatch('close');
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="modal" on:click={close}>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="modal-content" on:click|stopPropagation>
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <span class="close" on:click={closeModal}>&times;</span>
        <p>WIP</p>
    </div>
</div>

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

    @media (max-width: 1000px) {
        p {
            font-size: 34px;
        }
    }

    @media (max-width: 650px) {
        .modal-content {
            width: 100%;
            margin-left: 0;
        }
        p {
            font-size: 28px;
            margin-left: -17.5%;
        }
        .close {
            margin-right: 12.5%;
        }
    }
</style>
