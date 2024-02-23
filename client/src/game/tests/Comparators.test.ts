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
});
