import app from './app';
import { Server as SocketIOServer } from 'socket.io';
import http from 'http';
import session from 'express-session';
const { v4: uuidv4 } = require('uuid');

declare module 'express-session' {
    interface SessionData {
        uid: string;
        username: string;
    }
}

const port = process.env.PORT || 5678;

// This will also require a refactor
interface Hosts {
    // Client uid -> Host Socket
    [key: string]: string;
}

interface Clients {
    // Host Socket -> [N] Client Socket
    [key: string]: string[];
}

interface GameIds {
    // Host Socket -> GameID
    [key: string]: string;
}

interface Usernames {
    // SessionId -> Username
    [key: string]: string;
}

interface Sockets {
    // SessionId -> Socket
    [key: string]: string;
}

let hosts: Hosts = {};
let clients: Clients = {};
let gameIds: GameIds = {};
let usernames: Usernames = {};
let sockets: Sockets = {};

// TODO: Reconsider using sessionId as identifier. Pro: this would remove need for usernames map since one could just get the data from session stroage. Con: Security?

const server = http.createServer(app).listen(port, () => {
    console.log(`Server is up at port http://localhost:${port}`);
});

const io = new SocketIOServer(server, {
    cors: {
        origin: ['http://localhost:5173', 'http://localhost:5174'],
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

// Socket.IO event handling
io.on('connection', (socket) => {
    console.log('A user connected');
    const req: any = socket.request;
    const session = req.session;
    const sessionId = req.sessionID;
    session.uid = uuidv4();
    sockets[session.uid] = socket.id;

    socket.on('createGameToServer', (data) => {
        if (!data && !session.username) {
            console.log('No user name provided!', data);
            throw 'No user name';
            return;
        }
        const gameId: string = `${Math.floor(Math.random() * 2137) + 1}`;
        if (data) {
            session.username = data.username;
        }
        gameIds[gameId] = session.uid;
        clients[session.uid] = [];
        usernames[session.uid] = session.username;
        console.log('User ', session.username, ' created a game; id: ', gameId);
        socket.emit('createGameToHost', {
            gameId: gameId,
            hostId: session.uid,
        });
    });

    socket.on('joinGameToServer', (data) => {
        console.log('Received message from client:', data);
        let gameId = data.gameId;
        session.username = data.username;
        usernames[session.uid] = session.username;

        if (!(gameId in gameIds)) {
            socket.emit('joinGameToClient', false);
            socket.disconnect(true);
            return;
        }
        const hostUid: string = gameIds[gameId];

        let hostSocket = io.sockets.sockets.get(sockets[hostUid]);
        if (hostSocket) {
            hostSocket.emit('newPlayerJoinedGameToHost', {
                username: session.username,
                uid: session.uid,
            });
            let joinedPlayerList: { uid: string; username: string }[] = clients[
                hostUid
            ].map((id) => {
                return { uid: id, username: usernames[id] };
            });
            joinedPlayerList.push({
                uid: hostUid,
                username: usernames[hostUid],
            });
            socket.emit('joinGameToClient', {
                players: joinedPlayerList,
                thisPlayerId: session.uid,
                thisPlayerName: session.username,
            });
        }
        clients[hostUid].forEach((clientId) => {
            const clientSocket = io.sockets.sockets.get(sockets[clientId]);
            if (clientSocket) {
                clientSocket.emit('newPlayerJoinedGameToClient', {
                    username: session.username,
                    uid: session.uid,
                });
            }
        });
        clients[hostUid].push(session.uid);
    });

    socket.on('playerLeftGameToServer', (data: string) => {
        console.log('A user disconnected, player.id:' + data); // This is player.id
        if (session.id in hosts) {
            let hostUid = hosts[session.uid];

            let indexOfClient = clients[hostUid].indexOf(session.uid);
            if (indexOfClient >= 0) {
                clients[hostUid].splice(indexOfClient, 1);
            }
        }

        if (session.uid in clients) {
            delete clients[session.uid];
        }

        if (session.uid in usernames) {
            delete usernames[session.uid];
        }

        if (session.uid in sockets) {
            delete sockets[session.uid];
        }

        socket.emit('playerLeftGameToPlayers', { uid: session.uid });
    });

    // socket.on('gameStartedToClient', (data: string) => {
    //     if (socket.id in clients) {
    //         for(let clientSocketId in clients[socket.id])
    //         {
    //             let clientSock = io.sockets.sockets.get(clientSocketId);
    //             clientSock.emit
    //         }
    //         console.log('Game ', gameIds[socket.id], ' has been started');
    //         let indexOfClient = clients[hostSock].indexOf(socket.id);
    //         if (indexOfClient >= 0) {
    //             clients[hostSock].splice(indexOfClient, 1);
    //         }
    //     }

    //     socket.emit('playerLeftGameToPlayers');
    // });
});
