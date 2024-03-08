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
}

export enum SocketEventsFromServer {
    reconnectionInfo = 'reconnectionInfo',
    playerLeftGame = 'playerLeftGame',
    requestReconnect = 'requestReconnect',
}

export enum SocketEventsFromHostAndClient {}

export enum SocketEventsFromHost {
    closeGame = 'closeGame',
    requestReconnectResponse = 'requestReconnectResponse',
    kickPlayer = 'kickPlayer',
    timerUpdate = 'timerUpdate',
    cardListToPlayers = 'cardListToPlayers',
}

export enum SocketEventsFromClient {
    leaveGame = 'ClientLeaveGame',
    reconnectToGame = 'reconnectToGame',
}
