<script lang="ts">
    import { onMount } from 'svelte';
    import { io } from "socket.io-client";
    import type { Socket } from 'socket.io-client';

    export let gameId: string | undefined;
    export let socket: Socket;

    const serverUrl: string = "http://localhost:5678";

    onMount(() => {

        if (!socket) {
            socket = io(serverUrl);
        }

        if (gameId) {
            socket.on('playerHit', (data) => {
                // handle player hit event
            });

            socket.on('gameUpdate', (data) => {
                // handle game updates
            });

            socket.emit('joinGame', { gameId });
        }
    });
</script>

<h1>{#if gameId}Game ID: {gameId}{/if}</h1>
