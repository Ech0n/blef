import type { checkToPlayersPayload, checkToServerPayload, gameStartPayload } from '../../../common/payloads'
import { Player } from '../../../common/player'
import { CardColor, ColorToIndex, fullCardNameToNumeric, initalizeCountTable, Rank, type Card, type CardCountTable } from '../model/Card'
import { Game } from './Game'
import { checkFunctionsMap } from './HandRankings'

let deckInitialization: Card[] = []
type Maybe<T> = NonNullable<T> | undefined

for (let card in Rank) {
    if (isNaN(Number(card))) {
        for (let color in CardColor) {
            if (isNaN(Number(color))) {
                deckInitialization.push([card, color])
            }
        }
    }
}
export const deck: Card[] = deckInitialization

export class GameServer extends Game {
    hands: Map<string, Card[]>
    deck: Card[]
    isFinished: boolean = false
    cardCounts: CardCountTable
    constructor(players: Player[], gameStartData: gameStartPayload, thisPlayerId: string, initialCardCounts: CardCountTable) {
        super(players, gameStartData, thisPlayerId)
        this.hands = new Map(Object.entries(gameStartData.newHands))
        this.deck = deck.slice()
        this.cardCounts = initialCardCounts
    }

    drawCards(numberOfCards: number): Card[] {
        if (numberOfCards > 5) {
            throw 'Drawing more than 5 cards is not a possibility'
        }

        if (numberOfCards > this.deck.length) {
            throw 'Not enough cards in deck to draw cards'
        }

        let drawnCards: Card[] = []
        while (drawnCards.length < numberOfCards) {
            let randomIndex: number = Math.floor(Math.random() * this.deck.length)
            let card = this.deck.splice(randomIndex, 1)[0]
            drawnCards.push(card)
            this.cardCounts[fullCardNameToNumeric[card[0]].numeric][ColorToIndex[card[1]]] += 1
        }
        return drawnCards
    }

    shuffleDeck(): void {
        this.deck = deck.slice()
    }

    dealCards(): void {
        this.cardCounts = initalizeCountTable()
        this.shuffleDeck()
        this.hands = new Map<string, Card[]>()
        this.players.forEach((player: Player) => {
            this.hands.set(player.uid, this.drawCards(1 + player.loses))
        })
    }

    check(data?: checkToPlayersPayload): boolean {
        let checkWasSucessful = true
        if (!this.previousBet) {
            throw 'There is no bet'
        }

        let wasBetFound: boolean = checkFunctionsMap[this.previousBet.selectedRanking](this.cardCounts, this.previousBet)

        // If cards were found than current player is set to previous one
        // after that, current player has one lose added
        if (!wasBetFound) {
            const prevPlayer = (this.currentPlayerIndx - 1 + this.playerCount) % this.playerCount
            this.currentPlayerIndx = prevPlayer
            this.currentPlayer = this.players[this.currentPlayerIndx].uid
            checkWasSucessful = false
        }

        this.players[this.currentPlayerIndx].loses += 1
        this.playerThatLost = this.players[this.currentPlayerIndx]

        if (this.players[this.currentPlayerIndx].loses == 5) {
            this.eliminatedPlayers.push(this.players[this.currentPlayerIndx])
            this.players.splice(this.currentPlayerIndx, 1)
            this.playerCount -= 1
            this.currentPlayerIndx = this.currentPlayerIndx - 1
            if (this.currentPlayerIndx < 0) {
                this.currentPlayerIndx = this.players.length - 1
            }
            this.currentPlayer = this.players[this.currentPlayerIndx].uid
        }

        this.previousBet = null
        return checkWasSucessful
    }

    validateCheck(): checkToServerPayload {
        let checkResult = this.check()

        this.dealCards()

        let newHand = this.hands.get(this.thisPlayerId)
        if (newHand) {
            this.hand = newHand
        }

        let payload: checkToServerPayload = {
            newHands: Object.fromEntries(this.hands),
            players: this.players,
            roundStartingPlayerId: this.currentPlayer,
            eliminatedPlayers: this.eliminatedPlayers,
            checkSuccesful: checkResult,
            playerThatLost: this.playerThatLost,
        }

        return payload
    }

    getCardCount(): CardCountTable {
        return this.cardCounts
    }
}
