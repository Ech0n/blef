__all__ = ['game']

# Don't look below, you will not understand this Python code :) I don't.

from js2py.pyjs import *
# setting scope
var = Scope( JS_BUILTINS )
set_global_object(var)

# Code follows:
var.registers(['color', 'Card_1', 'card', '__extends', 'GameServer', 'deckInitialization', 'HandRankings_1', 'Game_1'])
Js('use strict')
@Js
def PyJs_anonymous_0_(this, arguments, var=var):
    var = Scope({'this':this, 'arguments':arguments}, var)
    var.registers(['extendStatics'])
    @Js
    def PyJs_anonymous_1_(d, b, this, arguments, var=var):
        var = Scope({'d':d, 'b':b, 'this':this, 'arguments':arguments}, var)
        var.registers(['d', 'b'])
        @Js
        def PyJs_anonymous_2_(d, b, this, arguments, var=var):
            var = Scope({'d':d, 'b':b, 'this':this, 'arguments':arguments}, var)
            var.registers(['d', 'b'])
            var.get('d').put('__proto__', var.get('b'))
        PyJs_anonymous_2_._set_name('anonymous')
        @Js
        def PyJs_anonymous_3_(d, b, this, arguments, var=var):
            var = Scope({'d':d, 'b':b, 'this':this, 'arguments':arguments}, var)
            var.registers(['d', 'p', 'b'])
            for PyJsTemp in var.get('b'):
                var.put('p', PyJsTemp)
                if var.get('Object').get('prototype').get('hasOwnProperty').callprop('call', var.get('b'), var.get('p')):
                    var.get('d').put(var.get('p'), var.get('b').get(var.get('p')))
        PyJs_anonymous_3_._set_name('anonymous')
        var.put('extendStatics', ((var.get('Object').get('setPrototypeOf') or (Js({'__proto__':Js([])}).instanceof(var.get('Array')) and PyJs_anonymous_2_)) or PyJs_anonymous_3_))
        return var.get('extendStatics')(var.get('d'), var.get('b'))
    PyJs_anonymous_1_._set_name('anonymous')
    var.put('extendStatics', PyJs_anonymous_1_)
    @Js
    def PyJs_anonymous_4_(d, b, this, arguments, var=var):
        var = Scope({'d':d, 'b':b, 'this':this, 'arguments':arguments}, var)
        var.registers(['__', 'd', 'b'])
        @Js
        def PyJsHoisted____(this, arguments, var=var):
            var = Scope({'this':this, 'arguments':arguments}, var)
            var.registers([])
            var.get(u"this").put('constructor', var.get('d'))
        PyJsHoisted____.func_name = '__'
        var.put('__', PyJsHoisted____)
        if (PyJsStrictNeq(var.get('b',throw=False).typeof(),Js('function')) and PyJsStrictNeq(var.get('b'),var.get(u"null"))):
            PyJsTempException = JsToPyException(var.get('TypeError').create(((Js('Class extends value ')+var.get('String')(var.get('b')))+Js(' is not a constructor or null'))))
            raise PyJsTempException
        var.get('extendStatics')(var.get('d'), var.get('b'))
        pass
        var.get('d').put('prototype', (var.get('Object').callprop('create', var.get('b')) if PyJsStrictEq(var.get('b'),var.get(u"null")) else PyJsComma(var.get('__').put('prototype', var.get('b').get('prototype')),var.get('__').create())))
    PyJs_anonymous_4_._set_name('anonymous')
    return PyJs_anonymous_4_
PyJs_anonymous_0_._set_name('anonymous')
var.put('__extends', ((var.get(u"this") and var.get(u"this").get('__extends')) or PyJs_anonymous_0_()))
var.get('Object').callprop('defineProperty', var.get('exports'), Js('__esModule'), Js({'value':Js(True)}))
var.get('exports').put('GameServer', var.get('exports').put('deck', PyJsComma(Js(0.0), Js(None))))
var.put('Card_1', var.get('require')(Js('../model/Card')))
var.put('Game_1', var.get('require')(Js('./Game')))
var.put('HandRankings_1', var.get('require')(Js('./HandRankings')))
var.put('deckInitialization', Js([]))
for PyJsTemp in var.get('Card_1').get('Rank'):
    var.put('card', PyJsTemp)
    if var.get('isNaN')(var.get('Number')(var.get('card'))):
        for PyJsTemp in var.get('Card_1').get('CardColor'):
            var.put('color', PyJsTemp)
            if var.get('isNaN')(var.get('Number')(var.get('color'))):
                var.get('deckInitialization').callprop('push', Js([var.get('card'), var.get('color')]))
