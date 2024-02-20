import type { IChecker } from './HandRankings';
import { Game } from './Game';
import {
    CardColor,
    type Card,
    Rank,
    type CardCountTable,
    cardToRankTranslation,
} from '../model/Card';
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

    drawCards(numberOfCards: number): Card[] {
        // if (numberOfCards > 5) {
        //     throw 'Drawing more than 5 cards is not a possibility';
        // }
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
        let countedCards: CardCountTable = {};

        //TODO: Extract card list initalization to function and use it to initalize this.betDetails
        for (const card in Rank) {
            let translatrion = cardToRankTranslation[Rank[card] as string];
            if (translatrion) {
                let cardToNumber = translatrion.numeric;

                countedCards[cardToNumber] = {};
                countedCards[cardToNumber][CardColor.colorless] = 0;
                for (const color in CardColor) {
                    countedCards[cardToNumber][color] = 0;
                }
            }
        }

        for (const player in this.hands) {
            let hands = this.hands.get(player);
            if (hands) {
                hands.forEach((card: Card) => {
                    let cardToNumber = cardToRankTranslation[card[0]].numeric;
                    countedCards[cardToNumber][card[1]]++;
                    countedCards[cardToNumber][CardColor.colorless]++;
                });
            }
        }
        //end of cards counting-------

        console.log(this.previousBet);
        let wasBetFound = checkFunctionsMap[this.previousBet.selectedRanking](
            countedCards,
            this.previousBet
        );
        //If cards were found than current player is set to previous one
        // next for the current player one lose is added
        if (wasBetFound) {
            const prevPlayer =
                (this.currentPlayerIndx - 1 + this.playerCount) %
                this.playerCount;
            this.currentPlayerIndx = prevPlayer;
            this.currentPlayer = this.players[this.currentPlayerIndx].uid;
        }

        this.players[this.currentPlayerIndx].loses += 1;

        if (this.players[this.currentPlayerIndx].loses == 5) {
            this.eliminatedPlayers.push(this.players[this.currentPlayerIndx]);
            this.players.splice(this.currentPlayerIndx, 1);
            this.playerCount -= 1;
            this.currentPlayerIndx = this.currentPlayerIndx - 1;
            if (this.currentPlayerIndx < 0) {
                this.currentPlayerIndx = this.players.length - 1;
            }
            this.currentPlayer = this.players[this.currentPlayerIndx].uid;
        }

        this.previousBet = undefined;
    }

    validateCheck(): checkToServerPayload {
        this.check();
        this.dealCards();
        console.log('this hands ', this.hands);
        let newHand = this.hands.get(this.thisPlayerId);
        if (!newHand) {
            throw 'Didnt get any new cards !';
        }
        this.hand = newHand;
        let payload = {
            newHands: Object.fromEntries(this.hands),
            players: this.players,
            roundStartingPlayerId: this.currentPlayer,
            eliminatedPlayers: this.eliminatedPlayers,
        };
        console.log('sending payload ', payload);
        return payload;
    }
}
