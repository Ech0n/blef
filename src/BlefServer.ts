import { Socket, Server } from 'socket.io';
import { io } from 'socket.io-client';
import http, { IncomingMessage } from 'http';
import { config } from '../config';
import { socketEventsListeners, SessionSocket } from './socketEventListeners';
import session, { SessionData } from 'express-session';
import { SocketEventsCommon, SocketEventsFromClient, SocketEventsFromHost, SocketEventsFromServer } from './types/socketEvents';
import { v4 as uuidv4 } from 'uuid';
import { Player, createPlayerFromIPlayer } from '../common/player';
import { gameInfo, joinGameResponsePayload, reconnectRequestPayload, reconnectResponsePayload } from '../common/payloads';
import { response } from 'express';

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

    askHostForReconnection(socket: Socket, request: reconnectRequestPayload) {
        let hostSocketId = this.roomHosts.get(request.gameId);
        if (!hostSocketId) {
            const onFailResponse: reconnectResponsePayload = { reconnectRequest: request, didReconnect: false };
            socket.emit(SocketEventsFromHost.reconnectToGame, onFailResponse);
            return;
        }
        request.requesterSocketId = socket.id;
        let roomHostSocket;
        roomHostSocket = this.io.sockets.sockets.get(hostSocketId);
        roomHostSocket?.emit(SocketEventsFromClient.reconnectToGame, request);
    }

    reconnectionResponse(socket: Socket, responsePayload: reconnectResponsePayload) {
        console.log('reconect response');

        let clientSid = responsePayload.reconnectRequest.requesterSocketId;
        if (!clientSid) {
            console.log('   no sockId');
            return;
        }

        let clientSocket = this.io.sockets.sockets.get(clientSid);
        if (!clientSocket) {
            console.log('   no sock');
            return;
        }

        if (!responsePayload.didReconnect) {
            console.log('   no recon');
            clientSocket.emit(SocketEventsFromHost.reconnectToGame, responsePayload);
        }
        const req: IncomingMessage = clientSocket.request;

        //TODO we  should check if request (defined line above) has values in if below
        if (!responsePayload.reconnectRequest.gameId) {
            console.debug('Reconnection failed');
            responsePayload.didReconnect = false;
            socket.emit(SocketEventsFromHost.reconnectToGame, responsePayload);
            socket.disconnect();
            return;
        }

        const session = req.session;

        session.gameId = responsePayload.reconnectRequest.gameId;
        session.uid = responsePayload.reconnectRequest.requesterUid;
        if (responsePayload.gameInfo) {
            clientSocket.player = {
                username: responsePayload.gameInfo.thisPlayerName,
                uid: responsePayload.reconnectRequest.requesterUid,
                isOnline: true,
                isHost: false,
            };
        }

        // let playersInRoom: Player[] = this.getPlayersInRoom(responsePayload.reconnectRequest.gameId);
        // const gameInfoPayload: gameInfo = { players: playersInRoom, thisPlayerId: req.session.uid, thisPlayerName: req.session.username, gameStarted: false };
        // responsePayload.gameInfo = gameInfoPayload;
        clientSocket.emit(SocketEventsFromHost.reconnectToGame, responsePayload);

        this.io.in(responsePayload.reconnectRequest.gameId).emit(SocketEventsFromServer.playerReconnected, { uid: responsePayload.reconnectRequest.requesterUid });
        console.log('was here');
        clientSocket.join(responsePayload.reconnectRequest.gameId);
        console.log('users in room ', this.io.sockets.adapter.rooms.get(session.gameId));
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

        session.gameId = gameId;
        let playersInRoom: Player[] = this.getPlayersInRoom(gameId);

        socket.player = {
            username: session.username,
            uid: session.uid,
            isOnline: true,
            isHost: false,
        };

        socket.join(gameId);

        for (let player of playersInRoom) {
            if (player.username === session.username) {
                console.debug('Player with that name already in game.', this.rooms);
                socket.disconnect(true);
                return;
            }
        }

        playersInRoom = this.getPlayersInRoom(gameId);

        const gameInfoPayload: gameInfo = { players: playersInRoom, thisPlayerId: session.uid, thisPlayerName: session.username, gameStarted: false };
        responsePayload.didJoin = true;
        responsePayload.gameInfo = gameInfoPayload;

        socket.emit(SocketEventsCommon.joinGame, responsePayload);

        socket.to(gameId).emit(SocketEventsCommon.newPlayerJoined, {
            username: session.username,
            uid: session.uid,
            isOnline: true,
        });
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
