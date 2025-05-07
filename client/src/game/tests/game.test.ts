import { describe, it, expect, beforeEach } from 'vitest';
import { Game } from '../Game';
import { Player } from '../../../../common/player';
import type { gameStartPayload,  checkToPlayersPayload } from '../../../../common/payloads';
import { HandInfo } from '../HandRankings'

describe('Game', () => {
  let players: Player[];
  let gameStartData: gameStartPayload;
  let thisPlayerId: string;
  let game: Game;

  beforeEach(() => {
    players = [
      new Player('1', 'Player 1'),
      new Player('2', 'Player 2'),
      new Player('3', 'Player 3')
    ];

    gameStartData = {
      newHands: {
        '1': [],
        '2': [],
        '3': []
      },
      startingPlayerId: '1'
    };

    thisPlayerId = '1';
    game = new Game(players, gameStartData, thisPlayerId);
  });

  it('should initialize correctly', () => {
    expect(game.playerCount).toBe(3);
    expect(game.players).toHaveLength(3);
    expect(game.hand).toEqual([]);
    expect(game.currentPlayer).toBe('1');
    expect(game.previousBet).toBeNull();
    expect(game.gameClosed).toBe(false);
  });

  it('should remove a player correctly', () => {
    game.removePlayer('2');
    expect(game.players).toHaveLength(2);
    expect(game.players.find((p) => p.uid === '2')).toBeUndefined();
    expect(game.playerCount).toBe(2);
  });

  it('should update current player after nextPlayer is called', () => {
    game.nextPlayer();
    expect(game.currentPlayer).toBe('2');
    game.nextPlayer();
    expect(game.currentPlayer).toBe('3');
    game.nextPlayer();
    expect(game.currentPlayer).toBe('1');
  });

  it('should update previous bet and move to next player on hit', () => {
    const bet: HandInfo = {
        selectedRanking: 'pair',
        primaryCard: '',
        secondaryCard: '',
        selectedColor: '',
        startingCard: ''
    };
    game.hit(bet);
    expect(game.previousBet).toEqual(bet);
    expect(game.currentPlayer).toBe('2');
  });

  it('should handle check correctly', () => {
    const checkData: checkToPlayersPayload = {
      newHand: [],
      players: players.slice(0, 2),
      eliminatedPlayers: [players[2]],
      roundStartingPlayerId: '2',
      playerThatLost: players[2],
      checkSuccesful: true
    };

    const result = game.check(checkData);
    expect(result).toBe(true);
    expect(game.hand).toEqual([]);
    expect(game.players).toHaveLength(2);
    expect(game.eliminatedPlayers).toHaveLength(1);
    expect(game.currentPlayer).toBe('2');
    expect(game.previousBet).toBeNull();
    expect(game.playerThatLost).toEqual(players[2]);
  });

  it('should throw an error if check is called without data', () => {
    expect(() => game.check()).toThrow('Data field not present in check()');
  });
});