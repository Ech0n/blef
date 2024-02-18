export enum SocketEvents {
    createGameToServer = 'createGameToServer',
    createGameToHost = 'createGameToHost',
    joinGameToServer = 'joinGameToServer',
    joinGameToClient = 'joinGameToClient',
    newPlayerJoinedGameToHost = 'newPlayerJoinedGameToHost',
    newPlayerJoinedGameToClient = 'newPlayerJoinedGameToClient',
    playerLeftGameToServer = 'playerLeftGameToServer',
    playerLeftGameToPlayers = 'playerLeftGameToPlayers',
    hitToHost = 'hitToHost',
    checkToHost = 'checkToHost',
    gameUpdateNextPlayerToClient = 'gameUpdateNextPlayerToClient',
    gameUpdateEndOfRoundAndStartOfNewRountToCLient = 'gameUpdateEndOfRoundAndStartOfNewRountToCLient',
}