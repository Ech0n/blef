__all__ = ['game']

# Don't look below, you will not understand this Python code :) I don't.

from js2py.pyjs import *
# setting scope
var = Scope( JS_BUILTINS )
set_global_object(var)

# Code follows:
var.registers(['__extends', '__assign'])
@Js
def PyJs_anonymous_0_(this, arguments, var=var):
    var = Scope({'this':this, 'arguments':arguments}, var)
    var.registers([])
    @Js
    def PyJs_anonymous_1_(t, this, arguments, var=var):
        var = Scope({'t':t, 'this':this, 'arguments':arguments}, var)
        var.registers(['p', 't', 's', 'n', 'i'])
        #for JS loop
        var.put('i', Js(1.0))
        var.put('n', var.get('arguments').get('length'))
        while (var.get('i')<var.get('n')):
            var.put('s', var.get('arguments').get(var.get('i')))
            for PyJsTemp in var.get('s'):
                var.put('p', PyJsTemp)
                if var.get('Object').get('prototype').get('hasOwnProperty').callprop('call', var.get('s'), var.get('p')):
                    var.get('t').put(var.get('p'), var.get('s').get(var.get('p')))
            # update
            (var.put('i',Js(var.get('i').to_number())+Js(1))-Js(1))
        return var.get('t')
    PyJs_anonymous_1_._set_name('anonymous')
    var.put('__assign', (var.get('Object').get('assign') or PyJs_anonymous_1_))
    return var.get('__assign').callprop('apply', var.get(u"this"), var.get('arguments'))
PyJs_anonymous_0_._set_name('anonymous')
var.put('__assign', ((var.get(u"this") and var.get(u"this").get('__assign')) or PyJs_anonymous_0_))
@Js
def PyJs_anonymous_2_(this, arguments, var=var):
    var = Scope({'this':this, 'arguments':arguments}, var)
    var.registers(['extendStatics'])
    @Js
    def PyJs_anonymous_3_(d, b, this, arguments, var=var):
        var = Scope({'d':d, 'b':b, 'this':this, 'arguments':arguments}, var)
        var.registers(['d', 'b'])
        @Js
        def PyJs_anonymous_4_(d, b, this, arguments, var=var):
            var = Scope({'d':d, 'b':b, 'this':this, 'arguments':arguments}, var)
            var.registers(['d', 'b'])
            var.get('d').put('__proto__', var.get('b'))
        PyJs_anonymous_4_._set_name('anonymous')
        @Js
        def PyJs_anonymous_5_(d, b, this, arguments, var=var):
            var = Scope({'d':d, 'b':b, 'this':this, 'arguments':arguments}, var)
            var.registers(['p', 'b', 'd'])
            for PyJsTemp in var.get('b'):
                var.put('p', PyJsTemp)
                if var.get('Object').get('prototype').get('hasOwnProperty').callprop('call', var.get('b'), var.get('p')):
                    var.get('d').put(var.get('p'), var.get('b').get(var.get('p')))
        PyJs_anonymous_5_._set_name('anonymous')
        var.put('extendStatics', ((var.get('Object').get('setPrototypeOf') or (Js({'__proto__':Js([])}).instanceof(var.get('Array')) and PyJs_anonymous_4_)) or PyJs_anonymous_5_))
        return var.get('extendStatics')(var.get('d'), var.get('b'))
    PyJs_anonymous_3_._set_name('anonymous')
    var.put('extendStatics', PyJs_anonymous_3_)
    @Js
    def PyJs_anonymous_6_(d, b, this, arguments, var=var):
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
    PyJs_anonymous_6_._set_name('anonymous')
    return PyJs_anonymous_6_
PyJs_anonymous_2_._set_name('anonymous')
var.put('__extends', ((var.get(u"this") and var.get(u"this").get('__extends')) or PyJs_anonymous_2_()))
@Js
def PyJs_anonymous_7_(require, exports, this, arguments, var=var):
    var = Scope({'require':require, 'exports':exports, 'this':this, 'arguments':arguments}, var)
    var.registers(['exports', 'createPlayerFromIPlayer', 'Player', 'require'])
    @Js
    def PyJsHoisted_createPlayerFromIPlayer_(ip, this, arguments, var=var):
        var = Scope({'ip':ip, 'this':this, 'arguments':arguments}, var)
        var.registers(['ip', 'player'])
        var.put('player', var.get('Player').create(var.get('ip').get('uid'), var.get('ip').get('username')))
        var.get('player').put('isOnline', var.get('ip').get('isOnline'))
        var.get('player').put('isHost', var.get('ip').get('isHost'))
        return var.get('player')
    PyJsHoisted_createPlayerFromIPlayer_.func_name = 'createPlayerFromIPlayer'
    var.put('createPlayerFromIPlayer', PyJsHoisted_createPlayerFromIPlayer_)
    Js('use strict')
    var.get('Object').callprop('defineProperty', var.get('exports'), Js('__esModule'), Js({'value':Js(True)}))
    var.get('exports').put('Player', var.get('exports').put('createPlayerFromIPlayer', PyJsComma(Js(0.0), Js(None))))
    pass
    var.get('exports').put('createPlayerFromIPlayer', var.get('createPlayerFromIPlayer'))
    @Js
    def PyJs_anonymous_8_(this, arguments, var=var):
        var = Scope({'this':this, 'arguments':arguments}, var)
        var.registers(['Player'])
        @Js
        def PyJsHoisted_Player_(id, username, this, arguments, var=var):
            var = Scope({'id':id, 'username':username, 'this':this, 'arguments':arguments}, var)
            var.registers(['id', 'username'])
            var.get(u"this").put('isHost', Js(False))
            var.get(u"this").put('uid', var.get('id'))
            var.get(u"this").put('username', var.get('username'))
            var.get(u"this").put('loses', Js(0.0))
            var.get(u"this").put('isBot', Js(False))
            var.get(u"this").put('isOnline', Js(True))
        PyJsHoisted_Player_.func_name = 'Player'
        var.put('Player', PyJsHoisted_Player_)
        pass
        return var.get('Player')
    PyJs_anonymous_8_._set_name('anonymous')
    var.put('Player', PyJs_anonymous_8_())
    var.get('exports').put('Player', var.get('Player'))
