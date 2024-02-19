<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { io, type Socket } from "socket.io-client";
    import { createEventDispatcher } from 'svelte';
    import { Player } from '../model/Player';
    import { playerStore } from '../game/stores';
    import { SocketEvents } from '../../../src/types/socketEvents';

    export let usernameInput:string;
    export let gameId: string;
    const dispatch = createEventDispatcher();
    let socket: Socket;

    let gameView: Promise<typeof import('../game/GameClientView.svelte')> | undefined;
    let players: Player[] = [];
    let player: Player;
    let startingPlayerId:string;


    const unsubscribe = playerStore.subscribe(value => {
        player = value!;
    });

    onDestroy(() => {
        unsubscribe();
    });


    onMount(() => {
        const serverUrl: string = "http://localhost:5678";
        socket = io(serverUrl);

        socket.emit("joinGameToServer", {gameId:gameId,username:usernameInput});

        // Listen for messages from the server
        socket.on("joinGameToClient", (data: { players?: {uid:string,username:string}[]; thisPlayerId:string;thisPlayerName:string; }) => {
            console.log(data)
            if (!data) {
                dispatch('leave'); // Very scuffed way to force quit after joining wrong lobby by gameID
            }

            if (data.players) {
                players = data.players.map((el) => {
                    let newPlayer: Player = new Player(el.uid, el.username);
                    newPlayer.isOnline = true;
                    return newPlayer
                });
            }

            if (data.thisPlayerId && data.thisPlayerName) { //This if is wrong. If data does not exist error should be thrown
                players = [...players, new Player(data.thisPlayerId,data.thisPlayerName)];
            }
        });

        socket.on("newPlayerJoinedGameToClient",(data:{username:string;uid:string})=>{
            console.log("new player in lobby name:",data.username)
            players = [...players, new Player(data.uid,data.username)];
        })

        socket.on(SocketEvents.startGameToClients, (data)  => {
            console.log("reveived game start message",data)
            if (data && data.startingPlayerId) {
                console.log("game start good")
                startingPlayerId = data.startingPlayerId
                gameView = import('../game/GameClientView.svelte');
            }
        });

        socket.on("playerLeftGameToPlayers", (data: { playerId: string }) => { // Players = Host and Clients
            console.log("Player disconnected", data);
            if (!data) {
                return;
            }

            // Tag the disconnected player as not connected
            players = players.map(player => {
                if (player.id === data.playerId) {
                    return { ...player, isOnline: false };
                }
                return player;
            });
        });

    });

    function leaveGame(): void {
        socket.emit("playerLeftGameToServer", player.id); 
        players = [];

        dispatch("leave"); // To parent
        console.log("Left the game and returned to the main menu");
    }

</script>

<h1>
    {#if gameView}
        {#await gameView then { default: GameClient }}
            <GameClient {gameId} {socket} on:leave={leaveGame} initialPlayerList={players} startinPlayerId={startingPlayerId}/>
        {/await}
    {:else}
        Game ID: {#if gameId}{gameId}{/if}
        <br>
        <ul>
            <ul>
                {#each players as player}
                    <li>
                        <strong>ID:</strong> {player.id}  <br>
                        <strong>NAME:</strong> {player.name}  <br>
                        <strong>ONLINE:</strong> {player.isOnline ? 'Yes' : 'No'}
                    </li>
                {/each}
            </ul>
            
            <button on:click={leaveGame}>Leave</button>
        </ul>
    {/if}
</h1>
