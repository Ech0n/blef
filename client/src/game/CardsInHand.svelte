<script lang="ts">
    import type { Card } from '../model/Card';
    import CardImageHandler from './CardImageHandler';

    export let hand: Card[];

    const cardImageHandler = new CardImageHandler();
    console.log(hand);
</script>

<div class="hand">
    {#each hand as card, index}
        <!-- svelte-ignore a11y-missing-attribute -->
        <img class="karta" id="card{index}" src={cardImageHandler.getCardImage(card[0] + ' ' + card[1])} />
    {/each}
</div>

<style>
    .hand {
        width: 400px;
    }
    .karta {
        position: absolute;
        width: 160px;
        box-shadow: -1px 1px 12px black;
        border-radius: 7px;
    }
    #card0 {
        left: 150px;
        z-index: 2;
    }
    #card1 {
        left: 120px;
        z-index: 1;
        transform: translateY(10px) rotate(-15deg);
    }
    #card2 {
        left: 190px;
        transform: translateY(10px) rotate(15deg);
        z-index: 3;
    }
    #card3 {
        left: 80px;
        transform: translateY(30px) rotate(-25deg);
        z-index: 0;
    }
    #card4 {
        left: 250px;
        transform: translateY(30px) rotate(25deg);

        z-index: 3;
    }
</style>
