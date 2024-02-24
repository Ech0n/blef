import { compareRankingAGreaterThanB } from '../Comparators';

interface hitPayload {
    selectedRanking: string;
    primaryCard: string;
    secondaryCard: string;
    selectedColor: string;
    startingCard: string;
}

let emptyHandInfo: hitPayload = {
    selectedColor: '',
    selectedRanking: '',
    primaryCard: '',
    secondaryCard: '',
    startingCard: '',
};
let payloadA: hitPayload;
let payloadB: hitPayload;

beforeEach(() => {
    payloadA = {
        selectedColor: '',
        selectedRanking: '',
        primaryCard: '',
        secondaryCard: '',
        startingCard: '',
    };
    payloadB = {
        selectedColor: '',
        selectedRanking: '',
        primaryCard: '',
        secondaryCard: '',
        startingCard: '',
    };
});

test('one and pair comparator', () => {
    payloadA.selectedRanking = 'pair';
    payloadB.selectedRanking = 'one';

    payloadA.primaryCard = '2';
    payloadB.primaryCard = '2';

    expect(compareRankingAGreaterThanB(payloadA, payloadB)).toBe(true);
    expect(compareRankingAGreaterThanB(payloadB, payloadA)).toBe(false);
});

test('one and one comparator', () => {
    payloadA.selectedRanking = 'one';
    payloadB.selectedRanking = 'one';

    payloadA.primaryCard = '6';
    payloadB.primaryCard = '3';

    expect(compareRankingAGreaterThanB(payloadB, payloadA)).toBe(false);
    expect(compareRankingAGreaterThanB(payloadA, payloadB)).toBe(true);

    payloadB.primaryCard = '6';

    expect(compareRankingAGreaterThanB(payloadB, payloadA)).toBe(false);
    expect(compareRankingAGreaterThanB(payloadA, payloadB)).toBe(false);
});

test('street and street comparator', () => {
    payloadA.selectedRanking = 'street';
    payloadB.selectedRanking = 'street';

    payloadA.startingCard = '2';
    payloadB.startingCard = '3';

    expect(compareRankingAGreaterThanB(payloadA, payloadA)).toBe(false);
    expect(compareRankingAGreaterThanB(payloadA, payloadB)).toBe(false);
    expect(compareRankingAGreaterThanB(payloadB, payloadA)).toBe(true);

    payloadA.startingCard = '3';

    expect(compareRankingAGreaterThanB(payloadA, payloadB)).toBe(false);
    expect(compareRankingAGreaterThanB(payloadB, payloadA)).toBe(false);
});

test('royal and royal comparator', () => {
    payloadA.selectedRanking = 'royal';
    payloadB.selectedRanking = 'royal';

    payloadA.selectedColor = 'heart';
    payloadB.selectedColor = 'spade';

    expect(compareRankingAGreaterThanB(payloadA, payloadA)).toBe(false);
    expect(compareRankingAGreaterThanB(payloadA, payloadB)).toBe(false);
    expect(compareRankingAGreaterThanB(payloadB, payloadA)).toBe(true);

    payloadA.selectedColor = 'spade';

    expect(compareRankingAGreaterThanB(payloadA, payloadB)).toBe(false);
    expect(compareRankingAGreaterThanB(payloadB, payloadA)).toBe(false);
});

test('color and color comparator', () => {
    payloadA.selectedRanking = 'color';
    payloadB.selectedRanking = 'color';

    payloadA.selectedColor = 'heart';
    payloadB.selectedColor = 'spade';

    expect(compareRankingAGreaterThanB(payloadA, payloadA)).toBe(false);
    expect(compareRankingAGreaterThanB(payloadA, payloadB)).toBe(false);
    expect(compareRankingAGreaterThanB(payloadB, payloadA)).toBe(true);

    payloadA.selectedColor = 'spade';

    expect(compareRankingAGreaterThanB(payloadA, payloadB)).toBe(false);
    expect(compareRankingAGreaterThanB(payloadB, payloadA)).toBe(false);
});

test('flush and flush comparator', () => {
    payloadA.selectedRanking = 'flush';
    payloadB.selectedRanking = 'flush';

    payloadA.selectedColor = 'heart';
    payloadB.selectedColor = 'spade';

    payloadA.startingCard = '9';
    payloadB.startingCard = '9';

    expect(compareRankingAGreaterThanB(payloadA, payloadA)).toBe(false);
    expect(compareRankingAGreaterThanB(payloadA, payloadB)).toBe(false);
    expect(compareRankingAGreaterThanB(payloadB, payloadA)).toBe(true);

    payloadB.startingCard = '8';

    expect(compareRankingAGreaterThanB(payloadA, payloadB)).toBe(true);
    expect(compareRankingAGreaterThanB(payloadB, payloadA)).toBe(false);
});

test('full and full comparator', () => {
    payloadA.selectedRanking = 'full';
    payloadB.selectedRanking = 'full';

    payloadA.primaryCard = '2';
    payloadB.primaryCard = '2';

    payloadA.secondaryCard = '4';
    payloadB.secondaryCard = '3';

    expect(compareRankingAGreaterThanB(payloadA, payloadA)).toBe(false);
    expect(compareRankingAGreaterThanB(payloadA, payloadB)).toBe(true);
    expect(compareRankingAGreaterThanB(payloadB, payloadA)).toBe(false);

    payloadB.primaryCard = '9';

    expect(compareRankingAGreaterThanB(payloadA, payloadB)).toBe(false);
    expect(compareRankingAGreaterThanB(payloadB, payloadA)).toBe(true);
});

test('double and double comparator', () => {
    payloadA.selectedRanking = 'double';
    payloadB.selectedRanking = 'double';

    payloadA.primaryCard = '2';
    payloadB.primaryCard = '2';

    payloadA.secondaryCard = '4';
    payloadB.secondaryCard = '3';

    expect(compareRankingAGreaterThanB(payloadA, payloadA)).toBe(false);
    expect(compareRankingAGreaterThanB(payloadA, payloadB)).toBe(true);
    expect(compareRankingAGreaterThanB(payloadB, payloadA)).toBe(false);

    payloadB.primaryCard = '9';

    expect(compareRankingAGreaterThanB(payloadA, payloadB)).toBe(false);
    expect(compareRankingAGreaterThanB(payloadB, payloadA)).toBe(true);
});
