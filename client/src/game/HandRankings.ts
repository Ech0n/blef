import { cardToRankTranslation, type CardCountTable, ColorToIndex } from '../model/Card';

//TODO: Change this into somekind of predefined structure that can be easily initalized. Reconsider if this is even a correct way to count of carts
export type CardDict = any; // Hell nah, I'm not using CardCountable 

//TODO: Implement Checkers

export interface IChecker {
    check(cards: CardDict): boolean;
}

export interface HandInfo {
    selectedRanking: string;
    primaryCard: string;
    secondaryCard: string;
    selectedColor: string;
    startingCard: string;
}

function royalFlushChecker(cards: CardDict, handInfo: HandInfo) {
    const selectedColor = handInfo.selectedColor;
    let startingCard = cardToRankTranslation["10"].numeric;
    
    for (let i = 0; i < 5; i++) {
        if (cards[startingCard - i][ColorToIndex[selectedColor]] == 0) {
            return false;
        }
    }
    return true;
}

function flushChecker(cards: CardDict, handInfo: HandInfo) {
    const selectedColor = handInfo.selectedColor;
    let startingCard = cardToRankTranslation[handInfo.startingCard].numeric;
    
    for (let i = 0; i < 5; i++) {
        if (cards[startingCard - i][ColorToIndex[selectedColor]] == 0) {
            return false;
        }
    }
    return true;
}

function colorChecker(cards: CardDict, handInfo: HandInfo): boolean {
    const selectedColor = handInfo.selectedColor;
    let count: number = 0;
    let cardRanks: string[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'j', 'q', 'k', 'a'];

    for (let i = 0; i < cardRanks.length; i++) {
        let rankValue: number = cardToRankTranslation[cardRanks[i]].numeric;
        count += cards[rankValue][ColorToIndex[selectedColor]];

        if (count >= 5) {
            return true;
        }
    }
    return false;
}

function fourChecker(cards: CardDict, handInfo: HandInfo) {
    let primCard: number = cardToRankTranslation[handInfo.primaryCard].numeric;

    if (!cards[primCard]) {
        return false;
    }
    return cards[primCard][ColorToIndex['colorless']] >= 4;
}

function fullChecker(cards: CardDict, handInfo: HandInfo) {
    let primCard: number = cardToRankTranslation[handInfo.primaryCard].numeric;

    if (!cards[primCard]) {
        return false;
    }

    let secCard: number = cardToRankTranslation[handInfo.primaryCard].numeric;

    if (!cards[secCard]) {
        return false;
    }

    return (cards[primCard][ColorToIndex['colorless']] >= 3 && cards[secCard][ColorToIndex['colorless']] >= 2);
}

function streetChecker(cards: CardDict, handInfo: HandInfo) {
    let startingCard = cardToRankTranslation[handInfo.startingCard].numeric;
    for (let i = 0; i < 5; i++) {
        if (!cards[startingCard - i]) {
            return false;
        }
        if (cards[startingCard - i][ColorToIndex['colorless']] == 0) {
            return false;
        }
    }
    return true;
}

function threeChecker(cards: CardDict, handInfo: HandInfo) {
    let primCard: number = cardToRankTranslation[handInfo.primaryCard].numeric;

    if (!cards[primCard]) {
        return false;
    }
    return cards[primCard][ColorToIndex['colorless']] >= 3;
}

function doubleChecker(cards: CardDict, handInfo: HandInfo) {
    let primCard: number = cardToRankTranslation[handInfo.primaryCard].numeric;

    if (!cards[primCard]) {
        return false;
    }
    let secCard: number = cardToRankTranslation[handInfo.primaryCard].numeric;

    if (!cards[secCard]) {
        return false;
    }
    return (
        cards[primCard][ColorToIndex['colorless']] >= 2 &&
        cards[secCard][ColorToIndex['colorless']] >= 2
    );
}

function pairChecker(cards: CardCountTable, handInfo: HandInfo) {
    let primCard: number = cardToRankTranslation[handInfo.primaryCard].numeric;
    if (!cards[primCard]) {
        return false;
    }
    return cards[primCard][ColorToIndex['colorless']] >= 2;
}

function oneChecker(cards: CardCountTable, handInfo: HandInfo) {
    console.log('handInfo', handInfo);
    let primCard: number = cardToRankTranslation[handInfo.primaryCard].numeric;

    if (!cards[primCard]) {
        return false;
    }
    return cards[primCard][ColorToIndex['colorless']] >= 1;
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
