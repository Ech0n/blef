import { Router } from 'express';
import { Game } from '../model/Game';

const router: Router = Router();

const games: Game[] = [];

function createGame(): Game {
    const newGameId: string = `game-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const newGame: Game = {
        id: newGameId,
        players: [] 
    };

    games.push(newGame); // Add the new game to the games array
    return newGame;
}

function joinGame(id: string): Game | undefined { 
    
    const game = games.find(game => game.id === id); 
    if (game) {
        // game.players.push(player); // Example action
        return game;
    }
    return undefined;
}

export default router; // Export using ES6 syntax
