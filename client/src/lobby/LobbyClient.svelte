<script>
    export let gameId
    import { onMount } from 'svelte'
    import { io } from "socket.io-client";
    import { createEventDispatcher } from 'svelte'

    const dispatch = createEventDispatcher()
    let socket;

    let gameView
    let players = []

    onMount(async () => {

        const url = "http://localhost:5678"
        socket = io(url);
            // Listen for messages from the server
        socket.on("join", (data) => {
            if(!data){
                dispatch('leave')
            }
            if(data.players)
            {
                players = data.players
            }
            if(data.newPlayer)
            {
                players = [...players,data.newPlayer]
            }
        });

        socket.on("start", (data) => {
            if(data)
            {
                gameView = import('../game/GameClient.svelte')
            }
        });

        socket.emit("join",gameId);
    })

    function leaveGame(ev)
    {

    }
</script>

<h1>
    {#if gameView}
    {#await gameView then { default: GameView }}
        <GameView {gameId} {socket} on:leave={leaveGame} />
    {/await}
    {:else}
        GRA {#if gameId} id:{gameId}  {/if}
        Players:

    {/if}
</h1>