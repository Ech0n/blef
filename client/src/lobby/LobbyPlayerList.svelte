<script lang="ts">
    import type { Player } from '../../../common/player';

    export let players: Player[];
    export let thisPlayerId: string;
</script>

<div class="playerList group">
    <h3>Players</h3>
    {#each players as player}
        <div class="playerItem">
            {player.username}
            <!-- {#if player.isOnline || player.uid !== thisPlayerId}
                🟢
            {:else}
                🔴
            {/if} -->
        </div>
    {/each}
</div>

<style>
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
    }

    h3 {
        padding: 10px 60px;
        margin: 0px;
        border-bottom: solid #444 1.5px;
    }
</style>
