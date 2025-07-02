import random
from typing import List, Optional, Dict

# Assume these are imported from your actual modules
from game import Game, Player, Card
from common.types import CheckToPlayersPayload, CheckToServerPayload, CardCountTable, GameStartPayload
from model.card import initialize_count_table, ColorToIndex, full_card_name_to_numeric

# Dummy/mock implementations for missing types and values (replace these with your actual imports)
deck = []  # Should be your full deck of cards, e.g. list of Card tuples
check_functions_map = {}  # Your map of ranking to validation functions

def get_player_input(prompt: str, options: List[str]) -> str:
    """Helper: get validated input from user."""
    while True:
        inp = input(f"{prompt} ({'/'.join(options)}): ").strip().lower()
        if inp in options:
            return inp
        print(f"Invalid input. Please enter one of {options}.")

def print_hand(hand: List[Card]):
    print("Your hand:")
    for i, card in enumerate(hand):
        print(f" {i+1}: {card[0]} of {card[1]}")

def main():
    # Setup players and game start data (mock example)
    player_id = "player1"
    
    players = [Player("player1", "You"),Player("player2", "Enemy")]
    card1 = ('A', 'spade')
    card2 = ('2', 'heart')
    card3 = ('3', 'club')
    card4 = ('4', 'diamond')
    new_hands = {
        "player1": [card1, card2],
        "player2": [card3, card4],
    }
    game_start_data = GameStartPayload(
        startingPlayerId="player1",
        newHands=new_hands
    )
    initial_card_counts = initialize_count_table()

    game = Game(players, game_start_data, player_id, initial_card_counts)

    print("Welcome to the card game CLI!")
    print_hand(game.hand)

    while not game.is_finished:
        print(f"Current player: {game.current_player}")
        if game.current_player == player_id:
            print_hand(game.hand)
            print("Make your move.")
            
            # Example: Let user create a bet (simplified)
            selected_ranking = input("Enter ranking (e.g., 'pair', 'flush'): ").strip()
            primary_card = input("Enter primary card name (e.g., 'A', '10', 'K'): ").strip()
            secondary_card = input("Enter secondary card name or leave empty: ").strip() or primary_card
            selected_color = input("Enter color (spade, heart, club, diamond): ").strip()
            starting_card = input("Enter starting card name (for sequences): ").strip() or primary_card

            bet = {
                'selectedRanking': selected_ranking,
                'primaryCard': primary_card,
                'secondaryCard': secondary_card,
                'selectedColor': selected_color,
                'startingCard': starting_card,
            }

            try:
                game.hit(bet)  # Place the bet
                print("Bet accepted.")
            except Exception as e:
                print(f"Invalid move: {e}")
                continue

        else:
            print("Waiting for other players to move...")
            # Here, you might simulate AI moves or skip turns.

        # Example: ask if player wants to 'check' (challenge previous bet)
        want_to_check = get_player_input("Do you want to check the previous bet?", ['yes', 'no'])
        if want_to_check == 'yes':
            try:
                result = game.validate_check()
                if result.checkSuccesful:
                    print("Check successful! Bet was correct.")
                else:
                    print(f"Check failed! Player {result.playerThatLost.username} lost a life.")
                print(f"Players eliminated: {[p.username for p in result.eliminatedPlayers]}")
            except Exception as e:
                print(f"Error during check: {e}")

        # Print current game state summary
        print(f"Players:")
        for p in game.players:
            print(f" - {p.username} (loses: {p.loses})")
        print(f"Eliminated players: {[p.username for p in game.eliminated_players]}")

        # TODO: Add logic to end game when conditions met, update is_finished

if __name__ == "__main__":
    main()
