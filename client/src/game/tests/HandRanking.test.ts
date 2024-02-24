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
    cards[cardToRankTranslation['q'].numeric][ColorToIndex['heart']] = 1;

    let thisHand = { ...emptyHandInfo };
    thisHand.primaryCard = '4';
    thisHand.selectedRanking = 'one';

    let checker = checkFunctionsMap[thisHand.selectedRanking](cards, thisHand);
    expect(checker).toBe(true);

    thisHand.primaryCard = '5';
    checker = checkFunctionsMap[thisHand.selectedRanking](cards, thisHand);
    expect(checker).toBe(false);

    thisHand.primaryCard = 'q';
    checker = checkFunctionsMap[thisHand.selectedRanking](cards, thisHand);
    expect(checker).toBe(true);
});

test('Pair cardCheck', () => {
    cards = initalizeCountTable();
    cards[cardToRankTranslation['8'].numeric][ColorToIndex['diamond']] = 1;
    cards[cardToRankTranslation['8'].numeric][ColorToIndex['spade']] = 1;
    cards[cardToRankTranslation['k'].numeric][ColorToIndex['spade']] = 1;
    cards[cardToRankTranslation['a'].numeric][ColorToIndex['spade']] = 1;

    let thisHand = { ...emptyHandInfo };
    thisHand.primaryCard = '8';
    thisHand.selectedRanking = 'pair';

    let checker = checkFunctionsMap[thisHand.selectedRanking](cards, thisHand);
    expect(checker).toBe(true);

    thisHand.primaryCard = 'k';
    checker = checkFunctionsMap[thisHand.selectedRanking](cards, thisHand);
    expect(checker).toBe(false);

    thisHand.primaryCard = 'a';
    checker = checkFunctionsMap[thisHand.selectedRanking](cards, thisHand);
    expect(checker).toBe(false);

    cards[cardToRankTranslation['k'].numeric][ColorToIndex['club']] = 1;
    thisHand.primaryCard = 'k';
    checker = checkFunctionsMap[thisHand.selectedRanking](cards, thisHand);
    expect(checker).toBe(true);
});

test('Three cardCheck', () => {
    cards = initalizeCountTable();
    cards[cardToRankTranslation['8'].numeric][ColorToIndex['diamond']] = 1;
    cards[cardToRankTranslation['8'].numeric][ColorToIndex['spade']] = 1;
    cards[cardToRankTranslation['k'].numeric][ColorToIndex['spade']] = 1;
    cards[cardToRankTranslation['8'].numeric][ColorToIndex['heart']] = 1;
    cards[cardToRankTranslation['k'].numeric][ColorToIndex['heart']] = 1;

    let thisHand = { ...emptyHandInfo };
    thisHand.primaryCard = '8';
    thisHand.selectedRanking = 'three';

    let checker = checkFunctionsMap[thisHand.selectedRanking](cards, thisHand);
    expect(checker).toBe(true);

    thisHand.primaryCard = 'k';
    checker = checkFunctionsMap[thisHand.selectedRanking](cards, thisHand);
    expect(checker).toBe(false);

    thisHand.primaryCard = 'q';
    checker = checkFunctionsMap[thisHand.selectedRanking](cards, thisHand);
    expect(checker).toBe(false);

    cards[cardToRankTranslation['k'].numeric][ColorToIndex['club']] = 1;
    thisHand.primaryCard = 'k';
    checker = checkFunctionsMap[thisHand.selectedRanking](cards, thisHand);
    expect(checker).toBe(true);
});

test('Four cardCheck', () => {
    cards = initalizeCountTable();
    cards[cardToRankTranslation['8'].numeric][ColorToIndex['diamond']] = 1;
    cards[cardToRankTranslation['8'].numeric][ColorToIndex['spade']] = 1;
    cards[cardToRankTranslation['k'].numeric][ColorToIndex['spade']] = 1;
    cards[cardToRankTranslation['8'].numeric][ColorToIndex['heart']] = 1;
    cards[cardToRankTranslation['k'].numeric][ColorToIndex['heart']] = 1;
    cards[cardToRankTranslation['8'].numeric][ColorToIndex['club']] = 1;
    cards[cardToRankTranslation['k'].numeric][ColorToIndex['diamond']] = 1;

    let thisHand = { ...emptyHandInfo };
    thisHand.primaryCard = '8';
    thisHand.selectedRanking = 'four';

    let checker = checkFunctionsMap[thisHand.selectedRanking](cards, thisHand);
    expect(checker).toBe(true);

    thisHand.primaryCard = 'k';
    checker = checkFunctionsMap[thisHand.selectedRanking](cards, thisHand);
    expect(checker).toBe(false);

    thisHand.primaryCard = 'q';
    checker = checkFunctionsMap[thisHand.selectedRanking](cards, thisHand);
    expect(checker).toBe(false);

    cards[cardToRankTranslation['k'].numeric][ColorToIndex['club']] = 1;
    thisHand.primaryCard = 'k';
    checker = checkFunctionsMap[thisHand.selectedRanking](cards, thisHand);
    expect(checker).toBe(true);
});

