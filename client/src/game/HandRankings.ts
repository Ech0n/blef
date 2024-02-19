import { CardColor, Rank } from '../model/Card';

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
    return cards[handInfo.primaryCard][CardColor.colorless] >= 4;
}

function fullChecker(cards: CardDict, handInfo: HandInfo) {
    return (
        cards[handInfo.primaryCard][CardColor.colorless] >= 3 &&
        cards[handInfo.secondaryCard][CardColor.colorless] >= 2
    );
}
function stritChecker(cards: CardDict, handInfo: HandInfo) {
    let startingCard: Rank = Rank[handInfo.startingCard as keyof typeof Rank];
    for (let i = 0; i < 5; i++) {
        if (cards[startingCard - i][CardColor.colorless] == 0) {
            return false;
        }
    }
    return true;
}
function tripleChecker(cards: CardDict, handInfo: HandInfo) {
    return cards[handInfo.primaryCard][CardColor.colorless] >= 3;
}

function doubleChecker(cards: CardDict, handInfo: HandInfo) {
    return (
        cards[handInfo.primaryCard][CardColor.colorless] >= 2 &&
        cards[handInfo.secondaryCard][CardColor.colorless] >= 2
    );
}

function pairChecker(cards: CardDict, handInfo: HandInfo) {
    return cards[handInfo.primaryCard][CardColor.colorless] >= 2;
}
function oneChecker(cards: CardDict, handInfo: HandInfo) {
    return cards[handInfo.primaryCard][CardColor.colorless] >= 1;
}

export const checkFunctionsMap: Record<
    string,
    (cards: CardDict, handInfo: HandInfo) => boolean
> = {
    'Royal': royalFlushChecker,
    'Flush': flushChecker,
    'Color': colorChecker,
    'Four': fourChecker,
    'Full': fullChecker,
    'Street': stritChecker,
    'Triple': tripleChecker,
    'Double': doubleChecker,
    'Pair': pairChecker,
    'One': oneChecker,
};
