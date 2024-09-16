import type { Player } from './player';
import type { Card } from '../client/src/model/Card';
import { HandInfo } from '../client/src/game/HandRankings';

export interface Payload{}

export interface checkToServerPayload extends Payload{
    newHands: { [key: string]: Card[] };
    roundStartingPlayerId: string;
    eliminatedPlayers: Player[];
    players: Player[];
    checkSuccesful: boolean;
}

export interface checkToPlayersPayload extends Payload{
    newHand: Card[];
    players: Player[];
    roundStartingPlayerId: string;
    eliminatedPlayers: Player[];
    checkSuccesful: boolean;
}

export interface gameStartPayload extends Payload{
    startingPlayerId: string;
    newHands: { [key: string]: Card[] };
}

export interface hitPayload extends Payload{
    move: HandInfo;
}

export interface gameInfo extends Payload{
    players: Player[];
    thisPlayerId: string;
    thisPlayerName: string;
    gameStarted: boolean;
    startedGameInfo?: {
        currentPlayer: string;
        currentBet: HandInfo | null;
        newHand: Card[];
    };
}

export interface joinRequest extends Payload{
    requesterSocketId?: string;
    requesterUid?: string;
    requesterUsername: string;
    gameId: string;
}

export interface joinGameResponsePayload extends Payload{
    didJoin: boolean;
    gameInfo?: gameInfo;
    request?: joinRequest;
}

export interface reconnectRequestPayload extends Payload{
    requesterSocketId?: string;
    requesterUid: string;
    gameId: string;
}

export interface reconnectResponsePayload extends Payload{
    reconnectRequest: reconnectRequestPayload;
    didReconnect: boolean;
    gameInfo?: gameInfo;
}
