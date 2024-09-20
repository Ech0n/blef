<script lang="ts">
    import { flip } from 'svelte/animate'
    import { quintOut } from 'svelte/easing'
    import type { IPlayer } from '../../../../common/player'

    export let users: IPlayer[]

    type TurnSlot = { turn: number; username?: string }
    const DEFAULT_TURN_SLOTS: TurnSlot[] = [{ turn: -3 }, { turn: -2 }, { turn: -1 }]

    let turnSlots: TurnSlot[] = [...DEFAULT_TURN_SLOTS]
    let currentIndex = 0
    let currentTurn = 0
    let queue: number[] = []
    let lock = true

    export function setup(startingPlayerIndex: number = 0) {
        currentIndex = startingPlayerIndex
        currentTurn = 0
        queue = [...Array(users.length).keys()]
        turnSlots = [...DEFAULT_TURN_SLOTS] // needs ... for svelte reactive updates

        while (turnSlots.length < 7) {
            turnSlots.push({ username: users[currentIndex].username, turn: currentTurn })
            queue.shift()
            currentIndex++

            if (currentIndex >= users.length) {
                queue = [...queue, ...Array(users.length).keys()]
                currentIndex = 0
                currentTurn++
            }
        }
    }

    export async function next() {
        if (lock) {
            let newUser: number = queue.shift() ?? -1
            if (newUser === -1) return // If queue is empty

            if (newUser === users.length - 1) {
                queue = [...Array(users.length).keys()]
                currentTurn += 1
            }

            turnSlots.shift()
            turnSlots = [...turnSlots, { username: users[newUser].username, turn: currentTurn }]
            lock = true
        }
    }

    const shortenUsername = (username: string) => {
        return username.length > 6 ? `${username.slice(0, 6)}...` : username
    }

    setup()
</script>

<!-- Carousel HTML Structure -->
<div class="container carousel">
    <div class="slider">
        {#each turnSlots as user, index (`${user.username}-${index}`)}
            <div class="item" id="{'item' + index}" animate:flip="{{ duration: 350, easing: quintOut }}">
                {#if user.username}
                    {shortenUsername(user.username)}
                {/if}
            </div>
        {/each}
    </div>
</div>

<style>
    .item {
        width: 75px;
        min-width: 75px;
        display: block;
        text-align: center;
    }

    .carousel {
    }

    .container {
        display: block;
        overflow-x: clip;
        width: 375px;
        font-size: 12px;
        color: gray;
    }
    .slider {
        display: flex;
        position: relative;
        left: -75px;
        display: flex;
        align-items: center;
    }
    #item3 {
        font-size: 1.5rem;
        color: greenyellow;
    }
    #item2,
    #item4 {
        color: white;
        font-size: 1.1rem;
    }
</style>
