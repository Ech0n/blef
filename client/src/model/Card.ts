export type Card = [string, string];
export type CardList = Card[];
export enum CardColor {
    spade,
    hearts,
    diamonds,
    clubs,
    colorless,
}
export enum Rank {
    Ace,
    King,
    Queen,
    Jupek,
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
    'J': { numeric: 11, string: 'Jupek' },
    'Q': { numeric: 12, string: 'Queen' },
    'K': { numeric: 13, string: 'King' },
    'A': { numeric: 14, string: 'Ace' },
};
