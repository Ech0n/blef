import type { gameStartPayload } from '../../../common/payloads';
import type { IPlayer } from '../../../common/player';

export type Card = [string, string];
export type CardCountTable = { [cardKey: number]: { [colorKey: number]: number } };

export function initalizeCountTable(): CardCountTable {
    // let table = new Map<Number, Map<Number, Number>>();
    let table: { [key: number]: { [key: number]: number } } = {};

    const colorTable: { [key: number]: number } = {};
    for (let colorIndex in ColorToIndex) {
        colorTable[ColorToIndex[colorIndex]] = 0;
    }

    for (let _colorIndex in ColorToIndex) {
        for (let cardString in cardToRankTranslation) {
            table[cardToRankTranslation[cardString].numeric] = {
                ...colorTable,
            };
        }
    }

    return table;
}

export enum CardColor {
    spade,
    heart,
    diamond,
    club,
}

export let ColorToIndex: { [key: string]: number } = {
    'spade': 4,
    'heart': 3,
    'club': 2,
    'diamond': 1,
};

export enum Rank {
    ace,
    king,
    queen,
    jack,
    ten,
    nine,
    eight,
    seven,
    six,
    five,
    four,
    three,
    two,
}

export const cardToRankTranslation: { [key: string]: { numeric: number | Rank; string: string } } = {
    '2': { numeric: 2, string: 'two' },
    '3': { numeric: 3, string: 'three' },
    '4': { numeric: 4, string: 'four' },
    '5': { numeric: 5, string: 'five' },
    '6': { numeric: 6, string: 'six' },
    '7': { numeric: 7, string: 'seven' },
    '8': { numeric: 8, string: 'eight' },
    '9': { numeric: 9, string: 'nine' },
    '10': { numeric: 10, string: 'ten' },
    'j': { numeric: 11, string: 'jack' },
    'q': { numeric: 12, string: 'queen' },
    'k': { numeric: 13, string: 'king' },
    'a': { numeric: 14, string: 'ace' },
};

export const fullCardNameToNumeric: { [key: string]: { numeric: number } } = {
    'two': { numeric: 2 },
    'three': { numeric: 3 },
    'four': { numeric: 4 },
    'five': { numeric: 5 },
    'six': { numeric: 6 },
    'seven': { numeric: 7 },
    'eight': { numeric: 8 },
    'nine': { numeric: 9 },
    'ten': { numeric: 10 },
    'jack': { numeric: 11 },
    'queen': { numeric: 12 },
    'king': { numeric: 13 },
    'ace': { numeric: 14 },
};

export function initalizeGame(players: IPlayer[]): { cardCounts: CardCountTable; payload: gameStartPayload } {
    let cardCounts = initalizeCountTable();

    let initialGameData: gameStartPayload;
    let startingPlayerId = players[0].uid;

    let deckInitialization: Card[] = [];

    for (let card in Rank) {
        if (isNaN(Number(card))) {
            for (let color in CardColor) {
                if (isNaN(Number(color))) {
                    deckInitialization.push([card, color]);
                }
            }
        }
    }

    let hands: { [key: string]: Card[] } = {};

    players.map((player) => {
        let randomIndex: number = Math.floor(Math.random() * deckInitialization.length);
        let randomCard = deckInitialization.splice(randomIndex, 1);
        cardCounts[fullCardNameToNumeric[randomCard[0][0]].numeric][ColorToIndex[randomCard[0][1]]] += 1;
        hands[player.uid] = randomCard;
    });

    initialGameData = { newHands: hands, startingPlayerId: startingPlayerId };
    return { cardCounts: cardCounts, payload: initialGameData };
}

export function cardCountTableToIterableArray(cardCountTable: CardCountTable): Array<[number, Array<[number, number]>]> {
    const iterableArray: Array<[number, Array<[number, number]>]> = [];

    for (const [cardKey, colorCounts] of Object.entries(cardCountTable)) {
        const cardNum = parseInt(cardKey, 10);
        const colorsArray: Array<[number, number]> = [];

        for (const [colorKey, count] of Object.entries(colorCounts)) {
            const colorNum = parseInt(colorKey, 10);
            colorsArray.push([colorNum, count]);
        }

        iterableArray.push([cardNum, colorsArray]);
    }

    return iterableArray;
}
