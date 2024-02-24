import { cardToRankTranslation, type CardCountTable, ColorToIndex } from '../model/Card';

export interface IChecker {
    check(cards: CardCountTable): boolean;
}

export interface HandInfo {
    selectedRanking: string;
    primaryCard: string;
    secondaryCard: string;
    selectedColor: string;
    startingCard: string;
}

function royalFlushChecker(cards: CardCountTable, handInfo: HandInfo) {
    console.log('cardDict: ', cards, 'handInfo:', handInfo);

    const selectedColor = handInfo.selectedColor;
    let startingCard: number = cardToRankTranslation['10'].numeric;
    console.log(startingCard);
    for (let i = 0; i < 5; i++) {
        if (cards[startingCard + i][ColorToIndex[selectedColor]] == 0) {
            return false;
        }
    }
    return true;
}

function flushChecker(cards: CardCountTable, handInfo: HandInfo) {
    const selectedColor = handInfo.selectedColor;
    let startingCard = cardToRankTranslation[handInfo.startingCard].numeric;

    for (let i = 0; i < 5; i++) {
        if (cards[startingCard + i][ColorToIndex[selectedColor]] == 0) {
            return false;
        }
    }
    return true;
}

function colorChecker(cards: CardCountTable, handInfo: HandInfo): boolean {
    const selectedColor = handInfo.selectedColor;
    let count: number = 0;
    let cardRanks: string[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'j', 'q', 'k', 'a'];

    for (let i = 0; i < cardRanks.length; i++) {
        let rankValue: number = cardToRankTranslation[cardRanks[i]].numeric;
        count += cards[rankValue][ColorToIndex[selectedColor]];
    }

    return count >= 5;
}

function fourChecker(cards: CardCountTable, handInfo: HandInfo) {
    let primCard: number = cardToRankTranslation[handInfo.primaryCard].numeric;

    if (!cards[primCard]) {
        return false;
    }

    let count: number = 0;
    for (let colorIndex: number = 1; colorIndex <= 4; colorIndex++) {
        count += cards[primCard][colorIndex];
    }

    return count == 4;
}

function fullChecker(cards: CardCountTable, handInfo: HandInfo) {
    let primCard: number = cardToRankTranslation[handInfo.primaryCard].numeric;

    if (!cards[primCard]) {
        return false;
    }

    let secCard: number = cardToRankTranslation[handInfo.secondaryCard].numeric;

    if (!cards[secCard]) {
        return false;
    }

    let count: number[] = [0, 0];
    for (let cardIndex of [primCard, secCard]) {
        for (let colorIndex: number = 1; colorIndex <= 4; colorIndex++) {
            let currentCard = cardIndex === primCard ? 0 : 1;
            count[currentCard] += cards[cardIndex][colorIndex];
        }
    }

    return count[0] >= 3 && count[1] >= 2;
}

function streetChecker(cards: CardCountTable, handInfo: HandInfo) {
    let startingCard = cardToRankTranslation[handInfo.startingCard].numeric;
    let count: number = 0;

    for (let i = 0; i < 5; i++) {
        if (!cards[startingCard + i]) {
            return false;
        }

        for (let colorIndex: number = 1; colorIndex <= 4; colorIndex++) {
            if (cards[startingCard + i][colorIndex] == 1) {
                count++;
                break;
            }
        }
    }
    return count == 5;
}

function threeChecker(cards: CardCountTable, handInfo: HandInfo) {
    let primCard: number = cardToRankTranslation[handInfo.primaryCard].numeric;

    if (!cards[primCard]) {
        return false;
    }

    let count: number = 0;
    for (let colorIndex: number = 1; colorIndex <= 4; colorIndex++) {
        count += cards[primCard][colorIndex];
    }

    return count >= 3;
}

function doubleChecker(cards: CardCountTable, handInfo: HandInfo) {
    let primCard: number = cardToRankTranslation[handInfo.primaryCard].numeric;

    if (!cards[primCard]) {
        return false;
    }

    let secCard: number = cardToRankTranslation[handInfo.secondaryCard].numeric;

    if (!cards[secCard]) {
        return false;
    }

    let count: number[] = [0, 0];
    for (let cardIndex of [primCard, secCard]) {
        for (let colorIndex: number = 1; colorIndex <= 4; colorIndex++) {
            let currentCard = cardIndex === primCard ? 0 : 1;
            count[currentCard] += cards[cardIndex][colorIndex];
        }
    }

    return count[0] >= 2 && count[1] >= 2;
}

function pairChecker(cards: CardCountTable, handInfo: HandInfo) {
    let primCard: number = cardToRankTranslation[handInfo.primaryCard].numeric;

    if (!cards[primCard]) {
        return false;
    }

    let count: number = 0;
    for (let colorIndex: number = 1; colorIndex <= 4; colorIndex++) {
        count += cards[primCard][colorIndex];
    }

    return count >= 2;
}

function oneChecker(cards: CardCountTable, handInfo: HandInfo) {
    let primCard: number = cardToRankTranslation[handInfo.primaryCard].numeric;

    if (!cards[primCard]) {
        return false;
    }

    let count: number = 0;
    for (let colorIndex: number = 1; colorIndex <= 4; colorIndex++) {
        count += cards[primCard][colorIndex];
    }

    return count >= 1;
}

export const checkFunctionsMap: Record<string, (cards: CardCountTable, handInfo: HandInfo) => boolean> = {
    'royal': royalFlushChecker,
    'flush': flushChecker,
    'color': colorChecker,
    'four': fourChecker,
    'full': fullChecker,
    'street': streetChecker,
    'three': threeChecker,
    'double': doubleChecker,
    'pair': pairChecker,
    'one': oneChecker,
};
