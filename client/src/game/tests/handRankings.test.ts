import { describe, it, expect } from 'vitest';
import { checkFunctionsMap, HandInfo } from '../HandRankings';
import { cardToRankTranslation, ColorToIndex, type CardCountTable } from '../../model/Card';

describe('HandRankings', () => {
    const createEmptyCardCountTable = (): CardCountTable => {
        const table: CardCountTable = {};
        for (let i = 2; i <= 14; i++) {
            table[i] = [0, 0, 0, 0];
        }
        return table;
    };

    it('should correctly identify a royal flush', () => {
        const cards = createEmptyCardCountTable();
        const handInfo: HandInfo = {
            selectedRanking: 'royal',
            primaryCard: '',
            secondaryCard: '',
            selectedColor: 'hearts',
            startingCard: '10',
        };

        for (let i = 0; i < 5; i++) {
            cards[10 + i][ColorToIndex['hearts']] = 1;
        }

        expect(checkFunctionsMap['royal'](cards, handInfo)).toBe(true);
    });

    it('should correctly identify a flush', () => {
        const cards = createEmptyCardCountTable();
        const handInfo: HandInfo = {
            selectedRanking: 'flush',
            primaryCard: '',
            secondaryCard: '',
            selectedColor: 'spades',
            startingCard: '2',
        };

        for (let i = 0; i < 5; i++) {
            cards[2 + i][ColorToIndex['spades']] = 1;
        }

        expect(checkFunctionsMap['flush'](cards, handInfo)).toBe(true);
    });

    it('should correctly identify a four of a kind', () => {
        const cards = createEmptyCardCountTable();
        const handInfo: HandInfo = {
            selectedRanking: 'four',
            primaryCard: '7',
            secondaryCard: '',
            selectedColor: '',
            startingCard: '',
        };

        for (let i = 1; i <= 4; i++) {
            cards[cardToRankTranslation['7'].numeric][i] = 1;
        }

        expect(checkFunctionsMap['four'](cards, handInfo)).toBe(true);
    });

    it('should correctly identify a full house', () => {
        const cards = createEmptyCardCountTable();
        const handInfo: HandInfo = {
            selectedRanking: 'full',
            primaryCard: '8',
            secondaryCard: '3',
            selectedColor: '',
            startingCard: '',
        };

        for (let i = 1; i <= 3; i++) {
            cards[cardToRankTranslation['8'].numeric][i] = 1;
        }

        for (let i = 1; i <= 2; i++) {
            cards[cardToRankTranslation['3'].numeric][i] = 1;
        }
        expect(checkFunctionsMap['full'](cards, handInfo)).toBe(true);
    });

    it('should correctly identify a straight', () => {
        const cards = createEmptyCardCountTable();
        const handInfo: HandInfo = {
            selectedRanking: 'street',
            primaryCard: '',
            secondaryCard: '',
            selectedColor: '',
            startingCard: '5',
        };

        for (let i = 0; i < 5; i++) {
            cards[5 + i][1] = 1;
        }

        expect(checkFunctionsMap['street'](cards, handInfo)).toBe(true);
    });
});