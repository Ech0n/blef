import { Socket, Server as SocketIOServer } from 'socket.io';
import http from 'http';
import { SessionData } from 'express-session';
import { SocketEventsCommon, SocketEventsFromClient, SocketEventsFromHost } from './types/socketEvents';
import { Player, IPlayer, createPlayerFromIPlayer } from '../common/player';
import {
    checkToPlayersPayload,
    checkToServerPayload,
    gameStartPayload,
    hitPayload,
    joinGameResponsePayload,
    joinRequest,
    reconnectRequestPayload,
    reconnectResponsePayload,
} from '../common/payloads';
import { BlefServer } from './BlefServer';
import { CardCountTable } from '../client/src/model/Card';

declare module 'socket.io' {
    interface Socket {
        uid: string;
        player: IPlayer | null;
        gameId: string | null;
    }
}

interface IncomingMessageWithSession extends http.IncomingMessage {
    session: SessionData;
    sessionID: string;
}

export interface SessionSocket extends Socket {
    request: IncomingMessageWithSession;
}

export function socketEventsListeners(blefServer: BlefServer, clientSocket: SessionSocket) {
    let io = blefServer.io;
    let rooms = blefServer.rooms;
    let roomHosts = blefServer.roomHosts;

    clientSocket.on('disconnect', () => {
        blefServer.disconnectPlayer(clientSocket);
    });

    clientSocket.on(SocketEventsFromClient.reconnectToGame, (request: reconnectRequestPayload) => {
        blefServer.askHostForReconnection(clientSocket, request);
    });

    clientSocket.on(SocketEventsFromHost.reconnectToGame, (hostResponse: reconnectResponsePayload) => {
        blefServer.reconnectionResponse(clientSocket, hostResponse);
    });

    clientSocket.on(SocketEventsCommon.createGame, (data) => {
        if (!data) {
            //console.log('No user name provided!', data);
            throw 'No user name';
        }

        const gameId: string = `${Math.floor(Math.random() * 2137) + 1}`;
        rooms.add(gameId);
        roomHosts.set(gameId, clientSocket.id);
        // roomIds.set(session.uid, gameId);
        clientSocket.join(gameId);
        clientSocket.gameId = gameId;

        clientSocket.player = {
            username: data.username,
            uid: clientSocket.uid,
            isOnline: true,
            isHost: true,
        };

        clientSocket.emit(SocketEventsCommon.createGame, {
            gameId: gameId,
            hostId: clientSocket.uid,
        });
    });

    clientSocket.on(SocketEventsFromClient.joinRequest, (data: joinRequest) => {
        const responsePayload: joinGameResponsePayload = {
            didJoin: false,
        };
        if (!data || !data.gameId) {
            clientSocket.emit(SocketEventsFromHost.joinResponse, responsePayload);
            return;
        }
        let hostId: string | undefined = roomHosts.get(data.gameId);
        if (!hostId) {
            clientSocket.emit(SocketEventsFromHost.joinResponse, responsePayload);
            return;
        }
        let hostSocket = io.sockets.sockets.get(hostId);
        if (!hostSocket) {
            clientSocket.emit(SocketEventsFromHost.joinResponse, responsePayload);
            return;
        }

        data.requesterSocketId = clientSocket.id;
        data.requesterUid = clientSocket.uid;

        hostSocket.emit(SocketEventsFromClient.joinRequest, data);
    });

    clientSocket.on(SocketEventsFromHost.joinResponse, (data: joinGameResponsePayload) => {
        if (!data || !data.request || !data.request.requesterSocketId || !data.request.requesterUid || !data.gameInfo) {
            const responsePayload: joinGameResponsePayload = {
                didJoin: false,
            };
            clientSocket.emit(SocketEventsFromHost.joinResponse, responsePayload);
            return;
        }

        let requesterSocket = io.sockets.sockets.get(data.request.requesterSocketId);
        if (!requesterSocket) {
            const responsePayload: joinGameResponsePayload = {
                didJoin: false,
            };
            clientSocket.emit(SocketEventsFromHost.joinResponse, responsePayload);
            return;
        }
        requesterSocket.join(data.request.gameId);
        requesterSocket.gameId = data.request.gameId;
        requesterSocket.player = new Player(data.request.requesterUid, data.request.requesterUsername);
        requesterSocket.uid = data.request.requesterUid;

        requesterSocket.emit(SocketEventsFromHost.joinResponse, data);

        let newPlayerPayload = {
            username: data.request.requesterUsername,
            uid: data.gameInfo.thisPlayerId,
            isOnline: true,
        };
        //console.log(newPlayerPayload, data.request.requesterUsername, data.request);

        requesterSocket.to(data.request.gameId).emit(SocketEventsCommon.newPlayerJoined, newPlayerPayload);
    });

    clientSocket.on(SocketEventsFromClient.leaveGame, () => {
        //console.log('Player trying to leave a game: ', clientSocket.uid, clientSocket.gameId);

        clientSocket.emit(SocketEventsCommon.playerLeftGame, { uid: clientSocket.uid });
        clientSocket.disconnect();
    });

    clientSocket.on(SocketEventsCommon.gameStarted, (data: gameStartPayload) => {
        if (!data || !data.startingPlayerId || !data.newHands) {
            throw 'No starting player id message!' + data + data.startingPlayerId + data.newHands;
        }

        if (roomHosts.get(blefServer.getRoomId(clientSocket)) != clientSocket.id) {
            clientSocket.emit(SocketEventsCommon.gameStarted, false);
            //console.log('Could not start the game, (user is not a host)');
            return;
        }

        io.in(blefServer.getRoomId(clientSocket)).emit(SocketEventsCommon.gameStarted, data);
    });

    clientSocket.on(SocketEventsCommon.hit, (data: hitPayload) => {
        blefServer.passToClientAndHost(SocketEventsCommon.hit, data, clientSocket);
    });

    clientSocket.on(SocketEventsCommon.checkToServer, () => {
        let roomHostSocketId = roomHosts.get(blefServer.getRoomId(clientSocket));
        let roomHostSocket;
        if (roomHostSocketId) {
            roomHostSocket = io.sockets.sockets.get(roomHostSocketId);
        } else {
            clientSocket.emit(SocketEventsCommon.checkToServer, {
                err: 'ur room does not have a host',
            });
        }
        if (roomHostSocket) {
            roomHostSocket.emit(SocketEventsCommon.checkToServer);
        }
    });

    clientSocket.on(SocketEventsCommon.checkToPlayers, (payload: checkToServerPayload) => {
        if (roomHosts.get(blefServer.getRoomId(clientSocket)) != clientSocket.id) {
            clientSocket.emit(SocketEventsCommon.gameStarted, false);
            //console.log('Could not check, (user is not a host)');
            return;
        }

        const clients = io.sockets.adapter.rooms.get(blefServer.getRoomId(clientSocket));
        if (!clients) {
            return;
        }
        //console.log('clients in room', clients);
        for (const clientId of clients) {
            const playerSocket = io.sockets.sockets.get(clientId);
            //console.log('plas scoke', playerSocket, playerSocket?.player);
            if (playerSocket && playerSocket.player) {
                let newPayload: checkToPlayersPayload = {
                    newHand: payload.newHands[playerSocket.player.uid],
                    players: payload.players,
                    roundStartingPlayerId: payload.roundStartingPlayerId,
                    eliminatedPlayers: payload.eliminatedPlayers,
                    checkSuccesful: payload.checkSuccesful,
                };
                //console.log('SEnding check to polayers L: ', newPayload);
                playerSocket.emit(SocketEventsCommon.checkToPlayers, newPayload);
            }
        }
    });

    clientSocket.on(SocketEventsCommon.gameClosed, () => {
        //console.log('Trying to close room');

        if (roomHosts.get(blefServer.getRoomId(clientSocket)) != clientSocket.id) {
            clientSocket.emit(SocketEventsCommon.gameClosed, false);
            //console.log('Cannot Close server u are not a host');
            return;
        }
        let roomToCloseId = blefServer.getRoomId(clientSocket);

        const clients = io.sockets.adapter.rooms.get(blefServer.getRoomId(clientSocket));
        if (!clients) {
            return;
        }
        roomHosts.delete(roomToCloseId);
        rooms.delete(roomToCloseId);
        for (const clientId of clients) {
            const clientSocket = io.sockets.sockets.get(clientId);

            if (clientSocket) {
                clientSocket.player = null;
                clientSocket.emit(SocketEventsCommon.gameClosed, true);
                clientSocket.leave(roomToCloseId);
                clientSocket.disconnect();
            }
        }
    });

    clientSocket.on(SocketEventsFromHost.timerUpdate, (update: number) => {
        if (roomHosts.get(blefServer.getRoomId(clientSocket)) != clientSocket.id) {
            //console.log('Could not update timer, (user is not a host)');
            return;
        }

        const clients = io.sockets.adapter.rooms.get(blefServer.getRoomId(clientSocket));
        if (!clients) {
            return;
        }

        for (const clientId of clients) {
            const clientSocket = io.sockets.sockets.get(clientId);

            if (clientSocket && clientSocket.player) {
                clientSocket.emit(SocketEventsCommon.updateTimerToPlayers, update);
            }
        }
    });

    clientSocket.on(SocketEventsFromHost.cardListToPlayers, (cardCount: CardCountTable) => {
        if (roomHosts.get(blefServer.getRoomId(clientSocket)) != clientSocket.id) {
            //console.log('Could not send cardCountTable, (user is not a host)');
            return;
        }

        const clients = io.sockets.adapter.rooms.get(blefServer.getRoomId(clientSocket));
        if (!clients) {
            return;
        }

        for (const clientId of clients) {
            const clientSocket = io.sockets.sockets.get(clientId);

            if (clientSocket && clientSocket.player) {
                clientSocket.emit(SocketEventsCommon.updateCardCountToPlayers, cardCount);
            }
        }
    });

    clientSocket.on(SocketEventsFromClient.playerReady, (readyPlayerId: string) => {
        blefServer.passToHost(SocketEventsCommon.playerReady, readyPlayerId, clientSocket);
    });

    clientSocket.on(SocketEventsFromHost.kickPlayer, (playerId: string) => {
        blefServer.passToClientAndHost(SocketEventsCommon.kickPlayer, playerId, clientSocket);
    });
}
