import { cardToRankTranslation } from '../model/Card';

interface hitPayload {
    selectedRanking: string;
    primaryCard: string;
    secondaryCard: string;
    selectedColor: string;
    startingCard: string;
}

function compareRankings(
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
        if (oldRanking.selectedRanking in ['One', 'Pair', 'Three']) {
            return (
                cardToRankTranslation[oldRanking.primaryCard] <
                cardToRankTranslation[newRanking.primaryCard]
            );
        }
        if (oldRanking.selectedRanking in ['Double', 'Full']) {
            if (
                cardToRankTranslation[oldRanking.primaryCard] ==
                cardToRankTranslation[newRanking.primaryCard]
            ) {
                return (
                    cardToRankTranslation[oldRanking.secondaryCard] <
                    cardToRankTranslation[newRanking.secondaryCard]
                );
            }
            return (
                cardToRankTranslation[oldRanking.primaryCard] <
                cardToRankTranslation[newRanking.primaryCard]
            );
        }
        if (oldRanking.selectedRanking in ['Color']) {
            return (
                colorHierarchy[oldRanking.selectedColor] <
                colorHierarchy[newRanking.selectedColor]
            );
        }
        if (oldRanking.selectedRanking in ['Street']) {
            return (
                cardToRankTranslation[oldRanking.startingCard] <
                cardToRankTranslation[newRanking.startingCard]
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
