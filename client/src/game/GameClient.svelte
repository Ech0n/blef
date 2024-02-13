<script>
    export let gameId
    export let socket
    import { onMount } from 'svelte'
    import { io } from "socket.io-client";
    import { createEventDispatcher } from 'svelte'

    const dispatch = createEventDispatcher()

    onMount(async () => {

        // const url = "http://localhost:5678"
        // socket = io(url);
        //     // Listen for messages from the server
        // socket.on("join", (data) => {
        //     if(!data){
        //         dispatch('leave')
        //     }
            
        // });

        // socket.emit("join",gameId);
        
    })

</script>

<h1>
    
GRA  id:{gameId}  
</h1>