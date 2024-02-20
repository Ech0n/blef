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

test('One cardCheck', () => {
    let thisHand = { ...emptyHandInfo };
    thisHand.primaryCard = '4';
    thisHand.selectedRanking = 'One';
    let checker = checkFunctionsMap[thisHand.selectedRanking](karty, thisHand);
    expect(checker).toBe(true);
});
