const colors: string[] = ["spade", "hearts",  "diamonds","clubs"];
const cards: string[] = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];
const bets: any = ["royal","flush","carrot","full","strit","triple","double","pair","one"]

let deckInitialization: [string, string][] = [];

cards.forEach((card: string) => {
  colors.forEach((color: string) => {
    deckInitialization.push([color, card]);
  });  
});

export const deck: [string, string][] = deckInitialization;

export class GameServer {
  playerCount: number;
  players: { socketId: string; loses: number; hands:[string,string][] }[];
  cards: { [socketId: string]: [string, string][] };
  currentPlayer: number;
  deck: [string, string][];
  rejectedCards: [string,string][];
  previousCards: string[] ;
  previousBet: string

  constructor(players: { socketId: string ; loses: number; hands:[string,string][]  }[]) {
    this.playerCount = players.length;
    this.players = players.map((el: { socketId: string; loses: number; hands:[string,string][]  }) => {
      el.loses = 0;
      el.hands = []
      return el;
    });
    this.cards = {};
    //TODO: Randomize starting player?
    this.currentPlayer = 0;
    this.deck = deck.slice();
    this.rejectedCards = []
    this.previousCards = []
    this.previousBet = ""
  }

  drawCards(numberOfCards: number): [string, string][] {
    if(numberOfCards > 5)
    {
      throw "Drawing more than 5 cards is not a possibility"
    }
    if(numberOfCards > this.deck.length)
    {
      throw "Not enough cards in deck to draw cards"
    }
    let drawnCards: [string, string][] = [];
    while (drawnCards.length < numberOfCards) {
      let randomIndex: number = Math.floor(Math.random() * this.deck.length);
      drawnCards.push(this.deck.splice(randomIndex, 1)[0]);
    }
    return drawnCards;
  }
  shuffleDeck():void{
    if(this.rejectedCards.length == 0)
    {
      throw("Too much cards on players hands")
    }
    this.deck = this.rejectedCards
    this.rejectedCards = []
  }
  dealCards(): void {
    let totalCardsToDraw = this.players.reduce((prev:number , player: { socketId: string; loses: number }) => (player.loses + 1 + prev), 0  );
    if(totalCardsToDraw == this.deck.length)
    {
      if(this.rejectedCards.length < totalCardsToDraw)
      {
        throw "Now enough cards to draw from"
      }
      this.shuffleDeck()
    }
    this.cards = {};
    this.players.forEach((player: { socketId: string; loses: number }) => {
      this.cards[player.socketId] = this.drawCards(1 + player.loses);
    });
  }

  check(): void {
    this.players.forEach((player: { socketId: string; loses: number }) => {
      this.cards[player.socketId] = this.drawCards(1 + player.loses);
    });
  }

  collectCards(): void
  {
    this.players = this.players.map((player: { socketId: string; loses: number, hands:[string,string][] }) => {
      this.rejectedCards = [...this.rejectedCards , ...player.hands]
      player.hands = []
      return player
    });
  }

  hit(): void {
    //TODO: Implement hit logic
  }

  getGameState(): void {
    //TODO: Implement getGameState logic
  }
}
