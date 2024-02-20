<script >
    import { createEventDispatcher } from 'svelte';
    import { compareRankings } from './Comparators';

    // @ts-ignore
    export let previousBet 
    
    const dispatch = createEventDispatcher();
    const handRankings = [
        'Royal', 'Flush', 'Four', 'Full', 'Street',
        'Color', 'Double', 'Three', 'Pair', 'One'
    ];
    const cards = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const colors = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];

    let selectedRanking = '';
    let primaryCard = '';
    let secondaryCard = '';
    let selectedColor = '';
    let startingCard = '';


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

        if (['Flush', 'Street'].includes(selectedRanking) && (!startingCard || ['10', 'J', 'Q', 'K', 'A'].includes(startingCard))) {
            alert('Please select starting card and make sure it is not larger than 9.');
            return;
        }

        if (['Flush', 'Street'].includes(selectedRanking) && (!startingCard || ['10', 'J', 'Q', 'K', 'A'].includes(startingCard))) {
            alert('Please select starting card and make sure it is not larger than 9.');
            return;
        }

        selectedRanking = selectedRanking.toLowerCase();
        primaryCard = primaryCard.toLowerCase();
        secondaryCard = secondaryCard.toLowerCase();
        selectedColor = selectedColor.toLowerCase();
        startingCard = startingCard.toLowerCase();

        let newBet = {
            selectedRanking,
            primaryCard,
            secondaryCard,
            selectedColor,
            startingCard
        }
        
        // @ts-ignore
        if (previousBet) {
            if (compareRankings(previousBet, newBet)) {
                alert("New ranking must be higher than previous one")
                return
            }
        }

        dispatch('select', newBet);
        closeModal();
    }
</script>

<div class="modal">
    <div class="modal-content">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <span class="close" on:click={closeModal}>&times;</span>
        <h2>Select Hand Ranking</h2>

        <select bind:value={selectedRanking}>
            <option value="">-- Select Hand Ranking --</option>
            {#each handRankings as ranking}
                <option value={ranking}>{ranking}</option>
            {/each}
        </select>

        <div class="dropdowns">
            {#if ['Flush', 'Royal', 'Color'].includes(selectedRanking)}
                <div>
                    <h3>Select Color</h3>
                    <select bind:value={selectedColor}>
                        <option value="">-- Select Color --</option>
                        {#each colors as color}
                            <option value={color}>{color}</option>
                        {/each}
                    </select>
                </div>
            {/if}

            {#if ['Flush', 'Street'].includes(selectedRanking)}
                <div>
                    <h3>Select Starting Card</h3>
                    <select bind:value={startingCard}>
                        <option value="">-- Select Starting Card --</option>
                        {#each cards as card}
                            <option value={card}>{card}</option>
                        {/each}
                    </select>
                </div>
            {/if}

            {#if ['Full', 'Double', 'Pair', 'One', 'Three', 'Four'].includes(selectedRanking)}
                <div>
                    <h3>Select Primary Card</h3>
                    <select bind:value={primaryCard}>
                        <option value="">-- Select Primary Card --</option>
                        {#each cards as card}
                            <option value={card}>{card}</option>
                        {/each}
                    </select>
                </div>
            {/if}

            {#if ['Full', 'Double'].includes(selectedRanking)}
                <div>
                    <h3>Select Secondary Card</h3>
                    <select bind:value={secondaryCard}>
                        <option value="">-- Select Secondary Card --</option>
                        {#each cards as card}
                            <option value={card}>{card}</option>
                        {/each}
                    </select>
                </div>
            {/if}
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
        background-color: rgb(0,0,0);
        background-color: rgba(0,0,0,0.4);
    }
    .modal-content {
        background-color: #3a3636;
        border-radius: 10px;
        margin: 15% auto;
        padding: 20px;
        width: 50%;
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
    .dropdowns > div {
        display: inline-block; 
        margin-right: 20px; 
    }
    select {
        width: 100%;
        padding: 10px;
        margin-top: 10px;
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
</style>