PyJs_anonymous_7_._set_name('anonymous')
var.get('define')(Js('common/player'), Js([Js('require'), Js('exports')]), PyJs_anonymous_7_)
@Js
def PyJs_anonymous_9_(require, exports, this, arguments, var=var):
    var = Scope({'require':require, 'exports':exports, 'this':this, 'arguments':arguments}, var)
    var.registers(['CardColor', 'require', 'initalizeGame', 'initalizeCountTable', 'Rank', 'exports', 'cardCountTableToIterableArray'])
    @Js
    def PyJsHoisted_initalizeCountTable_(this, arguments, var=var):
        var = Scope({'this':this, 'arguments':arguments}, var)
        var.registers(['colorIndex', 'cardString', 'table', '_colorIndex', 'colorTable'])
        var.put('table', Js({}))
        var.put('colorTable', Js({}))
        for PyJsTemp in var.get('exports').get('ColorToIndex'):
            var.put('colorIndex', PyJsTemp)
            var.get('colorTable').put(var.get('exports').get('ColorToIndex').get(var.get('colorIndex')), Js(0.0))
        for PyJsTemp in var.get('exports').get('ColorToIndex'):
            var.put('_colorIndex', PyJsTemp)
            for PyJsTemp in var.get('exports').get('cardToRankTranslation'):
                var.put('cardString', PyJsTemp)
                var.get('table').put(var.get('exports').get('cardToRankTranslation').get(var.get('cardString')).get('numeric'), var.get('__assign')(Js({}), var.get('colorTable')))
        return var.get('table')
    PyJsHoisted_initalizeCountTable_.func_name = 'initalizeCountTable'
    var.put('initalizeCountTable', PyJsHoisted_initalizeCountTable_)
    @Js
    def PyJsHoisted_initalizeGame_(players, this, arguments, var=var):
        var = Scope({'players':players, 'this':this, 'arguments':arguments}, var)
        var.registers(['cardCounts', 'deckInitialization', 'color', 'initialGameData', 'startingPlayerId', 'card', 'hands', 'players'])
        var.put('cardCounts', var.get('initalizeCountTable')())
        pass
        var.put('startingPlayerId', var.get('players').get('0').get('uid'))
        var.put('deckInitialization', Js([]))
        for PyJsTemp in var.get('Rank'):
            var.put('card', PyJsTemp)
            if var.get('isNaN')(var.get('Number')(var.get('card'))):
                for PyJsTemp in var.get('CardColor'):
                    var.put('color', PyJsTemp)
                    if var.get('isNaN')(var.get('Number')(var.get('color'))):
                        var.get('deckInitialization').callprop('push', Js([var.get('card'), var.get('color')]))
        var.put('hands', Js({}))
        @Js
        def PyJs_anonymous_14_(player, this, arguments, var=var):
            var = Scope({'player':player, 'this':this, 'arguments':arguments}, var)
            var.registers(['randomCard', 'randomIndex', 'player'])
            var.put('randomIndex', var.get('Math').callprop('floor', (var.get('Math').callprop('random')*var.get('deckInitialization').get('length'))))
            var.put('randomCard', var.get('deckInitialization').callprop('splice', var.get('randomIndex'), Js(1.0)))
            var.get('cardCounts').get(var.get('exports').get('fullCardNameToNumeric').get(var.get('randomCard').get('0').get('0')).get('numeric')).put(var.get('exports').get('ColorToIndex').get(var.get('randomCard').get('0').get('1')), Js(1.0), '+')
            var.get('hands').put(var.get('player').get('uid'), var.get('randomCard'))
        PyJs_anonymous_14_._set_name('anonymous')
        var.get('players').callprop('map', PyJs_anonymous_14_)
        var.put('initialGameData', Js({'newHands':var.get('hands'),'startingPlayerId':var.get('startingPlayerId')}))
        return Js({'cardCounts':var.get('cardCounts'),'payload':var.get('initialGameData')})
    PyJsHoisted_initalizeGame_.func_name = 'initalizeGame'
    var.put('initalizeGame', PyJsHoisted_initalizeGame_)
    @Js
    def PyJsHoisted_cardCountTableToIterableArray_(cardCountTable, this, arguments, var=var):
        var = Scope({'cardCountTable':cardCountTable, 'this':this, 'arguments':arguments}, var)
        var.registers(['_a', 'cardNum', 'iterableArray', 'colorsArray', '_b', 'colorNum', 'cardCountTable', 'colorKey', 'cardKey', '_i', 'count', '_e', '_c', 'colorCounts', '_d'])
        var.put('iterableArray', Js([]))
        #for JS loop
        var.put('_i', Js(0.0))
        var.put('_a', var.get('Object').callprop('entries', var.get('cardCountTable')))
        while (var.get('_i')<var.get('_a').get('length')):
            var.put('_b', var.get('_a').get(var.get('_i')))
            var.put('cardKey', var.get('_b').get('0'))
            var.put('colorCounts', var.get('_b').get('1'))
            var.put('cardNum', var.get('parseInt')(var.get('cardKey'), Js(10.0)))
            var.put('colorsArray', Js([]))
            #for JS loop
            var.put('_c', Js(0.0))
            var.put('_d', var.get('Object').callprop('entries', var.get('colorCounts')))
            while (var.get('_c')<var.get('_d').get('length')):
                var.put('_e', var.get('_d').get(var.get('_c')))
                var.put('colorKey', var.get('_e').get('0'))
                var.put('count', var.get('_e').get('1'))
                var.put('colorNum', var.get('parseInt')(var.get('colorKey'), Js(10.0)))
                var.get('colorsArray').callprop('push', Js([var.get('colorNum'), var.get('count')]))
                # update
                (var.put('_c',Js(var.get('_c').to_number())+Js(1))-Js(1))
            var.get('iterableArray').callprop('push', Js([var.get('cardNum'), var.get('colorsArray')]))
            # update
            (var.put('_i',Js(var.get('_i').to_number())+Js(1))-Js(1))
        return var.get('iterableArray')
    PyJsHoisted_cardCountTableToIterableArray_.func_name = 'cardCountTableToIterableArray'
    var.put('cardCountTableToIterableArray', PyJsHoisted_cardCountTableToIterableArray_)
    Js('use strict')
    var.get('Object').callprop('defineProperty', var.get('exports'), Js('__esModule'), Js({'value':Js(True)}))
    var.get('exports').put('cardCountTableToIterableArray', var.get('exports').put('initalizeGame', var.get('exports').put('fullCardNameToNumeric', var.get('exports').put('cardToRankTranslation', var.get('exports').put('Rank', var.get('exports').put('ColorToIndex', var.get('exports').put('CardColor', var.get('exports').put('initalizeCountTable', PyJsComma(Js(0.0), Js(None))))))))))
    pass
    var.get('exports').put('initalizeCountTable', var.get('initalizeCountTable'))
    pass
    @Js
    def PyJs_anonymous_10_(CardColor, this, arguments, var=var):
        var = Scope({'CardColor':CardColor, 'this':this, 'arguments':arguments}, var)
        var.registers(['CardColor'])
        var.get('CardColor').put(var.get('CardColor').put('spade', Js(0.0)), Js('spade'))
        var.get('CardColor').put(var.get('CardColor').put('heart', Js(1.0)), Js('heart'))
        var.get('CardColor').put(var.get('CardColor').put('diamond', Js(2.0)), Js('diamond'))
        var.get('CardColor').put(var.get('CardColor').put('club', Js(3.0)), Js('club'))
    PyJs_anonymous_10_._set_name('anonymous')
    PyJs_anonymous_10_((var.get('CardColor') or var.get('exports').put('CardColor', var.put('CardColor', Js({})))))
    var.get('exports').put('ColorToIndex', Js({'spade':Js(4.0),'heart':Js(3.0),'club':Js(2.0),'diamond':Js(1.0)}))
    pass
    @Js
    def PyJs_anonymous_11_(Rank, this, arguments, var=var):
        var = Scope({'Rank':Rank, 'this':this, 'arguments':arguments}, var)
        var.registers(['Rank'])
        var.get('Rank').put(var.get('Rank').put('ace', Js(0.0)), Js('ace'))
        var.get('Rank').put(var.get('Rank').put('king', Js(1.0)), Js('king'))
        var.get('Rank').put(var.get('Rank').put('queen', Js(2.0)), Js('queen'))
        var.get('Rank').put(var.get('Rank').put('jack', Js(3.0)), Js('jack'))
        var.get('Rank').put(var.get('Rank').put('ten', Js(4.0)), Js('ten'))
        var.get('Rank').put(var.get('Rank').put('nine', Js(5.0)), Js('nine'))
        var.get('Rank').put(var.get('Rank').put('eight', Js(6.0)), Js('eight'))
        var.get('Rank').put(var.get('Rank').put('seven', Js(7.0)), Js('seven'))
        var.get('Rank').put(var.get('Rank').put('six', Js(8.0)), Js('six'))
        var.get('Rank').put(var.get('Rank').put('five', Js(9.0)), Js('five'))
        var.get('Rank').put(var.get('Rank').put('four', Js(10.0)), Js('four'))
        var.get('Rank').put(var.get('Rank').put('three', Js(11.0)), Js('three'))
        var.get('Rank').put(var.get('Rank').put('two', Js(12.0)), Js('two'))
    PyJs_anonymous_11_._set_name('anonymous')
    PyJs_anonymous_11_((var.get('Rank') or var.get('exports').put('Rank', var.put('Rank', Js({})))))
    def PyJs_LONG_12_(var=var):
        return var.get('exports').put('cardToRankTranslation', Js({'2':Js({'numeric':Js(2.0),'string':Js('two')}),'3':Js({'numeric':Js(3.0),'string':Js('three')}),'4':Js({'numeric':Js(4.0),'string':Js('four')}),'5':Js({'numeric':Js(5.0),'string':Js('five')}),'6':Js({'numeric':Js(6.0),'string':Js('six')}),'7':Js({'numeric':Js(7.0),'string':Js('seven')}),'8':Js({'numeric':Js(8.0),'string':Js('eight')}),'9':Js({'numeric':Js(9.0),'string':Js('nine')}),'10':Js({'numeric':Js(10.0),'string':Js('ten')}),'j':Js({'numeric':Js(11.0),'string':Js('jack')}),'q':Js({'numeric':Js(12.0),'string':Js('queen')}),'k':Js({'numeric':Js(13.0),'string':Js('king')}),'a':Js({'numeric':Js(14.0),'string':Js('ace')})}))
    PyJs_LONG_12_()
    def PyJs_LONG_13_(var=var):
        return var.get('exports').put('fullCardNameToNumeric', Js({'two':Js({'numeric':Js(2.0)}),'three':Js({'numeric':Js(3.0)}),'four':Js({'numeric':Js(4.0)}),'five':Js({'numeric':Js(5.0)}),'six':Js({'numeric':Js(6.0)}),'seven':Js({'numeric':Js(7.0)}),'eight':Js({'numeric':Js(8.0)}),'nine':Js({'numeric':Js(9.0)}),'ten':Js({'numeric':Js(10.0)}),'jack':Js({'numeric':Js(11.0)}),'queen':Js({'numeric':Js(12.0)}),'king':Js({'numeric':Js(13.0)}),'ace':Js({'numeric':Js(14.0)})}))
    PyJs_LONG_13_()
    pass
    var.get('exports').put('initalizeGame', var.get('initalizeGame'))
    pass
    var.get('exports').put('cardCountTableToIterableArray', var.get('cardCountTableToIterableArray'))
