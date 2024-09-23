import { io, type Socket } from 'socket.io-client'
import { config } from '../../config'
import { SocketEventsCommon, SocketEventsFromClient, SocketEventsFromHost, SocketEventsFromServer } from '../../src/types/socketEvents'
import {
    gameStartPayload,
    GameState,
    hostGameRequest,
    joinGameResponsePayload,
    joinRequest,
    Payload,
    reconnectRequestPayload,
    reconnectResponsePayload,
} from '../../common/payloads'
import { AppState } from './StateTypes'
import { Player } from '../../common/player'
import { Game } from './game/Game'
import { readyPlayersCounter, waitingPlayersCounter } from './game/stores'
import { GameServer } from './game/GameServer'
import { playersStore } from './game/stores'

const serverUrl: string = config.BACKEND_SERVER_ADDRESS
export class ConnectionHandler {
    connection?: BaseConnection

    join(appState: AppState, onGameJoinedCallback: (data: joinGameResponsePayload) => void) {
        if (!appState.gameId) {
            throw 'Cannot join without game id'
        }
        if (!appState.username) {
            throw 'Cannot join without username'
        }
        this.connection = new ClientConnection(appState)

        //TODO: move to connection
        this.connection.socket.on(SocketEventsFromHost.joinResponse, (data: joinGameResponsePayload) => {
            if (!data || !data.didJoin || !data.gameState) {
                //TODO: Some kind of toast saying "Could not connect to game" and possibly information why
                return
            }
            appState.gameState = data.gameState
            playersStore.set(appState.gameState.players)
            //TODO: consider replacing whole appState
            appState.player = new Player(appState.gameState.thisPlayerId, appState.gameState.thisPlayerName)
            appState.player.isOnline = true

            if (appState.gameId) {
                sessionStorage.setItem('gameId', appState.gameId)
            }
            sessionStorage.setItem('uid', data.gameState.thisPlayerId)

            onGameJoinedCallback(data)

            //@ts-ignore
            this.connection.setupConnectoinHandlingListeners(appState)
        })

        let requestPayload: joinRequest = {
            gameId: appState.gameId,
            requesterUsername: appState.username,
        }
        this.connection.joinOrHostRoom(requestPayload)
    }

    host(appState: AppState, onGameJoinedCallback: () => void) {
        if (!appState.username) {
            throw 'Cannot host without username'
        }
        this.connection = new HostConnection(appState)

        this.connection.socket.on(SocketEventsCommon.createGame, (data: { gameId: string; hostId: string }) => {
            if (!appState.username) {
                throw 'Username is null. This line should be unreacheable!'
            }
            appState.gameId = data.gameId

            let host = new Player(data.hostId, appState.username)
            host.isOnline = true
            appState.gameState = {
                players: [host],
                thisPlayerId: data.hostId,
                thisPlayerName: appState.username,
                gameStarted: false,
            }
            playersStore.set(appState.gameState.players)

            onGameJoinedCallback()
            //@ts-ignore
            this.connection.setupConnectoinHandlingListeners(appState)
        })

        let requestPayload: hostGameRequest = {
            username: appState.username,
        }
        this.connection.joinOrHostRoom(requestPayload)
    }

    reconnect(appState: AppState, playerUid: string, onGameJoinedCallback: () => void) {
        if (!appState.gameId) {
            throw 'Cannot join without game id'
        }

        this.connection = new ClientConnection(appState)

        this.connection.socket.on(SocketEventsFromHost.reconnectToGame, (response: reconnectResponsePayload) => {
            if (!this.connection) {
                return
            }
            if (!response.didReconnect || !response.gameState) {
                this.connection.socket.disconnect()
                return
            }
            appState.gameState = response.gameState
            playersStore.set(appState.gameState.players)

            onGameJoinedCallback()
        })

        const request: reconnectRequestPayload = {
            requesterUid: playerUid,
            gameId: appState.gameId,
        }
        this.connection.socket.emit(SocketEventsFromClient.reconnectToGame, request)
    }
    setupLobbyListeners(game: Game, onGameStarted: (data: gameStartPayload) => void, onGameClosed: () => void) {
        this.connection?.setupLobbyListeners(game, onGameStarted, onGameClosed)
    }
}
class BaseConnection {
    socket: Socket
    appState: AppState
    game!: Game
    constructor(state: AppState) {
        this.socket = io(serverUrl)
        this.appState = state
    }

