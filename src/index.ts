import app from './app';
import { Socket, Server as SocketIOServer } from 'socket.io';
import http from 'http';
import session from 'express-session';
import { SocketEventsCommon } from './types/socketEvents';
import { v4 as uuidv4 } from 'uuid';
import { Player, IPlayer, createPlayerFromIPlayer } from '../common/player';
import { checkToPlayersPayload, checkToServerPayload, gameStartPayload, hitPayload } from '../common/payloads';
import { config } from '../config';
import { socketApi, SessionSocket } from './socketServer';
import { BlefServer } from './BlefServer';
const port = config.BACKENDSERVERPORT || 5678;

// TODO: Reconsider using sessionId as identifier. Pro: this would remove need for usernames map since one could just get the data from session stroage. Con: Security?

const server = http.createServer(app).listen(port, () => {
    console.log(`Server is up at port http://localhost:${port}`);
});
const sessionConfig = session({
    resave: true,
    saveUninitialized: true,
    secret: 'pizda', // :O
    rolling: false,
});

app.set('trust proxy', 1); // trust first proxy
app.use(sessionConfig);

let blefServer = new BlefServer(server);
