export enum SocketEvents {
    createGameToServer = 'createGameToServer',
    createGameToHost = 'createGameToHost',
    joinGameToServer = 'joinGameToServer',
    joinGameToClient = 'joinGameToClient',
    newPlayerJoinedGameToHost = 'newPlayerJoinedGameToHost',
    newPlayerJoinedGameToClient = 'newPlayerJoinedGameToClient',
    playerLeftGameToServer = 'playerLeftGameToServer',
    playerLeftGameToPlayers = 'playerLeftGameToPlayers',
    hitToPlayers = 'hitToPlayers',
    hitToServer = 'hitToServer',
    checkToPlayers = 'checkToPlayers',
    checkToServer = 'checkToServer',
    startGameToServer = 'startGameToServer',
    startGameToClients = 'startGameToClients',
    startGameToHost = 'startGameToHost',
    gameClosedToServer = 'gameClosedToServer',
}