test('Double cardCheck', () => {
    cards = initalizeCountTable();
    cards[cardToRankTranslation['8'].numeric][ColorToIndex['diamond']] = 1;
    cards[cardToRankTranslation['8'].numeric][ColorToIndex['spade']] = 1;
    cards[cardToRankTranslation['k'].numeric][ColorToIndex['spade']] = 1;
    cards[cardToRankTranslation['k'].numeric][ColorToIndex['diamond']] = 1;
    cards[cardToRankTranslation['2'].numeric][ColorToIndex['diamond']] = 1;

    let thisHand = { ...emptyHandInfo };
    thisHand.primaryCard = '8';
    thisHand.selectedRanking = 'double';
    thisHand.secondaryCard = 'k';

    let checker = checkFunctionsMap[thisHand.selectedRanking](cards, thisHand);
    expect(checker).toBe(true);

    thisHand.primaryCard = '2';
    checker = checkFunctionsMap[thisHand.selectedRanking](cards, thisHand);
    expect(checker).toBe(false);

    thisHand.secondaryCard = 'q';
    checker = checkFunctionsMap[thisHand.selectedRanking](cards, thisHand);
    expect(checker).toBe(false);

    cards[cardToRankTranslation['2'].numeric][ColorToIndex['club']] = 1;
    thisHand.secondaryCard = 'k';
    checker = checkFunctionsMap[thisHand.selectedRanking](cards, thisHand);
    expect(checker).toBe(true);
});

test('Full cardCheck', () => {
    cards = initalizeCountTable();
    cards[cardToRankTranslation['8'].numeric][ColorToIndex['diamond']] = 1;
    cards[cardToRankTranslation['8'].numeric][ColorToIndex['spade']] = 1;
    cards[cardToRankTranslation['k'].numeric][ColorToIndex['spade']] = 1;
    cards[cardToRankTranslation['k'].numeric][ColorToIndex['diamond']] = 1;
    cards[cardToRankTranslation['2'].numeric][ColorToIndex['diamond']] = 1;
    cards[cardToRankTranslation['8'].numeric][ColorToIndex['heart']] = 1;

    let thisHand = { ...emptyHandInfo };
    thisHand.primaryCard = '8';
    thisHand.selectedRanking = 'full';
    thisHand.secondaryCard = 'k';

    let checker = checkFunctionsMap[thisHand.selectedRanking](cards, thisHand);
    expect(checker).toBe(true);

    thisHand.primaryCard = '2';
    checker = checkFunctionsMap[thisHand.selectedRanking](cards, thisHand);
    expect(checker).toBe(false);

    thisHand.secondaryCard = 'q';
    checker = checkFunctionsMap[thisHand.selectedRanking](cards, thisHand);
    expect(checker).toBe(false);

    cards[cardToRankTranslation['2'].numeric][ColorToIndex['club']] = 1;
    thisHand.secondaryCard = '2';
    thisHand.primaryCard = 'k';
    checker = checkFunctionsMap[thisHand.selectedRanking](cards, thisHand);
    expect(checker).toBe(false);

    cards[cardToRankTranslation['k'].numeric][ColorToIndex['heart']] = 1;
    checker = checkFunctionsMap[thisHand.selectedRanking](cards, thisHand);
    expect(checker).toBe(true);

    thisHand.secondaryCard = '10';
    checker = checkFunctionsMap[thisHand.selectedRanking](cards, thisHand);
    expect(checker).toBe(false);
});

test('Street cardCheck', () => {
    cards = initalizeCountTable();
    cards[cardToRankTranslation['10'].numeric][ColorToIndex['diamond']] = 1;
    cards[cardToRankTranslation['j'].numeric][ColorToIndex['spade']] = 1;
    cards[cardToRankTranslation['q'].numeric][ColorToIndex['spade']] = 1;
    cards[cardToRankTranslation['k'].numeric][ColorToIndex['heart']] = 1;
    cards[cardToRankTranslation['a'].numeric][ColorToIndex['diamond']] = 1;
    cards[cardToRankTranslation['8'].numeric][ColorToIndex['club']] = 1;

    let thisHand = { ...emptyHandInfo };
    thisHand.startingCard = '10';
    thisHand.selectedRanking = 'street';

    let checker = checkFunctionsMap[thisHand.selectedRanking](cards, thisHand);
    expect(checker).toBe(true);

    thisHand.startingCard = '2';
    checker = checkFunctionsMap[thisHand.selectedRanking](cards, thisHand);
    expect(checker).toBe(false);

    thisHand.startingCard = '8';
    checker = checkFunctionsMap[thisHand.selectedRanking](cards, thisHand);
    expect(checker).toBe(false);

    cards[cardToRankTranslation['9'].numeric][ColorToIndex['heart']] = 1;
    checker = checkFunctionsMap[thisHand.selectedRanking](cards, thisHand);
    expect(checker).toBe(true);
});

