<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import CardImageHandler from './game/CardImageHandler';

    const cardImageHandler = new CardImageHandler();
    const handRankings: string[] = ['one', 'pair', 'three', 'double', 'street', 'full', 'color', 'four', 'flush', 'royal'];
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
        <div class="main-container">
            <h3>The Rules:</h3>
            <div class="game-info-container">
                <p>1. There is a stand deck of 52 cards in game.</p>
                <p>2. At the start of the game each players gets 1 random card.</p>
                <p>
                    3. One it is Your turn during the round, there are 2 possible moves: Raise and Check.
                    <br /> <br />
                    Raise - You can choose a Hand Ranking, for example Pair of Aces.
                    <br />
                    That means that you bet there are 2 Aces among ALL dealt cards in current round.
                    <br />
                    New bet must have higher ranking than previous bet.
                    <br /><br />
                    Check - You can check previous player's bet.
                    <br />
                    If his bet was correct then You will be the one to receive another card.
                    <br />
                    If his bet was incorrect then previous player will receive additional card and another he will begin next round.
                    <br />
                    For example if previous player bets there is One King and You check it and there are no dealt kings in current round => Previous Player loses that round.
                </p>
                <p>4. Player is eliminated once he loses a round with 5 cards.</p>
                <p>5. There can be maximum 5 players in 1 game.</p>
                <p>6. There is a 45 second timer for each turn during a round. If it ends a move is made automaticaly.</p>
                <p>7. The ranking of a selected bet directly responds to this list (same list will be available in game):</p>
                <ul class="hand-rankings">
                    {#each handRankings as ranking}
                        <li>
                            <span>{ranking.charAt(0).toUpperCase() + ranking.slice(1)}</span>
                            <br />
                            <img src={cardImageHandler.getCardImage(ranking)} alt={ranking} />
                        </li>
                    {/each}
                </ul>
            </div>
        </div>
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
        width: 80%;
        min-height: 100%;
        margin-top: 50px;
        margin-left: 1.5%;
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

    .main-container {
        margin-top: 50px;
        display: flex;
        width: 100%;
        min-height: 100%;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
    }
    .hand-rankings {
        width: 100%;
        list-style: none;
        padding: 0;
        height: 600px;
        overflow-y: auto;
        background-color: rgb(39, 34, 34);
        scrollbar-width: none;
        -ms-overflow-style: none;
        border-radius: 8px;
    }
    .hand-rankings::-webkit-scrollbar {
        display: none; /* Hides scrollbar for WebKit browsers */
    }
    .hand-rankings img {
        margin-top: 20px;
        max-height: 200px;
    }
    .hand-rankings li {
        font-size: 30px;
        margin: 50px 0;
    }
    p {
        font-size: 16px;
        margin-left: 20px;
        margin-right: 20px;
    }
    @media (max-width: 800px) {
        p {
            font-size: 12px;
        }
    }
</style>
