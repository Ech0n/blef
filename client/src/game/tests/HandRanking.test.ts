import { checkFunctionsMap, type HandInfo } from '../HandRankings';
import { Rank, CardColor, type CardCountTable, cardToRankTranslation, initalizeCountTable, ColorToIndex } from '../../model/Card';

let cards: CardCountTable;

const emptyHandInfo: HandInfo = {
    selectedColor: '',
    selectedRanking: '',
    primaryCard: '',
    secondaryCard: '',
    startingCard: '',
};

test('cardToRanktranslation test', () => {
    for (let i = 2; i <= 10; i++) {
        let numer = cardToRankTranslation[i.toString()].numeric;
        expect(numer).toBe(i);
    }
});

test('One cardCheck', () => {
    cards = initalizeCountTable();
    cards[cardToRankTranslation['4'].numeric][ColorToIndex['diamond']] = 1;

    let thisHand = { ...emptyHandInfo };
    thisHand.primaryCard = '4';
    thisHand.selectedRanking = 'one';

    console.log(cards);

    let checker = checkFunctionsMap[thisHand.selectedRanking](cards, thisHand);
    expect(checker).toBe(true);

    thisHand.primaryCard = '5';
    checker = checkFunctionsMap[thisHand.selectedRanking](cards, thisHand);
    expect(checker).toBe(false);

    thisHand.primaryCard = '6';
    checker = checkFunctionsMap[thisHand.selectedRanking](cards, thisHand);
    expect(checker).toBe(false);
});
