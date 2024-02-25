<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { compareRankingAGreaterThanB } from './Comparators';
    import CardImageHandler from './CardImageHandler';
    import SelectionModal from './SelectionModal.svelte';

    // @ts-ignore
    export let previousBet;

    const cardImageHandler = new CardImageHandler();
    const dispatch = createEventDispatcher();
    const handRankings = [
        { name: 'Royal', imageUrl: cardImageHandler.getCardImage('royal') },
        { name: 'Flush', imageUrl: cardImageHandler.getCardImage('flush') },
        { name: 'Four', imageUrl: cardImageHandler.getCardImage('four') },
        { name: 'Full', imageUrl: cardImageHandler.getCardImage('full') },
        { name: 'Street', imageUrl: cardImageHandler.getCardImage('street') },
        { name: 'Color', imageUrl: cardImageHandler.getCardImage('color') },
        { name: 'Three', imageUrl: cardImageHandler.getCardImage('three') },
        { name: 'Double', imageUrl: cardImageHandler.getCardImage('double') },
        { name: 'Pair', imageUrl: cardImageHandler.getCardImage('pair') },
        { name: 'One', imageUrl: cardImageHandler.getCardImage('one') },
    ];
    const cards = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const colors = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];

    let selectedRanking: string = '';
    let primaryCard: string = '';
    let secondaryCard: string = '';
    let selectedColor: string = '';
    let startingCard: string = '';

    let showModal: boolean = false;
    let onSelect = (selectedValues: { primaryCardModal: string; secondaryCardModal: string; selectedColorModal: string; startingCardModal: string }) => {
        const { primaryCardModal, secondaryCardModal, selectedColorModal, startingCardModal } = selectedValues;
        selectedColor = selectedColorModal;
        primaryCard = primaryCardModal;
        secondaryCard = secondaryCardModal;
        startingCard = startingCardModal;
    };

    function closeModal() {
        dispatch('close');
    }

    function confirmSelection() {
        if (!selectedRanking) {
            alert('Please select a hand ranking.');
            return;
        }

        if (['Flush', 'Royal', 'Color'].includes(selectedRanking) && !selectedColor) {
            alert('Please select a color ranking.');
            return;
        }

        if (['Full', 'Double', 'Pair', 'One', 'Three', 'Four'].includes(selectedRanking) && !primaryCard) {
            alert('Please select primary card.');
            return;
        }

        if (['Full', 'Double'].includes(selectedRanking) && (!secondaryCard || !primaryCard || secondaryCard === primaryCard)) {
            alert('Please select secondary card.');
            return;
        }

        if (['Flush'].includes(selectedRanking) && (!startingCard || ['10', 'J', 'Q', 'K', 'A'].includes(startingCard))) {
            alert('Please select starting card and make sure it is not larger than 9.');
            return;
        }

        if (['Street'].includes(selectedRanking) && (!startingCard || [, 'J', 'Q', 'K', 'A'].includes(startingCard))) {
            alert('Please select starting card and make sure it is not larger than 10.');
            return;
        }

        selectedRanking = selectedRanking.toLowerCase();
        primaryCard = primaryCard.toLowerCase();
        secondaryCard = secondaryCard.toLowerCase();
        selectedColor = selectedColor.toLowerCase().slice(0, -1);
        startingCard = startingCard.toLowerCase();

        let newBet = {
            selectedRanking,
            primaryCard,
            secondaryCard,
            selectedColor,
            startingCard,
        };

        console.log(newBet);

        // @ts-ignore
        if (previousBet) {
            if (compareRankingAGreaterThanB(previousBet, newBet)) {
                alert('New ranking must be higher than previous one');
                return;
            }
        }

        dispatch('select', newBet);
        closeModal();
    }

    $: options = // Damn auto formatter goes kinda crazy here
        ['Royal', 'Color'].includes(selectedRanking) ? colors
        : ['Street', 'Full', 'Double', 'Pair', 'One', 'Three', 'Four'].includes(selectedRanking) ? cards
        : ['Flush'].includes(selectedRanking) ? colors.concat(cards)
        : [];

    $: if (options.length > 1) {
        openModal();
    }

    function openModal(): void {
        showModal = true;
    }
</script>

<SelectionModal bind:showModal {options} {selectedRanking} {onSelect} />

<div class="modal">
    <div class="modal-content">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <span class="close" on:click={closeModal}>&times;</span>
        <h2 style="font-size: 55px">Select Hand Ranking</h2>
        <div class="hands-container">
            {#each handRankings as { name, imageUrl }}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div on:click={() => (selectedRanking = name)} class="hand-ranking-image {selectedRanking === name ? 'selected' : ''}">
                    <h3 style="margin: 10px;">{name}</h3>
                    <!-- svelte-ignore a11y-missing-attribute -->
                    <img src={imageUrl} class="auto-scale-image" />
                </div>
            {/each}
        </div>
        <div class="modal-footer">
            <button on:click={closeModal}>Cancel</button>
            <button on:click={confirmSelection}>Confirm</button>
        </div>
    </div>
</div>

<style>
    .modal {
        display: block;
        position: fixed;
        z-index: 1;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: rgb(0, 0, 0);
        background-color: rgba(0, 0, 0, 0.4);
    }
    .modal-content {
        background-color: #3a3636;
        border-radius: 10px;
        margin: 8% auto;
        padding: 20px;
        width: 80%;
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
    .modal-footer {
        margin-top: 20px;
        text-align: right;
    }
    button {
        margin-left: 10px;
        padding: 5px 15px;
        color: aliceblue;
    }
    .hand-ranking-image {
        width: 46%;
        margin: 3% 1%;
        padding: 1%;
        cursor: pointer;
        transition: transform 0.2s;
    }
    .hand-ranking-image:hover,
    .hand-ranking-image.selected {
        background-color: #1d1a1a;
        border-radius: 10px;
        transform: scale(1.05);
        margin: 0;
    }
    .hands-container {
        widows: 100%;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: center;
    }
    .auto-scale-image {
        max-height: 200px;
        max-width: 100%;
    }
    h3 {
        font-size: 30px;
    }

    @media (max-width: 800px) {
        .hand-ranking-image {
            width: 97%;
            margin: 3.5% auto;
        }
    }
</style>
