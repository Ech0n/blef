<script lang="ts">
    import CardImageHandler from './CardImageHandler';

    export let showModal: boolean;
    export let options: string[];
    export let selectedRanking: string;
    export let onSelect: (selectedValues: { primaryCardModal: string; secondaryCardModal: string; selectedColorModal: string; startingCardModal: string }) => void;

    let cardImageHandler = new CardImageHandler();
    let primaryCardModal: string = '';
    let secondaryCardModal: string = '';
    let selectedColorModal: string = '';
    let startingCardModal: string = '';
    let colors: string[] = [];
    let cards: string[] = [];

    function handleSelect() {
        onSelect({
            primaryCardModal,
            secondaryCardModal,
            selectedColorModal,
            startingCardModal,
        });
        showModal = false; // Close the modal after selection
    }

    $: if (showModal) {
        primaryCardModal = '';
        secondaryCardModal = '';
        selectedColorModal = '';
        startingCardModal = '';
        if (options.length <= 4) {
            colors = [...options];
            cards = []; // Clear cards as they are not needed
        } else if (options.length >= 10 && options.length <= 14) {
            cards = [...options];
            colors = []; // Clear colors as they are not needed
        } else if (options.length > 14) {
            colors = options.slice(0, 4);
            cards = options.slice(4, 17);
        }
    }
</script>

{#if showModal}
    <div class="modal-background">
        <div class="modal">
            <h3>{selectedRanking}</h3>
            {#if ['Royal', 'Color', 'Flush'].includes(selectedRanking)}
                <h3>Select color:</h3>
                <div class="options-container">
                    {#each colors as color}
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <div on:click={() => (selectedColorModal = color)} class="color-option-container {selectedColorModal === color ? 'selected' : ''}">
                            <h3>{color}</h3>
                            <!-- svelte-ignore a11y-missing-attribute -->
                            <img src={cardImageHandler.getCardImage(color)} class="auto-scale-image" />
                        </div>
                    {/each}
                </div>
            {/if}

            {#if ['Full', 'One', 'Double', 'Pair', 'Four', 'Three'].includes(selectedRanking)}
                <h3>Select card:</h3>
                <div class="options-container">
                    {#each cards as card}
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <div on:click={() => (primaryCardModal = card)} class="card-option-container {primaryCardModal === card ? 'selected' : ''}">
                            <!-- svelte-ignore a11y-missing-attribute -->
                            <img src={cardImageHandler.getCardImage(card)} class="auto-scale-image" />
                        </div>
                    {/each}
                </div>
            {/if}

            {#if ['Full', 'Double'].includes(selectedRanking)}
                <h3>Select secondary card:</h3>
                <div class="options-container">
                    {#each cards as card}
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <div on:click={() => (secondaryCardModal = card)} class="card-option-container {secondaryCardModal === card ? 'selected' : ''}">
                            <!-- svelte-ignore a11y-missing-attribute -->
                            <img src={cardImageHandler.getCardImage(card)} class="auto-scale-image" />
                        </div>
                    {/each}
                </div>
            {/if}

            {#if ['Street', 'Flush'].includes(selectedRanking)}
                <h3>Select hand starting card:</h3>
                <div class="options-container">
                    {#each cards as card}
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <div on:click={() => (startingCardModal = card)} class="card-option-container {startingCardModal === card ? 'selected' : ''}">
                            <!-- svelte-ignore a11y-missing-attribute -->
                            <img src={cardImageHandler.getCardImage(card)} class="auto-scale-image" />
                        </div>
                    {/each}
                </div>
            {/if}

            <button on:click={handleSelect}>Select</button>
        </div>
    </div>
{/if}

<style>
    .modal-background {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow-y: auto; /* Allow scrolling within the modal background */
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .modal {
        background-color: rgb(29, 27, 27);
        padding: 30px;
        border: 2px solid rgb(0, 0, 22);
        border-radius: 10px;
        box-shadow: 10px 10px 5px rgb(0, 0, 0);
        width: 80%;
        margin-top: 50px;
    }
    .options-container {
        widows: 100%;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-around;
        align-items: center;
    }
    button {
        margin-left: 10px;
        margin-top: 20px;
        padding: 5px 15px;
        color: aliceblue;
        background-color: rgb(20, 20, 20);
        font-size: 45px;
    }
    .card-option-container {
        max-width: 7%;
        cursor: pointer;
        transition: transform 0.2s;
    }
    .color-option-container {
        width: 24%;
        cursor: pointer;
        transition: transform 0.2s;
    }
    .card-option-container:hover,
    .card-option-container.selected,
    .color-option-container:hover,
    .color-option-container.selected {
        background-color: #0a0909;
        border-radius: 10px;
        transform: scale(1.05);
    }
    .card-option-container:hover,
    .card-option-container.selected {
        padding: 1%;
    }
    .auto-scale-image {
        max-height: 200px;
        max-width: 100%;
    }
    h3 {
        font-size: 35px;
        margin-bottom: 10px 10px 20px 10px;
    }

    @media (max-width: 1000px) {
        .card-option-container {
            max-width: 13%;
        }
        .color-option-container {
            width: 45%;
        }
    }
</style>
