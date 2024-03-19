<script lang="ts">
    import type { Player } from '../../../common/player';

    export let players: Player[];
    export let thisPlayerId: string;

    // Function to truncate usernames
    const truncateUsername = (username: string) => (username.length > 5 ? `${username.slice(0, 5)}...` : username);
</script>

<div class="playerList">
    {#each players as player}
        <div class="playerItem">
            <span class="full-name">{player.username}</span>
            <span class="short-name">{truncateUsername(player.username)}</span>
            {#if player.isOnline || player.uid !== thisPlayerId}
                🟢
            {:else}
                🔴
            {/if}
        </div>
    {/each}
</div>

<style>
    .playerList {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .playerItem {
        background-color: #1e1e22;
        border-radius: 20px;
        border-color: #07050f;
        border-style: solid;
        min-width: 300px;
        padding: 10px 20px 10px 20px;
        margin: 20px 0 15px 0;
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
</style>
