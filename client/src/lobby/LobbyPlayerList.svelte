<script lang="ts">
    import { Popover } from 'flowbite-svelte'
    import type { Player } from '../../../common/player'

    export let players: Player[]
    export let thisPlayerId: string
    export let isHost: boolean = false
    export let handlePlayerKick: (playerId: string) => null = (_) => {
        return null
    }

    const truncateUsername = (username: string) => (username.length > 8 ? `${username.slice(0, 8)}...` : username)
</script>

<div class="container group default-area-background p20">
    <h2 class="header-underline">Players{' '}</h2>
    {#each players as player}
        <div class="player-item">
            {truncateUsername(player.username)}
            <!-- {#if player.isOnline || player.uid !== thisPlayerId}
                🟢
            {:else}
                🔴
            {/if} -->
            {#if isHost && player.uid != thisPlayerId}
                <button class="kick-button" id="kick-button" on:click="{handlePlayerKick(player.uid)}" aria-label="{`Kick player: ${player.username}`}"></button>
                <Popover triggeredBy="#kick-button">
                    <div class="popover shadow">Click to kick this player</div>
                </Popover>
            {/if}
        </div>
    {/each}
</div>

<style lang="scss">
    .kick-button {
        all: unset;
        cursor: pointer;
        &:after {
            display: inline-block;
            width: 1em;
            height: 1em;
            vertical-align: -0.125em;
            content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23ff0000' d='M3 16.74L7.76 12L3 7.26L7.26 3L12 7.76L16.74 3L21 7.26L16.24 12L21 16.74L16.74 21L12 16.24L7.26 21zm9-3.33l4.74 4.75l1.42-1.42L13.41 12l4.75-4.74l-1.42-1.42L12 10.59L7.26 5.84L5.84 7.26L10.59 12l-4.75 4.74l1.42 1.42z'/%3E%3C/svg%3E");
        }

        &:hover:after {
            transform: scale(1.2);
            filter: brightness(1.5);
        }
    }

    .player-item {
        background-color: #2424242c;
        min-width: 200px;
        padding: 10px 0px 10px 0px;
        margin: 10px 0 10px 0;
        white-space: nowrap;
        position: relative;
    }

    h2 {
        padding: 10px 60px;
        margin: 0 0 1rem 0;
        font-size: 3rem;
        &:after {
            display: inline-block;
            width: 1em;
            height: 1em;
            vertical-align: -0.125em;
            content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'%3E%3Cpath fill='white' d='M230.92 212c-15.23-26.33-38.7-45.21-66.09-54.16a72 72 0 1 0-73.66 0c-27.39 8.94-50.86 27.82-66.09 54.16a8 8 0 1 0 13.85 8c18.84-32.56 52.14-52 89.07-52s70.23 19.44 89.07 52a8 8 0 1 0 13.85-8M72 96a56 56 0 1 1 56 56a56.06 56.06 0 0 1-56-56'/%3E%3C/svg%3E");
        }
    }
</style>
