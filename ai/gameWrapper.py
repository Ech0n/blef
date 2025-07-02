from gameMock.game import Game
import torch
import torch.nn as nn
import torch.nn.functional as F
from typing import List, Dict, Any

ACTION_SPACE = ["hit", "check"]
ACTION_TO_IDX = {a: i for i, a in enumerate(ACTION_SPACE)}
IDX_TO_ACTION = {i: a for a, i in ACTION_TO_IDX.items()}


class GameEnv:
    def __init__(self, game: Game):
        self.game = game
        self.history = []  # List[str] moves
        self.current_hand = []  # List[Card]
        self.current_bet = 0
        self.possible_actions = []
        self.reset()

    def reset(self):
        self.game.shuffle_deck()
        self.game.deal_cards()
        self.history = []
        self.current_hand = self.game.hand
        self.current_bet = 0
        self.possible_actions = self.get_valid_actions()
        return self._get_obs_tensor()

    def _encode_history(self) -> torch.Tensor:
        # Encode moves history as a fixed-length vector of action indices (pad with -1)
        max_history_len = 20
        encoded = [
            ACTION_TO_IDX.get(move, -1) for move in self.history[-max_history_len:]
        ]
        padded = [-1] * (max_history_len - len(encoded)) + encoded
        return torch.tensor(padded, dtype=torch.long)  # shape: (max_history_len,)

    def _encode_hand(self) -> torch.Tensor:
        # Simplify: encode cards as their ID or rank (assume card.id exists)
        max_hand_size = 5
        hand_ids = [card.id for card in self.current_hand[:max_hand_size]]
        padded = hand_ids + [0] * (max_hand_size - len(hand_ids))
        return torch.tensor(padded, dtype=torch.long)  # shape: (max_hand_size,)

    def _encode_bet(self) -> torch.Tensor:
        # Scalar bet as float tensor
        return torch.tensor([self.current_bet], dtype=torch.float)

    def _get_obs_tensor(self) -> Dict[str, torch.Tensor]:
        return {
            "history": self._encode_history(),
            "hand": self._encode_hand(),
            "bet": self._encode_bet(),
        }

    def get_valid_actions(self) -> List[str]:
        # TODO: Implement with game logic to return valid moves
        # For demo, let's say all actions are possible always
        return ACTION_SPACE.copy()

    def step(self, action_idx: int) -> (Dict[str, torch.Tensor], float, bool):
        action = IDX_TO_ACTION[action_idx]
        self.history.append(action)

        # Apply action to game
        self._apply_action(action)

        # Update environment state
        self.current_hand = self.game.draw_cards(
            0
        )  # replace with real method to update hand
        self.current_bet = self._update_bet()
        self.possible_actions = self.get_valid_actions()

        reward = self._calculate_reward()
        done = self._check_done()

        return self._get_obs_tensor(), reward, done

    def _apply_action(self, action: str):
        if action == "hit":
            self.game.hit(self.current_bet)
        elif action == "check":
            self.game.check()
        # Add more action mappings as needed

    def _update_bet(self) -> float:
        # Implement based on game state
        return self.current_bet

    def _calculate_reward(self) -> float:
        # Custom reward logic
        return 0.0

    def _check_done(self) -> bool:
        # Return True if game ended
        return False
