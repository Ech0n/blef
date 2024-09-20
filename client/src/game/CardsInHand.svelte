<script lang="ts">
    import type { Card } from '../model/Card'
    import CardImageHandler from './CardImageHandler'

    export let hand: Card[]

    const cardImageHandler = new CardImageHandler()
    let spread = '15px'
</script>

<div class="hand">
    {#each hand as card, index}
        <img
            style="--spread:{spread}; {hand.length === 1 ? 'transform: translateX(-2.5rem);' : ''}"
            class="single-card"
            id="card{index}"
            src="{cardImageHandler.getCardImage(card[0] + ' ' + card[1])}"
            alt="{`${card[0]} ${card[1]}`}"
        />
    {/each}
</div>

<style>
    .single-card {
        position: absolute;
        width: 16rem;
        box-shadow: -1px 1px 12px black;
        left: calc(50% - 7.5rem);
        bottom: -0.5rem;
    }
    #card0 {
        z-index: 3;
    }
    #card1 {
        transform: translateX(-30px) translateY(10px) rotate(-15deg);
        z-index: 2;
    }
    #card2 {
        transform: translateX(30px) translateY(10px) rotate(15deg);
        z-index: 4;
    }
    #card3 {
        transform: translateX(-60px) translateY(30px) rotate(-30deg);
        z-index: 1;
    }
    #card4 {
        transform: translateX(60px) translateY(30px) rotate(25deg);
        z-index: 4;
    }
</style>
