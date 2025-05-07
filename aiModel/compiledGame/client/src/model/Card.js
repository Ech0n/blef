"use strict";
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
