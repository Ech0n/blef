import { SessionData } from 'express-session'
import http, { IncomingMessage } from 'http'
import { Server, Socket } from 'socket.io'
import { v4 as uuidv4 } from 'uuid'
import { Payload, reconnectRequestPayload, reconnectResponsePayload } from '../common/payloads'
import { Player, createPlayerFromIPlayer } from '../common/player'
import { config } from '../config'
import { SessionSocket, socketEventsListeners } from './socketEventListeners'
import { SocketEventsCommon, SocketEventsFromClient, SocketEventsFromHost, SocketEventsFromServer } from './types/socketEvents'

declare module 'http' {
    interface IncomingMessage {
        session: SessionData
    }
}

export class BlefServer {
    io: Server
    serverSocket?: Socket
    rooms = new Set<string>()
    roomHosts = new Map<string, string>()

    constructor(server: http.Server) {
        this.io = new Server(server, {
            cors: {
                origin: ['http://localhost:5173', 'http://localhost:5174', config.FRONTEND_SERVER_ADDRESS],
                methods: ['GET', 'POST'],
                allowedHeaders: ['my-custom-header'],
                credentials: true,
            },
        })

        this.io.on('connection', (socket) => {
            //console.log('A user connected');
            this.setupConnection(socket)
            socketEventsListeners(this, <SessionSocket>socket)
        })
    }

    setupConnection(socket: Socket) {
        if (!socket.uid) {
            socket.uid = uuidv4()
        }
    }

    // Plan for those functions:
    // Lets simplyfy whole server
    // So basicly as it turns ou because this is just a broker server the only uniqe event handling we need is connection and disconnection
    // For other events we can define common functions and than define which one should we use
    // f.e. we listen to event ExapmleEvent and than we can use either of bellow three functions to decide who should we pass payload to
    // All of those functions should have callback as paramater (or be a promise) and than call that callback when client emits ExapleEvent
    // So doing it this way we can alawys expect client to emit a callback with same event (or not if smthng went wrong)
    passToEveryoneExceptSender(
        event: SocketEventsCommon,
        payload: Payload, 
        socket: Socket
    ) {
        let gameId = this.getRoomId(socket)
        socket.to(gameId).emit(event, payload)
    }

    passToHost(
        event: SocketEventsCommon,
        payload: Payload,
        socket: Socket
    ) {
        let gameId = this.getRoomId(socket)
        let roomHostSocketId = this.roomHosts.get(gameId)
        let roomHostSocket
        if (roomHostSocketId) {
            roomHostSocket = this.io.sockets.sockets.get(roomHostSocketId)
            roomHostSocket?.emit(event, payload)
        }
    }

    passToClientAndHost(
        event: SocketEventsCommon,
        payload: Payload,
        socket: Socket
    ) {
        let gameId = this.getRoomId(socket)

        this.io.in(gameId).emit(event, payload)
    }

    getRoomId(socket: Socket): string {
        if (!socket.gameId) {
            throw 'request dosent contain session or gameId' + new Error().stack
        }
        return socket.gameId
    }

    askHostForReconnection(socket: Socket, request: reconnectRequestPayload) {
        let hostSocketId = this.roomHosts.get(request.gameId)
        if (!hostSocketId) {
            const onFailResponse: reconnectResponsePayload = { reconnectRequest: request, didReconnect: false }
            socket.emit(SocketEventsFromHost.reconnectToGame, onFailResponse)
            return
        }
        request.requesterSocketId = socket.id
        let roomHostSocket
        roomHostSocket = this.io.sockets.sockets.get(hostSocketId)
        roomHostSocket?.emit(SocketEventsFromClient.reconnectToGame, request)
    }

    reconnectionResponse(socket: Socket, responsePayload: reconnectResponsePayload) {
        //console.log('reconect response');

        let clientSid = responsePayload.reconnectRequest.requesterSocketId
        if (!clientSid) {
            //console.log('   no sockId');
            return
        }

        let clientSocket = this.io.sockets.sockets.get(clientSid)
        if (!clientSocket) {
            //console.log('   no sock');
            return
        }

        if (!responsePayload.didReconnect) {
            //console.log('   no recon');
            clientSocket.emit(SocketEventsFromHost.reconnectToGame, responsePayload)
        }
        const req: IncomingMessage = clientSocket.request

        //TODO we  should check if request (defined line above) has values in if below
        if (!responsePayload.reconnectRequest.gameId) {
            console.debug('Reconnection failed')
            responsePayload.didReconnect = false
            socket.emit(SocketEventsFromHost.reconnectToGame, responsePayload)
            socket.disconnect()
            return
        }

        const session = req.session

        clientSocket.gameId = responsePayload.reconnectRequest.gameId
        clientSocket.uid = responsePayload.reconnectRequest.requesterUid
        if (responsePayload.gameInfo) {
            clientSocket.player = {
                username: responsePayload.gameInfo.thisPlayerName,
                uid: responsePayload.reconnectRequest.requesterUid,
                isOnline: true,
                isHost: false,
            }
        }

        clientSocket.emit(SocketEventsFromHost.reconnectToGame, responsePayload)

        this.io.in(responsePayload.reconnectRequest.gameId).emit(SocketEventsFromServer.playerReconnected, { uid: responsePayload.reconnectRequest.requesterUid })
        clientSocket.join(responsePayload.reconnectRequest.gameId)
    }

    disconnectPlayer(playerSocket: Socket) {
        if (playerSocket.gameId) {
            playerSocket.leave(playerSocket.gameId)
            playerSocket.to(playerSocket.gameId).emit(SocketEventsCommon.playerLeftGame, { uid: playerSocket.uid })
            playerSocket.gameId = null
        }
    }

    getPlayersInRoom(roomId: string) {
        let clientsInRoom = this.io.sockets.adapter.rooms.get(roomId)
        if (!clientsInRoom) {
            throw 'no players in da room!?' + roomId
        }
        let playersInRoom: Player[] = []
        for (const clientId of clientsInRoom) {
            const clientSocket = this.io.sockets.sockets.get(clientId)
            if (!clientSocket) {
                throw 'Couldnt find socket for player' + clientId
            }
            if (clientSocket.player) {
                playersInRoom.push(createPlayerFromIPlayer(clientSocket.player))
            }
        }
        return playersInRoom
    }
}
