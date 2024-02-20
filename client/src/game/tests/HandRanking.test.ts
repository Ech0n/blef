import { checkFunctionsMap, type HandInfo } from '../HandRankings';
import {
    Rank,
    CardColor,
    type CardCountTable,
    cardToRankTranslation,
} from '../../model/Card';

let karty: CardCountTable = {};
let karta = cardToRankTranslation['4'].numeric;
karty[karta] = {};
karty[karta][CardColor.colorless] = 3;
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
    let thisHand = { ...emptyHandInfo };
    thisHand.primaryCard = '4';
    thisHand.selectedRanking = 'One';
    let checker = checkFunctionsMap[thisHand.selectedRanking](karty, thisHand);
    expect(checker).toBe(true);

    thisHand.primaryCard = '5';
    expect(cardToRankTranslation[thisHand.primaryCard].numeric).toBe(5);
    checker = checkFunctionsMap[thisHand.selectedRanking](karty, thisHand);
    expect(checker).toBe(false);
});
