import { createServer } from 'node:http';
import { type AddressInfo } from 'node:net';
import { io as ioc, type Socket as ClientSocket } from 'socket.io-client';
import { Server, type Socket as ServerSocket } from 'socket.io';
import { socketApi, SessionSocket } from '../socketServer';
import { SocketEventsCommon } from '../types/socketEvents';
import { Session } from 'node:inspector';
import session from 'express-session';
import { BlefServer } from '../BlefServer';

function waitFor(socket: ServerSocket | ClientSocket, event: string) {
    return new Promise((resolve) => {
        socket.once(event, resolve);
    });
}

jest.setTimeout(4000);

describe('host', () => {
    let io: any, serverSocket: any, hostSocket: any;
    let blefServer: any;
    let port: any;

    beforeAll((done) => {
        const httpServer = createServer();

        let lst = httpServer.listen(() => {
            port = (httpServer.address() as AddressInfo).port;
            hostSocket = ioc(`http://localhost:${port}`);

            io.on('connection', (socket: any) => {
                serverSocket = socket;
            });
            hostSocket.on('connect', done);
        });
        blefServer = new BlefServer(lst);
        io = blefServer.io;
        serverSocket = blefServer.serverSocket;
    });

    afterAll(() => {
        io.close();
        hostSocket.disconnect();
    });

    test('should create a game than close it and cleanup properly', async () => {
        //Open server
        let prom = hostSocket.emit(SocketEventsCommon.createGame, 'username');
        await waitFor(hostSocket, SocketEventsCommon.createGame);
        let socks = await io.fetchSockets();

        //Check if all structures inside server were created/populated
        expect(blefServer.rooms.size).toBe(1);
        expect(socks.length).toBe(1);
        expect(socks[0].id).toBe(hostSocket.id);
        expect(io.of('/').adapter.rooms.size).toBe(2); //Should be equal to 2 because one room is a lobby and another one is an user

        //Close server
        prom = hostSocket.emit(SocketEventsCommon.gameClosed, 'username');
        prom = await waitFor(hostSocket, SocketEventsCommon.gameClosed);
        expect(prom).toBe(true);

        //Check if cleanup was sucesfull
        socks = await io.fetchSockets();
        expect(blefServer.rooms.size).toBe(0);
        expect(blefServer.roomHosts.size).toBe(0);
        expect(socks.length).toBe(0);
        expect(io.of('/').adapter.rooms.size).toBe(0);
    });
});

