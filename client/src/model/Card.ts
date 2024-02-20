import type { gameStartPayload } from '../../../common/payloads';
import type { IPlayer } from '../../../common/player';

export type Card = [string, string];
export type CardList = Card[];
export type CardCountTable = { [key: number]: { [key: string]: number } };

export function initalizeCountTable(): CardCountTable {
    // let table = new Map<Number, Map<Number, Number>>();
    let table: { [key: number]: { [key: number]: number } } = {};

    const colorTable: { [key: string]: number } = {};
    for (let item in CardColor) {
        if (isNaN(Number(item))) {
            colorTable[CardColor[item]] = 0;
        }
    }
    for (let color in CardColor)
        for (let cardString in cardToRankTranslation) {
            table[cardToRankTranslation[cardString].numeric] = {
                ...colorTable,
            };
        }
    return table;
}
export enum CardColor {
    spade,
    heart,
    diamond,
    club,
    colorless,
}
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
export const cardToRankTranslation: {
    [key: string]: { numeric: number | Rank; string: string };
} = {
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
    'two': { numeric: 2, string: 'two' },
    'three': { numeric: 3, string: 'three' },
    'four': { numeric: 4, string: 'four' },
    'five': { numeric: 5, string: 'five' },
    'six': { numeric: 6, string: 'six' },
    'seven': { numeric: 7, string: 'seven' },
    'eight': { numeric: 8, string: 'eight' },
    'nine': { numeric: 9, string: 'nine' },
    'ten': { numeric: 10, string: 'ten' },
    'jack': { numeric: 11, string: 'jack' },
    'queen': { numeric: 12, string: 'queen' },
    'king': { numeric: 13, string: 'king' },
    'ace': { numeric: 14, string: 'ace' },
};

export function initalizeGame(players: IPlayer[]): gameStartPayload {
    //select random player to start
    let initialGameData: gameStartPayload;
    let startingPlayerId = players[0].uid;

    let deckInitialization: Card[] = [];

    for (let card in Rank) {
        if (isNaN(Number(card))) {
            for (let color in CardColor) {
                if (
                    isNaN(Number(color)) &&
                    color != CardColor[CardColor.colorless]
                ) {
                    deckInitialization.push([card, color]);
                }
            }
        }
    }

    let hands: { [key: string]: Card[] } = {};

    players.map((player) => {
        let randomIndex: number = Math.floor(
            Math.random() * deckInitialization.length
        );
        let randomCard = deckInitialization.splice(randomIndex, 1);
        hands[player.uid] = randomCard;
    });

    initialGameData = { newHands: hands, startingPlayerId: startingPlayerId };
    return initialGameData;
}
