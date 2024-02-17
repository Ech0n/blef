import app from './app';
import { Server as SocketIOServer } from 'socket.io';
import http from 'http';

const port = process.env.PORT || 5678;

// This will also require a refactor
interface Hosts { // Client Socket -> Host Socket
    [key: string]: string;
}

interface Clients { // Host Socket -> [N] Client Socket
    [key: string]: string[];
}

interface GameIds { // Host Socket -> GameID
    [key: string]: string;
}

let hosts: Hosts = {};
let clients: Clients = {};
let gameIds: GameIds = {};

const server = http.createServer(app).listen(port, () => {
    console.log(`Server is up at port http://localhost:${port}`);
});

const io = new SocketIOServer(server, {
    cors: {
        origin: ["http://localhost:5173", "http://localhost:5174"],
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});

// Socket.IO event handling
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('createGameToServer', () => {
        const gameId: string = `${Math.floor(Math.random() * 2137) + 1}`;

        gameIds[gameId] = socket.id;
        clients[socket.id] = [];
        console.log("User created a game; id: ", gameId);
        socket.emit('createGameToHost', gameId);
    });

    socket.on('joinGameToServer', (data: string) => {
        console.log('Received message from client:', data);

        if (!(data in gameIds)) {
            socket.emit('joinGameToClient', false);
            socket.disconnect(true);
            return;
        }

        const hostSocketId: string = gameIds[data];
        clients[hostSocketId].forEach(clientId => {
            const clientSocket = io.sockets.sockets.get(clientId);
            if (clientSocket) {
                clientSocket.emit('joinGameToClient', { newPlayer: 'user' });
            }
        });

        let hostSocket = io.sockets.sockets.get(hostSocketId);
        if (hostSocket) {
            hostSocket.emit('playerJoinedGameToHost', { newPlayer: 'user' });
            clients[hostSocketId].push(socket.id);
            socket.emit("joinGameToClient", { 
                players: clients[hostSocketId].map(() => "user").concat("host") 
            });
        }
    });

    socket.on('playerLeftGameToServer', (data: string) => {
        console.log('A user disconnected, player.id:' + data); // This is player.id

        if (socket.id in hosts) {
            let hostSock = hosts[socket.id];

            let indexOfClient = clients[hostSock].indexOf(socket.id);
            if (indexOfClient >= 0) {
                clients[hostSock].splice(indexOfClient, 1);
            }
        }

        if (socket.id in clients) {
            delete clients[socket.id]; 
        }

        socket.emit("playerLeftGameToPlayers");
    });


});