import type { Card } from '../model/Card';
import { Player } from '../model/Player';

export class Game {
    playerCount: number;
    players: Player[];
    eliminatedPlayers: Player[];
    currentPlayer: string;
    hand: Card[];
    currentPlayerIndx: number;
    previousBet!: any;

    constructor(players: Player[], startingPlayerId: string) {
        this.playerCount = players.length;
        this.players = structuredClone(players);
        this.hand = [];
        this.currentPlayer = startingPlayerId;
        this.eliminatedPlayers = [];
        this.currentPlayerIndx = this.players.findIndex(
            (el) => startingPlayerId == el.id
        );
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

    check(data: { newHand: Card[]; newCurrentPlayer: string }): void {
        this.hand = data.newHand;
        this.currentPlayer = data.newCurrentPlayer;
    }
}
