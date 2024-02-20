<script lang="ts">
    import type { Player } from "../../../common/player";

    export let players:Player[]

    export let thisPlayer: Player;


</script>

<div class="playerList">
    {#each players as player}
        <div class="playerItem">
            {player.username}
            {#if (player.isOnline || player.username === thisPlayer.username)}
                🟢 
                {:else}
                🔴
                {/if}
        </div>
    {/each}
</div>

<style>
    .playerList{
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .playerItem {
        background-color: #4f3acc;;
        border-radius: 20px;
        border-color: #210097;
        border-style: solid;
        min-width: 300px;
        padding: 3px 10px 3px 10px;
        margin: 20px 0 15px 0;
        white-space: nowrap; 
    }
</style>

