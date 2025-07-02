from typing import Dict
from common.types import HandInfo
from model.card import card_to_rank_translation  # Zakładam, że HandInfo i translacja są zaimportowane

# Hierarchie rankingów i kolorów
compare_hierarchy: Dict[str, int] = {
    "royal": 9,
    "flush": 8,
    "four": 7,
    "full": 6,
    "street": 5,
    "color": 4,
    "double": 3,
    "three": 2,
    "pair": 1,
    "one": 0,
}

color_hierarchy: Dict[str, int] = {
    "spade": 4,
    "heart": 3,
    "club": 2,
    "diamond": 1,
}


def compare_ranking_a_greater_than_b(old_ranking: HandInfo, new_ranking: HandInfo) -> bool:
    old_rank = compare_hierarchy[old_ranking.selectedRanking]
    new_rank = compare_hierarchy[new_ranking.selectedRanking]

    if old_rank == new_rank:
        if old_ranking.selectedRanking in {"one", "pair", "three", "four"}:
            return (
                card_to_rank_translation[old_ranking.primaryCard]["numeric"]
                >= card_to_rank_translation[new_ranking.primaryCard]["numeric"]
            )

        if old_ranking.selectedRanking in {"double", "full"}:
            if (
                card_to_rank_translation[old_ranking.primaryCard]["numeric"]
                == card_to_rank_translation[new_ranking.primaryCard]["numeric"]
            ):
                return (
                    card_to_rank_translation[old_ranking.secondaryCard]["numeric"]
                    >= card_to_rank_translation[new_ranking.secondaryCard]["numeric"]
                )
            return (
                card_to_rank_translation[old_ranking.primaryCard]["numeric"]
                >= card_to_rank_translation[new_ranking.primaryCard]["numeric"]
            )

        if old_ranking.selectedRanking in {"color", "royal"}:
            return (
                color_hierarchy[old_ranking.selectedColor]
                >= color_hierarchy[new_ranking.selectedColor]
            )

        if old_ranking.selectedRanking == "street":
            return (
                card_to_rank_translation[old_ranking.startingCard]["numeric"]
                >= card_to_rank_translation[new_ranking.startingCard]["numeric"]
            )

        if old_ranking.selectedRanking == "flush":
            old_value = card_to_rank_translation[old_ranking.startingCard]["numeric"]
            new_value = card_to_rank_translation[new_ranking.startingCard]["numeric"]
            if old_value > new_value:
                return True
            elif old_value == new_value:
                return (
                    color_hierarchy[old_ranking.selectedColor]
                    >= color_hierarchy[new_ranking.selectedColor]
                )
            return False

    return old_rank >= new_rank
