import { GameState } from "../../common/payloads"
import { Player } from "../../common/player"

export class AppState{
    gameId: string | null
    player: Player | null
    username: string | null
    gameState?: GameState
    constructor(){
        this.gameId = null
        this.player = null
        this.username = null
    }
}