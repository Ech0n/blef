<script>
    import { onMount } from 'svelte'
    import { io } from "socket.io-client";
  
    export let socket;
    export let gameId;

    onMount(async () => {

        // const url = "http://localhost:5678"
        // socket = io(url);
        //     // Listen for messages from the server
        // socket.on("create", (data) => {
        //     console.log("User created a game, its id is: ",data)
        //     gameId = data
        // });
        // socket.emit("create");
        socket.on("playerHit",(data)=>
        {
            
        })
        
    })

</script>

<h1>
    
GRA {#if gameId} id:{gameId}  {/if}
</h1>