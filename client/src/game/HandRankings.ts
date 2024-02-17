export type CardDict = { [key: string]: { [key: string]: number } };

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
    check(cards: CardDict): boolean {
        return false;
    }
}

export class CarrotChecker implements IChecker {
    check(cards: CardDict): boolean {
        for (let key in cards) {
            if (cards[key]['total'] >= 4) {
                return true;
            }
        }
        return false;
    }
}

export class FullChecker implements IChecker {
    check(cards: CardDict): boolean {
        return false;
    }
}

export class StritChecker implements IChecker {
    check(cards: CardDict): boolean {
        return false;
    }
}

export class TripleChecker implements IChecker {
    check(cards: CardDict): boolean {
        return false;
    }
}

export class DoubleChecker implements IChecker {
    check(cards: CardDict): boolean {
        for (let key in cards) {
            if (cards[key]['total'] >= 2) {
                return true;
            }
        }
        return false;
    }
}

export class PairChecker implements IChecker {
    check(cards: CardDict): boolean {
        for (let key in cards) {
            if (cards[key]['total'] >= 2) {
                return true;
            }
        }
        return false;
    }
}

export class OneChecker implements IChecker {
    constructor(cards: CardDict) {}
    check(cards: CardDict): boolean {
        return true;
    }
}

export const bets: Record<string, new (cards: CardDict) => IChecker> = {
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
