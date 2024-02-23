import app from './app';
import { Socket, Server as SocketIOServer } from 'socket.io';
import http from 'http';
import session from 'express-session';
import { SocketEvents } from './types/socketEvents';
import { v4 as uuidv4 } from 'uuid';
import { Player, IPlayer, createPlayerFromIPlayer } from '../common/player';
import { checkToPlayersPayload, checkToServerPayload, gameStartPayload, hitPayload } from '../common/payloads';
import { config } from '../config';
import { socketApi, SessionSocket } from './socketServer';

const port = config.BACKENDSERVERPORT || 5678;

// TODO: Reconsider using sessionId as identifier. Pro: this would remove need for usernames map since one could just get the data from session stroage. Con: Security?

const server = http.createServer(app).listen(port, () => {
    console.log(`Server is up at port http://localhost:${port}`);
});

const io = new SocketIOServer(server, {
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
    secret: 'pizda', // :O
    rolling: false,
});

app.set('trust proxy', 1); // trust first proxy
app.use(sessionConfig);
io.engine.use(sessionConfig);

io.on('connection', (socket) => {
    socketApi(<SessionSocket>socket, io);
});
