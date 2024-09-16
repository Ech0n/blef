<script lang="ts">
    import CardImageHandler from '../CardImageHandler';
    import { cardCountTableToIterableArray, type CardCountTable, cardToRankTranslation } from '../model/Card';

    export let previousCards: CardCountTable;
    export let hand;

    
    let readyPreviousCards: any = [];

    const cardImageHandler = new CardImageHandler();


    function constructReadyCards() {
        let iterableCards = cardCountTableToIterableArray(previousCards);
        readyPreviousCards = [];

        const cardNumberToString: { [key: number]: string } = {
            11: 'j',
            12: 'q',
            13: 'k',
            14: 'a',
        };
        const IndexToColor: { [key: number]: string } = {
            4: 'spade',
            3: 'heart',
            2: 'club',
            1: 'diamond',
        };

        for (let [cardNumber, colorCounts] of iterableCards) {
            for (let [color, isThereColor] of colorCounts) {
                if (isThereColor == 1) {
                    let stringCardNumber = cardNumberToString[cardNumber] || cardNumber.toString();
                    let readyCardNumber = cardToRankTranslation[stringCardNumber].string;
                    readyPreviousCards.push(readyCardNumber + ' ' + IndexToColor[color]);
                }
            }
        }
    }
    function constructReadyCards() {
        let iterableCards = cardCountTableToIterableArray(previousCards);
        readyPreviousCards = [];

        const cardNumberToString: { [key: number]: string } = {
            11: 'j',
            12: 'q',
            13: 'k',
            14: 'a',
        };
        const IndexToColor: { [key: number]: string } = {
            4: 'spade',
            3: 'heart',
            2: 'club',
            1: 'diamond',
        };

        for (let [cardNumber, colorCounts] of iterableCards) {
            for (let [color, isThereColor] of colorCounts) {
                if (isThereColor == 1) {
                    let stringCardNumber = cardNumberToString[cardNumber] || cardNumber.toString();
                    let readyCardNumber = cardToRankTranslation[stringCardNumber].string;
                    readyPreviousCards.push(readyCardNumber + ' ' + IndexToColor[color]);
                }
            }
        }
    }
</script>
            <div class="cards-container">
                <div class={previousCards ? 'cards-width-with-prev' : 'cards-width-default'}>
                    <p>Your hand:</p>
                    <div class="hand">
                        {#each hand as card}
                            <!-- svelte-ignore a11y-missing-attribute -->
                            <img src={cardImageHandler.getCardImage(card[0] + ' ' + card[1])} />
                        {/each}
                    </div>
                </div>
                {#if previousCards}
                    <div class="prev-cards-width">
                        <p style="font-size: 15px">Cards from previous round:</p>
                        <div class="prev-cards-container">
                            {#each readyPreviousCards as card}
                                <!-- svelte-ignore a11y-missing-attribute -->
                                <img src={cardImageHandler.getCardImage(card)} />
                                <br />
                            {/each}
                        </div>
                    </div>
                {/if}
            </div>