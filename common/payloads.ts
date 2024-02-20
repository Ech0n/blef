import type { Player } from './player';
import type { Card } from '../client/src/model/Card';

export interface checkToServerPayload {
    newHands: { [key: string]: Card[] };
    roundStartingPlayerId: string;
    players: Player[];
}

export interface checkToPlayersPayload {
    newHand: Card[];
    players: Player[];
    roundStartingPlayerId: string;
}

export interface gameStartPayload {
    startingPlayerId: string;
    newHands: { [key: string]: Card[] };
}

export interface hitPayload {
    move: any;
}
