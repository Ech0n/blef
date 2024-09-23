<script lang="ts">
    import { quintOut } from 'svelte/easing';
    import { flip } from 'svelte/animate';
    import type { IPlayer } from '../../../../common/player';

    export let users: IPlayer[];

    //TODO remove any
    let slots: any[] = [{ turn: -3 }, { turn: -2 }, { turn: -1 }];

    let i = 0;
    let turn = 0;
    let queue: number[];

    export function setup(startingPlayerIndex: number = 0) {
        i = startingPlayerIndex;

        turn = 0;
        queue = [...Array(users.length).keys()];
        slots = [{ turn: -3 }, { turn: -2 }, { turn: -1 }];
        while (slots.length < 7) {
            slots.push({ username: users[i].username, turn: turn });
            queue.shift();
            i += 1;

            if (i >= users.length) {
                queue = [...queue, ...Array(users.length).keys()];
                i = 0;
                turn += 1;
            }
        }
    }
    setup();
    let lock = true;
    export async function next() {
        if (lock) {
            let newUser = queue.shift();
            if (newUser == users.length - 1) {
                queue = [...Array(users.length).keys()];
                turn += 1;
            }

            slots.shift();

            //FIXME Change the way queue works so that ignore is not needed here
            //@ts-ignore
            slots = [...slots, { username: users[newUser].username, turn: turn }];
            lock = true;
        }
    }
</script>

<div class="container">
    <div class="slider">
        {#each slots as user, i (user)}
            <div class="item" id={'item' + i} animate:flip={{ duration: 350, easing: quintOut }}>
                {#if user.username}
                    {user.username}
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
    #item2 {
        color: white;
        font-size: 1.1rem;
    }
    #item4 {
        font-size: 1.1rem;
        color: white;
    }
</style>
