export interface IPlayer {
    uid: string;
    username: string;
    isOnline: boolean;
    isHost: boolean;
}

export function createPlayerFromIPlayer(ip: IPlayer): Player {
    let player = new Player(ip.uid, ip.username);
    player.isOnline = ip.isOnline;
    player.isHost = ip.isHost;
    return player;
}

export class Player implements IPlayer {
    uid: string;
    username: string;
    isOnline!: boolean;
    loses: number;
    isHost: boolean = false;

    constructor(id: string, username: string) {
        this.uid = id;
        this.username = username;
        this.loses = 0;
    }
}
