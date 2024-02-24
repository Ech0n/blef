import { cardToRankTranslation } from '../model/Card';

interface hitPayload {
    selectedRanking: string;
    primaryCard: string;
    secondaryCard: string;
    selectedColor: string;
    startingCard: string;
}

export function compareRankingAGreaterThanB(oldRanking: hitPayload, newRanking: hitPayload): boolean {
    console.log(compareHierarchy[oldRanking.selectedRanking], compareHierarchy[newRanking.selectedRanking]);

    if (compareHierarchy[oldRanking.selectedRanking] === compareHierarchy[newRanking.selectedRanking]) {
        console.log('Ranks are equal, checking cards ');

        if (['one', 'pair', 'three', 'four'].includes(oldRanking.selectedRanking)) {
            console.log('Rank is One, Two, Three, Four');
            return cardToRankTranslation[oldRanking.primaryCard].numeric > cardToRankTranslation[newRanking.primaryCard].numeric;
        }

        if (['double', 'full'].includes(oldRanking.selectedRanking)) {
            if (cardToRankTranslation[oldRanking.primaryCard].numeric === cardToRankTranslation[newRanking.primaryCard].numeric) {
                return cardToRankTranslation[oldRanking.secondaryCard].numeric > cardToRankTranslation[newRanking.secondaryCard].numeric;
            }

            return cardToRankTranslation[oldRanking.primaryCard].numeric > cardToRankTranslation[newRanking.primaryCard].numeric;
        }

        if (['color', 'royal'].includes(oldRanking.selectedRanking)) {
            return colorHierarchy[oldRanking.selectedColor] > colorHierarchy[newRanking.selectedColor];
        }

        if (['street'].includes(oldRanking.selectedRanking)) {
            return cardToRankTranslation[oldRanking.startingCard].numeric > cardToRankTranslation[newRanking.startingCard].numeric;
        }

        if (['flush'].includes(oldRanking.selectedRanking)) {
            if (cardToRankTranslation[oldRanking.startingCard].numeric > cardToRankTranslation[newRanking.startingCard].numeric) {
                return true;
            } else if (cardToRankTranslation[oldRanking.startingCard].numeric === cardToRankTranslation[newRanking.startingCard].numeric) {
                return colorHierarchy[oldRanking.selectedColor] > colorHierarchy[newRanking.selectedColor];
            }
            return false;
        }
    }
    return compareHierarchy[oldRanking.selectedRanking] > compareHierarchy[newRanking.selectedRanking];
}

let compareHierarchy: { [key: string]: number } = {
    'royal': 9,
    'flush': 8,
    'four': 7,
    'full': 6,
    'street': 5,
    'color': 4,
    'double': 3,
    'three': 2,
    'pair': 1,
    'one': 0,
};

let colorHierarchy: { [key: string]: number } = {
    'spade': 4,
    'heart': 3,
    'club': 2,
    'diamond': 1,
};
