<script lang="ts">
    import { createEventDispatcher } from 'svelte'
    import { toasts } from 'svelte-toasts'
    import CardImageHandler from './CardImageHandler'
    import { compareRankingAGreaterThanB } from './Comparators'
    import SelectionModal from './SelectionModal.svelte'

    export let previousBet

    const cardImageHandler = new CardImageHandler()
    const dispatch = createEventDispatcher()
    const handRankings = [
        { name: 'One', imageUrl: cardImageHandler.getCardImage('one'), description: '1 Card of any type' },
        { name: 'Pair', imageUrl: cardImageHandler.getCardImage('pair'), description: '2 Same cards of any type' },
        { name: 'Double', imageUrl: cardImageHandler.getCardImage('double'), description: '2 Pairs of same cards' },
        { name: 'Three', imageUrl: cardImageHandler.getCardImage('three'), description: '3 Same cards of any type' },
        { name: 'Color', imageUrl: cardImageHandler.getCardImage('color'), description: '5 Cards of the same color' },
        { name: 'Street', imageUrl: cardImageHandler.getCardImage('street'), description: '5 Cards in ascending order' },
        { name: 'Full', imageUrl: cardImageHandler.getCardImage('full'), description: '3 Same cards and 2 same cards' },
        { name: 'Four', imageUrl: cardImageHandler.getCardImage('four'), description: '4 Same cards of any type' },
        { name: 'Flush', imageUrl: cardImageHandler.getCardImage('flush'), description: 'Combination of Color and Street' },
        { name: 'Royal', imageUrl: cardImageHandler.getCardImage('royal'), description: 'Flush but starting from 10' },
    ]
    const cards = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
    const colors = ['Hearts', 'Diamonds', 'Clubs', 'Spades']

    let selectedRanking: string = ''
    let primaryCard: string = ''
    let secondaryCard: string = ''
    let selectedColor: string = ''
    let startingCard: string = ''
    let showModal: boolean = false

    const onSelect = (selectedValues: { primaryCardModal: string; secondaryCardModal: string; selectedColorModal: string; startingCardModal: string }) => {
        const { primaryCardModal, secondaryCardModal, selectedColorModal, startingCardModal } = selectedValues
        selectedColor = selectedColorModal
        primaryCard = primaryCardModal
        secondaryCard = secondaryCardModal
        startingCard = startingCardModal

        confirmSelection()
    }

    const closeModal = () => {
        dispatch('close')
    }

    const openModal = () => {
        showModal = true
    }

    const confirmSelection = () => {
        if (!selectedRanking) {
            toasts.warning('Please select a hand ranking.')
            return
        }

        if (['Flush', 'Royal', 'Color'].includes(selectedRanking) && !selectedColor) {
            toasts.warning('Please select a color ranking.')
            return
        }

        if (['Full', 'Double', 'Pair', 'One', 'Three', 'Four'].includes(selectedRanking) && !primaryCard) {
            toasts.warning('Please select primary card.')
            return
        }

        if (['Full', 'Double'].includes(selectedRanking) && (!secondaryCard || !primaryCard || secondaryCard === primaryCard)) {
            let message = secondaryCard === primaryCard ? 'Please select different primary and secondary card.' : 'Please select secondary card.'
            toasts.warning(message)
            return
        }

        if (['Flush'].includes(selectedRanking) && (!startingCard || ['10', 'J', 'Q', 'K', 'A'].includes(startingCard))) {
            toasts.warning('Please select starting card and make sure it is not larger than 9.')
            return
        }

        if (['Street'].includes(selectedRanking) && (!startingCard || [, 'J', 'Q', 'K', 'A'].includes(startingCard))) {
            toasts.warning('Please select starting card and make sure it is not larger than 10.')
            return
        }

        selectedRanking = selectedRanking.toLowerCase()
        primaryCard = primaryCard.toLowerCase()
        secondaryCard = secondaryCard.toLowerCase()
        selectedColor = selectedColor.toLowerCase().slice(0, -1)
        startingCard = startingCard.toLowerCase()

        let newBet = {
            selectedRanking,
            primaryCard,
            secondaryCard,
            selectedColor,
            startingCard,
        }

        if (previousBet) {
            if (compareRankingAGreaterThanB(previousBet, newBet)) {
                toasts.warning('New ranking must be higher than previous one')
                return
            }
        }

        dispatch('select', newBet)
        closeModal()
    }

    $: options =
        ['Royal', 'Color'].includes(selectedRanking) ? colors
        : ['Street', 'Full', 'Double', 'Pair', 'One', 'Three', 'Four'].includes(selectedRanking) ? cards
        : ['Flush'].includes(selectedRanking) ? colors.concat(cards)
        : []

    $: if (options.length > 1) {
        openModal()
    }
