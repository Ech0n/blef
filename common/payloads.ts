import type { Player } from './player';
import type { Card } from '../client/src/model/Card';
import { HandInfo } from '../client/src/game/HandRankings';

export interface checkToServerPayload {
    newHands: { [key: string]: Card[] };
    roundStartingPlayerId: string;
    eliminatedPlayers: Player[];
    players: Player[];
    checkSuccesful: boolean;
}

export interface checkToPlayersPayload {
    newHand: Card[];
    players: Player[];
    roundStartingPlayerId: string;
    eliminatedPlayers: Player[];
    checkSuccesful: boolean;
}

export interface gameStartPayload {
    startingPlayerId: string;
    newHands: { [key: string]: Card[] };
}

export interface hitPayload {
    move: HandInfo;
}

export interface gameInfo {
    players: Player[];
    thisPlayerId: string;
    thisPlayerName: string;
    gameStarted: boolean;
    startedGameInfo?: {
        currentPlayer: string;
        currentBet: HandInfo;
        newHand: Card[];
    };
}

export interface joinGameResponsePayload {
    didJoin: boolean;
    gameInfo?: gameInfo;
}

export interface reconnectRequestPayload {
    requesterSocketId?: string;
    requesterUid: string;
    gameId: string;
}

export interface reconnectResponsePayload {
    reconnectRequest: reconnectRequestPayload;
    didReconnect: boolean;
    gameInfo?: gameInfo;
}
