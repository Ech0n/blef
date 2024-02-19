const { GameServer } = require('../GameServer');
import { Player } from '../../model/Player';
import type { CardDict, IChecker } from '../HandRankings';
const { bets } = require('../HandRankings');
import type * as Types from '../HandRankings';

let gs: typeof GameServer;

let playerList: Player[] = [
    new Player('0', 'user1'),
    new Player('1', 'user2'),
    new Player('2', 'user3'),
];

class MockBetTrue implements IChecker {
    check(cards: CardDict): boolean {
        return true;
    }
}
class MockBetFalse implements IChecker {
    check(cards: CardDict): boolean {
        return false;
    }
}

beforeEach(() => {
    gs = new GameServer(playerList, '0');
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

test('check', () => {
    gs.dealCards();
    gs.hit(new MockBetTrue()); //p1
    gs.check(); //p2
    expect(gs.players[1].loses).toBe(1);
    gs.hit(new MockBetFalse());
    gs.check();

    //TODO: Verify if this is actually correct (i guessed)
    expect(gs.players[1].loses).toBe(2);
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

test('Player checks and loses', () => {
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

test('Player 1 loses whole game', () => {
    gs.dealCards();
    gs.hit(new MockBetTrue()); //p1
    gs.hit(new MockBetTrue()); //p2
    gs.hit(new MockBetTrue()); //p3
    gs.checkAndDeal(); //p1
    gs.hit(new MockBetTrue()); //p2
    gs.hit(new MockBetTrue()); //p3
    gs.checkAndDeal(); //p1
    gs.hit(new MockBetTrue()); //p2
    gs.hit(new MockBetTrue()); //p3
    gs.checkAndDeal(); //p1
    gs.hit(new MockBetTrue()); //p2
    gs.hit(new MockBetTrue()); //p3
    gs.checkAndDeal(); //p1
    gs.hit(new MockBetTrue()); //p2
    gs.hit(new MockBetTrue()); //p3
    gs.checkAndDeal(); //p1
    expect(gs.lostPlayers.length).toEqual(1);
    expect(gs.lostPlayers[0]).toEqual(
        expect.objectContaining({
            name: 'user1',
        })
    );
});
