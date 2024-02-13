<script>
    import { onMount } from 'svelte'
    import { io } from "socket.io-client";
  
    import svelteLogo from './assets/svelte.svg'
    import Emojis from './lib/Emojis.svelte'
    import Modal from './Modal.svelte';
    import { createEventDispatcher } from 'svelte'

    const dispatch = createEventDispatcher()
    let showModal = false;
  
    let emojisList;
  
    let gameId = undefined;
    let socket;
    onMount(async () => {
      const response = await fetch('http://localhost:5678/api/v1/emojis');
      const { emojis } = await response.json();
  
      emojisList = emojis;
  
      console.log(emojisList)
  

    });
  
      async function doPost () {
          // const res = await fetch('http://localhost:5678/api/v1/game/create', {
          // 	method: 'POST',credentials: "include",	})
      // const jsonRes = await res.json();
          // console.log(JSON.stringify(jsonRes))
          // const json = await res.json()
          // result = JSON.stringify(json)
            console.log("post")
            joinGame(1)
      }

    function joinGame(e)
    {
        dispatch('joinGame', {
            gameId: gameId
        })

    }

    
    function createGame(gameId)
    {
        dispatch('createGame')

    }

  </script>
  

<div>
    <button on:click={() => (showModal = true)}>  Join game </button>
    <button on:click={createGame}> Create a game </button>
</div>
  

<Modal bind:showModal on:join={joinGame}>
	<h2 slot="header">
		Game code:
	</h2>
  <input type="text" bind:value={gameId}  placeholder="enter game code..."/> 

</Modal>