describe('host and 4 clients', () => {
    let io: any, serverSocket: any, hostSocket: any, clientSocket1: any, clientSocket2: any, clientSocket3: any, clientSocket4: any;
    let blefServer: any;
    let port: any;

    beforeAll((done) => {
        const httpServer = createServer();

        let lst = httpServer.listen(() => {
            port = (httpServer.address() as AddressInfo).port;
            hostSocket = ioc(`http://localhost:${port}`);
            clientSocket1 = ioc(`http://localhost:${port}`);
            clientSocket2 = ioc(`http://localhost:${port}`);
            clientSocket3 = ioc(`http://localhost:${port}`);
            clientSocket4 = ioc(`http://localhost:${port}`);

            io.on('connection', (socket: any) => {
                serverSocket = socket;
            });
            hostSocket.on('connect', done);
            clientSocket1.on('connect', done);
            clientSocket2.on('connect', done);
            clientSocket3.on('connect', done);
            clientSocket4.on('connect', done);
        });
        blefServer = new BlefServer(lst);
        io = blefServer.io;
        serverSocket = blefServer.serverSocket;
    });

    afterAll(() => {
        io.close();
        hostSocket.disconnect();
        clientSocket1.disconnect();
        clientSocket2.disconnect();
        clientSocket3.disconnect();
        clientSocket4.disconnect();
    });

    function usersWaitForEvent(event: string) {
        return Promise.all([
            new Promise((resolve) => {
                hostSocket.once(event, resolve);
            }),
            new Promise((resolve) => {
                clientSocket1.once(event, resolve);
            }),
            new Promise((resolve) => {
                clientSocket2.once(event, resolve);
            }),
            new Promise((resolve) => {
                clientSocket3.once(event, resolve);
            }),
            new Promise((resolve) => {
                clientSocket4.once(event, resolve);
            }),
        ]);
    }
    function clientsWaitForEvent(event: string) {
        return Promise.all([
            new Promise((resolve) => {
                clientSocket1.once(event, resolve);
            }),
            new Promise((resolve) => {
                clientSocket2.once(event, resolve);
            }),
            new Promise((resolve) => {
                clientSocket3.once(event, resolve);
            }),
            new Promise((resolve) => {
                clientSocket4.once(event, resolve);
            }),
        ]);
    }

    test('should create a game join it than close it and cleanup properly', async () => {
        //Open server
        let prom = hostSocket.emit(SocketEventsCommon.createGame, { username: 'username' });
        let ret = <{ gameId: string }>await waitFor(hostSocket, SocketEventsCommon.createGame);

        clientSocket1.emit(SocketEventsCommon.joinGame, { username: 'cl1', gameId: ret.gameId });
        clientSocket2.emit(SocketEventsCommon.joinGame, { username: 'cl1', gameId: ret.gameId });
        clientSocket3.emit(SocketEventsCommon.joinGame, { username: 'cl1', gameId: ret.gameId });
        clientSocket4.emit(SocketEventsCommon.joinGame, { username: 'cl1', gameId: ret.gameId });

        await clientsWaitForEvent(SocketEventsCommon.joinGame);
        let socks = await io.fetchSockets();

        //Check if all structures inside server were created/populated
        expect(blefServer.rooms.size).toBe(1);
        expect(socks.length).toBe(5);
        expect(io.of('/').adapter.rooms.size).toBe(6); //Should be equal to 6 because one room is a lobby and 5 for every connected socket

        //Close server
        prom = hostSocket.emit(SocketEventsCommon.gameClosed, 'username');
        prom = await usersWaitForEvent(SocketEventsCommon.gameClosed);
        expect(prom).toEqual([true, true, true, true, true]);

        //Check if cleanup was sucesfull
        socks = await io.fetchSockets();
        expect(blefServer.rooms.size).toBe(0);
        expect(blefServer.roomHosts.size).toBe(0);
        expect(socks.length).toBe(0);
        expect(io.of('/').adapter.rooms.size).toBe(0);
    });

    test('should join a game leave it and join again :O', async () => {
        //Open server
        let prom = hostSocket.emit(SocketEventsCommon.createGame, { username: 'username' });
        let ret = <{ gameId: string }>await waitFor(hostSocket, SocketEventsCommon.createGame);

        clientSocket1.emit(SocketEventsCommon.joinGame, { username: 'cl1', gameId: ret.gameId });
        clientSocket2.emit(SocketEventsCommon.joinGame, { username: 'cl1', gameId: ret.gameId });
        clientSocket3.emit(SocketEventsCommon.joinGame, { username: 'cl1', gameId: ret.gameId });
        clientSocket4.emit(SocketEventsCommon.joinGame, { username: 'cl1', gameId: ret.gameId });

        await clientsWaitForEvent(SocketEventsCommon.joinGame);

        clientSocket4.emit(SocketEventsCommon.leaveGame, { username: 'cl1', gameId: ret.gameId });

        //Close server
        prom = hostSocket.emit(SocketEventsCommon.gameClosed, 'username');
        prom = await usersWaitForEvent(SocketEventsCommon.gameClosed);
        expect(prom).toEqual([true, true, true, true, true]);

        //Check if cleanup was sucesfull
        socks = await io.fetchSockets();
        expect(blefServer.rooms.size).toBe(0);
        expect(blefServer.roomHosts.size).toBe(0);
        expect(socks.length).toBe(0);
        expect(io.of('/').adapter.rooms.size).toBe(0);
    });
});
