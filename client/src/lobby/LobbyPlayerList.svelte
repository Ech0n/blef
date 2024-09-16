<script lang="ts">
    import type { Player } from '../../../common/player';

    export let players: Player[];
    export let thisPlayerId: string;
    export let isHost : boolean = false;
    export let handlePlayerKick: (playerId:string) => null = (_)=>{return null};


    // Function to truncate usernames
    const truncateUsername = (username: string) => (username.length > 6 ? `${username.slice(0, 6)}...` : username);
</script>

<div class="playerList container group">
    <h3>Players</h3>
    {#each players as player}
        <div class="playerItem">
            {player.username}
            <!-- {#if player.isOnline || player.uid !== thisPlayerId}
                🟢
            {:else}
                🔴
            {/if} -->
            {#if isHost && player.uid != thisPlayerId}
                <button class="kick-button" on:click={handlePlayerKick(player.uid)}>x</button>
            {/if}
        </div>
    {/each}
</div>

<style>
    .kick-button{
        min-width: 1rem;
        color:red;
    }
    .playerList {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 10px 0px 10px 0px;
    }

    .playerItem {
        background-color: #2424242c;
        border-radius: 20px;
        border-color: #05580c;
        border-style: solid;
        border-width: 1px;
        min-width: 200px;
        padding: 10px 0px 10px 0px;
        margin: 10px 0 10px 0;
        white-space: nowrap;
        position: relative;
    }

    .full-name {
        display: inline;
    }

    .short-name {
        display: none;
    }

    @media (max-width: 500px) {
        .full-name {
            display: none;
        }

        .short-name {
            display: inline;
        }
    }

    h3 {
        padding: 10px 60px;
        margin: 0px;
        border-bottom: solid #444 1.5px;
    }
</style>
