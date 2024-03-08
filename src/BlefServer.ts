import { Socket, Server } from 'socket.io';
import { io } from 'socket.io-client';
import http, { IncomingMessage } from 'http';
import { config } from '../config';
import { socketEventsListeners, SessionSocket } from './socketEventListeners';
import session, { SessionData } from 'express-session';
import { SocketEventsCommon, SocketEventsFromServer } from './types/socketEvents';
import { v4 as uuidv4 } from 'uuid';
import { Player, createPlayerFromIPlayer } from '../common/player';
import { gameInfo, joinGameResponsePayload, reconnectPayload } from '../common/payloads';

declare module 'http' {
    interface IncomingMessage {
        session: SessionData;
    }
}

export class BlefServer {
    io: Server;
    serverSocket?: Socket;
    rooms = new Set<string>();
    roomHosts = new Map<string, string>();

    constructor(server: http.Server) {
        this.io = new Server(server, {
            cors: {
                origin: ['http://localhost:5173', 'http://localhost:5174', config.FRONTEND_SERVER_ADDRESS],
                methods: ['GET', 'POST'],
                allowedHeaders: ['my-custom-header'],
                credentials: true,
            },
        });
        const sessionConfig = session({
            resave: true,
            saveUninitialized: true,
            secret: config.sessionSecret,
            rolling: false,
        });

        this.io.engine.use(sessionConfig);

        this.io.on('connection', (socket) => {
            console.log('A user connected');
            this.setupConnection(socket);
            socketEventsListeners(this, <SessionSocket>socket);
        });
    }

    setupConnection(socket: Socket) {
        const req: IncomingMessage = socket.request;
        const session = req.session;
        if (!session.uid) {
            session.uid = uuidv4();
        }
    }

    //Plan for those functions:
    //Lets simplyfy whole server
    // So basicly as it turns ou because this is just a broker server the only uniqe event handling we need is connection and disconnection
    // For other events we can define common functions and than define which one should we use
    // f.e. we listen to event ExapmleEvent and than we can use either of bellow three functions to decide who should we pass payload to
    // All of those functions should have callback as paramater (or be a promise) and than call that callback when client emits ExapleEvent
    // So doing it this way we can alawys expect client to emit a callback with same event (or not if smthng went wrong)
    passToEveryoneExceptSender(
        event: SocketEventsCommon,
        payload: any, // payload in futer of payload type
        socket: Socket
    ) {
        let gameId = this.getRoomId(socket);
        socket.to(gameId).emit(event, payload);
    }
    passToHost(
        event: SocketEventsCommon,
        payload: any, // payload in futer of payload type
        socket: Socket
    ) {
        let gameId = this.getRoomId(socket);
        socket.to(gameId).emit(event, payload);

        let roomHostSocketId = this.roomHosts.get(gameId);
        let roomHostSocket;
        if (roomHostSocketId) {
            roomHostSocket = this.io.sockets.sockets.get(roomHostSocketId);
            roomHostSocket?.emit(event, payload);
        }
    }
    passToClientAndHost(
        event: SocketEventsCommon,
        payload: any, // payload in futer of payload type
        socket: Socket
    ) {
        let gameId = this.getRoomId(socket);

        this.io.in(gameId).emit(event, payload);
    }

    getRoomId(socket: Socket): string {
        const req: IncomingMessage = socket.request;
        if (!req.session || !req.session.gameId) {
            throw 'request dosent contain session or gameId';
        }
        return req.session.gameId;
    }
    handleReconnection(socket: Socket) {
        //Send data about previous game to client
        let responsePayload: reconnectPayload = {
            didReconnect: false,
        };
        const req: IncomingMessage = socket.request;
        if (!req.session || !req.session.gameId) {
            console.debug('Reconnection failed');
            socket.emit(SocketEventsFromServer.reconnectionInfo, responsePayload);
            socket.disconnect();
            return;
        }
        let playersInRoom: Player[] = this.getPlayersInRoom(req.session.gameId);

        const gameInfoPayload: gameInfo = { players: playersInRoom, thisPlayerId: req.session.uid, thisPlayerName: req.session.username, gameStarted: false };
        responsePayload.didReconnect = true;
        responsePayload.gameInfo = gameInfoPayload;

        socket.emit(SocketEventsFromServer.reconnectionInfo, responsePayload);
    }

    handlePlayerJoinRequest(socket: Socket, session: SessionData, gameId: string, username: string) {
        let responsePayload: joinGameResponsePayload = {
            didJoin: false,
        };
        if (!gameId || !username) {
            socket.emit(SocketEventsCommon.joinGame, responsePayload);
            return;
        }
        session.username = username;

        if (!this.rooms.has(gameId)) {
            socket.emit(SocketEventsCommon.joinGame, responsePayload);
            console.debug('room does not exist', this.rooms);
            socket.disconnect(true);
            return;
        }
        let playersInRoom: Player[] = this.getPlayersInRoom(gameId);

        session.gameId = gameId;

        socket.player = {
            username: session.username,
            uid: session.uid,
            isOnline: true,
            isHost: false,
        };

        const gameInfoPayload: gameInfo = { players: playersInRoom, thisPlayerId: session.uid, thisPlayerName: session.username, gameStarted: false };
        responsePayload.didJoin = true;
        responsePayload.gameInfo = gameInfoPayload;

        socket.emit(SocketEventsCommon.joinGame, responsePayload);

        socket.to(gameId).emit(SocketEventsCommon.newPlayerJoined, {
            username: session.username,
            uid: session.uid,
            isOnline: true,
        });

        socket.join(gameId);
    }

    disconnectPlayer(session: SessionData, playerSocket: Socket) {
        if (session.gameId) {
            playerSocket.leave(session.gameId);
            playerSocket.to(session.gameId).emit(SocketEventsCommon.playerLeftGame, { uid: session.uid });
            session.gameId = null;
        }
    }

    getPlayersInRoom(roomId: string) {
        let clientsInRoom = this.io.sockets.adapter.rooms.get(roomId);
        if (!clientsInRoom) {
            throw 'Huh!?';
        }
        let playersInRoom: Player[] = [];
        for (const clientId of clientsInRoom) {
            const clientSocket = this.io.sockets.sockets.get(clientId);
            if (!clientSocket) {
                throw 'Bruh';
            }
            if (clientSocket.player) {
                playersInRoom.push(createPlayerFromIPlayer(clientSocket.player));
            }
        }
        return playersInRoom;
    }
}
