import { Socket, Server as SocketIOServer } from 'socket.io';
import http from 'http';
import { SessionData } from 'express-session';
import { SocketEvents } from './types/socketEvents';
import { v4 as uuidv4 } from 'uuid';
import { Player, IPlayer, createPlayerFromIPlayer } from '../common/player';
import { checkToPlayersPayload, checkToServerPayload, gameStartPayload, hitPayload } from '../common/payloads';

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

let rooms = new Set<string>();
let roomHosts = new Map<string, string>();

export function socketApi(socket: SessionSocket, io: SocketIOServer) {
    console.log('A user connected');
    const req: IncomingMessageWithSession = socket.request;
    const session = req.session;
    const sessionId = req.sessionID;
    if (!session.uid) {
        session.uid = uuidv4();
    }

    socket.on(SocketEvents.createGame, (data) => {
        if (!data && !session.username) {
            console.log('No user name provided!', data);
            throw 'No user name';
        }
        session.username = data.username;

        const gameId: string = `${Math.floor(Math.random() * 2137) + 1}`;
        rooms.add(gameId);
        roomHosts.set(gameId, socket.id);
        // roomIds.set(session.uid, gameId);
        socket.join(gameId);
        session.gameId = gameId;

        socket.player = {
            username: session.username,
            uid: session.uid,
            isOnline: true,
            isHost: true,
        };

        socket.emit(SocketEvents.createGame, {
            gameId: gameId,
            hostId: session.uid,
        });
    });

    socket.on(SocketEvents.joinGame, (data) => {
        if (!data || !data.gameId || !data.username) {
            socket.emit(SocketEvents.joinGame, {
                err: 'Wrong or no payload provided',
            });
            return;
        }
        let gameId = data.gameId;
        session.username = data.username;

        if (!rooms.has(gameId)) {
            socket.emit(SocketEvents.joinGame, false);
            console.debug('room does not exist', rooms);
            socket.disconnect(true);
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

        socket.player = {
            username: session.username,
            uid: session.uid,
            isOnline: true,
            isHost: false,
        };
        socket.emit(SocketEvents.joinGame, {
            players: playersInRoom,
            thisPlayerId: session.uid,
            thisPlayerName: session.username,
        });

        socket.to(gameId).emit(SocketEvents.newPlayerJoined, {
            username: session.username,
            uid: session.uid,
            isOnline: true,
        });

        socket.join(gameId);
    });

    socket.on(SocketEvents.playerLeftGame, (data: string) => {
        console.log('A user disconnected, player.id:' + data);
        if (roomHosts.get(session.gameId) != socket.id) {
        }
        socket.leave(session.gameId);
        socket.emit(SocketEvents.playerLeftGame, { uid: session.uid });
    });

    socket.on(SocketEvents.gameStarted, (data: gameStartPayload) => {
        if (!data || !data.startingPlayerId || !data.newHands) {
            throw 'No startin player id message!';
        }
        if (roomHosts.get(session.gameId) != socket.id) {
            socket.emit(SocketEvents.gameStarted, false);
            console.log('Could not start the game, (user is not a host)');
            return;
        }

        io.in(session.gameId).emit(SocketEvents.gameStarted, data);
    });
    socket.on(SocketEvents.hit, (data: hitPayload) => {
        if (!data || !data.move) {
            throw 'No move data passed';
        }
        // console.log('passing on hit data: ', data.move);
        //TODO: Some kidn of validation would be useful

        io.in(session.gameId).emit(SocketEvents.hit, data);
    });
    socket.on(SocketEvents.checkToServer, () => {
        let roomHostSocketId = roomHosts.get(session.gameId);
        let roomHostSocket;
        if (roomHostSocketId) {
            roomHostSocket = io.sockets.sockets.get(roomHostSocketId);
        } else {
            socket.emit(SocketEvents.checkToServer, {
                err: 'ur room does not have a host',
            });
        }
        if (roomHostSocket) {
            roomHostSocket.emit(SocketEvents.checkToServer);
        }
    });

    socket.on(SocketEvents.checkToPlayers, (payload: checkToServerPayload) => {
        if (roomHosts.get(session.gameId) != socket.id) {
            socket.emit(SocketEvents.gameStarted, false);
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
                clientSocket.emit(SocketEvents.checkToPlayers, newPayload);
            }
        }
    });

    socket.on(SocketEvents.gameClosed, () => {
        if (roomHosts.get(session.gameId) != socket.id) {
            socket.emit(SocketEvents.gameClosed, false);
            console.log('Cannot Close server u are not a host');
            return;
        }

        let roomToCloseId = session.gameId;

        const clients = io.sockets.adapter.rooms.get(session.gameId);
        if (!clients) {
            return;
        }
        for (const clientId of clients) {
            const clientSocket = io.sockets.sockets.get(clientId);

            if (clientSocket) {
                clientSocket.player = undefined;
                clientSocket.emit(SocketEvents.gameClosed);
                clientSocket.leave(roomToCloseId);
                clientSocket.disconnect;
            }
        }
        roomHosts.delete(roomToCloseId);
        rooms.delete(roomToCloseId);
    });
}
