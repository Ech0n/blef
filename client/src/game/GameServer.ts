import type { IChecker } from './HandRankings';
import { Game } from './Game';
import { Player } from '../model/Player';
import { CardColor, type Card, Rank } from '../model/Card';
import { checkFunctionsMap } from './HandRankings';

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
export const deck: Card[] = deckInitialization;

export class GameServer extends Game {
    hands: { [playerId: string]: Card[] };
    deck: Card[];
    rejectedCards: Card[];
    previousBet!: any;
    isFinished: boolean = false;
    currentPlayerIndx: number;

    constructor(players: Player[], startingPlayerId: string) {
        super(players, startingPlayerId);
        this.hands = {};
        this.deck = deck.slice();
        this.rejectedCards = [];
        this.currentPlayerIndx = this.players.findIndex(
            (el) => startingPlayerId == el.id
        );
    }

    checkAndDeal(): void {
        this.check();
        this.collectCards();
        this.dealCards();
        this.nextPlayer();
    }

    hit(bet: any): void {
        //TODO: consider validation if bet is possible?
        this.previousBet = bet;
        this.nextPlayer();
    }

    nextPlayer(): void {
        this.currentPlayerIndx =
            (this.currentPlayerIndx + 1) % this.playerCount;
        this.currentPlayer = this.players[this.currentPlayerIndx].id;
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
        let countedCards: any = {};

        //TODO: Extract card list initalization to function and use it to initalize this.betDetails
        for (const card in Rank) {
            countedCards[card] = {};
            countedCards[card][CardColor.colorless] = 0;
            for (const color in CardColor) {
                countedCards[card][color] = 0;
            }
        }

        for (const player in this.hands) {
            this.hands[player].forEach((card: Card) => {
                countedCards[card[0]][card[1]]++;
                countedCards[card[0]][CardColor.colorless]++;
            });
        }
        //end of cards counting-------

        console.log(this.previousBet);
        let wasBetFound = checkFunctionsMap[this.previousBet.selectedRanking](
            countedCards,
            this.previousBet
        );
        if (wasBetFound) {
            this.players[this.currentPlayerIndx].loses += 1;
            if (this.players[this.currentPlayerIndx].loses == 4) {
                this.eliminatedPlayers.push(
                    this.players[this.currentPlayerIndx]
                );
                this.players.slice(this.currentPlayerIndx, 1);
                this.playerCount -= 1;
            }
        } else {
            const prevPlayer =
                (this.currentPlayerIndx - 1 + this.playerCount) %
                this.playerCount;
            this.players[prevPlayer].loses += 1;
        }
    }

    collectCards(): void {
        for (const player in this.hands) {
            this.rejectedCards = [...this.rejectedCards, ...this.hands[player]];
            this.hands[player] = [];
        }
    }
}
