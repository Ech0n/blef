import torch
import torch.nn as nn
import torch.nn.functional as F
from typing import List, Dict, Any
from gameWrapper import Game

class StructuredPolicyNet(nn.Module):
    def __init__(self, embed_dim=32, num_rankings=10, num_colors=2, max_cards=52):
        super().__init__()

        # Embeddings
        self.card_embed = nn.Embedding(num_embeddings=max_cards, embedding_dim=embed_dim)
        self.history_embed = nn.Embedding(num_embeddings=10, embedding_dim=embed_dim)  # actions

        # Core encoder
        self.fc1 = nn.Linear(embed_dim * 20 + 1, 128)

        # Action type (check/hit)
        self.action_head = nn.Linear(128, 2)

        # Structured heads for HandInfo fields
        self.ranking_head = nn.Linear(128, num_rankings)
        self.primary_card_head = nn.Linear(128, max_cards)
        self.secondary_card_head = nn.Linear(128, max_cards)
        self.color_head = nn.Linear(128, num_colors)
        self.starting_card_head = nn.Linear(128, max_cards)

    def forward(self, obs, mask_dict):
        """
        obs: dict with tensors
        mask_dict: dict with boolean masks for all outputs
        """
        # Embed cards & history
        hand_embed = self.card_embed(obs['hand']).flatten(1)
        hist_embed = self.history_embed(obs['history']).flatten(1)
        bet = obs['bet']

        x = torch.cat([hand_embed, hist_embed, bet], dim=1)
        x = F.relu(self.fc1(x))

        action_logits = self.action_head(x)

        # Structured outputs
        ranking_logits = self.ranking_head(x)
        primary_logits = self.primary_card_head(x)
        secondary_logits = self.secondary_card_head(x)
        color_logits = self.color_head(x)
        starting_logits = self.starting_card_head(x)

        # Apply masks
        action_logits[~mask_dict['action_type']] = -1e9
        ranking_logits[~mask_dict['ranking']] = -1e9
        primary_logits[~mask_dict['primary_card']] = -1e9
        secondary_logits[~mask_dict['secondary_card']] = -1e9
        color_logits[~mask_dict['color']] = -1e9
        starting_logits[~mask_dict['starting_card']] = -1e9

        return {
            'action_type': F.softmax(action_logits, dim=1),
            'ranking': F.softmax(ranking_logits, dim=1),
            'primary_card': F.softmax(primary_logits, dim=1),
            'secondary_card': F.softmax(secondary_logits, dim=1),
            'color': F.softmax(color_logits, dim=1),
            'starting_card': F.softmax(starting_logits, dim=1),
        }
