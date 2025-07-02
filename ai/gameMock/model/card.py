import random
from typing import Dict, List, Tuple, Any
from enum import Enum

# === ENUMS ===

class CardColor(Enum):
    spade = 4
    heart = 3
    club = 2
    diamond = 1

ColorToIndex: Dict[str, int] = {
    'spade': 4,
    'heart': 3,
    'club': 2,
    'diamond': 1,
}

class Rank(Enum):
    ace = 14
    king = 13
    queen = 12
    jack = 11
    ten = 10
    nine = 9
    eight = 8
    seven = 7
    six = 6
    five = 5
    four = 4
    three = 3
    two = 2

# === STRUCTURES ===

card_to_rank_translation: Dict[str, Dict[str, Any]] = {
    '2': {'numeric': 2, 'string': 'two'},
    '3': {'numeric': 3, 'string': 'three'},
    '4': {'numeric': 4, 'string': 'four'},
    '5': {'numeric': 5, 'string': 'five'},
    '6': {'numeric': 6, 'string': 'six'},
    '7': {'numeric': 7, 'string': 'seven'},
    '8': {'numeric': 8, 'string': 'eight'},
    '9': {'numeric': 9, 'string': 'nine'},
    '10': {'numeric': 10, 'string': 'ten'},
    'j': {'numeric': 11, 'string': 'jack'},
    'q': {'numeric': 12, 'string': 'queen'},
    'k': {'numeric': 13, 'string': 'king'},
    'a': {'numeric': 14, 'string': 'ace'},
}

full_card_name_to_numeric: Dict[str, Dict[str, int]] = {
    'two': {'numeric': 2},
    'three': {'numeric': 3},
    'four': {'numeric': 4},
    'five': {'numeric': 5},
    'six': {'numeric': 6},
    'seven': {'numeric': 7},
    'eight': {'numeric': 8},
    'nine': {'numeric': 9},
    'ten': {'numeric': 10},
    'jack': {'numeric': 11},
    'queen': {'numeric': 12},
    'king': {'numeric': 13},
    'ace': {'numeric': 14},
}

# === TYPE ALIASES ===

Card = Tuple[str, str]  # e.g. ('jack', 'heart')
CardCountTable = Dict[int, Dict[int, int]]

# === INITALIZERS ===

def initialize_count_table() -> CardCountTable:
    table: CardCountTable = {}

    color_table: Dict[int, int] = {color_value: 0 for color_value in ColorToIndex.values()}

    for card_key in card_to_rank_translation:
        card_value = card_to_rank_translation[card_key]['numeric']
        table[card_value] = color_table.copy()

    return table


def initialize_game(players: List[Any]) -> Dict[str, Any]:
    card_counts = initialize_count_table()
    starting_player_id = players[0].uid

    # Buil
