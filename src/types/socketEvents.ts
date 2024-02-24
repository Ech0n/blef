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
}

export enum SocketEventsFromServer {}

export enum SocketEventsFromHostAndClient {}

export enum SocketEventsFromHost {
    closeGame = 'closeGame',
    kickPlayer = 'kickPlayer',
}

export enum SocketEventsFromClient {}
