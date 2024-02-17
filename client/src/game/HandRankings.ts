export type CardList = { [key: string]: { [key: string]: number } };

//TODO: Change interface to also accept a cards that are supposed to appear
//TODO: Implement Checkers

export interface IChecker {
    check(cards: CardList): boolean;
}

export class RoyalFlushChecker implements IChecker {
    check(cards: CardList) {
        return true;
    }
}

export class FlushChecker implements IChecker {
    check(cards: CardList): boolean {
        return false;
    }
}

export class CarrotChecker implements IChecker {
    check(cards: CardList): boolean {
        for (let key in cards) {
            if (cards[key]['total'] >= 4) {
                return true;
            }
        }
        return false;
    }
}

export class FullChecker implements IChecker {
    check(cards: CardList): boolean {
        return false;
    }
}

export class StritChecker implements IChecker {
    check(cards: CardList): boolean {
        return false;
    }
}

export class TripleChecker implements IChecker {
    check(cards: CardList): boolean {
        return false;
    }
}

export class DoubleChecker implements IChecker {
    check(cards: CardList): boolean {
        for (let key in cards) {
            if (cards[key]['total'] >= 2) {
                return true;
            }
        }
        return false;
    }
}

export class PairChecker implements IChecker {
    check(cards: CardList): boolean {
        for (let key in cards) {
            if (cards[key]['total'] >= 2) {
                return true;
            }
        }
        return false;
    }
}

export class OneChecker implements IChecker {
    constructor(cards: CardList) {}
    check(cards: CardList): boolean {
        return true;
    }
}

export const bets: Record<string, new (cards: CardList) => IChecker> = {
    'royal': RoyalFlushChecker,
    'flush': FlushChecker,
    'carrot': CarrotChecker,
    'full': FullChecker,
    'strit': StritChecker,
    'triple': TripleChecker,
    'double': DoubleChecker,
    'pair': PairChecker,
    'one': OneChecker,
};
