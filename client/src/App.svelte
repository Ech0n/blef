<script>
  import { onMount } from 'svelte'
  import { io } from "socket.io-client";

  import Menu from "./Menu.svelte"
    import LobbyClient from './lobby/LobbyClient.svelte';

	let showModal = false;

  let emojisList;

  let socket;

	async function doPost () {
		// const res = await fetch('http://localhost:5678/api/v1/game/create', {
		// 	method: 'POST',credentials: "include",	})
    // const jsonRes = await res.json();
		// console.log(JSON.stringify(jsonRes))
		// const json = await res.json()
		// result = JSON.stringify(json)

    socket.emit("message", "HAHAHAHAH");
	}
  let gameView
  let gameId

  function joinGame(e){
    console.log(e.detail.gameId)
    
    gameId = e.detail.gameId
    gameView = import('./lobby/LobbyClient.svelte')
  }

  function hostGame(e){
    gameView = import('./lobby/LobbyHost.svelte')
  }
  function leaveGame(){
    gameView = undefined
    gameId = null
  }



</script>

<main>
{#if gameView}
  {#await gameView then { default: LobbyView }}
  <LobbyView {gameId} on:leave={leaveGame} />
  {/await}
{:else}
  <Menu on:joinGame={joinGame} on:createGame={hostGame}/>
{/if}
</main>

