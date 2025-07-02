import random
from typing import List, Dict, Tuple, Optional

import os
import sys

# Add parent dir to sys.path so you can import sibling modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from model.card import (
    Card,
    CardColor,
    ColorToIndex,
    full_card_name_to_numeric,
    initialize_count_table,
    CardCountTable,
    Rank,
)
from common.types import (
    Player,
    GameStartPayload,
    CheckToPlayersPayload,
    CheckToServerPayload,
)
from handRankings import HandInfo, check_functions_map
from igame import IGame

CardType = Tuple[str, str]


# Tworzenie talii
deck: List[CardType] = [
    (rank, color)
    for rank in Rank.__members__.keys()
    for color in CardColor.__members__.keys()
]


class Game(IGame):
    def __init__(
        self,
        players: List[Player],
        game_start_data: GameStartPayload,
        this_player_id: str,
        initial_card_counts: CardCountTable,
    ):
        super().__init__(players, game_start_data, this_player_id)
        self.hands: Dict[str, List[Card]] = dict(game_start_data.newHands)
        self.deck: List[Card] = deck[:]
        self.card_counts: CardCountTable = initial_card_counts
        self.is_finished: bool = False

    def draw_cards(self, number_of_cards: int) -> List[Card]:
        if number_of_cards > 5:
            raise ValueError("Drawing more than 5 cards is not allowed")
        if number_of_cards > len(self.deck):
            raise ValueError("Not enough cards in deck to draw")

        drawn_cards: List[Card] = []
        while len(drawn_cards) < number_of_cards:
            random_index = random.randint(0, len(self.deck) - 1)
            card = self.deck.pop(random_index)
            drawn_cards.append(card)
            rank_index = full_card_name_to_numeric[card[0]].numeric
            color_index = ColorToIndex[card[1]]
            self.card_counts[rank_index][color_index] += 1

        return drawn_cards

    def shuffle_deck(self) -> None:
        self.deck = deck[:]

    def deal_cards(self) -> None:
        self.card_counts = initialize_count_table()
        self.shuffle_deck()
        self.hands = {}

        for player in self.players:
            self.hands[player.uid] = self.draw_cards(1 + player.loses)

    def check(self, data: Optional[CheckToPlayersPayload] = None) -> bool:
        if self.previous_bet is None:
            raise ValueError("There is no previous bet")

        check_successful = True

        was_bet_found = check_functions_map[self.previous_bet.selectedRanking](
            self.card_counts, self.previous_bet
        )

        if not was_bet_found:
            prev_player_index = (
                self.current_player_index - 1 + self.player_count
            ) % self.player_count
            self.current_player_index = prev_player_index
            self.current_player = self.players[self.current_player_index].uid
            check_successful = False

        self.players[self.current_player_index].loses += 1
        self.player_that_lost = self.players[self.current_player_index]

        if self.players[self.current_player_index].loses == 5:
            self.eliminated_players.append(self.players[self.current_player_index])
            self.players.pop(self.current_player_index)
            self.player_count -= 1
            self.current_player_index -= 1
            if self.current_player_index < 0:
                self.current_player_index = len(self.players) - 1
            self.current_player = self.players[self.current_player_index].uid

        self.previous_bet = None
        return check_successful

    def validate_check(self) -> CheckToServerPayload:
        check_result = self.check()
        self.deal_cards()

        new_hand = self.hands.get(self.this_player_id)
        if new_hand:
            self.hand = new_hand

        payload: CheckToServerPayload = CheckToServerPayload(
            newHands=self.hands,
            players=self.players,
            roundStartingPlayerId=self.current_player,
            eliminatedPlayers=self.eliminated_players,
            checkSuccesful=check_result,
            playerThatLost=self.player_that_lost,
        )
        return payload

    def get_card_count(self) -> CardCountTable:
        return self.card_counts
