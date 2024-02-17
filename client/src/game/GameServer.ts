import type { CardList, IChecker } from './HandRankings';
const { bets } = require('./HandRankings');
import type * as Types from './HandRankings';

const colors: string[] = ['spade', 'hearts', 'diamonds', 'clubs'];
const cards: string[] = [
    'A',
    'K',
    'Q',
    'J',
    '10',
    '9',
    '8',
    '7',
    '6',
    '5',
    '4',
    '3',
    '2',
];
let deckInitialization: [string, string][] = [];

cards.forEach((card: string) => {
    colors.forEach((color: string) => {
        deckInitialization.push([color, card]);
    });
});

export const deck: [string, string][] = deckInitialization;

export class GameServer {
    playerCount: number;
    players: { socketId: string; loses: number; hands: [string, string][] }[];
    lostPlayers: { socketId: string; loses: number }[] = [];
    cards: { [socketId: string]: [string, string][] };
    currentPlayer: number;
    deck: [string, string][];
    rejectedCards: [string, string][];
    previousBet!: IChecker;
    isFinished: boolean = false;

    constructor(
        players: {
            socketId: string;
            loses: number;
            hands: [string, string][];
        }[]
    ) {
        this.playerCount = players.length;
        this.players = players.map(
            (el: {
                socketId: string;
                loses: number;
                hands: [string, string][];
            }) => {
                el.loses = 0;
                el.hands = [];
                return el;
            }
        );
        this.cards = {};
        //TODO: Randomize starting player?
        this.currentPlayer = 0;
        this.deck = deck.slice();
        this.rejectedCards = [];
    }
    checkAndDeal(): void {
        this.check();
        this.collectCards();
        this.dealCards();
        this.nextPlayer();
    }
    hit(bet: IChecker): void {
        //TODO: consider validation if bet is possible?
        this.previousBet = bet;
        this.nextPlayer();
    }
    nextPlayer(): void {
        this.currentPlayer = (this.currentPlayer + 1) % this.playerCount;
    }
    drawCards(numberOfCards: number): [string, string][] {
        if (numberOfCards > 5) {
            throw 'Drawing more than 5 cards is not a possibility';
        }
        if (numberOfCards > this.deck.length) {
            throw 'Not enough cards in deck to draw cards';
        }
        let drawnCards: [string, string][] = [];
        while (drawnCards.length < numberOfCards) {
            let randomIndex: number = Math.floor(
                Math.random() * this.deck.length
            );
            drawnCards.push(this.deck.splice(randomIndex, 1)[0]);
        }
        return drawnCards;
    }
    shuffleDeck(): void {
        if (this.rejectedCards.length == 0) {
            throw 'Too much cards on players hands';
        }
        this.deck = this.rejectedCards;
        this.rejectedCards = [];
    }
    dealCards(): void {
        let totalCardsToDraw = this.players.reduce(
            (prev: number, player: { socketId: string; loses: number }) =>
                player.loses + 1 + prev,
            0
        );
        if (totalCardsToDraw > this.deck.length) {
            if (this.rejectedCards.length < totalCardsToDraw) {
                throw 'Now enough cards to draw from';
            }
            this.shuffleDeck();
        }
        this.cards = {};
        this.players.forEach((player: { socketId: string; loses: number }) => {
            this.cards[player.socketId] = this.drawCards(1 + player.loses);
        });
    }

    check(): void {
        if (!this.previousBet) {
            throw 'There is no bet';
        }
        //card counting
        let countedCards: CardList = {};

        //TODO: Extract card list initalization to function and use it to initalize this.betDetails
        for (const card of cards) {
            countedCards[card] = {};
            countedCards[card]['total'] = 0;
            for (const color of colors) {
                countedCards[card][color] = 0;
            }
        }

        this.players.forEach(
            (player: { socketId: string; loses: number; hands: any }) => {
                player.hands.forEach((card: any) => {
                    countedCards[card[1][0]++];
                    countedCards[card[1]['total']++];
                });
            }
        );

        let wasBetFound = this.previousBet.check(countedCards);
        if (wasBetFound) {
            this.players[this.currentPlayer].loses += 1;
            if (this.players[this.currentPlayer].loses == 4) {
                this.lostPlayers.push(this.players[this.currentPlayer]);
                this.players.slice(this.currentPlayer, 1);
                this.playerCount -= 1;
            }
        } else {
            const prevPlayer =
                (this.currentPlayer - 1 + this.playerCount) % this.playerCount;
            this.players[prevPlayer].loses += 1;
        }
    }

    collectCards(): void {
        this.players = this.players.map(
            (player: {
                socketId: string;
                loses: number;
                hands: [string, string][];
            }) => {
                this.rejectedCards = [...this.rejectedCards, ...player.hands];
                player.hands = [];
                return player;
            }
        );
    }

    getGameState(): void {
        //TODO: Implement getGameState logic
    }
}
