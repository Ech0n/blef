from typing import Optional, List, Dict
from model.card import Card, CardCountTable
from common.types import (
    GameStartPayload,
    CheckToPlayersPayload,
    CheckToServerPayload,
    HitPayload,
    Player
)
from handRankings import HandInfo  # Zakładamy, że HandInfo jest w osobnym module
import copy

Decision = CheckToPlayersPayload | HitPayload


class IGame:
    def __init__(self, players: List[Player], game_start_data: GameStartPayload, this_player_id: str):
        self.player_count: int = len(players)
        self.players: List[Player] = [copy.deepcopy(p) for p in players]  # zakładamy że Player ma metodę copy
        self.hand: List[Card] = game_start_data.newHands[this_player_id]
        self.previous_bet: Optional[HandInfo] = None
        self.current_player: str = game_start_data.startingPlayerId
        self.eliminated_players: List[Player] = []
        self.current_player_index: int = next(
            (i for i, p in enumerate(self.players) if p.uid == self.current_player), 0
        )
        self.this_player_id: str = this_player_id
        self.game_closed: bool = False
        self.player_that_lost: Optional[Player] = None

    def remove_player(self, player_uid: str) -> None:
        self.players = [pl for pl in self.players if pl.uid != player_uid]
        self.eliminated_players = [pl for pl in self.eliminated_players if pl.uid != player_uid]
        self.player_count = len(self.players)

        if self.current_player_index >= self.player_count:
            self.current_player_index = 0
            if self.players:
                self.current_player = self.players[0].uid

    def hit(self, bet: HandInfo) -> None:
        # TODO: dodać walidację zakładu
        self.previous_bet = bet
        self.next_player()

    def next_player(self) -> None:
        self.current_player_index = (self.current_player_index + 1) % self.player_count
        self.current_player = self.players[self.current_player_index].uid

    def check(self, data: Optional[CheckToPlayersPayload] = None) -> bool:
        if data is None:
            raise ValueError("Data field not present in check()")

        self.hand = data.newHand
        self.players = data.players
        self.eliminated_players = data.eliminatedPlayers
        self.player_count = len(self.players)
        self.current_player = data.roundStartingPlayerId
        self.current_player_index = next(
            (i for i, p in enumerate(self.players) if p.uid == self.current_player), 0
        )
        self.previous_bet = None
        self.player_that_lost = data.playerThatLost
        return data.checkSuccesful

    def validate_check(self) -> Optional[CheckToServerPayload]:
        print("WARNING: CLIENT SHOULD NOT CALL HOST-ONLY FUNCTIONS!")
        return None

    def get_card_count(self) -> CardCountTable:
        print("WARNING: CLIENT SHOULD NOT CALL HOST-ONLY FUNCTIONS!")
        return {}
