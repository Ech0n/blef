import { cardToRankTranslation } from '../model/Card';

interface hitPayload {
    selectedRanking: string;
    primaryCard: string;
    secondaryCard: string;
    selectedColor: string;
    startingCard: string;
}

export function compareRankings(
    oldRanking: hitPayload,
    newRanking: hitPayload
): boolean {
    if (
        compareHierarchy[oldRanking.selectedRanking] <
        compareHierarchy[newRanking.selectedRanking]
    ) {
        return true;
    }
    if (
        compareHierarchy[oldRanking.selectedRanking] ==
        compareHierarchy[newRanking.selectedRanking]
    ) {
        console.debug(
            'ranks are equal, checking cards ',
            oldRanking,
            newRanking
        );
        if (['One', 'Pair', 'Three'].includes(oldRanking.selectedRanking)) {
            console.debug('rank is one');
            return (
                cardToRankTranslation[oldRanking.primaryCard].numeric <
                cardToRankTranslation[newRanking.primaryCard].numeric
            );
        }
        if (['Double', 'Full'].includes(oldRanking.selectedRanking)) {
            if (
                cardToRankTranslation[oldRanking.primaryCard].numeric ==
                cardToRankTranslation[newRanking.primaryCard].numeric
            ) {
                return (
                    cardToRankTranslation[oldRanking.secondaryCard].numeric <
                    cardToRankTranslation[newRanking.secondaryCard].numeric
                );
            }
            return (
                cardToRankTranslation[oldRanking.primaryCard].numeric <
                cardToRankTranslation[newRanking.primaryCard].numeric
            );
        }
        if (['Color'].includes(oldRanking.selectedRanking)) {
            return (
                colorHierarchy[oldRanking.selectedColor] <
                colorHierarchy[newRanking.selectedColor]
            );
        }
        if (['Street'].includes(oldRanking.selectedRanking)) {
            return (
                cardToRankTranslation[oldRanking.startingCard].numeric <
                cardToRankTranslation[newRanking.startingCard].numeric
            );
        }
    }
    return false;
}

let compareHierarchy: { [key: string]: number } = {
    'Royal': 9,
    'Flush': 8,
    'Four': 7,
    'Full': 6,
    'Street': 5,
    'Color': 4,
    'Three': 3,
    'Double': 2,
    'Pair': 1,
    'One': 0,
};

let colorHierarchy: { [key: string]: number } = {
    'Spades': 4,
    'Hearts': 3,
    'Diamonds': 2,
    'Clubs': 1,
};
