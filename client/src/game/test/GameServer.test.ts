import type { GameServer } from "../GameServer";

const {GameServer} = require('../GameServer.ts')

let gs: GameServer

let playerList = [{socketId:"user1"},{socketId:"user2"},{socketId:"user3"}]

beforeEach(() => {
  gs = new GameServer(playerList)
});


test('draw five cards and than even more cards', () => {
  let drawnCards: Array<Array<String>> = gs.drawCards(5)
  expect(drawnCards.length).toBe(5)

  drawnCards = gs.drawCards(5)
  expect(drawnCards.length).toBe(5)
  
  drawnCards = gs.drawCards(3)
  expect(drawnCards.length).toBe(3)
});


test('draw six cards (which is not allowed)', () => {
  expect(() =>  gs.drawCards(6)).toThrow("Drawing more than 5 cards is not a possibility");

});


test.skip('draw more than full deck in multiple draws', () => {
  let drawnCards: Array<Array<String>>
  for(let i = 0;i<=50; i+=5)
  {
    drawnCards = gs.drawCards(5)
    expect(drawnCards.length).toBe(5)
  }
  drawnCards = gs.drawCards(2)
  expect(drawnCards.length).toBe(2)

  //TODO: should not throw deck is empty instead reshuffle and check if all drawn cards are deck cards
  drawnCards = gs.drawCards(2)
  expect(drawnCards.length).toThrow("Deck is empty")

});