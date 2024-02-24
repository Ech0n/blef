import { Socket, Server as SocketIOServer } from 'socket.io';
import http from 'http';
import { SessionData } from 'express-session';
import { SocketEventsCommon } from './types/socketEvents';
import { v4 as uuidv4 } from 'uuid';
import { Player, IPlayer, createPlayerFromIPlayer } from '../common/player';
import { checkToPlayersPayload, checkToServerPayload, gameStartPayload, hitPayload } from '../common/payloads';
import { BlefServer } from './BlefServer';

declare module 'express-session' {
    interface SessionData {
        uid: string;
        username: string;
        gameId: string;
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

export function socketApi(blefServer: BlefServer, clientSocket: SessionSocket) {
    let io = blefServer.io;
    let rooms = blefServer.rooms;
    let roomHosts = blefServer.roomHosts;
    console.log('A user connected');
    const req: any = clientSocket.request;
    const session = req.session;
    const sessionId = req.sessionID;
    if (!session.uid) {
        session.uid = uuidv4();
    }

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
        if (!data || !data.gameId || !data.username) {
            clientSocket.emit(SocketEventsCommon.joinGame, {
                err: 'Wrong or no payload provided',
            });
            return;
        }
        let gameId = data.gameId;
        session.username = data.username;

        if (!rooms.has(gameId)) {
            clientSocket.emit(SocketEventsCommon.joinGame, false);
            console.debug('room does not exist', rooms);
            clientSocket.disconnect(true);
            return;
        }

        let clientsInRoom = io.sockets.adapter.rooms.get(gameId);
        if (!clientsInRoom) {
            throw 'Huh!?';
        }
        let playersInRoom: Player[] = [];
        for (const clientId of clientsInRoom) {
            const clientSocket = io.sockets.sockets.get(clientId);
            if (!clientSocket) {
                throw 'Bruh';
            }
            if (clientSocket.player) {
                playersInRoom.push(createPlayerFromIPlayer(clientSocket.player));
            }
        }

        session.gameId = gameId;

        clientSocket.player = {
            username: session.username,
            uid: session.uid,
            isOnline: true,
            isHost: false,
        };
        clientSocket.emit(SocketEventsCommon.joinGame, {
            players: playersInRoom,
            thisPlayerId: session.uid,
            thisPlayerName: session.username,
        });

        clientSocket.to(gameId).emit(SocketEventsCommon.newPlayerJoined, {
            username: session.username,
            uid: session.uid,
            isOnline: true,
        });

        clientSocket.join(gameId);
    });

    clientSocket.on(SocketEventsCommon.playerLeftGame, (data: string) => {
        console.log('A user disconnected, player.id:' + data);
        if (roomHosts.get(session.gameId) != clientSocket.id) {
        }
        clientSocket.leave(session.gameId);
        clientSocket.emit(SocketEventsCommon.playerLeftGame, { uid: session.uid });
    });

    clientSocket.on(SocketEventsCommon.gameStarted, (data: gameStartPayload) => {
        if (!data || !data.startingPlayerId || !data.newHands) {
            throw 'No startin player id message!';
        }
        if (roomHosts.get(session.gameId) != clientSocket.id) {
            clientSocket.emit(SocketEventsCommon.gameStarted, false);
            console.log('Could not start the game, (user is not a host)');
            return;
        }

        io.in(session.gameId).emit(SocketEventsCommon.gameStarted, data);
    });
    clientSocket.on(SocketEventsCommon.hit, (data: hitPayload) => {
        if (!data || !data.move) {
            throw 'No move data passed';
        }
        // console.log('passing on hit data: ', data.move);
        //TODO: Some kidn of validation would be useful

        io.in(session.gameId).emit(SocketEventsCommon.hit, data);
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
}
