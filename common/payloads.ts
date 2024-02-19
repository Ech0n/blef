import type { Player } from './player';
import type { Card } from '../client/src/model/Card';

export interface checkToServerPayload {
    newHands: { [key: string]: Card[] };
    players: Player[];
}

export interface checkToPlayersPayload {
    newHand: Card[];
    players: Player[];
}