var.get('exports').put('deck', var.get('deckInitialization'))
@Js
def PyJs_anonymous_5_(_super, this, arguments, var=var):
    var = Scope({'_super':_super, 'this':this, 'arguments':arguments}, var)
    var.registers(['_super', 'GameServer'])
    @Js
    def PyJsHoisted_GameServer_(players, gameStartData, thisPlayerId, initialCardCounts, this, arguments, var=var):
        var = Scope({'players':players, 'gameStartData':gameStartData, 'thisPlayerId':thisPlayerId, 'initialCardCounts':initialCardCounts, 'this':this, 'arguments':arguments}, var)
        var.registers(['thisPlayerId', 'initialCardCounts', '_this', 'players', 'gameStartData'])
        var.put('_this', (var.get('_super').callprop('call', var.get(u"this"), var.get('players'), var.get('gameStartData'), var.get('thisPlayerId')) or var.get(u"this")))
        var.get('_this').put('isFinished', Js(False))
        var.get('_this').put('hands', var.get('Map').create(var.get('Object').callprop('entries', var.get('gameStartData').get('newHands'))))
        var.get('_this').put('deck', var.get('exports').get('deck').callprop('slice'))
        var.get('_this').put('cardCounts', var.get('initialCardCounts'))
        return var.get('_this')
    PyJsHoisted_GameServer_.func_name = 'GameServer'
    var.put('GameServer', PyJsHoisted_GameServer_)
    var.get('__extends')(var.get('GameServer'), var.get('_super'))
    pass
    @Js
    def PyJs_anonymous_6_(numberOfCards, this, arguments, var=var):
        var = Scope({'numberOfCards':numberOfCards, 'this':this, 'arguments':arguments}, var)
        var.registers(['drawnCards', 'card', 'randomIndex', 'numberOfCards'])
        if (var.get('numberOfCards')>Js(5.0)):
            PyJsTempException = JsToPyException(Js('Drawing more than 5 cards is not a possibility'))
            raise PyJsTempException
        if (var.get('numberOfCards')>var.get(u"this").get('deck').get('length')):
            PyJsTempException = JsToPyException(Js('Not enough cards in deck to draw cards'))
            raise PyJsTempException
        var.put('drawnCards', Js([]))
        while (var.get('drawnCards').get('length')<var.get('numberOfCards')):
            var.put('randomIndex', var.get('Math').callprop('floor', (var.get('Math').callprop('random')*var.get(u"this").get('deck').get('length'))))
            var.put('card', var.get(u"this").get('deck').callprop('splice', var.get('randomIndex'), Js(1.0)).get('0'))
            var.get('drawnCards').callprop('push', var.get('card'))
            var.get(u"this").get('cardCounts').get(var.get('Card_1').get('fullCardNameToNumeric').get(var.get('card').get('0')).get('numeric')).put(var.get('Card_1').get('ColorToIndex').get(var.get('card').get('1')), Js(1.0), '+')
        return var.get('drawnCards')
    PyJs_anonymous_6_._set_name('anonymous')
    var.get('GameServer').get('prototype').put('drawCards', PyJs_anonymous_6_)
    @Js
    def PyJs_anonymous_7_(this, arguments, var=var):
        var = Scope({'this':this, 'arguments':arguments}, var)
        var.registers([])
        var.get(u"this").put('deck', var.get('exports').get('deck').callprop('slice'))
    PyJs_anonymous_7_._set_name('anonymous')
    var.get('GameServer').get('prototype').put('shuffleDeck', PyJs_anonymous_7_)
    @Js
    def PyJs_anonymous_8_(this, arguments, var=var):
        var = Scope({'this':this, 'arguments':arguments}, var)
        var.registers(['_this'])
        var.put('_this', var.get(u"this"))
        var.get(u"this").put('cardCounts', PyJsComma(Js(0.0),var.get('Card_1').get('initalizeCountTable'))())
        var.get(u"this").callprop('shuffleDeck')
        var.get(u"this").put('hands', var.get('Map').create())
        @Js
        def PyJs_anonymous_9_(player, this, arguments, var=var):
            var = Scope({'player':player, 'this':this, 'arguments':arguments}, var)
            var.registers(['player'])
            var.get('_this').get('hands').callprop('set', var.get('player').get('uid'), var.get('_this').callprop('drawCards', (Js(1.0)+var.get('player').get('loses'))))
        PyJs_anonymous_9_._set_name('anonymous')
        var.get(u"this").get('players').callprop('forEach', PyJs_anonymous_9_)
    PyJs_anonymous_8_._set_name('anonymous')
    var.get('GameServer').get('prototype').put('dealCards', PyJs_anonymous_8_)
    @Js
    def PyJs_anonymous_10_(data, this, arguments, var=var):
        var = Scope({'data':data, 'this':this, 'arguments':arguments}, var)
        var.registers(['wasBetFound', 'prevPlayer', 'checkWasSucessful', 'data'])
        var.put('checkWasSucessful', Js(True))
        if var.get(u"this").get('previousBet').neg():
            PyJsTempException = JsToPyException(Js('There is no bet'))
            raise PyJsTempException
        var.put('wasBetFound', var.get('HandRankings_1').get('checkFunctionsMap').callprop(var.get(u"this").get('previousBet').get('selectedRanking'), var.get(u"this").get('cardCounts'), var.get(u"this").get('previousBet')))
        if var.get('wasBetFound').neg():
            var.put('prevPlayer', (((var.get(u"this").get('currentPlayerIndx')-Js(1.0))+var.get(u"this").get('playerCount'))%var.get(u"this").get('playerCount')))
            var.get(u"this").put('currentPlayerIndx', var.get('prevPlayer'))
            var.get(u"this").put('currentPlayer', var.get(u"this").get('players').get(var.get(u"this").get('currentPlayerIndx')).get('uid'))
            var.put('checkWasSucessful', Js(False))
        var.get(u"this").get('players').get(var.get(u"this").get('currentPlayerIndx')).put('loses', Js(1.0), '+')
        var.get(u"this").put('playerThatLost', var.get(u"this").get('players').get(var.get(u"this").get('currentPlayerIndx')))
        if (var.get(u"this").get('players').get(var.get(u"this").get('currentPlayerIndx')).get('loses')==Js(5.0)):
            var.get(u"this").get('eliminatedPlayers').callprop('push', var.get(u"this").get('players').get(var.get(u"this").get('currentPlayerIndx')))
            var.get(u"this").get('players').callprop('splice', var.get(u"this").get('currentPlayerIndx'), Js(1.0))
            var.get(u"this").put('playerCount', Js(1.0), '-')
            var.get(u"this").put('currentPlayerIndx', (var.get(u"this").get('currentPlayerIndx')-Js(1.0)))
            if (var.get(u"this").get('currentPlayerIndx')<Js(0.0)):
                var.get(u"this").put('currentPlayerIndx', (var.get(u"this").get('players').get('length')-Js(1.0)))
            var.get(u"this").put('currentPlayer', var.get(u"this").get('players').get(var.get(u"this").get('currentPlayerIndx')).get('uid'))
        var.get(u"this").put('previousBet', var.get(u"null"))
        return var.get('checkWasSucessful')
    PyJs_anonymous_10_._set_name('anonymous')
    var.get('GameServer').get('prototype').put('check', PyJs_anonymous_10_)
    @Js
    def PyJs_anonymous_11_(this, arguments, var=var):
        var = Scope({'this':this, 'arguments':arguments}, var)
        var.registers(['newHand', 'checkResult', 'payload'])
        var.put('checkResult', var.get(u"this").callprop('check'))
        var.get(u"this").callprop('dealCards')
        var.put('newHand', var.get(u"this").get('hands').callprop('get', var.get(u"this").get('thisPlayerId')))
        if var.get('newHand'):
            var.get(u"this").put('hand', var.get('newHand'))
        var.put('payload', Js({'newHands':var.get('Object').callprop('fromEntries', var.get(u"this").get('hands')),'players':var.get(u"this").get('players'),'roundStartingPlayerId':var.get(u"this").get('currentPlayer'),'eliminatedPlayers':var.get(u"this").get('eliminatedPlayers'),'checkSuccesful':var.get('checkResult'),'playerThatLost':var.get(u"this").get('playerThatLost')}))
        return var.get('payload')
    PyJs_anonymous_11_._set_name('anonymous')
    var.get('GameServer').get('prototype').put('validateCheck', PyJs_anonymous_11_)
    @Js
    def PyJs_anonymous_12_(this, arguments, var=var):
        var = Scope({'this':this, 'arguments':arguments}, var)
        var.registers([])
        return var.get(u"this").get('cardCounts')
    PyJs_anonymous_12_._set_name('anonymous')
    var.get('GameServer').get('prototype').put('getCardCount', PyJs_anonymous_12_)
    return var.get('GameServer')
PyJs_anonymous_5_._set_name('anonymous')
var.put('GameServer', PyJs_anonymous_5_(var.get('Game_1').get('Game')))
var.get('exports').put('GameServer', var.get('GameServer'))
pass


# Add lib to the module scope
game = var.to_python()