</script>

{#if showModal}
    <SelectionModal bind:showModal {options} {selectedRanking} {onSelect} />
{/if}

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="modal-background" on:click="{closeModal}">
    <div class="modal-content" on:click="{(event) => event.stopPropagation()}">
        <h2 class="header-underline hand-ranking-header" style="font-size: 55px">Select Hand Ranking</h2>
        <div class="hands-container">
            {#each handRankings as { name, imageUrl, description }}
                <div
                    on:click="{() => {
                        selectedRanking = name
                        openModal()
                    }}"
                    class="hand-ranking-image {selectedRanking === name ? 'selected' : ''}"
                >
                    <h3 style="margin: 10px;">{name == 'Royal' ? 'Royal Flush' : name}</h3>
                    <img src="{imageUrl}" class="auto-scale-image" alt="{name}" />
                    <p class="hover-details">{description}</p>
                </div>
            {/each}
        </div>
    </div>
</div>

<style lang="scss">
    .modal-background {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: rgb(0, 0, 0);
        background-color: rgba(0, 0, 0, 0.4);
    }

    .modal-content {
        height: calc(100vh - 320px);
        display: flex;
        margin: 0 1rem;
        align-items: center;
        justify-content: space-around;
        flex-direction: column;
        position: fixed;
        z-index: 4;
        top: 2rem;
        opacity: 1;
        background: rgb(42, 41, 42);
        background: linear-gradient(90deg, rgba(42, 41, 42, 1) 20%, rgba(28, 33, 38, 1) 69%);
        border-radius: 30px;
        border-width: 5px;
        box-shadow: 5px 5px 10px black;
        animation: slideIn 0.6s linear;
    }

    button {
        margin-left: 10px;
        padding: 5px 15px;
        color: aliceblue;
        font-size: 45px;
    }

    .hand-ranking-header {
        padding: 0.5rem 3rem;
    }

    .hands-container {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        grid-gap: 20px;
        margin: 20px 0;
        height: 80%;

        h3 {
            white-space: nowrap;
            font-size: 2rem;
        }
    }

    .hand-ranking-image:hover .hover-details {
        display: block;
    }

    .hover-details {
        max-width: calc(100% - 2rem);
        font-size: 1.5rem;
        display: none;
        position: fixed;
        padding: 0 1rem;
        bottom: 0;
        left: 0;
    }

    .hand-ranking-image {
        min-width: 12rem;
        cursor: pointer;
        padding: 10px;
        transition: transform 0.2s;
        text-align: center;

        &:hover,
        &:focus {
            background-color: #1d1a1a;
            border-radius: 10px;
            transform: scale(1.05);
        }
    }

    .auto-scale-image {
        max-width: 100%;
        height: 3rem;
    }

    @keyframes slideIn {
        0% {
            transform: translateY(-600px);
            animation-timing-function: ease-out;
        }
        60% {
            transform: translateY(30px);
            animation-timing-function: ease-in;
        }
        80% {
            transform: translateY(-10px);
            animation-timing-function: ease-out;
        }
        100% {
            transform: translateY(0px);
            animation-timing-function: ease-in;
        }
    }

    @media (max-width: 1000px) {
        .modal-content {
            width: fit-content;
        }

        .hands-container {
            grid-gap: 0;
            min-width: 500px;
        }

        .hand-ranking-header {
            font-size: 3.5rem !important;
        }

        .hand-ranking-image {
            min-width: 8rem;
            padding: 0;
            height: 13.5rem;

            &:hover,
            &:focus {
                background-color: #1d1a1a;
                border-radius: 10px;
                transform: scale(1.02);
            }

            h3 {
                font-size: 1.5rem;
            }
        }
        .auto-scale-image {
            height: 2.5rem;
        }

        .hover-details {
            font-size: 1.25rem;
        }
    }

    @media (max-width: 600px) {
        .hand-ranking-header {
            font-size: 2rem !important;
        }

        .hands-container {
            min-width: 400px;
            grid-template-columns: repeat(4, 1fr);
            grid-template-rows: auto auto auto;

            > div:nth-child(9),
            > div:nth-child(10) {
                grid-column: span 2;
            }
        }

        .hand-ranking-image {
            min-width: 8rem;
            h3 {
                font-size: 1.5rem;
            }
        }

        .auto-scale-image {
            height: 2.25rem;
        }
    }
</style>
