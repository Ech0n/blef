<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte'
    import { toasts } from 'svelte-toasts'

    const dispatch = createEventDispatcher()

    export let showModal: boolean = false
    export let mode: 'join' | 'create' = 'join' // Add a mode prop to determine which form to show
    let gameId: string = ''
    let username: string = ''

    onMount(() => {
        let usernameFromStorage = sessionStorage.getItem('username')
        if (usernameFromStorage) {
            username = usernameFromStorage
        }
    })

    function closeModal() {
        showModal = false
        dispatch('close')
    }

    function gameAction() {
        if (username.trim() === '') {
            toasts.error({ description: 'Please enter your name.', placement: 'top-right' })
            return // Stop the action if username is empty
        }
        sessionStorage.setItem('username', username)
        if (mode === 'join') {
            if (gameId.trim() === '') {
                toasts.error({ description: 'Please enter a game ID.', placement: 'top-right' })
                return // Stop the action if gameId is empty
            }
            toasts.info({ description: 'Attempted to join a game', placement: 'top-right' })
            dispatch('joinGame', { username, gameId })
        } else {
            toasts.success({ description: 'Game created!', placement: 'top-right' })
            dispatch('createGame', { username })
        }
        closeModal() // Close the modal only if everything is correct
    }
</script>

{#if showModal}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="modal-backdrop" on:click="{closeModal}">
        <div class="modal container p15" on:click|stopPropagation>
            <div class="container">
                <span class="header-underline"> {`${mode === 'join' ? 'Join' : 'Create your'} game`} </span>
                {#if mode === 'join'}
                    <input type="text" placeholder="Enter Game ID" bind:value="{gameId}" maxlength="10" />
                {/if}
                <input type="text" placeholder="Enter Your Name" bind:value="{username}" maxlength="14" />

                <button class="default-button start-close" on:click="{gameAction}">
                    <span class="{`${mode === 'join' ? 'join' : 'create'}`}">{mode === 'join' ? 'Join Game' : 'Create Game'}</span>
                </button>
                <button class="default-button start-close" on:click="{closeModal}">
                    <p>Cancel</p>
                </button>
            </div>
        </div>
    </div>
{/if}

<style lang="scss">
    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.3);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .modal {
        background-color: #e5e5f7;
        background-color: #000000;
        opacity: 1;
        background: rgb(42, 41, 42);
        background: linear-gradient(90deg, rgba(42, 41, 42, 1) 20%, rgba(28, 33, 38, 1) 69%);
        border-radius: 30px;
        border-width: 5px;
        height: 500px;
        width: 800px;
        margin: 10px;
        box-shadow: 5px 5px 10px black;
        animation: slideIn 0.6s linear;

        input {
            margin-top: 1rem;
        }

        button {
            max-height: 50px;
            width: 250px;
            margin-top: 2rem;
        }

        p {
            position: relative;
            margin-block: unset;
            margin-left: -2.5rem;

            &:after {
                content: '';
                right: 0;
                position: absolute;
                display: inline-block;
                height: 100%;
                width: 30px;
                --svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='m8.4 17l3.6-3.6l3.6 3.6l1.4-1.4l-3.6-3.6L17 8.4L15.6 7L12 10.6L8.4 7L7 8.4l3.6 3.6L7 15.6zm3.6 5q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8'/%3E%3C/svg%3E");
                background-color: currentColor;
                -webkit-mask-image: var(--svg);
                mask-image: var(--svg);
                -webkit-mask-repeat: no-repeat;
                mask-repeat: no-repeat;
                -webkit-mask-size: 100% 100%;
                mask-size: 100% 100%;
            }
        }

        .join,
        .create {
            position: relative;
            margin-left: -2.5rem;
            &:after {
                position: absolute;
                right: -3rem;
                display: inline-block;
                width: 1em;
                height: 1em;
                vertical-align: -0.125em;
                content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='none' stroke='white' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M1.75 2.75H10v11.5H1.75zm8.25 1l4.25 2l-4.25 7.5'/%3E%3C/svg%3E");
            }
        }

        .join {
            &:after {
                right: -4rem;
            }
        }
    }

    @media only screen and (max-width: 800px) {
        .modal {
            width: 500px;
        }
    }

    @media only screen and (max-width: 500px) {
        .modal {
            width: 375px;
        }
    }

    @keyframes slideIn {
        0% {
            transform: translateY(-600px);
            animation-timing-function: ease-out;
        }
        60% {
            transform: translateY(30px);
            animation-timing-function: ease-in;
        }
        80% {
            transform: translateY(-10px);
            animation-timing-function: ease-out;
        }
        100% {
            transform: translateY(0px);
            animation-timing-function: ease-in;
        }
    }
</style>
