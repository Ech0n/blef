<script lang="ts">
    import { toasts } from 'svelte-toasts'

    export let gameId: string | null = null

    const copyCodeToClipboard = () => {
        if (gameId) {
            navigator.clipboard
                .writeText(gameId)
                .then(() => {
                    toasts.info({ placement: 'top-right', description: 'Copied game ID to clipboard' })
                })
                .catch((err) => {
                    toasts.warning({ placement: 'top-right', description: 'Failed to copy game ID' })
                })
        }
    }
</script>

<div class="container group code-container p20 default-area-background">
    {#if gameId}
        <span class="header-underline game-code-header">Game Code</span>
        <button on:click="{copyCodeToClipboard}" aria-label="Copy game ID" id="copy-button">
            <span class="glowing">{gameId}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16">
                <path
                    fill="currentColor"
                    fill-rule="evenodd"
                    d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"
                >
                </path>
            </svg>
        </button>
    {/if}
</div>

<style lang="scss">
    .code-container {
        margin-bottom: 2rem;

        button {
            all: unset;

            &:hover {
                cursor: pointer;
            }

            &:focus-visible {
                outline: whitesmoke 1px solid;
                outline-offset: 0.75rem;
                border-radius: 10px;
            }
        }

        svg {
            &:active {
                filter: drop-shadow(0 0 0 #15111a);
                font-weight: 900;
                transform: translate(0, 0.125rem);
            }
        }
    }

    .game-code-header {
        font-weight: 600;
        font-family: 'Roboto', sans-serif;
        font-size: 3rem;
        margin-bottom: 2rem;
    }
</style>
