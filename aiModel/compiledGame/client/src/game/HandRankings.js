"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkFunctionsMap = void 0;
var Card_1 = require("../model/Card");
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
