import { describe, it, expect, beforeEach } from 'vitest';
import { GameServer, deck } from '../GameServer';
import { Player } from '../../../../common/player';
import { initalizeCountTable } from '../../model/Card';
import { gameStartPayload } from '../../../../common/payloads';

// Mock data
const mockPlayers = [
  new Player('1', 'Player1'),
  new Player('2', 'Player2'),
  new Player('3', 'Player3')
];
const mockGameStartData : gameStartPayload = {
    newHands: {
        '1': [['Ace', 'Hearts']],
        '2': [['King', 'Diamonds']],
        '3': [['Queen', 'Clubs']]
    },
    startingPlayerId: '1'
};
const mockInitialCardCounts = initalizeCountTable();

describe('GameServer', () => {
  let gameServer : GameServer;

  beforeEach(() => {
    gameServer = new GameServer(mockPlayers, mockGameStartData, '1', mockInitialCardCounts);
  });

  it('should initialize with correct hands and deck', () => {
    expect(gameServer.hands.size).toBe(3);
    expect(gameServer.deck.length).toBe(deck.length);
  });

  it('should draw cards correctly', () => {
    const initialDeckSize = gameServer.deck.length;
    const drawnCards = gameServer.drawCards(3);

    expect(drawnCards.length).toBe(3);
    expect(gameServer.deck.length).toBe(initialDeckSize - 3);
  });

  it('should throw an error when drawing more than 5 cards', () => {
    expect(() => gameServer.drawCards(6)).toThrow('Drawing more than 5 cards is not a possibility');
  });

  it('should shuffle the deck', () => {
    gameServer.shuffleDeck();
    expect(gameServer.deck.length).toBe(deck.length);
  });

  it('should deal cards correctly', () => {
    gameServer.dealCards();
    mockPlayers.forEach(player => {
      expect(gameServer.hands.get(player.uid).length).toBe(1 + player.loses);
    });
  });

  it('should validate check and update state correctly', () => {
    gameServer.previousBet = {
        selectedRanking: 'pair',
        primaryCard: '2',
        secondaryCard: '',
        selectedColor: '',
        startingCard: ''
    };
    const checkResult = gameServer.validateCheck();

    expect(checkResult).toHaveProperty('newHands');
    expect(checkResult).toHaveProperty('players');
    expect(checkResult).toHaveProperty('roundStartingPlayerId');
    expect(checkResult).toHaveProperty('eliminatedPlayers');
    expect(checkResult).toHaveProperty('checkSuccesful');
    expect(checkResult).toHaveProperty('playerThatLost');
  });

  it('should return correct card counts', () => {
    const cardCounts = gameServer.getCardCount();
    expect(cardCounts).toEqual(mockInitialCardCounts);
  });
});