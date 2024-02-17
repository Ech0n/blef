export class Player {
    id: string;
    name: string;
    isOnline!: boolean;
    loses: number;

    constructor(id: string, username: string) {
        this.id = id;
        this.name = username;
        this.loses = 0;
    }
}