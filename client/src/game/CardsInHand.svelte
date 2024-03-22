<script lang="ts">
    import type { Card } from '../model/Card';
    import CardImageHandler from './CardImageHandler';

    export let hand: Card[];

    const cardImageHandler = new CardImageHandler();
    console.log(hand);
    let spread = '35px';
</script>

<div class="hand">
    {#each hand as card, index}
        <!-- svelte-ignore a11y-missing-attribute -->
        <img style="--spread:{spread}" class="karta" id="card{index}" src={cardImageHandler.getCardImage(card[0] + ' ' + card[1])} />
    {/each}
</div>

<style>
    .hand {
        width: 100vw;
        height: 240px;
        margin-top: 10px;
    }

    .karta {
        position: relative;
        width: 180px;
        box-shadow: -1px 1px 12px black;
        border-radius: 7px;
    }
    #card0 {
        left: 120px;
        z-index: 2;
    }
    #card1 {
        left: calc(120px - var(--spread));
        z-index: 1;
        transform: translateY(10px) rotate(-15deg);
    }
    #card2 {
        left: calc(130px + var(--spread));
        transform: translateY(10px) rotate(15deg);
        z-index: 3;
    }
    #card3 {
        left: calc(120px - calc(var(--spread) + var(--spread)));
        transform: translateY(30px) rotate(-30deg);
        z-index: 0;
    }
    #card4 {
        left: calc(140px + calc(var(--spread) + var(--spread)));
        transform: translateY(30px) rotate(25deg);

        z-index: 3;
    }
</style>
