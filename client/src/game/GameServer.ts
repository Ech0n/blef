import type { CardDict, IChecker } from './HandRankings';
const { bets } = require('./HandRankings');
import type * as Types from './HandRankings';
import { Game } from './Game';
import { Player } from '../model/Player';
import type { Card } from '../model/Card';

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
let deckInitialization: Card[] = [];

cards.forEach((card: string) => {
    colors.forEach((color: string) => {
        deckInitialization.push([card, color]);
    });
});

export const deck: Card[] = deckInitialization;

export class GameServer extends Game {
    hands: { [playerId: string]: Card[] };
    deck: Card[];
    rejectedCards: Card[];
    previousBet!: IChecker;
    isFinished: boolean = false;

    constructor(players: Player[]) {
        super(players);
        this.hands = {};
        //TODO: Randomize starting player?
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
    drawCards(numberOfCards: number): Card[] {
        if (numberOfCards > 5) {
            throw 'Drawing more than 5 cards is not a possibility';
        }
        if (numberOfCards > this.deck.length) {
            throw 'Not enough cards in deck to draw cards';
        }
        let drawnCards: Card[] = [];
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
        this.deck = deck.slice();
        this.rejectedCards = [];
    }
    dealCards(): void {
        let totalCardsToDraw = this.players.reduce(
            (prev: number, player: Player) => player.loses + 1 + prev,
            0
        );
        if (totalCardsToDraw > this.deck.length) {
            if (this.rejectedCards.length < totalCardsToDraw) {
                throw 'Now enough cards to draw from';
            }
            this.shuffleDeck();
        }
        this.hands = {};
        this.players.forEach((player: Player) => {
            this.hands[player.id] = this.drawCards(1 + player.loses);
        });
    }

    check(): void {
        if (!this.previousBet) {
            throw 'There is no bet';
        }
        //card counting
        let countedCards: CardDict = {};

        //TODO: Extract card list initalization to function and use it to initalize this.betDetails
        for (const card of cards) {
            countedCards[card] = {};
            countedCards[card]['total'] = 0;
            for (const color of colors) {
                countedCards[card][color] = 0;
            }
        }

        for (const player in this.hands) {
            this.hands[player].forEach((card: Card) => {
                countedCards[card[0]][card[1]]++;
                countedCards[card[0]]['total']++;
            });
        }

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
        for (const player in this.hands) {
            this.rejectedCards = [...this.rejectedCards, ...this.hands[player]];
            this.hands[player] = [];
        }
    }

    getGameState(): void {
        //TODO: Implement getGameState logic
    }
}
