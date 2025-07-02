from dataclasses import dataclass, field
from enum import Enum
from typing import Dict, List, Optional, Union, Tuple, TypedDict

# === Card and Related Types ===

Card = Tuple[str, str]
CardCountTable = Dict[int, Dict[int, int]]


@dataclass
class HandInfo:
    selectedRanking: str
    primaryCard: str
    secondaryCard: str
    selectedColor: str
    startingCard: str


# === Player and Game Structures ===


@dataclass
class IPlayer:
    uid: str
    username: str
    isOnline: bool
    isHost: bool


@dataclass
class Player(IPlayer):
    loses: int = 0
    isBot: bool = False

    def __init__(self, id: str, username: str):
        super().__init__(uid=id, username=username, isOnline=True, isHost=False)
        self.loses = 0
        self.isBot = False


def create_player_from_iplayer(ip: IPlayer) -> Player:
    player = Player(ip.uid, ip.username)
    player.isOnline = ip.isOnline
    player.isHost = ip.isHost
    return player


# === Payload Base ===


class Payload:
    pass


# === Payloads ===


class CheckToServerPayload(Payload):
    def __init__(
        self,
        newHands: Dict[str, List[Card]],
        roundStartingPlayerId: str,
        eliminatedPlayers: List[Player],
        players: List[Player],
        checkSuccesful: bool,
        playerThatLost: Player,
    ):
        self.newHands = newHands
        self.roundStartingPlayerId = roundStartingPlayerId
        self.eliminatedPlayers = eliminatedPlayers
        self.players = players
        self.checkSuccesful = checkSuccesful
        self.playerThatLost = playerThatLost


class CheckToPlayersPayload(Payload):
    def __init__(
        self,
        newHand: List[Card],
        players: List[Player],
        roundStartingPlayerId: str,
        eliminatedPlayers: List[Player],
        checkSuccesful: bool,
        playerThatLost: Player,
    ):
        self.newHand = newHand
        self.players = players
        self.roundStartingPlayerId = roundStartingPlayerId
        self.eliminatedPlayers = eliminatedPlayers
        self.checkSuccesful = checkSuccesful
        self.playerThatLost = playerThatLost


class GameStartPayload(Payload):
    def __init__(self, startingPlayerId: str, newHands: Dict[str, List[Card]]):
        self.startingPlayerId = startingPlayerId
        self.newHands = newHands


class HitPayload(Payload):
    def __init__(self, move: HandInfo):
        self.move = move


@dataclass
class StartedGameInfo:
    currentPlayer: str
    currentBet: Optional[HandInfo]
    newHand: List[Card]


class GameState(Payload):
    def __init__(
        self,
        players: List[Player],
        thisPlayerId: str,
        thisPlayerName: str,
        gameStarted: bool,
        startedGameInfo: Optional[StartedGameInfo] = None,
    ):
        self.players = players
        self.thisPlayerId = thisPlayerId
        self.thisPlayerName = thisPlayerName
        self.gameStarted = gameStarted
        self.startedGameInfo = startedGameInfo


@dataclass
class JoinRequest(Payload):
    requesterSocketId: Optional[str]
    requesterUid: Optional[str]
    requesterUsername: str
    gameId: str


@dataclass
class HostGameRequest(Payload):
    username: str


class JoinGameResponsePayload(Payload):
    def __init__(
        self,
        didJoin: bool,
        gameState: Optional[GameState] = None,
        request: Optional[JoinRequest] = None,
    ):
        self.didJoin = didJoin
        self.gameState = gameState
        self.request = request


@dataclass
class ReconnectRequestPayload(Payload):
    requesterSocketId: Optional[str]
    requesterUid: str
    gameId: str


@dataclass
class ReconnectResponsePayload(Payload):
    reconnectRequest: ReconnectRequestPayload
    didReconnect: bool
    gameState: Optional[GameState] = None


@dataclass
class PlayerJoinedPayload(Payload):
    username: str
    uid: str
    isOnline: bool
    isBot: bool


@dataclass
class CardListToPlayersPayload(Payload):
    cardList: CardCountTable


# === Socket Events ===


class SocketEventsCommon(str, Enum):
    joinGame = "joinGame"
    createGame = "createGame"
    newPlayerJoined = "newPlayerJoined"
    gameStarted = "gameStarted"
    playerLeftGame = "playerLeftGame"
    hit = "hit"
    checkToPlayers = "checkToPlayers"
    checkToServer = "checkToServer"
    kickPlayer = "kickPlayer"
    gameClosed = "gameClosed"
    updateTimerToPlayers = "updateTimerToPlayers"
    updateCardCountToPlayers = "updateCardCountToPlayers"
    playerReady = "playerReady"


class SocketEventsFromServer(str, Enum):
    reconnectionInfo = "reconnectionInfo"
    playerLeftGame = "playerLeftGame"
    requestReconnect = "requestReconnect"
    playerReconnected = "playerReconnected"


class SocketEventsFromHost(str, Enum):
    closeGame = "closeGame"
    requestReconnectResponse = "requestReconnectResponse"
    kickPlayer = "kickPlayer"
    timerUpdate = "timerUpdate"
    cardListToPlayers = "cardListToPlayers"
    reconnectToGame = "reconnectToGameResponseFromHost"
    joinResponse = "joinResponse"
    addBot = "addBot"


class SocketEventsFromClient(str, Enum):
    leaveGame = "ClientLeaveGame"
    reconnectToGame = "reconnectToGameRequestFromClient"
    playerReady = "playerReady"
    joinRequest = "joinRequest"


class SocketEventsFromHostAndClient(str, Enum):
    pass


AnySocketEvent = Union[
    SocketEventsCommon,
    SocketEventsFromClient,
    SocketEventsFromHost,
    SocketEventsFromHostAndClient,
    SocketEventsFromServer,
]
