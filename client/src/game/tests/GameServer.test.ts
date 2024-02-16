
const {GameServer} = require('../GameServer')

let gs: typeof GameServer


let playerList = [{socketId:"user1"},{socketId:"user2"},{socketId:"user3"}]

beforeEach(() => {
  gs = new GameServer(playerList)
  return gs
});


test('draw five cards and than even more cards (total of 13 cards)', () => {
  let drawnCards: Array<Array<String>> = gs.drawCards(5)
  expect(drawnCards.length).toBe(5)

  drawnCards = gs.drawCards(5)
  expect(drawnCards.length).toBe(5)
  
  drawnCards = gs.drawCards(3)
  expect(drawnCards.length).toBe(3)

  expect(gs.deck.length).toBe(52-13)
});

test('draw five cards and than even more cards (total of 9 cards)', () => {
  let drawnCards: Array<Array<String>> = gs.drawCards(5)
  expect(drawnCards.length).toBe(5)


  drawnCards = gs.drawCards(4)
  expect(drawnCards.length).toBe(4)

  expect(gs.deck.length).toBe(52-9)
});

test('draw six cards (which is not allowed)', () => {
  expect(() =>  gs.drawCards(6)).toThrow("Drawing more than 5 cards is not a possibility");

});


test('draw more than full deck in multiple draws while all cards are in use', () => {
  let drawnCards: Array<Array<String>>
  for(let i = 5;i<=50; i+=5)
  {
    drawnCards = gs.drawCards(5)
    expect(drawnCards.length).toBe(5)

  }
  expect(gs.deck.length).toBe(2)
  drawnCards = gs.drawCards(2)
  expect(drawnCards.length).toBe(2)
  expect(gs.deck.length).toBe(0)

  

  expect(() => gs.drawCards(2)).toThrow("Too much cards on players hands")
});

test('draw more than full deck in multiple draws', () => {
  let drawnCards: Array<Array<String>>
  for(let i = 5;i<=50; i+=5)
  {
    drawnCards = gs.drawCards(5)
    expect(drawnCards.length).toBe(5)

  }
  expect(gs.deck.length).toBe(2)

  gs.check()

  gs.dealCards()

  gs.drawCards()

});