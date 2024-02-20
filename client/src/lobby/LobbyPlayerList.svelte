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
        background-color: #1e1e22;;
        border-radius: 20px;
        border-color: #07050f;
        border-style: solid;
        min-width: 300px;
        padding: 10px 20px 10px 20px;
        margin: 20px 0 15px 0;
        white-space: nowrap; 
    }
</style>