PyJs_anonymous_9_._set_name('anonymous')
var.get('define')(Js('client/src/model/Card'), Js([Js('require'), Js('exports')]), PyJs_anonymous_9_)
@Js
def PyJs_anonymous_15_(require, exports, Card_1, this, arguments, var=var):
    var = Scope({'require':require, 'exports':exports, 'Card_1':Card_1, 'this':this, 'arguments':arguments}, var)
    var.registers(['Card_1', 'streetChecker', 'colorChecker', 'require', 'fourChecker', 'fullChecker', 'flushChecker', 'pairChecker', 'oneChecker', 'doubleChecker', 'threeChecker', 'exports', 'royalFlushChecker'])
    @Js
    def PyJsHoisted_royalFlushChecker_(cards, handInfo, this, arguments, var=var):
        var = Scope({'cards':cards, 'handInfo':handInfo, 'this':this, 'arguments':arguments}, var)
        var.registers(['selectedColor', 'cards', 'handInfo', 'startingCard', 'i'])
        var.put('selectedColor', var.get('handInfo').get('selectedColor'))
        var.put('startingCard', var.get('Card_1').get('cardToRankTranslation').get('10').get('numeric'))
        #for JS loop
        var.put('i', Js(0.0))
        while (var.get('i')<Js(5.0)):
            if PyJsStrictEq(var.get('cards').get((var.get('startingCard')+var.get('i'))).get(var.get('Card_1').get('ColorToIndex').get(var.get('selectedColor'))),Js(0.0)):
                return Js(False)
            # update
            (var.put('i',Js(var.get('i').to_number())+Js(1))-Js(1))
        return Js(True)
    PyJsHoisted_royalFlushChecker_.func_name = 'royalFlushChecker'
    var.put('royalFlushChecker', PyJsHoisted_royalFlushChecker_)
    @Js
    def PyJsHoisted_flushChecker_(cards, handInfo, this, arguments, var=var):
        var = Scope({'cards':cards, 'handInfo':handInfo, 'this':this, 'arguments':arguments}, var)
        var.registers(['selectedColor', 'cards', 'handInfo', 'startingCard', 'i'])
        var.put('selectedColor', var.get('handInfo').get('selectedColor'))
        var.put('startingCard', var.get('Card_1').get('cardToRankTranslation').get(var.get('handInfo').get('startingCard')).get('numeric'))
        #for JS loop
        var.put('i', Js(0.0))
        while (var.get('i')<Js(5.0)):
            if PyJsStrictEq(var.get('cards').get((var.get('startingCard')+var.get('i'))).get(var.get('Card_1').get('ColorToIndex').get(var.get('selectedColor'))),Js(0.0)):
                return Js(False)
            # update
            (var.put('i',Js(var.get('i').to_number())+Js(1))-Js(1))
        return Js(True)
    PyJsHoisted_flushChecker_.func_name = 'flushChecker'
    var.put('flushChecker', PyJsHoisted_flushChecker_)
    @Js
    def PyJsHoisted_colorChecker_(cards, handInfo, this, arguments, var=var):
        var = Scope({'cards':cards, 'handInfo':handInfo, 'this':this, 'arguments':arguments}, var)
        var.registers(['selectedColor', 'cards', 'count', 'handInfo', 'rankValue', 'cardRanks', 'i'])
        var.put('selectedColor', var.get('handInfo').get('selectedColor'))
        var.put('count', Js(0.0))
        var.put('cardRanks', Js([Js('2'), Js('3'), Js('4'), Js('5'), Js('6'), Js('7'), Js('8'), Js('9'), Js('10'), Js('j'), Js('q'), Js('k'), Js('a')]))
        #for JS loop
        var.put('i', Js(0.0))
        while (var.get('i')<var.get('cardRanks').get('length')):
            var.put('rankValue', var.get('Card_1').get('cardToRankTranslation').get(var.get('cardRanks').get(var.get('i'))).get('numeric'))
            var.put('count', var.get('cards').get(var.get('rankValue')).get(var.get('Card_1').get('ColorToIndex').get(var.get('selectedColor'))), '+')
            # update
            (var.put('i',Js(var.get('i').to_number())+Js(1))-Js(1))
        return (var.get('count')>=Js(5.0))
    PyJsHoisted_colorChecker_.func_name = 'colorChecker'
    var.put('colorChecker', PyJsHoisted_colorChecker_)
    @Js
    def PyJsHoisted_fourChecker_(cards, handInfo, this, arguments, var=var):
        var = Scope({'cards':cards, 'handInfo':handInfo, 'this':this, 'arguments':arguments}, var)
        var.registers(['colorIndex', 'cards', 'count', 'primCard', 'handInfo'])
        var.put('primCard', var.get('Card_1').get('cardToRankTranslation').get(var.get('handInfo').get('primaryCard')).get('numeric'))
        if var.get('cards').get(var.get('primCard')).neg():
            return Js(False)
        var.put('count', Js(0.0))
        #for JS loop
        var.put('colorIndex', Js(1.0))
        while (var.get('colorIndex')<=Js(4.0)):
            var.put('count', var.get('cards').get(var.get('primCard')).get(var.get('colorIndex')), '+')
            # update
            (var.put('colorIndex',Js(var.get('colorIndex').to_number())+Js(1))-Js(1))
        return (var.get('count')==Js(4.0))
    PyJsHoisted_fourChecker_.func_name = 'fourChecker'
    var.put('fourChecker', PyJsHoisted_fourChecker_)
    @Js
    def PyJsHoisted_fullChecker_(cards, handInfo, this, arguments, var=var):
        var = Scope({'cards':cards, 'handInfo':handInfo, 'this':this, 'arguments':arguments}, var)
        var.registers(['colorIndex', '_a', 'currentCard', 'cardIndex', 'cards', 'count', 'primCard', '_i', 'secCard', 'handInfo'])
        var.put('primCard', var.get('Card_1').get('cardToRankTranslation').get(var.get('handInfo').get('primaryCard')).get('numeric'))
        if var.get('cards').get(var.get('primCard')).neg():
            return Js(False)
        var.put('secCard', var.get('Card_1').get('cardToRankTranslation').get(var.get('handInfo').get('secondaryCard')).get('numeric'))
        if var.get('cards').get(var.get('secCard')).neg():
            return Js(False)
        var.put('count', Js([Js(0.0), Js(0.0)]))
        #for JS loop
        var.put('_i', Js(0.0))
        var.put('_a', Js([var.get('primCard'), var.get('secCard')]))
        while (var.get('_i')<var.get('_a').get('length')):
            var.put('cardIndex', var.get('_a').get(var.get('_i')))
            #for JS loop
            var.put('colorIndex', Js(1.0))
            while (var.get('colorIndex')<=Js(4.0)):
                var.put('currentCard', (Js(0.0) if PyJsStrictEq(var.get('cardIndex'),var.get('primCard')) else Js(1.0)))
                var.get('count').put(var.get('currentCard'), var.get('cards').get(var.get('cardIndex')).get(var.get('colorIndex')), '+')
                # update
                (var.put('colorIndex',Js(var.get('colorIndex').to_number())+Js(1))-Js(1))
            # update
            (var.put('_i',Js(var.get('_i').to_number())+Js(1))-Js(1))
        return ((var.get('count').get('0')>=Js(3.0)) and (var.get('count').get('1')>=Js(2.0)))
    PyJsHoisted_fullChecker_.func_name = 'fullChecker'
    var.put('fullChecker', PyJsHoisted_fullChecker_)
    @Js
    def PyJsHoisted_streetChecker_(cards, handInfo, this, arguments, var=var):
        var = Scope({'cards':cards, 'handInfo':handInfo, 'this':this, 'arguments':arguments}, var)
        var.registers(['colorIndex', 'cards', 'count', 'handInfo', 'startingCard', 'i'])
        var.put('startingCard', var.get('Card_1').get('cardToRankTranslation').get(var.get('handInfo').get('startingCard')).get('numeric'))
        var.put('count', Js(0.0))
        #for JS loop
        var.put('i', Js(0.0))
        while (var.get('i')<Js(5.0)):
            if var.get('cards').get((var.get('startingCard')+var.get('i'))).neg():
                return Js(False)
            #for JS loop
            var.put('colorIndex', Js(1.0))
            while (var.get('colorIndex')<=Js(4.0)):
                if (var.get('cards').get((var.get('startingCard')+var.get('i'))).get(var.get('colorIndex'))==Js(1.0)):
                    (var.put('count',Js(var.get('count').to_number())+Js(1))-Js(1))
                    break
                # update
                (var.put('colorIndex',Js(var.get('colorIndex').to_number())+Js(1))-Js(1))
            # update
            (var.put('i',Js(var.get('i').to_number())+Js(1))-Js(1))
        return (var.get('count')==Js(5.0))
    PyJsHoisted_streetChecker_.func_name = 'streetChecker'
    var.put('streetChecker', PyJsHoisted_streetChecker_)
    @Js
    def PyJsHoisted_threeChecker_(cards, handInfo, this, arguments, var=var):
        var = Scope({'cards':cards, 'handInfo':handInfo, 'this':this, 'arguments':arguments}, var)
        var.registers(['colorIndex', 'cards', 'count', 'primCard', 'handInfo'])
        var.put('primCard', var.get('Card_1').get('cardToRankTranslation').get(var.get('handInfo').get('primaryCard')).get('numeric'))
        if var.get('cards').get(var.get('primCard')).neg():
            return Js(False)
        var.put('count', Js(0.0))
        #for JS loop
        var.put('colorIndex', Js(1.0))
        while (var.get('colorIndex')<=Js(4.0)):
            var.put('count', var.get('cards').get(var.get('primCard')).get(var.get('colorIndex')), '+')
            # update
            (var.put('colorIndex',Js(var.get('colorIndex').to_number())+Js(1))-Js(1))
        return (var.get('count')>=Js(3.0))
    PyJsHoisted_threeChecker_.func_name = 'threeChecker'
    var.put('threeChecker', PyJsHoisted_threeChecker_)
    @Js
    def PyJsHoisted_doubleChecker_(cards, handInfo, this, arguments, var=var):
        var = Scope({'cards':cards, 'handInfo':handInfo, 'this':this, 'arguments':arguments}, var)
        var.registers(['colorIndex', '_a', 'currentCard', 'cardIndex', 'cards', 'count', 'primCard', '_i', 'secCard', 'handInfo'])
        var.put('primCard', var.get('Card_1').get('cardToRankTranslation').get(var.get('handInfo').get('primaryCard')).get('numeric'))
        if var.get('cards').get(var.get('primCard')).neg():
            return Js(False)
        var.put('secCard', var.get('Card_1').get('cardToRankTranslation').get(var.get('handInfo').get('secondaryCard')).get('numeric'))
        if var.get('cards').get(var.get('secCard')).neg():
            return Js(False)
        var.put('count', Js([Js(0.0), Js(0.0)]))
        #for JS loop
        var.put('_i', Js(0.0))
        var.put('_a', Js([var.get('primCard'), var.get('secCard')]))
        while (var.get('_i')<var.get('_a').get('length')):
            var.put('cardIndex', var.get('_a').get(var.get('_i')))
            #for JS loop
            var.put('colorIndex', Js(1.0))
            while (var.get('colorIndex')<=Js(4.0)):
                var.put('currentCard', (Js(0.0) if PyJsStrictEq(var.get('cardIndex'),var.get('primCard')) else Js(1.0)))
                var.get('count').put(var.get('currentCard'), var.get('cards').get(var.get('cardIndex')).get(var.get('colorIndex')), '+')
                # update
                (var.put('colorIndex',Js(var.get('colorIndex').to_number())+Js(1))-Js(1))
            # update
            (var.put('_i',Js(var.get('_i').to_number())+Js(1))-Js(1))
        return ((var.get('count').get('0')>=Js(2.0)) and (var.get('count').get('1')>=Js(2.0)))
    PyJsHoisted_doubleChecker_.func_name = 'doubleChecker'
    var.put('doubleChecker', PyJsHoisted_doubleChecker_)
    @Js
    def PyJsHoisted_pairChecker_(cards, handInfo, this, arguments, var=var):
        var = Scope({'cards':cards, 'handInfo':handInfo, 'this':this, 'arguments':arguments}, var)
        var.registers(['colorIndex', 'cards', 'count', 'primCard', 'handInfo'])
        var.put('primCard', var.get('Card_1').get('cardToRankTranslation').get(var.get('handInfo').get('primaryCard')).get('numeric'))
        if var.get('cards').get(var.get('primCard')).neg():
            return Js(False)
        var.put('count', Js(0.0))
        #for JS loop
        var.put('colorIndex', Js(1.0))
        while (var.get('colorIndex')<=Js(4.0)):
            var.put('count', var.get('cards').get(var.get('primCard')).get(var.get('colorIndex')), '+')
            # update
            (var.put('colorIndex',Js(var.get('colorIndex').to_number())+Js(1))-Js(1))
        return (var.get('count')>=Js(2.0))
    PyJsHoisted_pairChecker_.func_name = 'pairChecker'
    var.put('pairChecker', PyJsHoisted_pairChecker_)
    @Js
    def PyJsHoisted_oneChecker_(cards, handInfo, this, arguments, var=var):
        var = Scope({'cards':cards, 'handInfo':handInfo, 'this':this, 'arguments':arguments}, var)
        var.registers(['colorIndex', 'cards', 'count', 'primCard', 'handInfo'])
        var.put('primCard', var.get('Card_1').get('cardToRankTranslation').get(var.get('handInfo').get('primaryCard')).get('numeric'))
        if var.get('cards').get(var.get('primCard')).neg():
            return Js(False)
        var.put('count', Js(0.0))
        #for JS loop
        var.put('colorIndex', Js(1.0))
        while (var.get('colorIndex')<=Js(4.0)):
            var.put('count', var.get('cards').get(var.get('primCard')).get(var.get('colorIndex')), '+')
            # update
            (var.put('colorIndex',Js(var.get('colorIndex').to_number())+Js(1))-Js(1))
        return (var.get('count')>=Js(1.0))
    PyJsHoisted_oneChecker_.func_name = 'oneChecker'
    var.put('oneChecker', PyJsHoisted_oneChecker_)
    Js('use strict')
    var.get('Object').callprop('defineProperty', var.get('exports'), Js('__esModule'), Js({'value':Js(True)}))
    var.get('exports').put('checkFunctionsMap', PyJsComma(Js(0.0), Js(None)))
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    var.get('exports').put('checkFunctionsMap', Js({'royal':var.get('royalFlushChecker'),'flush':var.get('flushChecker'),'color':var.get('colorChecker'),'four':var.get('fourChecker'),'full':var.get('fullChecker'),'street':var.get('streetChecker'),'three':var.get('threeChecker'),'double':var.get('doubleChecker'),'pair':var.get('pairChecker'),'one':var.get('oneChecker')}))
PyJs_anonymous_15_._set_name('anonymous')
var.get('define')(Js('client/src/game/HandRankings'), Js([Js('require'), Js('exports'), Js('client/src/model/Card')]), PyJs_anonymous_15_)
@Js
def PyJs_anonymous_16_(require, exports, this, arguments, var=var):
    var = Scope({'require':require, 'exports':exports, 'this':this, 'arguments':arguments}, var)
    var.registers(['exports', 'require'])
    Js('use strict')
    var.get('Object').callprop('defineProperty', var.get('exports'), Js('__esModule'), Js({'value':Js(True)}))
