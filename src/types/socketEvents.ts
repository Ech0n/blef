export enum SocketEventsCommon {
    joinGame = 'joinGame',
    createGame = 'createGame',
    newPlayerJoined = 'newPlayerJoined',
    gameStarted = 'gameStarted',
    playerLeftGame = 'playerLeftGame',
    hit = 'hit',
    checkToPlayers = 'checkToPlayers',
    checkToServer = 'checkToServer',

    kickPlayer = 'kickPlayer',

    gameClosed = 'gameClosed',
    updateTimerToPlayers = 'updateTimerToPlayers',
    updateCardCountToPlayers = 'updateCardCountToPlayers',
    playerReady = 'playerReady',
}

export enum SocketEventsFromServer {
    reconnectionInfo = 'reconnectionInfo',
    playerLeftGame = 'playerLeftGame',
    requestReconnect = 'requestReconnect',
    playerReconnected = 'playerReconnected',
}

export enum SocketEventsFromHostAndClient {}

export enum SocketEventsFromHost {
    closeGame = 'closeGame',
    requestReconnectResponse = 'requestReconnectResponse',
    kickPlayer = 'kickPlayer',
    timerUpdate = 'timerUpdate',
    cardListToPlayers = 'cardListToPlayers',
    reconnectToGame = 'reconnectToGameResponseFromHost',
    joinResponse = 'joinResponse',
    addBot = 'addBot',
}

export enum SocketEventsFromClient {
    leaveGame = 'ClientLeaveGame',
    reconnectToGame = 'reconnectToGameRequestFromClient',
    playerReady = 'playerReady',
    joinRequest = 'joinRequest',
}

export type anySocketEvent = SocketEventsCommon| SocketEventsFromClient | SocketEventsFromHost | SocketEventsFromHostAndClient | SocketEventsFromServer 