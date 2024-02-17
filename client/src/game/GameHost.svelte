<script lang="ts">
    import { onMount } from 'svelte';
    import { io } from "socket.io-client";
    import { createEventDispatcher } from 'svelte';
    import type { Socket } from 'socket.io-client';

    export let gameId: string;
    export let socket: Socket;

    const dispatch = createEventDispatcher();
    const serverUrl: string = "http://localhost:5678";

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