PyJs_anonymous_16_._set_name('anonymous')
var.get('define')(Js('common/payloads'), Js([Js('require'), Js('exports')]), PyJs_anonymous_16_)
@Js
def PyJs_anonymous_17_(require, exports, this, arguments, var=var):
    var = Scope({'require':require, 'exports':exports, 'this':this, 'arguments':arguments}, var)
    var.registers(['exports', 'Game', 'require'])
    Js('use strict')
    var.get('Object').callprop('defineProperty', var.get('exports'), Js('__esModule'), Js({'value':Js(True)}))
    var.get('exports').put('Game', PyJsComma(Js(0.0), Js(None)))
    @Js
    def PyJs_anonymous_18_(this, arguments, var=var):
        var = Scope({'this':this, 'arguments':arguments}, var)
        var.registers(['Game'])
        @Js
        def PyJsHoisted_Game_(players, gameStartData, thisPlayerId, this, arguments, var=var):
            var = Scope({'players':players, 'gameStartData':gameStartData, 'thisPlayerId':thisPlayerId, 'this':this, 'arguments':arguments}, var)
            var.registers(['gameStartData', 'thisPlayerId', 'players'])
            var.get(u"this").put('playerCount', var.get('players').get('length'))
            var.get(u"this").put('players', var.get('structuredClone')(var.get('players')))
            var.get(u"this").put('hand', var.get('gameStartData').get('newHands').get(var.get('thisPlayerId')))
            var.get(u"this").put('previousBet', var.get(u"null"))
            var.get(u"this").put('currentPlayer', var.get('gameStartData').get('startingPlayerId'))
            var.get(u"this").put('eliminatedPlayers', Js([]))
            @Js
            def PyJs_anonymous_19_(el, this, arguments, var=var):
                var = Scope({'el':el, 'this':this, 'arguments':arguments}, var)
                var.registers(['el'])
                return (var.get('gameStartData').get('startingPlayerId')==var.get('el').get('uid'))
            PyJs_anonymous_19_._set_name('anonymous')
            var.get(u"this").put('currentPlayerIndx', var.get(u"this").get('players').callprop('findIndex', PyJs_anonymous_19_))
            var.get(u"this").put('thisPlayerId', var.get('thisPlayerId'))
            var.get(u"this").put('gameClosed', Js(False))
        PyJsHoisted_Game_.func_name = 'Game'
        var.put('Game', PyJsHoisted_Game_)
        pass
        @Js
        def PyJs_anonymous_20_(playerUid, this, arguments, var=var):
            var = Scope({'playerUid':playerUid, 'this':this, 'arguments':arguments}, var)
            var.registers(['playerUid'])
            @Js
            def PyJs_anonymous_21_(pl, this, arguments, var=var):
                var = Scope({'pl':pl, 'this':this, 'arguments':arguments}, var)
                var.registers(['pl'])
                return PyJsStrictNeq(var.get('pl').get('uid'),var.get('playerUid'))
            PyJs_anonymous_21_._set_name('anonymous')
            var.get(u"this").put('players', var.get(u"this").get('players').callprop('filter', PyJs_anonymous_21_))
            @Js
            def PyJs_anonymous_22_(pl, this, arguments, var=var):
                var = Scope({'pl':pl, 'this':this, 'arguments':arguments}, var)
                var.registers(['pl'])
                return PyJsStrictNeq(var.get('pl').get('uid'),var.get('playerUid'))
            PyJs_anonymous_22_._set_name('anonymous')
            var.get(u"this").put('eliminatedPlayers', var.get(u"this").get('eliminatedPlayers').callprop('filter', PyJs_anonymous_22_))
            var.get(u"this").put('playerCount', Js(1.0), '-')
            if (var.get(u"this").get('currentPlayerIndx')>var.get(u"this").get('playerCount')):
                var.get(u"this").put('currentPlayerIndx', Js(0.0))
                var.get(u"this").put('currentPlayer', var.get(u"this").get('players').get('0').get('uid'))
        PyJs_anonymous_20_._set_name('anonymous')
        var.get('Game').get('prototype').put('removePlayer', PyJs_anonymous_20_)
        @Js
        def PyJs_anonymous_23_(bet, this, arguments, var=var):
            var = Scope({'bet':bet, 'this':this, 'arguments':arguments}, var)
            var.registers(['bet'])
            var.get(u"this").put('previousBet', var.get('bet'))
            var.get(u"this").callprop('nextPlayer')
        PyJs_anonymous_23_._set_name('anonymous')
        var.get('Game').get('prototype').put('hit', PyJs_anonymous_23_)
        @Js
        def PyJs_anonymous_24_(this, arguments, var=var):
            var = Scope({'this':this, 'arguments':arguments}, var)
            var.registers([])
            var.get(u"this").put('currentPlayerIndx', ((var.get(u"this").get('currentPlayerIndx')+Js(1.0))%var.get(u"this").get('playerCount')))
            var.get(u"this").put('currentPlayer', var.get(u"this").get('players').get(var.get(u"this").get('currentPlayerIndx')).get('uid'))
        PyJs_anonymous_24_._set_name('anonymous')
        var.get('Game').get('prototype').put('nextPlayer', PyJs_anonymous_24_)
        @Js
        def PyJs_anonymous_25_(data, this, arguments, var=var):
            var = Scope({'data':data, 'this':this, 'arguments':arguments}, var)
            var.registers(['data', '_this'])
            var.put('_this', var.get(u"this"))
            if var.get('data').neg():
                PyJsTempException = JsToPyException(Js('Data field not present in check()'))
                raise PyJsTempException
            var.get(u"this").put('hand', var.get('data').get('newHand'))
            var.get(u"this").put('players', var.get('data').get('players'))
            var.get(u"this").put('eliminatedPlayers', var.get('data').get('eliminatedPlayers'))
            var.get(u"this").put('playerCount', var.get(u"this").get('players').get('length'))
            var.get(u"this").put('currentPlayer', var.get('data').get('roundStartingPlayerId'))
            @Js
            def PyJs_anonymous_26_(pl, this, arguments, var=var):
                var = Scope({'pl':pl, 'this':this, 'arguments':arguments}, var)
                var.registers(['pl'])
                return (var.get('pl').get('uid')==var.get('_this').get('currentPlayer'))
            PyJs_anonymous_26_._set_name('anonymous')
            var.get(u"this").put('currentPlayerIndx', var.get(u"this").get('players').callprop('findIndex', PyJs_anonymous_26_))
            var.get(u"this").put('previousBet', var.get(u"null"))
            var.get(u"this").put('playerThatLost', var.get('data').get('playerThatLost'))
            return var.get('data').get('checkSuccesful')
        PyJs_anonymous_25_._set_name('anonymous')
        var.get('Game').get('prototype').put('check', PyJs_anonymous_25_)
        @Js
        def PyJs_anonymous_27_(this, arguments, var=var):
            var = Scope({'this':this, 'arguments':arguments}, var)
            var.registers([])
            var.get('console').callprop('warn', Js('CLIENT SHOULDNT CALL HOST ONLY FUNCTIONS!'))
            return var.get('undefined')
        PyJs_anonymous_27_._set_name('anonymous')
        var.get('Game').get('prototype').put('validateCheck', PyJs_anonymous_27_)
        @Js
        def PyJs_anonymous_28_(this, arguments, var=var):
            var = Scope({'this':this, 'arguments':arguments}, var)
            var.registers([])
            var.get('console').callprop('warn', Js('CLIENT SHOULDNT CALL HOST ONLY FUNCTIONS!'))
            return Js({})
        PyJs_anonymous_28_._set_name('anonymous')
        var.get('Game').get('prototype').put('getCardCount', PyJs_anonymous_28_)
        return var.get('Game')
    PyJs_anonymous_18_._set_name('anonymous')
    var.put('Game', PyJs_anonymous_18_())
    var.get('exports').put('Game', var.get('Game'))
