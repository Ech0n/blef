"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameServer = exports.deck = void 0;
var Card_1 = require("../model/Card");
var Game_1 = require("./Game");
var HandRankings_1 = require("./HandRankings");
var deckInitialization = [];
for (var card in Card_1.Rank) {
    if (isNaN(Number(card))) {
        for (var color in Card_1.CardColor) {
            if (isNaN(Number(color))) {
                deckInitialization.push([card, color]);
            }
        }
    }
}
exports.deck = deckInitialization;
var GameServer = /** @class */ (function (_super) {
    __extends(GameServer, _super);
    //TODO: initalize aiEngine only if bots exist
    function GameServer(players, gameStartData, thisPlayerId, initialCardCounts) {
        var _this = _super.call(this, players, gameStartData, thisPlayerId) || this;
        _this.isFinished = false;
        _this.hands = new Map(Object.entries(gameStartData.newHands));
        _this.deck = exports.deck.slice();
        _this.cardCounts = initialCardCounts;
        return _this;
    }
    GameServer.prototype.drawCards = function (numberOfCards) {
        if (numberOfCards > 5) {
            throw 'Drawing more than 5 cards is not a possibility';
        }
        if (numberOfCards > this.deck.length) {
            throw 'Not enough cards in deck to draw cards';
        }
        var drawnCards = [];
        while (drawnCards.length < numberOfCards) {
            var randomIndex = Math.floor(Math.random() * this.deck.length);
            var card = this.deck.splice(randomIndex, 1)[0];
            drawnCards.push(card);
            this.cardCounts[Card_1.fullCardNameToNumeric[card[0]].numeric][Card_1.ColorToIndex[card[1]]] += 1;
        }
        return drawnCards;
    };
    GameServer.prototype.shuffleDeck = function () {
        this.deck = exports.deck.slice();
    };
    GameServer.prototype.dealCards = function () {
        var _this = this;
        this.cardCounts = (0, Card_1.initalizeCountTable)();
        this.shuffleDeck();
        this.hands = new Map();
        this.players.forEach(function (player) {
            _this.hands.set(player.uid, _this.drawCards(1 + player.loses));
        });
    };
    GameServer.prototype.check = function (data) {
        var checkWasSucessful = true;
        if (!this.previousBet) {
            throw 'There is no bet';
        }
        var wasBetFound = HandRankings_1.checkFunctionsMap[this.previousBet.selectedRanking](this.cardCounts, this.previousBet);
        // If cards were found than current player is set to previous one
        // after that, current player has one lose added
        if (!wasBetFound) {
            var prevPlayer = (this.currentPlayerIndx - 1 + this.playerCount) % this.playerCount;
            this.currentPlayerIndx = prevPlayer;
            this.currentPlayer = this.players[this.currentPlayerIndx].uid;
            checkWasSucessful = false;
        }
        this.players[this.currentPlayerIndx].loses += 1;
        this.playerThatLost = this.players[this.currentPlayerIndx];
        if (this.players[this.currentPlayerIndx].loses == 5) {
            this.eliminatedPlayers.push(this.players[this.currentPlayerIndx]);
            this.players.splice(this.currentPlayerIndx, 1);
            this.playerCount -= 1;
            this.currentPlayerIndx = this.currentPlayerIndx - 1;
            if (this.currentPlayerIndx < 0) {
                this.currentPlayerIndx = this.players.length - 1;
            }
            this.currentPlayer = this.players[this.currentPlayerIndx].uid;
        }
        this.previousBet = null;
        return checkWasSucessful;
    };
    GameServer.prototype.validateCheck = function () {
        var checkResult = this.check();
        this.dealCards();
        var newHand = this.hands.get(this.thisPlayerId);
        if (newHand) {
            this.hand = newHand;
        }
        var payload = {
            newHands: Object.fromEntries(this.hands),
            players: this.players,
            roundStartingPlayerId: this.currentPlayer,
            eliminatedPlayers: this.eliminatedPlayers,
            checkSuccesful: checkResult,
            playerThatLost: this.playerThatLost,
        };
        return payload;
    };
    GameServer.prototype.getCardCount = function () {
        return this.cardCounts;
    };
    return GameServer;
}(Game_1.Game));
exports.GameServer = GameServer;