    joinOrHostRoom(req: Payload) {}
    setupConnectoinHandlingListeners(appState: AppState) {
        this.socket.on(SocketEventsFromServer.playerReconnected, (data: { uid: string }) => {
            if (!appState.gameState) {
                return
            }
            let player = appState.gameState.players.find((pl) => {
                return pl.uid === data.uid
            })
            if (!player) {
                return
            }

            player.isOnline = true
        })
    }

    setupLobbyListeners(game: Game, onGameStarted: (data: gameStartPayload) => void, onGameClosed: () => void) {
        this.game = game
        this.socket.on(SocketEventsCommon.newPlayerJoined, (data: { username: string; uid: string; isOnline: boolean }) => {
            if (!this.appState.gameState) {
                return
            }
            if (!data) {
                throw 'No data from server'
            }

            let newPlayer: Player = new Player(data.uid, data.username)
            newPlayer.isOnline = data.isOnline

            this.appState.gameState.players = [...this.appState.gameState.players, newPlayer]
            playersStore.set(this.appState.gameState.players)
        })

        this.socket.on(SocketEventsCommon.gameStarted, (data: gameStartPayload) => {
            console.debug('reveived game start message', data)
            if (data && data.startingPlayerId && this.appState.gameState) {
                onGameStarted(data)
            }
        })

        this.socket.on(SocketEventsCommon.gameClosed, () => {
            onGameClosed()
        })

        this.socket.on(SocketEventsCommon.playerLeftGame, (data: { uid: string }) => {
            if (!data) {
                return
            }
            this.handlePlayerLeaving(data.uid)
        })
        this.socket.on(SocketEventsCommon.kickPlayer, (data: { uid: string }) => {
            if (!data) {
                return
            }
            this.handlePlayerLeaving(data.uid)
        })
    }
    handlePlayerLeaving(playerId: string) {
        if (!this.appState.gameState) {
            return
        }
        if (playerId === this.appState.gameState.thisPlayerId) {
            return
        }

        if (this.appState.gameState?.gameStarted) {
            let playerThatLeft = this.appState.gameState.players.find((pl) => pl.uid === playerId)
            if (playerThatLeft) {
                playerThatLeft.isOnline = false
            }
        } else {
            // Tag the disconnected player as not connected
            this.appState.gameState.players = this.appState.gameState.players.filter((pl) => {
                return pl.uid !== playerId
            })
            this.appState.gameState.players = this.appState.gameState.players
            playersStore.set(this.appState.gameState.players)
        }
    }
}

class HostConnection extends BaseConnection {
    joinOrHostRoom(req: hostGameRequest) {
        this.socket.emit(SocketEventsCommon.createGame, req)
    }

