<script>
    import { onMount } from 'svelte'
    import { io } from "socket.io-client";
  
    let socket;
    let gameId;

    let gameView;

    let players = ["host"]

    onMount(async () => {

        const url = "http://localhost:5678"
        socket = io(url);
            // Listen for messages from the server
        socket.on("create", (data) => {
            console.log("User created a game, its id is: ",data)
            gameId = data
        });

        socket.on("join", (data) => {
            console.log("join event ",data)
            if(!data)
            {
                return
            }

            if(data.newPlayer)
            {
                console.log("new player is here ",data.newPlayer)
                players = [...players,data.newPlayer]
            }

        });

        socket.on("start", (data) => {
            if(data)
            {
                gameView = import('../game/GameHost.svelte')
            }
        });

        socket.emit("create");
    })
    function start()
    {
        socket.emit("start")
    }
    function leaveGame()
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
        <ul>
            {#each players as username}
                <li>
                    {username}
                </li>
            {/each}
        </ul>

        <div>

            <button on:click={start}> Start </button>
        </div>
    {/if}

</h1>