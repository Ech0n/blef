<script lang="ts">
    import CardImageHandler from './CardImageHandler'

    export let showModal: boolean
    export let options: string[]
    export let selectedRanking: string
    export let onSelect: (selectedValues: { primaryCardModal: string; secondaryCardModal: string; selectedColorModal: string; startingCardModal: string }) => void

    let cardImageHandler = new CardImageHandler()
    let primaryCardModal: string = ''
    let secondaryCardModal: string = ''
    let selectedColorModal: string = ''
    let startingCardModal: string = ''
    let colors: string[] = []
    let cards: string[] = []
    let helperText: string = ''
    let selectionCounter: number = 0
    let selectionRequirement: number = 0
    let showPopup = false

    const handleSelect = () => {
        selectionCounter++
        if (selectionCounter !== selectionRequirement) {
            return
        }

        onSelect({
            primaryCardModal,
            secondaryCardModal,
            selectedColorModal,
            startingCardModal,
        })
        showModal = false
    }

    $: if (showModal) {
        primaryCardModal = ''
        secondaryCardModal = ''
        selectedColorModal = ''
        startingCardModal = ''
        if (options.length <= 4) {
            colors = [...options]
            cards = [] // Clear cards as they are not needed
        } else if (options.length >= 10 && options.length <= 14) {
            cards = [...options]
            colors = [] // Clear colors as they are not needed
        } else if (options.length > 14) {
            colors = options.slice(0, 4)
            cards = options.slice(4, 17)
        }
    }

    const closeModal = () => {
        showModal = false
        resetHelperText()
    }

    const resetHelperText = () => {
        helperText = ''
        selectionRequirement = 0
        selectionCounter = 0
    }

    const appendToHelperText = (newText: string) => {
        helperText += `${helperText ? ' and ' : ''}${newText}`
        selectionRequirement++
    }
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
{#if showModal}
    <div class="modal-background">
        <div class="modal">
            <div class="helper-symbol" on:mouseover="{() => (showPopup = true)}" on:mouseleave="{() => (showPopup = false)}"></div>
            {#if showPopup}
                <div class="popup">{helperText}</div>
            {/if}
            <h3 class="header-underline select-hand-header">{selectedRanking}</h3>
            {#if ['Royal', 'Color', 'Flush'].includes(selectedRanking)}
                {appendToHelperText('Pick a card to choose color') ?? ''}
                <div class="color-options-container">
                    {#each colors as color}
                        <div
                            on:click="{() => {
                                selectedColorModal = color
                                handleSelect()
                            }}"
                            class="color-option-container {selectedColorModal === color ? 'selected' : ''}"
                        >
                            <h3 class="color-name">{color}</h3>
                            <img src="{cardImageHandler.getCardImage(color)}" class="color-scale-image" alt="{color}" />
                        </div>
                    {/each}
                </div>
            {/if}

            {#if ['Full', 'One', 'Double', 'Pair', 'Four', 'Three'].includes(selectedRanking)}
                {appendToHelperText('Pick a primary card') ?? ''}
                <div class="options-container">
                    {#each cards as card}
                        <div
                            on:click="{() => {
                                primaryCardModal = card
                                handleSelect()
                            }}"
                            class="card-option-container {primaryCardModal === card ? 'selected' : ''}"
                        >
                            <img src="{cardImageHandler.getCardImage(card)}" class="auto-scale-image" alt="{card}" />
                        </div>
                    {/each}
                </div>
            {/if}

            {#if ['Full', 'Double'].includes(selectedRanking)}
                {appendToHelperText('Pick a secondary card') ?? ''}
                <div class="options-container">
                    {#each cards as card}
                        <div
                            on:click="{() => {
                                secondaryCardModal = card
                                handleSelect()
                            }}"
                            class="card-option-container {secondaryCardModal === card ? 'selected' : ''}"
                        >
                            <img src="{cardImageHandler.getCardImage(card)}" class="auto-scale-image" alt="{card}" />
                        </div>
                    {/each}
                </div>
            {/if}

            {#if ['Street', 'Flush'].includes(selectedRanking)}
                {appendToHelperText('Pick a starting card') ?? ''}
                <div class="options-container">
                    {#each cards.slice(0, 8) as card}
                        <div
                            on:click="{() => {
                                startingCardModal = card
                                handleSelect()
                            }}"
                            class="card-option-container {startingCardModal === card ? 'selected' : ''}"
                        >
                            <img src="{cardImageHandler.getCardImage(card)}" class="auto-scale-image" alt="{card}" />
                        </div>
                    {/each}
                </div>
            {/if}

            <button class="default-button" style="margin-top: 20px;" on:click="{closeModal}">Go back to hand selection</button>
        </div>
    </div>
{/if}

<style lang="scss">
    .modal-background {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .modal {
        display: flex;
        margin: 0 1rem;
        align-items: center;
        justify-content: space-around;
        flex-direction: column;
        background: rgb(42, 41, 42);
        background: linear-gradient(90deg, rgba(42, 41, 42, 1) 20%, rgba(28, 33, 38, 1) 69%);
        border-radius: 30px;
        border-width: 5px;
        box-shadow: 5px 5px 10px black;
        animation: slideIn 0.6s linear;
        width: 80%;
        padding: 2rem;
        position: relative;
    }

    .select-hand-header {
        font-size: 5rem;
        max-width: 20rem;
    }

    .helper-symbol {
        overflow: visible;
        position: absolute;
        width: 5rem;
        height: 5rem;
        right: 3.5rem;
        top: 3.5rem;
        display: inline-block;
        content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='M9 11a1 1 0 1 1-2 0a1 1 0 0 1 2 0M7.5 4A2.5 2.5 0 0 0 5 6.5h2a.5.5 0 0 1 .5-.5h.646a.382.382 0 0 1 .17.724L7 7.382V9h2v-.382l.211-.106A2.382 2.382 0 0 0 8.146 4z'/%3E%3Cpath d='M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-6a6 6 0 1 0 0 12A6 6 0 0 0 8 2'/%3E%3C/g%3E%3C/svg%3E");

        &:hover {
            cursor: pointer;
        }
    }

    .popup {
        position: absolute;
        top: -1rem;
        right: -10rem;
        transform: translateX(-50%);
        background-color: #333;
        padding: 8px;
        border-radius: 5px;
        white-space: nowrap;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        font-size: 2rem;
    }

    .options-container {
        margin-top: 2rem;
        width: 100%;
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
    .color-options-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin: 0 -2rem;
    }

    .color-option-container {
        width: fit-content;
        padding: 0 2rem;
        cursor: pointer;
        transition: transform 0.2s;
        box-sizing: border-box;
        flex: 0 1 calc(25% - 4rem);
    }

    .color-option-container:hover,
    .color-option-container.selected {
        background-color: #0a0909;
        border-radius: 10px;
        transform: scale(1.05);
    }

    .color-scale-image {
        height: 14rem;
    }

    .color-name {
        width: 100%;
        font-size: 2rem;
    }

    .card-option-container:hover,
    .card-option-container.selected {
        background-color: none;
        border-radius: 50px;
        transform: scale(1.15);
        box-shadow: 24px 16px 20px rgba(0, 0, 0, 0.6);
    }
    .auto-scale-image {
        max-height: 200px;
        max-width: 100%;
    }
    h3 {
        font-size: 35px;
        margin-bottom: 0px 10px 20px 10px;
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
        .card-option-container {
            max-width: 13%;
        }
        .color-option-container {
            width: 45%;
        }

        .select-hand-header {
            font-size: 4.5rem;
        }
        .helper-symbol {
            display: none;
        }
    }
</style>
