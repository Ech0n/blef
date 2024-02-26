import { Socket, Server } from 'socket.io';
import { io } from 'socket.io-client';
import http, { IncomingMessage } from 'http';
import { config } from '../config';
import { socketEventsListeners, SessionSocket } from './socketEventListeners';
import session, { SessionData } from 'express-session';
import { SocketEventsCommon, SocketEventsFromServer } from './types/socketEvents';
import { v4 as uuidv4 } from 'uuid';
import { Player, createPlayerFromIPlayer } from '../common/player';

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

    handleReconnection(socket: Socket) {
        //Send data about previous game to client
        const req: IncomingMessage = socket.request;
        if (!req.session || !req.session.gameId) {
            console.debug('Reconnection failed');
            socket.emit(SocketEventsFromServer.reconnectionInfo, false);
            socket.disconnect();
            return;
        }
        socket.emit(SocketEventsFromServer.reconnectionInfo, true);
    }

    handlePlayerJoinRequest(socket: Socket, session: SessionData, gameId: string, username: string) {
        if (!gameId || !username) {
            socket.emit(SocketEventsCommon.joinGame, {
                err: 'Wrong or no payload provided',
            });
            return;
        }
        session.username = username;

        if (!this.rooms.has(gameId)) {
            socket.emit(SocketEventsCommon.joinGame, false);
            console.debug('room does not exist', this.rooms);
            socket.disconnect(true);
            return;
        }

        let clientsInRoom = this.io.sockets.adapter.rooms.get(gameId);
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

        session.gameId = gameId;

        socket.player = {
            username: session.username,
            uid: session.uid,
            isOnline: true,
            isHost: false,
        };
        socket.emit(SocketEventsCommon.joinGame, {
            players: playersInRoom,
            thisPlayerId: session.uid,
            thisPlayerName: session.username,
        });

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
}
