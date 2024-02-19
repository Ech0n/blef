import type { Card } from '../model/Card';
import { Player } from '../../../common/player';
import type {
    checkToServerPayload,
    checkToPlayersPayload,
} from '../../../common/payloads';

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
            (el) => startingPlayerId == el.uid
        );
    }

    hit(bet: any): void {
        //TODO: consider validation if bet is possible?
        this.previousBet = bet;
        this.nextPlayer();
    }

    nextPlayer(): void {
        this.currentPlayerIndx = (this.currentPlayerIndx + 1) % this.playerCount;
        this.currentPlayer = this.players[this.currentPlayerIndx].uid;
    }

    check(data?: checkToPlayersPayload): void {
        if (!data) {
            return;
        }

        this.hand = data.newHand;
        this.players = data.players;
        this.playerCount = this.players.length;
    }
    validateCheck(): checkToServerPayload | undefined {
        console.warn('CLIENT SHOULDNT CALL HOST ONLY FUNCTIONS!');
        return;
    }
}
