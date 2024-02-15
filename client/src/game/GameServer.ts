const colors: string[] = ["spade", "hearts", "clubs", "diamonds"];
const cards: string[] = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

let deckInitialization: [string, string][] = [];

cards.forEach((card: string) => {
  colors.forEach((color: string) => {
    deckInitialization.push([color, card]);
  });  
});

const deck: [string, string][] = deckInitialization;

class GameServer {
  playerCount: number;
  players: { socketId: string; loses: number }[];
  cards: { [socketId: string]: [string, string][] };
  currentPlayer: number;
  deck: [string, string][];

  constructor(players: { socketId: string; loses: number }[]) {
    this.playerCount = players.length;
    this.players = players.map((el: { socketId: string; loses: number }) => {
      el.loses = 0;
      return el;
    });
    this.cards = {};
    //TODO: Randomize starting player?
    this.currentPlayer = 0;
    this.deck = deck;
  }

  drawCards(numberOfCards: number): [string, string][] {
    //TODO: suffle deck if not enough cards for draw
    let drawnCards: [string, string][] = [];
    while (drawnCards.length < numberOfCards) {
      let randomIndex: number = Math.floor(Math.random() * this.deck.length);
      drawnCards.push(this.deck.splice(randomIndex, 1)[0]);
    }
    return drawnCards;
  }

  dealCards(): void {
    this.cards = {};
    this.players.forEach((player: { socketId: string; loses: number }) => {
      this.cards[player.socketId] = this.drawCards(1 + player.loses);
    });
  }

  check(): void {
    // Implement check logic
  }

  hit(): void {
    // Implement hit logic
  }

  getGameState(): void {
    // Implement getGameState logic
  }
}
