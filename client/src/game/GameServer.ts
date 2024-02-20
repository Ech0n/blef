import type { IChecker } from './HandRankings';
import { Game } from './Game';
import { CardColor, type Card, Rank } from '../model/Card';
import { checkFunctionsMap } from './HandRankings';
import { Player } from '../../../common/player';
import type {
    checkToServerPayload,
    checkToPlayersPayload,
    gameStartPayload,
} from '../../../common/payloads';

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
    hands: Map<string, Card[]>;
    deck: Card[];
    isFinished: boolean = false;

    constructor(
        players: Player[],
        gameStartData: gameStartPayload,
        thisPlayerId: string
    ) {
        super(players, gameStartData, thisPlayerId);
        this.hands = new Map(Object.entries(gameStartData.newHands));
        this.deck = deck.slice();
    }

    checkAndDeal(): void {
        this.dealCards();
        this.nextPlayer();
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
        console.log('drawn cards ', drawnCards);
        return drawnCards;
    }

    shuffleDeck(): void {
        this.deck = deck.slice();
    }

    dealCards(): void {
        // let totalCardsToDraw = this.players.reduce(
        //     (prev: number, player: Player) => player.loses + 1 + prev,
        //     0
        // );

        // if (totalCardsToDraw > this.deck.length) {
        //     if (this.rejectedCards.length < totalCardsToDraw) {
        //         throw 'Now enough cards to draw from';
        //     }
        //     this.shuffleDeck();
        // }
        this.shuffleDeck();
        this.hands = new Map<string, Card[]>();
        this.players.forEach((player: Player) => {
            this.hands.set(player.uid, this.drawCards(1 + player.loses));
        });
    }

    check(data?: checkToPlayersPayload): void {
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
            let hands = this.hands.get(player);
            if (hands) {
                hands.forEach((card: Card) => {
                    countedCards[card[0]][card[1]]++;
                    countedCards[card[0]][CardColor.colorless]++;
                });
            }
        }
        //end of cards counting-------

        console.log(this.previousBet);
        let wasBetFound = checkFunctionsMap[this.previousBet.selectedRanking](
            countedCards,
            this.previousBet
        );
        if (!wasBetFound) {
            const prevPlayer =
                (this.currentPlayerIndx - 1 + this.playerCount) %
                this.playerCount;
            this.currentPlayerIndx = prevPlayer;
            this.currentPlayer = this.players[this.currentPlayerIndx].uid;
        }
        this.players[this.currentPlayerIndx].loses += 1;
        if (this.players[this.currentPlayerIndx].loses == 4) {
            this.eliminatedPlayers.push(this.players[this.currentPlayerIndx]);
            this.players.slice(this.currentPlayerIndx, 1);
            this.playerCount -= 1;
            this.currentPlayerIndx -= 1;
            this.currentPlayer = this.players[this.currentPlayerIndx].uid;
        }
    }

    validateCheck(): checkToServerPayload {
        this.check();
        this.dealCards();
        console.log('this hands ', this.hands);
        return {
            newHands: Object.fromEntries(this.hands),
            players: this.players,
        };
    }
}
