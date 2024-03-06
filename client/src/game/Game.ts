import type { Card } from '../model/Card';
import { Player } from '../../../common/player';
import type { checkToServerPayload, checkToPlayersPayload, gameStartPayload } from '../../../common/payloads';

export class Game {
    playerCount: number;
    players: Player[];
    eliminatedPlayers: Player[];
    currentPlayer: string;
    hand: Card[];
    currentPlayerIndx: number;
    previousBet!: any;
    thisPlayerId: string;
    gameClosed: boolean;

    constructor(players: Player[], gameStartData: gameStartPayload, thisPlayerId: string) {
        this.playerCount = players.length;
        this.players = structuredClone(players);
        this.hand = gameStartData.newHands[thisPlayerId];
        this.currentPlayer = gameStartData.startingPlayerId;
        this.eliminatedPlayers = [];
        this.currentPlayerIndx = this.players.findIndex((el) => gameStartData.startingPlayerId == el.uid);
        this.thisPlayerId = thisPlayerId;
        this.gameClosed = false;
    }

    removePlayer(playerUid: string) {
        this.players = this.players.filter((pl) => {
            return pl.uid !== playerUid;
        });
        this.eliminatedPlayers = this.eliminatedPlayers.filter((pl) => {
            return pl.uid !== playerUid;
        });
        this.playerCount -= 1;
        if (this.currentPlayerIndx > this.playerCount) {
            this.currentPlayerIndx = 0;
            this.currentPlayer = this.players[0].uid;
        }
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
        this.eliminatedPlayers = data.eliminatedPlayers;
        this.playerCount = this.players.length;
        this.currentPlayer = data.roundStartingPlayerId;
        this.currentPlayerIndx = this.players.findIndex((pl) => {
            return pl.uid == this.currentPlayer;
        });
        this.previousBet = undefined;
    }

    validateCheck(): checkToServerPayload | undefined {
        console.warn('CLIENT SHOULDNT CALL HOST ONLY FUNCTIONS!');
        return;
    }

    startRoundTimer(): void {
        console.warn('CLIENT SHOULDNT CALL HOST ONLY FUNCTIONS!');
        return;
    }

    stopRoundTimer(): void {
        console.warn('CLIENT SHOULDNT CALL HOST ONLY FUNCTIONS!');
        return;
    }

    getRoundTimer(): number {
        console.warn('CLIENT SHOULDNT CALL HOST ONLY FUNCTIONS!');
        return -1;
    }

    setRoundTimer(_: number): void {
        console.warn('CLIENT SHOULDNT CALL HOST ONLY FUNCTIONS!');
        return;
    }

    forceEndRound(): void {
        console.warn('CLIENT SHOULDNT CALL HOST ONLY FUNCTIONS!');
        return;
    }
}
