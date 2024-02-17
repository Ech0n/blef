import { CardColor, Rank } from '../model/Card';

//TODO: Change this into somekind of predefined structure that can be easily initalized. Reconsider if this is even a correct way to count of carts
type ColorDict = any;
export type CardDict = any;

//TODO: Implement Checkers

export interface IChecker {
    check(cards: CardDict): boolean;
}

export class RoyalFlushChecker implements IChecker {
    check(cards: CardDict) {
        return true;
    }
}

export class FlushChecker implements IChecker {
    color: CardColor;
    constructor(_: Rank, __: Rank, color: CardColor) {
        this.color = color;
    }
    check(cards: CardDict): boolean {
        // return cards[this.color]['total'] >= 2;
        return true;
    }
}

export class ColorChecker implements IChecker {
    color: CardColor;
    constructor(_: Rank, __: Rank, color: CardColor) {
        this.color = color;
    }
    check(cards: CardDict): boolean {
        // return cards[this.color]['total'] >= 2;
        return true;
    }
}

export class CarrotChecker implements IChecker {
    card: Rank;
    constructor(card: Rank) {
        this.card = card;
    }
    check(cards: CardDict): boolean {
        return cards[this.card][CardColor.colorless] >= 4;
    }
}

export class FullChecker implements IChecker {
    threeCard: Rank;
    twoCard: Rank;
    constructor(threeCard: Rank, twoCard: Rank) {
        this.threeCard = threeCard;
        this.twoCard = twoCard;
    }
    check(cards: CardDict): boolean {
        return (
            cards[this.threeCard][CardColor.colorless] >= 3 &&
            cards[this.twoCard][CardColor.colorless] >= 2
        );
    }
}

export class StritChecker implements IChecker {
    lowestStritCard: Rank;
    constructor(lowestStritCard: Rank) {
        this.lowestStritCard = lowestStritCard;
    }
    check(cards: CardDict): boolean {
        for (let i = 0; i < 5; i++) {
            if (cards[this.lowestStritCard + i]['total'] == 0) {
                return false;
            }
        }
        return true;
    }
}

export class TripleChecker implements IChecker {
    card: Rank;
    constructor(card: Rank) {
        this.card = card;
    }
    check(cards: CardDict): boolean {
        return cards[this.card]['total'] >= 3;
    }
}

export class DoubleChecker implements IChecker {
    cardA: Rank;
    cardB: Rank;
    constructor(cardA: Rank, cardB: Rank) {
        this.cardA = cardA;
        this.cardB = cardB;
    }
    check(cards: CardDict): boolean {
        return (
            cards[this.cardA]['total'] >= 2 && cards[this.cardB]['total'] >= 2
        );
    }
}

export class PairChecker implements IChecker {
    card: Rank;
    constructor(card: Rank) {
        this.card = card;
    }
    check(cards: CardDict): boolean {
        return cards[this.card]['total'] >= 2;
    }
}

export class OneChecker implements IChecker {
    high: Rank;
    constructor(card: Rank) {
        this.high = card;
    }
    check(cards: CardDict): boolean {
        return cards[this.high]['total'] >= 1;
    }
}

export const bets: Record<
    string,
    new (carda: Rank, cardB: Rank, color: CardColor) => IChecker
> = {
    'royal': RoyalFlushChecker,
    'flush': FlushChecker,
    'carrot': CarrotChecker,
    'full': FullChecker,
    'strit': StritChecker,
    'color': ColorChecker,
    'triple': TripleChecker,
    'double': DoubleChecker,
    'pair': PairChecker,
    'one': OneChecker,
};
