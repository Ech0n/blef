import app from './app';
import { Server as SocketIOServer } from 'socket.io';
import http from 'http';

const port = process.env.PORT || 5678;

// This will also require a refactor
interface Hosts {
    [key: string]: string;
}

interface Clients {
    [key: string]: string[];
}

interface GameIds {
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

    socket.on('create', () => {
        const gameId: string = `${Math.floor(Math.random() * 2137) + 1}`;

        gameIds[gameId] = socket.id;
        clients[socket.id] = [];
        console.log("User created a game; id: ", gameId);
        socket.emit('create', gameId);
    });

    socket.on('join', (data: string) => {
        console.log('Received message from client:', data);

        if (!(data in gameIds)) {
            socket.emit('join', false);
            socket.disconnect(true);
            return;
        }

        const hostSocketId: string = gameIds[data];
        clients[hostSocketId].forEach(clientId => {
            console.log("FAILED FOR ", clientId);
            const clientSocket = io.sockets.sockets.get(clientId);
            if (clientSocket) {
                clientSocket.emit('join', { newPlayer: 'user' });
            }
        });

        let hostSocket = io.sockets.sockets.get(hostSocketId);
        if (hostSocket) {
            hostSocket.emit('join', { newPlayer: 'user' });
            clients[hostSocketId].push(socket.id);
            socket.emit("join", { 
                players: clients[hostSocketId].map(() => "user").concat("host") 
            });
        }
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');

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

        //TODO: Implement playerLeave emit
    });
});
