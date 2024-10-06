<script lang="ts">
    import { io, type Socket } from 'socket.io-client'
    import { onMount } from 'svelte'
    import { FlatToast, ToastContainer, toasts } from 'svelte-toasts'
    import { ToastProps } from 'svelte-toasts/types/common'
    import type { GameState, joinGameResponsePayload, joinRequest, reconnectRequestPayload, reconnectResponsePayload } from '../../common/payloads'
    import { Player } from '../../common/player'
    import { SocketEventsCommon, SocketEventsFromClient, SocketEventsFromHost, SocketEventsFromServer } from '../../src/types/socketEvents'
    import Account from './Account.svelte'
    import { playerStore } from './game/stores'
    import Home from './Home.svelte'
    import Menu from './Menu.svelte'
    import { ConnectionHandler } from './ConnectoinHandler'
    import { AppState } from './StateTypes'
    import { connect } from 'http2'

    let gameView: Promise<any> | undefined
    let activeView: string = 'menu'
    let connectoinHandler: ConnectionHandler = new ConnectionHandler()
    let appState: AppState = new AppState()
    let theme = {
        'primary-color': '#05580c',
        'secondary-color': '#01420d',
        'background-color': '#171c17',
    }
    $: cssVarTheme = Object.entries(theme)
        .map(([key, value]) => `--${key}:${value}`)
        .join(';')

    function loadClientGameView() {
        gameView = import('./lobby/LobbyClient.svelte')
    }

    function joinGame(event: CustomEvent): void {
        appState.username = event.detail.username
        appState.gameId = event.detail.gameId

        if (!appState.gameId) {
            return
        }
        if (!appState.username) {
            return
        }

        connectoinHandler.join(appState, loadClientGameView)
    }

    function hostGame(event: CustomEvent): void {
        appState.username = event.detail.username

        connectoinHandler.host(appState, () => {
            gameView = import('./lobby/LobbyHost.svelte')
        })
    }

    function leaveGame(): void {
        gameView = undefined
        appState.gameId = null
        appState.player = null // Reset player status or keep for reconnection purposes
    }

    function checkForReconnect() {
        let sessionGameId = sessionStorage.getItem('gameId')
        let sessionUid = sessionStorage.getItem('uid')
        if (!sessionUid || !sessionGameId) {
            return
        }

        appState.gameId = sessionGameId

        connectoinHandler.reconnect(appState, sessionUid, loadClientGameView)
    }

    onMount(() => {
        checkForReconnect()
    })

    export const showToast = (props: Partial<ToastProps>) => {
        toasts.add({
            duration: 10000,
            placement: 'top-right',
            theme: 'dark',
            ...props,
        })
    }
</script>

<main style="{cssVarTheme}">
    <ToastContainer placement="top-right" let:data>
        <FlatToast {data} />
    </ToastContainer>
    <div class="main-content">
        <h1 class="glowing title">BLEF</h1>
        {#if gameView && connectoinHandler.connection && appState.gameState}
            {#await gameView then { default: LobbyView }}
                <LobbyView usernameInput="{appState.username}" on:gameClosed="{leaveGame}" gameState="{appState.gameState}" {appState} connectionHandler="{connectoinHandler}" />
            {/await}
        {:else if activeView === 'menu'}
            <Menu on:joinGame="{joinGame}" on:createGame="{hostGame}" />
        {:else if activeView === 'settings'}
            <Account />
        {:else if activeView === 'info'}
            <Home />
        {/if}
    </div>
</main>

<style>
    main {
        background-color: var(--background-color);
    }
    .title {
        text-transform: uppercase;
        display: inline-block;
        font-size: 128px;
        padding: 10px 10px 10px 20px;
    }
    .main-content {
        height: calc(100% - 70px);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-evenly;
    }
</style>
