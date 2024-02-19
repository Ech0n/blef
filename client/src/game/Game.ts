import type { Card } from '../model/Card';
import { Player } from '../model/Player';

export class Game {
    playerCount: number;
    players: Player[];
    lostPlayers: Player[];
    currentPlayer: string;
    hand: Card[];
    constructor(players: Player[], startingPlayerId: string) {
        this.playerCount = players.length;
        this.players = structuredClone(players);
        this.hand = [];
        this.currentPlayer = startingPlayerId;
        this.lostPlayers = [];
    }
}
