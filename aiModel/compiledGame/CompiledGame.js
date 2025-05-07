var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
define("common/player", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Player = exports.createPlayerFromIPlayer = void 0;
    function createPlayerFromIPlayer(ip) {
        var player = new Player(ip.uid, ip.username);
        player.isOnline = ip.isOnline;
        player.isHost = ip.isHost;
        return player;
    }
    exports.createPlayerFromIPlayer = createPlayerFromIPlayer;
    var Player = /** @class */ (function () {
        function Player(id, username) {
            this.isHost = false;
            this.uid = id;
            this.username = username;
            this.loses = 0;
            this.isBot = false;
            this.isOnline = true;
        }
        return Player;
    }());
    exports.Player = Player;
});
define("client/src/model/Card", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.cardCountTableToIterableArray = exports.initalizeGame = exports.fullCardNameToNumeric = exports.cardToRankTranslation = exports.Rank = exports.ColorToIndex = exports.CardColor = exports.initalizeCountTable = void 0;
    function initalizeCountTable() {
        var table = {};
        var colorTable = {};
        for (var colorIndex in exports.ColorToIndex) {
            colorTable[exports.ColorToIndex[colorIndex]] = 0;
        }
        for (var _colorIndex in exports.ColorToIndex) {
            for (var cardString in exports.cardToRankTranslation) {
                table[exports.cardToRankTranslation[cardString].numeric] = __assign({}, colorTable);
            }
        }
        return table;
    }
    exports.initalizeCountTable = initalizeCountTable;
    var CardColor;
    (function (CardColor) {
        CardColor[CardColor["spade"] = 0] = "spade";
        CardColor[CardColor["heart"] = 1] = "heart";
        CardColor[CardColor["diamond"] = 2] = "diamond";
        CardColor[CardColor["club"] = 3] = "club";
    })(CardColor || (exports.CardColor = CardColor = {}));
    exports.ColorToIndex = {
        'spade': 4,
        'heart': 3,
        'club': 2,
        'diamond': 1,
    };
    var Rank;
    (function (Rank) {
        Rank[Rank["ace"] = 0] = "ace";
        Rank[Rank["king"] = 1] = "king";
        Rank[Rank["queen"] = 2] = "queen";
        Rank[Rank["jack"] = 3] = "jack";
        Rank[Rank["ten"] = 4] = "ten";
        Rank[Rank["nine"] = 5] = "nine";
        Rank[Rank["eight"] = 6] = "eight";
        Rank[Rank["seven"] = 7] = "seven";
        Rank[Rank["six"] = 8] = "six";
        Rank[Rank["five"] = 9] = "five";
        Rank[Rank["four"] = 10] = "four";
        Rank[Rank["three"] = 11] = "three";
        Rank[Rank["two"] = 12] = "two";
    })(Rank || (exports.Rank = Rank = {}));
    exports.cardToRankTranslation = {
        '2': { numeric: 2, string: 'two' },
        '3': { numeric: 3, string: 'three' },
        '4': { numeric: 4, string: 'four' },
        '5': { numeric: 5, string: 'five' },
        '6': { numeric: 6, string: 'six' },
        '7': { numeric: 7, string: 'seven' },
        '8': { numeric: 8, string: 'eight' },
        '9': { numeric: 9, string: 'nine' },
        '10': { numeric: 10, string: 'ten' },
        'j': { numeric: 11, string: 'jack' },
        'q': { numeric: 12, string: 'queen' },
        'k': { numeric: 13, string: 'king' },
        'a': { numeric: 14, string: 'ace' },
    };
    exports.fullCardNameToNumeric = {
        'two': { numeric: 2 },
        'three': { numeric: 3 },
        'four': { numeric: 4 },
        'five': { numeric: 5 },
        'six': { numeric: 6 },
        'seven': { numeric: 7 },
        'eight': { numeric: 8 },
        'nine': { numeric: 9 },
        'ten': { numeric: 10 },
        'jack': { numeric: 11 },
        'queen': { numeric: 12 },
        'king': { numeric: 13 },
        'ace': { numeric: 14 },
    };
    function initalizeGame(players) {
        var cardCounts = initalizeCountTable();
        var initialGameData;
        var startingPlayerId = players[0].uid;
        var deckInitialization = [];
        for (var card in Rank) {
            if (isNaN(Number(card))) {
                for (var color in CardColor) {
                    if (isNaN(Number(color))) {
                        deckInitialization.push([card, color]);
                    }
                }
            }
        }
        var hands = {};
        players.map(function (player) {
            var randomIndex = Math.floor(Math.random() * deckInitialization.length);
            var randomCard = deckInitialization.splice(randomIndex, 1);
            cardCounts[exports.fullCardNameToNumeric[randomCard[0][0]].numeric][exports.ColorToIndex[randomCard[0][1]]] += 1;
            hands[player.uid] = randomCard;
        });
        initialGameData = { newHands: hands, startingPlayerId: startingPlayerId };
        return { cardCounts: cardCounts, payload: initialGameData };
    }
    exports.initalizeGame = initalizeGame;
    function cardCountTableToIterableArray(cardCountTable) {
        var iterableArray = [];
        for (var _i = 0, _a = Object.entries(cardCountTable); _i < _a.length; _i++) {
            var _b = _a[_i], cardKey = _b[0], colorCounts = _b[1];
            var cardNum = parseInt(cardKey, 10);
            var colorsArray = [];
            for (var _c = 0, _d = Object.entries(colorCounts); _c < _d.length; _c++) {
                var _e = _d[_c], colorKey = _e[0], count = _e[1];
                var colorNum = parseInt(colorKey, 10);
                colorsArray.push([colorNum, count]);
            }
            iterableArray.push([cardNum, colorsArray]);
        }
        return iterableArray;
    }
    exports.cardCountTableToIterableArray = cardCountTableToIterableArray;
});
define("client/src/game/HandRankings", ["require", "exports", "client/src/model/Card"], function (require, exports, Card_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.checkFunctionsMap = void 0;
    function royalFlushChecker(cards, handInfo) {
        var selectedColor = handInfo.selectedColor;
        var startingCard = Card_1.cardToRankTranslation['10'].numeric;
        for (var i = 0; i < 5; i++) {
            if (cards[startingCard + i][Card_1.ColorToIndex[selectedColor]] === 0) {
                return false;
            }
        }
        return true;
    }
    function flushChecker(cards, handInfo) {
        var selectedColor = handInfo.selectedColor;
        var startingCard = Card_1.cardToRankTranslation[handInfo.startingCard].numeric;
        for (var i = 0; i < 5; i++) {
            if (cards[startingCard + i][Card_1.ColorToIndex[selectedColor]] === 0) {
                return false;
            }
        }
        return true;
    }
    function colorChecker(cards, handInfo) {
        var selectedColor = handInfo.selectedColor;
        var count = 0;
        var cardRanks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'j', 'q', 'k', 'a'];
        for (var i = 0; i < cardRanks.length; i++) {
            var rankValue = Card_1.cardToRankTranslation[cardRanks[i]].numeric;
            count += cards[rankValue][Card_1.ColorToIndex[selectedColor]];
        }
        return count >= 5;
    }
    function fourChecker(cards, handInfo) {
        var primCard = Card_1.cardToRankTranslation[handInfo.primaryCard].numeric;
        if (!cards[primCard]) {
            return false;
        }
        var count = 0;
        for (var colorIndex = 1; colorIndex <= 4; colorIndex++) {
            count += cards[primCard][colorIndex];
        }
        return count == 4;
    }
    function fullChecker(cards, handInfo) {
        var primCard = Card_1.cardToRankTranslation[handInfo.primaryCard].numeric;
        if (!cards[primCard]) {
            return false;
        }
        var secCard = Card_1.cardToRankTranslation[handInfo.secondaryCard].numeric;
        if (!cards[secCard]) {
            return false;
        }
        var count = [0, 0];
        for (var _i = 0, _a = [primCard, secCard]; _i < _a.length; _i++) {
            var cardIndex = _a[_i];
            for (var colorIndex = 1; colorIndex <= 4; colorIndex++) {
                var currentCard = cardIndex === primCard ? 0 : 1;
                count[currentCard] += cards[cardIndex][colorIndex];
            }
        }
        return count[0] >= 3 && count[1] >= 2;
    }
    function streetChecker(cards, handInfo) {
        var startingCard = Card_1.cardToRankTranslation[handInfo.startingCard].numeric;
        var count = 0;
        for (var i = 0; i < 5; i++) {
            if (!cards[startingCard + i]) {
                return false;
            }
            for (var colorIndex = 1; colorIndex <= 4; colorIndex++) {
                if (cards[startingCard + i][colorIndex] == 1) {
                    count++;
                    break;
                }
            }
        }
        return count == 5;
    }
    function threeChecker(cards, handInfo) {
        var primCard = Card_1.cardToRankTranslation[handInfo.primaryCard].numeric;
        if (!cards[primCard]) {
            return false;
        }
        var count = 0;
        for (var colorIndex = 1; colorIndex <= 4; colorIndex++) {
            count += cards[primCard][colorIndex];
        }
        return count >= 3;
    }
    function doubleChecker(cards, handInfo) {
        var primCard = Card_1.cardToRankTranslation[handInfo.primaryCard].numeric;
        if (!cards[primCard]) {
            return false;
        }
        var secCard = Card_1.cardToRankTranslation[handInfo.secondaryCard].numeric;
        if (!cards[secCard]) {
            return false;
        }
        var count = [0, 0];
        for (var _i = 0, _a = [primCard, secCard]; _i < _a.length; _i++) {
            var cardIndex = _a[_i];
            for (var colorIndex = 1; colorIndex <= 4; colorIndex++) {
                var currentCard = cardIndex === primCard ? 0 : 1;
                count[currentCard] += cards[cardIndex][colorIndex];
            }
        }
        return count[0] >= 2 && count[1] >= 2;
    }
    function pairChecker(cards, handInfo) {
        var primCard = Card_1.cardToRankTranslation[handInfo.primaryCard].numeric;
        if (!cards[primCard]) {
            return false;
        }
        var count = 0;
        for (var colorIndex = 1; colorIndex <= 4; colorIndex++) {
            count += cards[primCard][colorIndex];
        }
        return count >= 2;
    }
    function oneChecker(cards, handInfo) {
        var primCard = Card_1.cardToRankTranslation[handInfo.primaryCard].numeric;
        if (!cards[primCard]) {
            return false;
        }
        var count = 0;
        for (var colorIndex = 1; colorIndex <= 4; colorIndex++) {
            count += cards[primCard][colorIndex];
        }
        return count >= 1;
    }
    exports.checkFunctionsMap = {
        'royal': royalFlushChecker,
        'flush': flushChecker,
        'color': colorChecker,
        'four': fourChecker,
        'full': fullChecker,
        'street': streetChecker,
        'three': threeChecker,
        'double': doubleChecker,
        'pair': pairChecker,
        'one': oneChecker,
    };
});
define("common/payloads", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("client/src/game/Game", ["require", "exports"], function (require, exports) {
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
});
define("client/src/game/GameServer", ["require", "exports", "client/src/model/Card", "client/src/game/Game", "client/src/game/HandRankings"], function (require, exports, Card_2, Game_1, HandRankings_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GameServer = exports.deck = void 0;
    var deckInitialization = [];
    for (var card in Card_2.Rank) {
        if (isNaN(Number(card))) {
            for (var color in Card_2.CardColor) {
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
                this.cardCounts[Card_2.fullCardNameToNumeric[card[0]].numeric][Card_2.ColorToIndex[card[1]]] += 1;
            }
            return drawnCards;
        };
        GameServer.prototype.shuffleDeck = function () {
            this.deck = exports.deck.slice();
        };
        GameServer.prototype.dealCards = function () {
            var _this = this;
            this.cardCounts = (0, Card_2.initalizeCountTable)();
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
});
