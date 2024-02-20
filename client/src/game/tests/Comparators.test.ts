import { compareRankings } from '../Comparators';

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
let payload: hitPayload;
let paylobd: hitPayload;

beforeEach(() => {
    payload = {
        selectedColor: '',
        selectedRanking: '',
        primaryCard: '',
        secondaryCard: '',
        startingCard: '',
    };
    paylobd = {
        selectedColor: '',
        selectedRanking: '',
        primaryCard: '',
        secondaryCard: '',
        startingCard: '',
    };
});

test('one and pair comparator', () => {
    payload.selectedRanking = 'Pair';
    paylobd.selectedRanking = 'One';

    payload.primaryCard = '2';
    paylobd.primaryCard = '2';

    expect(compareRankings(paylobd, payload)).toBe(true);
    expect(compareRankings(payload, paylobd)).toBe(false);
});

test('one and one comparator', () => {
    payload.selectedRanking = 'One';
    paylobd.selectedRanking = 'One';

    payload.primaryCard = '6';
    paylobd.primaryCard = '3';

    expect(compareRankings(paylobd, payload)).toBe(true);
    expect(compareRankings(payload, paylobd)).toBe(false);
});
