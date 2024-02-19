<script lang="ts">
    import { onMount } from 'svelte';
    import { io } from "socket.io-client";
    import { createEventDispatcher } from 'svelte';
    import type { Socket } from 'socket.io-client';
    import type { Player } from '../model/Player';
    import { GameServer } from './GameServer';
    import { Game } from './Game';

    export let gameId: string;
    export let socket: Socket;
    export let initialPlayerList: Player[];
    export let startinPlayerId: string;

    const dispatch = createEventDispatcher();
    const serverUrl: string = "http://localhost:5678";
    const Game: GameServer = new GameServer(initialPlayerList,startinPlayerId)

    onMount(() => {
        if (!socket) {
            socket = io(serverUrl);
        }

        // socket.emit('joinGame', { gameId }); // Send a join game event to the server

        socket.on('gameState', (data) => {
            dispatch('update', data);
        });

        
    });
</script>

<h1>Game ID: {gameId}</h1>
