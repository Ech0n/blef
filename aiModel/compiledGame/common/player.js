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
