import {
    CardColor,
    Rank,
    cardToRankTranslation,
    type CardCountTable,
    initalizeCountTable,
} from '../model/Card';

//TODO: Change this into somekind of predefined structure that can be easily initalized. Reconsider if this is even a correct way to count of carts
type ColorDict = any;
export type CardDict = any;

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
    return true;
}

function flushChecker(cards: CardDict, handInfo: HandInfo) {
    return true;
}

function colorChecker(cards: CardDict, handInfo: HandInfo) {
    // TODO:
    return true;
}

function fourChecker(cards: CardDict, handInfo: HandInfo) {
    let primCard: number = cardToRankTranslation[handInfo.primaryCard].numeric;

    if (!cards[primCard]) {
        return false;
    }
    return cards[primCard][CardColor.colorless] >= 4;
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
    return (
        cards[primCard][CardColor.colorless] >= 3 &&
        cards[secCard][CardColor.colorless] >= 2
    );
}
function streetChecker(cards: CardDict, handInfo: HandInfo) {
    let startingCard = cardToRankTranslation[handInfo.startingCard].numeric;
    for (let i = 0; i < 5; i++) {
        if (!cards[startingCard - i]) {
            return false;
        }
        if (cards[startingCard - i][CardColor.colorless] == 0) {
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
    return cards[primCard][CardColor.colorless] >= 3;
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
        cards[primCard][CardColor.colorless] >= 2 &&
        cards[secCard][CardColor.colorless] >= 2
    );
}

function pairChecker(cards: CardCountTable, handInfo: HandInfo) {
    let primCard: number = cardToRankTranslation[handInfo.primaryCard].numeric;
    if (!cards[primCard]) {
        return false;
    }
    return cards[primCard][CardColor.colorless] >= 2;
}

function oneChecker(cards: CardCountTable, handInfo: HandInfo) {
    console.log('handInfo', handInfo);
    let primCard: number = cardToRankTranslation[handInfo.primaryCard].numeric;

    if (!cards[primCard]) {
        return false;
    }
    return cards[primCard][CardColor.colorless] >= 1;
}

export const checkFunctionsMap: Record<
    string,
    (cards: CardCountTable, handInfo: HandInfo) => boolean
> = {
    'Royal': royalFlushChecker,
    'Flush': flushChecker,
    'Color': colorChecker,
    'Four': fourChecker,
    'Full': fullChecker,
    'Street': streetChecker,
    'Three': threeChecker,
    'Double': doubleChecker,
    'Pair': pairChecker,
    'One': oneChecker,
};
