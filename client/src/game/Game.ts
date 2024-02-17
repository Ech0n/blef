import type { Card } from '../model/Card';
import { Player } from '../model/Player';

export class Game {
    playerCount: number;
    players: Player[];
    lostPlayers: Player[];
    currentPlayer: number;
    hand: Card[];
    constructor(players: Player[]) {
        this.playerCount = players.length;
        this.players = structuredClone(players);
        this.hand = [];
        this.currentPlayer = 0;
        this.lostPlayers = [];
    }
}
