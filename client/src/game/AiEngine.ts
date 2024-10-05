import { ConnectionHandler } from 'src/ConnectoinHandler'
import { HandInfo } from './HandRankings'
import { Card } from 'src/model/Card'

export interface Decision {}

function random(max: number) {
    return Math.floor(Math.random() * max)
}
export class AiEngine {
    conHandler: ConnectionHandler
    previousMoves: HandInfo[] = []
    constructor(connectionHandler: ConnectionHandler) {
        this.conHandler = connectionHandler
    }
    passHitInfo(moveData: HandInfo) {
        this.previousMoves.push(moveData)
    }
    check() {
        this.previousMoves = []
    }

    findHigherCombination(avaiableCards: Card[]): HandInfo {
        let currendCombination = this.previousMoves[this.previousMoves.length - 1]

        // NOTE: WIP AI solution
        const forcedBet: HandInfo = {
            selectedRanking: 'royal',
            primaryCard: '',
            secondaryCard: '',
            selectedColor: 'spade',
            startingCard: '',
        }
        currendCombination = forcedBet

        return currendCombination
    }
    decide(yourCards: Card[]): boolean {
        console.log('ai is deciding')
        let choice = random(2)
        if (this.previousMoves.length == 0) {
            choice = 0
        }
        if (choice < 1) {
            this.conHandler.sendHitEvent(this.findHigherCombination(yourCards))
        } else {
            this.conHandler.sendCheckEvent()
        }
        return false
    }
}