PyJs_anonymous_17_._set_name('anonymous')
var.get('define')(Js('client/src/game/Game'), Js([Js('require'), Js('exports')]), PyJs_anonymous_17_)
@Js
def PyJs_anonymous_29_(require, exports, Card_2, Game_1, HandRankings_1, this, arguments, var=var):
    var = Scope({'require':require, 'exports':exports, 'Card_2':Card_2, 'Game_1':Game_1, 'HandRankings_1':HandRankings_1, 'this':this, 'arguments':arguments}, var)
    var.registers(['Card_2', 'deckInitialization', 'color', 'require', 'GameServer', 'card', 'HandRankings_1', 'Game_1', 'exports'])
    Js('use strict')
    var.get('Object').callprop('defineProperty', var.get('exports'), Js('__esModule'), Js({'value':Js(True)}))
    var.get('exports').put('GameServer', var.get('exports').put('deck', PyJsComma(Js(0.0), Js(None))))
    var.put('deckInitialization', Js([]))
    for PyJsTemp in var.get('Card_2').get('Rank'):
        var.put('card', PyJsTemp)
        if var.get('isNaN')(var.get('Number')(var.get('card'))):
            for PyJsTemp in var.get('Card_2').get('CardColor'):
                var.put('color', PyJsTemp)
                if var.get('isNaN')(var.get('Number')(var.get('color'))):
                    var.get('deckInitialization').callprop('push', Js([var.get('card'), var.get('color')]))
    var.get('exports').put('deck', var.get('deckInitialization'))
    @Js
    def PyJs_anonymous_30_(_super, this, arguments, var=var):
        var = Scope({'_super':_super, 'this':this, 'arguments':arguments}, var)
        var.registers(['GameServer', '_super'])
        @Js
        def PyJsHoisted_GameServer_(players, gameStartData, thisPlayerId, initialCardCounts, this, arguments, var=var):
            var = Scope({'players':players, 'gameStartData':gameStartData, 'thisPlayerId':thisPlayerId, 'initialCardCounts':initialCardCounts, 'this':this, 'arguments':arguments}, var)
            var.registers(['thisPlayerId', 'players', 'gameStartData', 'initialCardCounts', '_this'])
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
        def PyJs_anonymous_31_(numberOfCards, this, arguments, var=var):
            var = Scope({'numberOfCards':numberOfCards, 'this':this, 'arguments':arguments}, var)
            var.registers(['numberOfCards', 'drawnCards', 'card', 'randomIndex'])
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
                var.get(u"this").get('cardCounts').get(var.get('Card_2').get('fullCardNameToNumeric').get(var.get('card').get('0')).get('numeric')).put(var.get('Card_2').get('ColorToIndex').get(var.get('card').get('1')), Js(1.0), '+')
            return var.get('drawnCards')
        PyJs_anonymous_31_._set_name('anonymous')
        var.get('GameServer').get('prototype').put('drawCards', PyJs_anonymous_31_)
        @Js
        def PyJs_anonymous_32_(this, arguments, var=var):
            var = Scope({'this':this, 'arguments':arguments}, var)
            var.registers([])
            var.get(u"this").put('deck', var.get('exports').get('deck').callprop('slice'))
        PyJs_anonymous_32_._set_name('anonymous')
        var.get('GameServer').get('prototype').put('shuffleDeck', PyJs_anonymous_32_)
        @Js
        def PyJs_anonymous_33_(this, arguments, var=var):
            var = Scope({'this':this, 'arguments':arguments}, var)
            var.registers(['_this'])
            var.put('_this', var.get(u"this"))
            var.get(u"this").put('cardCounts', PyJsComma(Js(0.0),var.get('Card_2').get('initalizeCountTable'))())
            var.get(u"this").callprop('shuffleDeck')
            var.get(u"this").put('hands', var.get('Map').create())
            @Js
            def PyJs_anonymous_34_(player, this, arguments, var=var):
                var = Scope({'player':player, 'this':this, 'arguments':arguments}, var)
                var.registers(['player'])
                var.get('_this').get('hands').callprop('set', var.get('player').get('uid'), var.get('_this').callprop('drawCards', (Js(1.0)+var.get('player').get('loses'))))
            PyJs_anonymous_34_._set_name('anonymous')
            var.get(u"this").get('players').callprop('forEach', PyJs_anonymous_34_)
        PyJs_anonymous_33_._set_name('anonymous')
        var.get('GameServer').get('prototype').put('dealCards', PyJs_anonymous_33_)
        @Js
        def PyJs_anonymous_35_(data, this, arguments, var=var):
            var = Scope({'data':data, 'this':this, 'arguments':arguments}, var)
            var.registers(['checkWasSucessful', 'data', 'wasBetFound', 'prevPlayer'])
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
        PyJs_anonymous_35_._set_name('anonymous')
        var.get('GameServer').get('prototype').put('check', PyJs_anonymous_35_)
        @Js
        def PyJs_anonymous_36_(this, arguments, var=var):
            var = Scope({'this':this, 'arguments':arguments}, var)
            var.registers(['payload', 'newHand', 'checkResult'])
            var.put('checkResult', var.get(u"this").callprop('check'))
            var.get(u"this").callprop('dealCards')
            var.put('newHand', var.get(u"this").get('hands').callprop('get', var.get(u"this").get('thisPlayerId')))
            if var.get('newHand'):
                var.get(u"this").put('hand', var.get('newHand'))
            var.put('payload', Js({'newHands':var.get('Object').callprop('fromEntries', var.get(u"this").get('hands')),'players':var.get(u"this").get('players'),'roundStartingPlayerId':var.get(u"this").get('currentPlayer'),'eliminatedPlayers':var.get(u"this").get('eliminatedPlayers'),'checkSuccesful':var.get('checkResult'),'playerThatLost':var.get(u"this").get('playerThatLost')}))
            return var.get('payload')
        PyJs_anonymous_36_._set_name('anonymous')
        var.get('GameServer').get('prototype').put('validateCheck', PyJs_anonymous_36_)
        @Js
        def PyJs_anonymous_37_(this, arguments, var=var):
            var = Scope({'this':this, 'arguments':arguments}, var)
            var.registers([])
            return var.get(u"this").get('cardCounts')
        PyJs_anonymous_37_._set_name('anonymous')
        var.get('GameServer').get('prototype').put('getCardCount', PyJs_anonymous_37_)
        return var.get('GameServer')
    PyJs_anonymous_30_._set_name('anonymous')
    var.put('GameServer', PyJs_anonymous_30_(var.get('Game_1').get('Game')))
    var.get('exports').put('GameServer', var.get('GameServer'))
PyJs_anonymous_29_._set_name('anonymous')
var.get('define')(Js('client/src/game/GameServer'), Js([Js('require'), Js('exports'), Js('client/src/model/Card'), Js('client/src/game/Game'), Js('client/src/game/HandRankings')]), PyJs_anonymous_29_)
pass


# Add lib to the module scope
game = var.to_python()