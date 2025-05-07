"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
var Game = /** @class */ (function () {
    function Game(players, gameStartData, thisPlayerId) {
        this.playerCount = players.length;
        this.players = structuredClone(players);
        this.hand = gameStartData.newHands[thisPlayerId];
        this.previousBet = null;
        this.currentPlayer = gameStartData.startingPlayerId;
        this.eliminatedPlayers = [];
        this.currentPlayerIndx = this.players.findIndex(function (el) { return gameStartData.startingPlayerId == el.uid; });
        this.thisPlayerId = thisPlayerId;
        this.gameClosed = false;
    }
    Game.prototype.removePlayer = function (playerUid) {
        this.players = this.players.filter(function (pl) {
            return pl.uid !== playerUid;
        });
        this.eliminatedPlayers = this.eliminatedPlayers.filter(function (pl) {
            return pl.uid !== playerUid;
        });
        this.playerCount -= 1;
        if (this.currentPlayerIndx > this.playerCount) {
            this.currentPlayerIndx = 0;
            this.currentPlayer = this.players[0].uid;
        }
    };
    Game.prototype.hit = function (bet) {
        //TODO: consider validation if bet is possible?
        this.previousBet = bet;
        this.nextPlayer();
    };
    Game.prototype.nextPlayer = function () {
        this.currentPlayerIndx = (this.currentPlayerIndx + 1) % this.playerCount;
        this.currentPlayer = this.players[this.currentPlayerIndx].uid;
    };
    Game.prototype.check = function (data) {
        var _this = this;
        if (!data) {
            throw 'Data field not present in check()';
        }
        this.hand = data.newHand;
        this.players = data.players;
        this.eliminatedPlayers = data.eliminatedPlayers;
        this.playerCount = this.players.length;
        this.currentPlayer = data.roundStartingPlayerId;
        this.currentPlayerIndx = this.players.findIndex(function (pl) {
            return pl.uid == _this.currentPlayer;
        });
        this.previousBet = null;
        this.playerThatLost = data.playerThatLost;
        return data.checkSuccesful;
    };
    Game.prototype.validateCheck = function () {
        console.warn('CLIENT SHOULDNT CALL HOST ONLY FUNCTIONS!');
        return;
    };
    Game.prototype.getCardCount = function () {
        console.warn('CLIENT SHOULDNT CALL HOST ONLY FUNCTIONS!');
        return {};
    };
    return Game;
}());
exports.Game = Game;
