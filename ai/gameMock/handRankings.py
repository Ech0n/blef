from model.card import card_to_rank_translation, ColorToIndex
from common.types import HandInfo
from typing import List, Dict
# Zakładam, że card_to_rank_translation i ColorToIndex są już zdefiniowane
# cards: List[List[int]] – 2D lista [ranga][kolor]

def royal_flush_checker(cards: List[List[int]], hand_info):
    selected_color = hand_info.selectedColor
    starting_card = card_to_rank_translation['10']['numeric']
    for i in range(5):
        if cards[starting_card + i][ColorToIndex[selected_color]] == 0:
            return False
    return True


def flush_checker(cards: List[List[int]], hand_info):
    selected_color = hand_info.selectedColor
    starting_card = card_to_rank_translation[hand_info.startingCard]['numeric']
    for i in range(5):
        if cards[starting_card + i][ColorToIndex[selected_color]] == 0:
            return False
    return True


def color_checker(cards: List[List[int]], hand_info) -> bool:
    selected_color = hand_info.selectedColor
    count = 0
    card_ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'j', 'q', 'k', 'a']
    for rank in card_ranks:
        rank_value = card_to_rank_translation[rank]['numeric']
        count += cards[rank_value][ColorToIndex[selected_color]]
    return count >= 5


def four_checker(cards: List[List[int]], hand_info):
    prim_card = card_to_rank_translation[hand_info.primaryCard]['numeric']
    if prim_card >= len(cards):
        return False
    count = sum(cards[prim_card][1:5])
    return count == 4


def full_checker(cards: List[List[int]], hand_info):
    prim_card = card_to_rank_translation[hand_info.primaryCard]['numeric']
    sec_card = card_to_rank_translation[hand_info.secondaryCard]['numeric']

    if prim_card >= len(cards) or sec_card >= len(cards):
        return False

    count_a = sum(cards[prim_card][:4])
    count_b = sum(cards[sec_card][:4])

    return count_a >= 3 and count_b >= 2


def street_checker(cards: List[List[int]], hand_info):
    starting_card = card_to_rank_translation[hand_info.startingCard]['numeric']
    for i in range(5):
        if starting_card + i >= len(cards):
            return False
        found = False
        for color_index in range(1, 5):
            if cards[starting_card + i][color_index] == 1:
                found = True
                break
        if not found:
            return False
    return True


def three_checker(cards: List[List[int]], hand_info):
    prim_card = card_to_rank_translation[hand_info.primaryCard]['numeric']
    if prim_card >= len(cards):
        return False
    count = sum(cards[prim_card][1:5])
    return count >= 3


def double_checker(cards: List[List[int]], hand_info):
    prim_card = card_to_rank_translation[hand_info.primaryCard]['numeric']
    sec_card = card_to_rank_translation[hand_info.secondaryCard]['numeric']

    if prim_card >= len(cards) or sec_card >= len(cards):
        return False

    count = [0, 0]
    for idx, card_index in enumerate([prim_card, sec_card]):
        count[idx] = sum(cards[card_index][1:5])

    return count[0] >= 2 and count[1] >= 2


def pair_checker(cards: List[List[int]], hand_info):
    prim_card = card_to_rank_translation[hand_info.primaryCard]['numeric']
    if prim_card >= len(cards):
        return False
    count = sum(cards[prim_card][1:5])
    return count >= 2


def one_checker(cards: List[List[int]], hand_info):
    prim_card = card_to_rank_translation[hand_info.primaryCard]['numeric']
    if prim_card >= len(cards):
        return False
    count = sum(cards[prim_card][1:5])
    return count >= 1


# Mapa funkcji jak w TypeScript
check_functions_map: Dict[str, callable] = {
    'royal': royal_flush_checker,
    'flush': flush_checker,
    'color': color_checker,
    'four': four_checker,
    'full': full_checker,
    'street': street_checker,
    'three': three_checker,
    'double': double_checker,
    'pair': pair_checker,
    'one': one_checker,
}
