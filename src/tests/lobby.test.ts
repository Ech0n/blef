import { createServer } from 'node:http';
import { type AddressInfo } from 'node:net';
import { io as ioc, type Socket as ClientSocket } from 'socket.io-client';
import { Server, type Socket as ServerSocket } from 'socket.io';
import { socketApi, SessionSocket } from '../socketServer';
import { SocketEvents } from '../types/socketEvents';
import { Session } from 'node:inspector';
import session from 'express-session';
import { BlefServer } from '../BlefServer';

function waitFor(socket: ServerSocket | ClientSocket, event: string) {
    return new Promise((resolve) => {
        socket.once(event, resolve);
    });
}

jest.setTimeout(10000);

describe('my awesome project', () => {
    let io: any, serverSocket: any, clientSocket: any;
    let blefServer: any;

    beforeAll((done) => {
        const httpServer = createServer();

        let lst = httpServer.listen(() => {
            const port = (httpServer.address() as AddressInfo).port;
            clientSocket = ioc(`http://localhost:${port}`);

            io.on('connection', (socket: any) => {
                serverSocket = socket;
            });
            clientSocket.on('connect', done);
        });
        blefServer = new BlefServer(lst);
        io = blefServer.io;
        serverSocket = blefServer.serverSocket;
    });

    afterAll(() => {
        io.close();
        clientSocket.disconnect();
    });

    test('should create a game and than close it', async () => {
        //Open server
        let prom = clientSocket.emit(SocketEvents.createGame, 'username');
        await waitFor(clientSocket, SocketEvents.createGame);
        let socks = await io.fetchSockets();

        //Check if all structures inside server were created/populated
        expect(blefServer.rooms.size).toBe(1);
        expect(socks.length).toBe(1);
        expect(socks[0].id).toBe(clientSocket.id);
        expect(io.of('/').adapter.rooms.size).toBe(2); //Should be equal to 2 because one room is a lobby and another one is an user

        //Close server
        prom = clientSocket.emit(SocketEvents.gameClosed, 'username');
        prom = await waitFor(clientSocket, SocketEvents.gameClosed);
        expect(prom).toBe(true);

        //Check if cleanup was sucesfull
        socks = await io.fetchSockets();
        expect(blefServer.rooms.size).toBe(0);
        expect(blefServer.roomHosts.size).toBe(0);
        expect(socks.length).toBe(0);
        expect(io.of('/').adapter.rooms.size).toBe(0);
    });

    // test('should work with an acknowledgement', (done) => {
    //     serverSocket.on('hi', (cb: any) => {
    //         cb('hola');
    //     });
    //     clientSocket.emit('hi', (arg: any) => {
    //         expect(arg).toBe('hola');
    //         done();
    //     });
    // });

    // test('should work with emitWithAck()', async () => {
    //     serverSocket.on('foo', (cb: any) => {
    //         cb('bar');
    //     });
    //     const result = await clientSocket.emitWithAck('foo');
    //     expect(result).toBe('bar');
    // });

    // test('should work with waitFor()', () => {
    //     clientSocket.emit('baz');

    //     return waitFor(serverSocket, 'baz');
    // });
});
