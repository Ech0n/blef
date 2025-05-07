import { describe, it, expect } from 'vitest';
import { compareRankingAGreaterThanB } from '../Comparators';

describe('compareRankingAGreaterThanB', () => {
  it('should return true when old ranking is greater than new ranking', () => {
    const oldRanking = {
      selectedRanking: 'royal',
      primaryCard: 'ace',
      secondaryCard: '',
      selectedColor: 'spade',
      startingCard: ''
    };

    const newRanking = {
      selectedRanking: 'flush',
      primaryCard: 'king',
      secondaryCard: '',
      selectedColor: 'heart',
      startingCard: ''
    };

    expect(compareRankingAGreaterThanB(oldRanking, newRanking)).toBe(true);
  });

  it('should return false when old ranking is less than new ranking', () => {
    const oldRanking = {
      selectedRanking: 'pair',
      primaryCard: '2',
      secondaryCard: '',
      selectedColor: 'club',
      startingCard: ''
    };

    const newRanking = {
      selectedRanking: 'three',
      primaryCard: '3',
      secondaryCard: '',
      selectedColor: 'diamond',
      startingCard: ''
    };

    expect(compareRankingAGreaterThanB(oldRanking, newRanking)).toBe(false);
  });

  it('for pair should compare primary cards when rankings are equal', () => {
    const oldRanking = {
      selectedRanking: 'pair',
      primaryCard: 'q',
      secondaryCard: '',
      selectedColor: 'heart',
      startingCard: ''
    };

    const newRanking = {
      selectedRanking: 'pair',
      primaryCard: 'j',
      secondaryCard: '',
      selectedColor: 'diamond',
      startingCard: ''
    };

    expect(compareRankingAGreaterThanB(oldRanking, newRanking)).toBe(true);
  });
  it('for double should compare primary cards when rankings are equal', () => {
    const oldRanking = {
      selectedRanking: 'double',
      primaryCard: '2',
      secondaryCard: '9',
      selectedColor: 'club',
      startingCard: ''
    };

    const newRanking = {
      selectedRanking: 'double',
      primaryCard: '10',
      secondaryCard: '8',
      selectedColor: 'diamond',
      startingCard: ''
    };

    expect(compareRankingAGreaterThanB(oldRanking, newRanking)).toBe(false);
  });
  it('for double should compare secondary cards when primary cards are equal', () => {
    const oldRanking = {
      selectedRanking: 'double',
      primaryCard: '10',
      secondaryCard: '9',
      selectedColor: 'club',
      startingCard: ''
    };

    const newRanking = {
      selectedRanking: 'double',
      primaryCard: '10',
      secondaryCard: '8',
      selectedColor: 'diamond',
      startingCard: ''
    };

    expect(compareRankingAGreaterThanB(oldRanking, newRanking)).toBe(true);
  });

  it('should compare colors when rankings and cards are equal', () => {
    const oldRanking = {
      selectedRanking: 'color',
      primaryCard: '',
      secondaryCard: '',
      selectedColor: 'spade',
      startingCard: ''
    };

    const newRanking = {
      selectedRanking: 'color',
      primaryCard: '',
      secondaryCard: '',
      selectedColor: 'heart',
      startingCard: ''
    };

    expect(compareRankingAGreaterThanB(oldRanking, newRanking)).toBe(true);
  });

  it('should compare starting cards for street rankings', () => {
    const oldRanking = {
      selectedRanking: 'street',
      primaryCard: '',
      secondaryCard: '',
      selectedColor: '',
      startingCard: '9'
    };

    const newRanking = {
      selectedRanking: 'street',
      primaryCard: '',
      secondaryCard: '',
      selectedColor: '',
      startingCard: '8'
    };

    expect(compareRankingAGreaterThanB(oldRanking, newRanking)).toBe(true);
  });
});