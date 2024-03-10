import { Socket, Server as SocketIOServer } from 'socket.io';
import http from 'http';
import { SessionData } from 'express-session';
import { SocketEventsCommon, SocketEventsFromClient, SocketEventsFromHost } from './types/socketEvents';
import { Player, IPlayer, createPlayerFromIPlayer } from '../common/player';
import {
    checkToPlayersPayload,
    checkToServerPayload,
    gameStartPayload,
    hitPayload,
    joinGameResponsePayload,
    reconnectRequestPayload,
    reconnectResponsePayload,
} from '../common/payloads';
import { BlefServer } from './BlefServer';
import { CardCountTable } from '../client/src/model/Card';

declare module 'express-session' {
    interface SessionData {
        uid: string;
        username: string;
        gameId: string | null;
    }
}

declare module 'socket.io' {
    interface Socket {
        player?: IPlayer;
    }
}

interface IncomingMessageWithSession extends http.IncomingMessage {
    session: SessionData;
    sessionID: string;
}

export interface SessionSocket extends Socket {
    request: IncomingMessageWithSession;
}

export function socketEventsListeners(blefServer: BlefServer, clientSocket: SessionSocket) {
    const req: any = clientSocket.request;
    const session = req.session;
    const sessionId = req.sessionID;

    let io = blefServer.io;
    let rooms = blefServer.rooms;
    let roomHosts = blefServer.roomHosts;

    clientSocket.on('disconnect', () => {
        blefServer.disconnectPlayer(session, clientSocket);
    });

    clientSocket.on(SocketEventsFromClient.reconnectToGame, (request: reconnectRequestPayload) => {
        blefServer.askHostForReconnection(clientSocket, request);
    });

    clientSocket.on(SocketEventsFromHost.reconnectToGame, (hostResponse: reconnectResponsePayload) => {
        blefServer.reconnectionResponse(clientSocket, hostResponse);
    });

    clientSocket.on(SocketEventsCommon.createGame, (data) => {
        if (!data && !session.username) {
            console.log('No user name provided!', data);
            throw 'No user name';
        }
        session.username = data.username;

        const gameId: string = `${Math.floor(Math.random() * 2137) + 1}`;
        rooms.add(gameId);
        roomHosts.set(gameId, clientSocket.id);
        // roomIds.set(session.uid, gameId);
        clientSocket.join(gameId);
        session.gameId = gameId;

        clientSocket.player = {
            username: session.username,
            uid: session.uid,
            isOnline: true,
            isHost: true,
        };

        clientSocket.emit(SocketEventsCommon.createGame, {
            gameId: gameId,
            hostId: session.uid,
        });
    });

    clientSocket.on(SocketEventsCommon.joinGame, (data) => {
        if (!data) {
            const responsePayload: joinGameResponsePayload = {
                didJoin: false,
            };
            clientSocket.emit(SocketEventsCommon.joinGame, responsePayload);
            return;
        }
        blefServer.handlePlayerJoinRequest(clientSocket, session, data.gameId, data.username);
    });

    clientSocket.on(SocketEventsFromClient.leaveGame, () => {
        console.log('Player trying to leave a game: ', session.uid, session.gameId);

        clientSocket.emit(SocketEventsCommon.playerLeftGame, { uid: session.uid });
        clientSocket.disconnect();
    });

    clientSocket.on(SocketEventsCommon.gameStarted, (data: gameStartPayload) => {
        if (!data || !data.startingPlayerId || !data.newHands) {
            throw 'No starting player id message!';
        }

        if (roomHosts.get(session.gameId) != clientSocket.id) {
            clientSocket.emit(SocketEventsCommon.gameStarted, false);
            console.log('Could not start the game, (user is not a host)');
            return;
        }

        io.in(session.gameId).emit(SocketEventsCommon.gameStarted, data);
    });

    clientSocket.on(SocketEventsCommon.hit, (data: hitPayload) => {
        blefServer.passToClientAndHost(SocketEventsCommon.hit, data, clientSocket);
    });

    clientSocket.on(SocketEventsCommon.checkToServer, () => {
        let roomHostSocketId = roomHosts.get(session.gameId);
        let roomHostSocket;
        if (roomHostSocketId) {
            roomHostSocket = io.sockets.sockets.get(roomHostSocketId);
        } else {
            clientSocket.emit(SocketEventsCommon.checkToServer, {
                err: 'ur room does not have a host',
            });
        }
        if (roomHostSocket) {
            roomHostSocket.emit(SocketEventsCommon.checkToServer);
        }
    });

    clientSocket.on(SocketEventsCommon.checkToPlayers, (payload: checkToServerPayload) => {
        if (roomHosts.get(session.gameId) != clientSocket.id) {
            clientSocket.emit(SocketEventsCommon.gameStarted, false);
            console.log('Could not check, (user is not a host)');
            return;
        }

        const clients = io.sockets.adapter.rooms.get(session.gameId);
        if (!clients) {
            return;
        }

        for (const clientId of clients) {
            const clientSocket = io.sockets.sockets.get(clientId);

            if (clientSocket && clientSocket.player) {
                let newPayload: checkToPlayersPayload = {
                    newHand: payload.newHands[clientSocket.player.uid],
                    players: payload.players,
                    roundStartingPlayerId: payload.roundStartingPlayerId,
                    eliminatedPlayers: payload.eliminatedPlayers,
                };
                clientSocket.emit(SocketEventsCommon.checkToPlayers, newPayload);
            }
        }
    });

    clientSocket.on(SocketEventsCommon.gameClosed, () => {
        console.log('Trying to close room');

        if (roomHosts.get(session.gameId) != clientSocket.id) {
            clientSocket.emit(SocketEventsCommon.gameClosed, false);
            console.log('Cannot Close server u are not a host');
            return;
        }
        let roomToCloseId = session.gameId;

        const clients = io.sockets.adapter.rooms.get(session.gameId);
        if (!clients) {
            return;
        }
        roomHosts.delete(roomToCloseId);
        rooms.delete(roomToCloseId);
        for (const clientId of clients) {
            const clientSocket = io.sockets.sockets.get(clientId);

            if (clientSocket) {
                clientSocket.player = undefined;
                clientSocket.emit(SocketEventsCommon.gameClosed, true);
                clientSocket.leave(roomToCloseId);
                clientSocket.disconnect();
            }
        }
    });

    clientSocket.on(SocketEventsFromHost.timerUpdate, (update: number) => {
        if (roomHosts.get(session.gameId) != clientSocket.id) {
            console.log('Could not update timer, (user is not a host)');
            return;
        }

        const clients = io.sockets.adapter.rooms.get(session.gameId);
        if (!clients) {
            return;
        }

        for (const clientId of clients) {
            const clientSocket = io.sockets.sockets.get(clientId);

            if (clientSocket && clientSocket.player) {
                clientSocket.emit(SocketEventsCommon.updateTimerToPlayers, update);
            }
        }
    });

    clientSocket.on(SocketEventsFromHost.cardListToPlayers, (cardCount: CardCountTable) => {
        if (roomHosts.get(session.gameId) != clientSocket.id) {
            console.log('Could not send cardCountTable, (user is not a host)');
            return;
        }

        const clients = io.sockets.adapter.rooms.get(session.gameId);
        if (!clients) {
            return;
        }

        for (const clientId of clients) {
            const clientSocket = io.sockets.sockets.get(clientId);

            if (clientSocket && clientSocket.player) {
                clientSocket.emit(SocketEventsCommon.updateCardCountToPlayers, cardCount);
            }
        }
    });

    clientSocket.on(SocketEventsFromClient.playerReady, (readyPlayerId: string) => {
        blefServer.passToHost(SocketEventsCommon.playerReady, readyPlayerId, clientSocket);
    });
}
