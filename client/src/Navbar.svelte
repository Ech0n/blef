<!-- Navbar.svelte -->
<script lang="ts">
    import { createEventDispatcher } from "svelte";

    export let activeView: string;
    const dispatch = createEventDispatcher();

    function changeView(newView: string) {
        const event = new CustomEvent('viewChange', {
            detail: { newView }
        });
        dispatch('viewChange', event);
    }
</script>


<style>
    nav {
        display: flex;
        height: 50px;
        justify-content: space-around; 
        align-items: center;
        width: 100%;
        background-color: #1e1818; 
        padding: 10px 0;
        box-shadow: 1px 2px #151515;
    }
    button {
        padding-bottom: 50px;
        margin: 0;
        cursor: pointer;
        background-color: transparent;
        border: 1px solid transparent;
        transition: background-color 0.3s;
        transition: font-weight 0.3s;
        width: 33%;
        color:aliceblue;
        height: 100%;
        border-radius: 0;
        font-size: 30px;
    }
    button:hover {
        background-color: #2f2a2a;
        font-weight: 900;
    }
    button:focus {
        outline: none;
        border: none; 
    }
</style>

<nav>
    <button on:click={() => changeView("info")}>What's Blef?</button>
    <button on:click={() => changeView('menu')}>Play</button>
    <button on:click={() => changeView('settings')}>Settings</button>
</nav>
