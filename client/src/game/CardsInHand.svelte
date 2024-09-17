<script lang="ts">
    import type { Card } from '../model/Card'
    import CardImageHandler from './CardImageHandler'

    export let hand: Card[]

    const cardImageHandler = new CardImageHandler()
    //console.log(hand)
    let spread = '15px'
</script>

<div class="hand">
    {#each hand as card, index}
        <!-- svelte-ignore a11y-missing-attribute -->
        <img style="--spread:{spread}" class="karta" id="card{index}" src="{cardImageHandler.getCardImage(card[0] + ' ' + card[1])}" />
    {/each}
</div>

<style>
    .karta {
        position: absolute;
        width: 16rem;
        box-shadow: -1px 1px 12px black;
        border-radius: 7px;
        left: calc(50% - 60px);
        bottom: -10px;
    }
    #card0 {
        z-index: 2;
    }
    #card1 {
        transform: translateX(-30px) translateY(10px) rotate(-15deg);
        z-index: 1;
    }
    #card2 {
        transform: translateX(30px) translateY(10px) rotate(15deg);
        z-index: 3;
    }
    #card3 {
        transform: translateX(-60px) translateY(30px) rotate(-30deg);
        z-index: 0;
    }
    #card4 {
        transform: translateX(60px) translateY(30px) rotate(25deg);
        z-index: 3;
    }
</style>