test('Color cardCheck', () => {
    cards = initalizeCountTable();
    cards[cardToRankTranslation['10'].numeric][ColorToIndex['diamond']] = 1;
    cards[cardToRankTranslation['j'].numeric][ColorToIndex['spade']] = 1;
    cards[cardToRankTranslation['q'].numeric][ColorToIndex['spade']] = 1;
    cards[cardToRankTranslation['k'].numeric][ColorToIndex['spade']] = 1;
    cards[cardToRankTranslation['a'].numeric][ColorToIndex['spade']] = 1;
    cards[cardToRankTranslation['8'].numeric][ColorToIndex['spade']] = 1;

    let thisHand = { ...emptyHandInfo };
    thisHand.selectedColor = 'spade';
    thisHand.selectedRanking = 'color';

    let checker = checkFunctionsMap[thisHand.selectedRanking](cards, thisHand);
    expect(checker).toBe(true);

    thisHand.selectedColor = 'heart';
    checker = checkFunctionsMap[thisHand.selectedRanking](cards, thisHand);
    expect(checker).toBe(false);

    thisHand.selectedColor = 'diamond';
    checker = checkFunctionsMap[thisHand.selectedRanking](cards, thisHand);
    expect(checker).toBe(false);

    cards[cardToRankTranslation['2'].numeric][ColorToIndex['diamond']] = 1;
    cards[cardToRankTranslation['4'].numeric][ColorToIndex['diamond']] = 1;
    cards[cardToRankTranslation['7'].numeric][ColorToIndex['diamond']] = 1;
    cards[cardToRankTranslation['a'].numeric][ColorToIndex['diamond']] = 1;
    checker = checkFunctionsMap[thisHand.selectedRanking](cards, thisHand);
    expect(checker).toBe(true);
});

test('Flush cardCheck', () => {
    cards = initalizeCountTable();
    cards[cardToRankTranslation['10'].numeric][ColorToIndex['spade']] = 1;
    cards[cardToRankTranslation['j'].numeric][ColorToIndex['spade']] = 1;
    cards[cardToRankTranslation['q'].numeric][ColorToIndex['spade']] = 1;
    cards[cardToRankTranslation['9'].numeric][ColorToIndex['spade']] = 1;
    cards[cardToRankTranslation['8'].numeric][ColorToIndex['spade']] = 1;
    cards[cardToRankTranslation['k'].numeric][ColorToIndex['heart']] = 1;

    let thisHand = { ...emptyHandInfo };
    thisHand.startingCard = '8';
    thisHand.selectedRanking = 'flush';
    thisHand.selectedColor = 'spade';

    let checker = checkFunctionsMap[thisHand.selectedRanking](cards, thisHand);
    expect(checker).toBe(true);

    thisHand.startingCard = '5';
    checker = checkFunctionsMap[thisHand.selectedRanking](cards, thisHand);
    expect(checker).toBe(false);

    thisHand.startingCard = '9';
    checker = checkFunctionsMap[thisHand.selectedRanking](cards, thisHand);
    expect(checker).toBe(false);

    cards[cardToRankTranslation['k'].numeric][ColorToIndex['spade']] = 1;
    checker = checkFunctionsMap[thisHand.selectedRanking](cards, thisHand);
    expect(checker).toBe(true);
});

test('Royal Flush cardCheck', () => {
    cards = initalizeCountTable();
    cards[cardToRankTranslation['10'].numeric][ColorToIndex['spade']] = 1;
    cards[cardToRankTranslation['j'].numeric][ColorToIndex['spade']] = 1;
    cards[cardToRankTranslation['q'].numeric][ColorToIndex['spade']] = 1;
    cards[cardToRankTranslation['k'].numeric][ColorToIndex['spade']] = 1;
    cards[cardToRankTranslation['a'].numeric][ColorToIndex['spade']] = 1;

    let thisHand = { ...emptyHandInfo };
    thisHand.selectedRanking = 'royal';
    thisHand.selectedColor = 'spade';

    let checker = checkFunctionsMap[thisHand.selectedRanking](cards, thisHand);
    expect(checker).toBe(true);

    thisHand.selectedColor = 'heart';
    checker = checkFunctionsMap[thisHand.selectedRanking](cards, thisHand);
    expect(checker).toBe(false);

    cards[cardToRankTranslation['k'].numeric][ColorToIndex['spade']] = 0;
    checker = checkFunctionsMap[thisHand.selectedRanking](cards, thisHand);
    expect(checker).toBe(false);
});