    setupLobbyListeners(game: GameServer, onGameStarted: (data: gameStartPayload) => void, onGameClosed: () => void) {
        this.game = game
        //FIXME: code repetition
        this.socket.on(SocketEventsCommon.newPlayerJoined, (data: { username: string; uid: string; isOnline: boolean }) => {
            console.log('recvd new player joined')
            if (!this.appState.gameState) {
                return
            }
            if (!data) {
                throw 'No data from server'
            }
            let searchForPlayer = this.appState.gameState.players.find((el) => el.username === data.username)
            if (searchForPlayer) {
                return
            }
            if (this.appState.gameState.gameStarted) {
                waitingPlayersCounter.update((n) => n + 1)
            } else {
                readyPlayersCounter.update((n) => n + 1)
            }
            let newPlayer: Player = new Player(data.uid, data.username)
            newPlayer.isOnline = data.isOnline

            this.appState.gameState.players = [...this.appState.gameState.players, newPlayer]
            playersStore.set(this.appState.gameState.players)
        })
        this.socket.on(SocketEventsFromClient.joinRequest, (data: joinRequest) => {
            console.log('recieved join request')
            let response: joinGameResponsePayload = {
                didJoin: false,
                request: data,
            }
            if (!data || !data.requesterUid || !this.appState.gameState) {
                this.socket.emit(SocketEventsFromHost.joinResponse, response)
                return
            }

            let playersList = this.appState.gameState.players
            let wasPlayerFound = playersList.find((el) => {
                return el.username === data.requesterUsername
            })

            if (!wasPlayerFound) {
                if (this.appState.gameState.gameStarted) {
                    this.socket.emit(SocketEventsFromHost.joinResponse, response)

                    return
                }

                let newPlayer = new Player(data.requesterUid, data.requesterUsername)
                newPlayer.isOnline = true
                playersList = [...this.appState.gameState.players, newPlayer]
                playersStore.set(this.appState.gameState.players)
            } else {
                //Its not undefined
                //@ts-ignore
                response.request.requesterUid = wasPlayerFound.uid
                if (!this.appState.gameState.gameStarted || wasPlayerFound.isOnline) {
                    this.socket.emit(SocketEventsFromHost.joinResponse, response)
                    return
                } else {
                    wasPlayerFound.isOnline = true
                }
            }

            response.didJoin = true
            let gameState: GameState = { players: playersList, thisPlayerId: data.requesterUid, thisPlayerName: data.requesterUsername, gameStarted: false }

            if (this.appState.gameState.gameStarted) {
                let hand = game.hands.get(data.requesterUid)
                if (hand) {
                    gameState.gameStarted = true

                    gameState.startedGameInfo = {
                        currentBet: game.previousBet,
                        currentPlayer: game.currentPlayer,
                        newHand: hand,
                    }
                }
            }
            response.gameState = gameState

            console.log('sent response')
            this.socket.emit(SocketEventsFromHost.joinResponse, response)
        })

        this.socket.on(SocketEventsCommon.playerLeftGame, (data: { uid: string }) => {
            if (!data) {
                return
            }
            this.handlePlayerLeaving(data.uid)
        })
        this.socket.on(SocketEventsCommon.kickPlayer, (data: { uid: string }) => {
            if (!data) {
                return
            }
            this.handlePlayerLeaving(data.uid)
        })

        this.socket.on(SocketEventsCommon.playerReady, (readyPlayerId: string) => {
            readyPlayersCounter.update((n) => n + 1)
        })
        this.socket.on(SocketEventsCommon.gameStarted, (data: gameStartPayload) => {
            if (data && this.appState.gameState) {
                let gameStartData = data

                // if(botCounter>0)
                // {
                //     // initalize ai engine
                //     pass
                // }
                onGameStarted(data)
            }
        })

        this.socket.on(SocketEventsCommon.gameClosed, () => {
            onGameClosed()
        })
    }

    handlePlayerLeaving(playerId: string): void {
        if (this.appState.gameState?.gameStarted) {
            let playerThatLeft = this.appState.gameState.players.find((pl) => pl.uid === playerId)
            if (playerThatLeft) {
                playerThatLeft.isOnline = false
            }
            this.appState.gameState.players = this.appState.gameState.players
            playersStore.set(this.appState.gameState.players)
        } else if (this.appState.gameState) {
            let wasInLobby: boolean = false
            for (let player of this.appState.gameState.players) {
                if (player.uid === playerId) {
                    wasInLobby = true
                    break
                }
            }

            this.appState.gameState.players = this.appState.gameState.players.filter((pl) => {
                return pl.uid !== playerId
            })
            this.appState.gameState.players = this.appState.gameState.players
            playersStore.set(this.appState.gameState.players)
            if (wasInLobby) readyPlayersCounter.update((n) => n - 1)
        }
    }
}

class ClientConnection extends BaseConnection {
    joinOrHostRoom(req: joinRequest) {
        this.socket.emit(SocketEventsFromClient.joinRequest, req)
    }
}
