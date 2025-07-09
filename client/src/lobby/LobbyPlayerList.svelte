<script lang="ts">
    import type { Player } from '../../../common/player'
    import { playersStore } from '../game/stores'

    let players: Player[]
    export let thisPlayerId: string
    export const isHost: boolean = false
    export let handlePlayerKick: (playerId: string) => null = (_) => {
        return null
    }

    playersStore.subscribe((value) => {
        players = value
    })

    // Function to truncate usernames
    const truncateUsername = (username: string) => (username.length > 6 ? `${username.slice(0, 6)}...` : username)
</script>

<div class="container group default-area-background p20 player-list">
    <h2 class="header-underline">Players{' '}</h2>
    {#each players as player}
        <div class="player-item">
            {truncateUsername(player.username)}

        </div>
    {/each}
</div>

<style lang="scss">
    

    .player-list {
        margin-bottom: 3rem;
    }

    .player-item {
        background-color: #2424242c;
        min-width: 200px;
        padding: 10px 0px 5px 0px;
        margin: 0px;
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
