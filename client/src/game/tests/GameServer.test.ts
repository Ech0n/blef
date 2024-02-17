const { GameServer } = require('../GameServer');
import type { CardList, IChecker } from '../HandRankings';
const { bets } = require('../HandRankings');
import type * as Types from '../HandRankings';

let gs: typeof GameServer;

let playerList = [
    { socketId: 'user1' },
    { socketId: 'user2' },
    { socketId: 'user3' },
];

class MockBetTrue implements IChecker {
    check(cards: CardList): boolean {
        return true;
    }
}
class MockBetFalse implements IChecker {
    check(cards: CardList): boolean {
        return false;
    }
}

beforeEach(() => {
    gs = new GameServer(playerList);
    return gs;
});

test('draw five cards and than even more cards (total of 13 cards)', () => {
    let drawnCards: Array<Array<String>> = gs.drawCards(5);
    expect(drawnCards.length).toBe(5);

    drawnCards = gs.drawCards(5);
    expect(drawnCards.length).toBe(5);

    drawnCards = gs.drawCards(3);
    expect(drawnCards.length).toBe(3);

    expect(gs.deck.length).toBe(52 - 13);
});

test('draw five cards and than even more cards (total of 9 cards)', () => {
    let drawnCards: Array<Array<String>> = gs.drawCards(5);
    expect(drawnCards.length).toBe(5);

    drawnCards = gs.drawCards(4);
    expect(drawnCards.length).toBe(4);

    expect(gs.deck.length).toBe(52 - 9);
});

test('draw six cards (which is not allowed)', () => {
    expect(() => gs.drawCards(6)).toThrow(
        'Drawing more than 5 cards is not a possibility'
    );
});

test('does deck shuffle', () => {
    let drawnCards: Array<Array<String>>;
    for (let i = 5; i <= 50; i += 5) {
        drawnCards = gs.drawCards(5);
        expect(drawnCards.length).toBe(5);
        gs.rejectedCards = [...gs.rejectedCards, ...drawnCards];
    }
    expect(gs.deck.length).toBe(2);
    drawnCards = gs.drawCards(2);
    gs.rejectedCards = [...gs.rejectedCards, ...drawnCards];
    gs.previousBet = new MockBetFalse();

    gs.check();
    gs.collectCards();
    gs.dealCards();
    expect(gs.deck.length).toBe(48);
});

test('Player checks and wins', () => {
    gs.dealCards();
    gs.hit(new MockBetTrue()); //p1
    gs.hit(new MockBetTrue()); //p2
    gs.hit(new MockBetTrue()); //p3
    gs.hit(new MockBetTrue()); //p1
    gs.hit(new MockBetTrue()); //p2
    gs.hit(new MockBetTrue()); //p3
    gs.check(); //p1

    expect(gs.players[0].loses).toBe(1);
});
