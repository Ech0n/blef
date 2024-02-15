const colors = ["trefle","pik","hearts","diamonds"]
const cards = ['a','k','q','b','t','9','8','7','6','5','4','3','2']
let deckInitialization = []
cards.forEach(card=>
{
  colors.forEach(color=>{
    deckInitialization.push([color,card])
  })  
})
const deck = deckInitialization
class GameServer
{
    constructor(players)
    {
        this.playerCount = players.length
        this.players = players.map(el => {
            el.looses = 0
            return el
        })
        this.cards ={}
        //TODO: Randomize starting player?
        this.currentPlayer = 0 
        this.deck = deck
    }
    drawCards(numberOfCards){
        //TODO: suffle deck if not enough cards for draw
        let drawnCards = []
        while(drawnCards.length<numberOfCards)
        {
            let randomIndex = Math.floor(Math.random() * this.deck.length);
            drawnCards.push(this.deck.splice(randomIndex,1))
        }
        return drawnCards
    }
    dealCards(){
        this.cards ={}
        this.players.forEach(player =>
        {
            this.cards[player.socketId] = this.drawCards(1+player.looses)
        })
    }
    check(){

    }
    hit(){

    }
    getGameState()
    {

    }
}