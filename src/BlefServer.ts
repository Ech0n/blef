import { Socket, Server } from 'socket.io';
import { io } from 'socket.io-client';
import http from 'http';
import { config } from '../config';
import { socketEventsListeners, SessionSocket } from './socketEventListeners';
import session, { SessionData } from 'express-session';
import { SocketEventsCommon } from './types/socketEvents';
import { v4 as uuidv4 } from 'uuid';

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
        const req: any = socket.request;
        const session = req.session;
        if (!session.uid) {
            session.uid = uuidv4();
        }
    }

    disconnectPlayer(session: SessionData, playerSocket: Socket) {
        playerSocket.leave(session.gameId);
        playerSocket.to(session.gameId).emit(SocketEventsCommon.playerLeftGame, { uid: session.uid });
    }
}
