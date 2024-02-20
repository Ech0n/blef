<script lang="ts">
    import type { Player } from "../../../common/player";

    export let players:Player[]


</script>

<div class="playerList">
    {#each players as player}
        <div class="playerItem">
            {player.username}
            {#if player.isOnline}
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

    .playerItem{
        background-color: #363636;;
        border-radius: 20px;
        border-color: #464646;
        border-style: solid;
        width:300px;
        padding-top:3px;
        padding-bottom: 3px;
    }
</style>

