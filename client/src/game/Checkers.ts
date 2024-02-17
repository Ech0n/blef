export type CardList = { [key: string]: { [key: string]: number } };

//TODO: Change interface to also accept a cards that are supposed to appear
//TODO: Implement Checkers

interface IChecker {
    (cards: CardList, betDetails: CardList): boolean;
}

const RoyalFlushChecker: IChecker = (cards: CardList) => {
    return true;
};

const FlushChecker: IChecker = (cards: CardList) => {
    return false;
};

const CarrotChecker: IChecker = (cards: CardList) => {
    for (let key in cards) {
        if (cards[key]['total'] >= 4) {
            return true;
        }
    }

    return false;
};

const FullChecker: IChecker = (cards: CardList) => {
    return false;
};

const StritChecker: IChecker = (cards: CardList) => {
    return false;
};

const TripleChecker: IChecker = (cards: CardList) => {
    return false;
};

const DoubleChecker: IChecker = (cards: CardList) => {
    for (let key in cards) {
        if (cards[key]['total'] >= 2) {
            return true;
        }
    }

    return false;
};

const PairChecker: IChecker = (cards: CardList) => {
    for (let key in cards) {
        if (cards[key]['total'] >= 2) {
            return true;
        }
    }

    return false;
};

const OneChecker: IChecker = (cards: CardList) => {
    return true;
};

export const bets: Record<string, IChecker> = {
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
