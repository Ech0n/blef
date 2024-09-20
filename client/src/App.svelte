<script lang="ts">
    import { io, type Socket } from 'socket.io-client'
    import { onMount } from 'svelte'
    import { FlatToast, ToastContainer, toasts } from 'svelte-toasts'
    import { ToastProps } from 'svelte-toasts/types/common'
    import type { gameInfo, joinGameResponsePayload, joinRequest, reconnectRequestPayload, reconnectResponsePayload } from '../../common/payloads'
    import { Player } from '../../common/player'
    import { config } from '../../config'
    import { SocketEventsCommon, SocketEventsFromClient, SocketEventsFromHost, SocketEventsFromServer } from '../../src/types/socketEvents'
    import Account from './Account.svelte'
    import { playerStore } from './game/stores'
    import Home from './Home.svelte'
    import Menu from './Menu.svelte'

    let gameView: Promise<any> | undefined
    let activeView: string = 'menu'
    let gameId: string | null = null
    let player: Player | null = null
    let username = ''
    const serverUrl: string = config.BACKEND_SERVER_ADDRESS
    let socket: Socket
    let players: Player[] = []
    let thisPlayerId: string
    let startedGameInfo: gameInfo['startedGameInfo']

    let theme = {
        'primary-color': '#05580c',
        'secondary-color': '#01420d',
        'background-color': '#171c17',
    }
    $: cssVarTheme = Object.entries(theme)
        .map(([key, value]) => `--${key}:${value}`)
        .join(';')

    function commonListeners(socket: Socket) {
        socket.on(SocketEventsFromServer.playerReconnected, (data: { uid: string }) => {
            let player = players.find((pl) => {
                return pl.uid === data.uid
            })
            if (!player) {
                return
            }

            player.isOnline = true
        })
    }

    function loadClientGameView(gameInfo: gameInfo) {
        if (gameInfo.players) {
            players = gameInfo.players.map((el) => {
                let newPlayer: Player = new Player(el.uid, el.username)
                newPlayer.isOnline = el.isOnline
                return newPlayer
            })
        }
        thisPlayerId = gameInfo.thisPlayerId
        gameView = import('./lobby/LobbyClient.svelte')
    }

    function joinGame(event: CustomEvent): void {
        gameId = event.detail.gameId
        username = event.detail.username

        if (!gameId) {
            return //TODO ensure that gameId is not undefined
        }
        if (!username) {
            return
        }
        socket = io(serverUrl)

        // Listen for messages from the server
        socket.on(SocketEventsFromHost.joinResponse, (data: joinGameResponsePayload) => {
            if (!data || !data.didJoin || !data.gameInfo) {
                //TODO: Some kind of toast saying "Could not connect to game" and possibly information why
                return
            }

            if (gameId) {
                sessionStorage.setItem('gameId', gameId)
            }
            sessionStorage.setItem('uid', data.gameInfo.thisPlayerId)
            playerStore.set(player)

            thisPlayerId = data.gameInfo.thisPlayerId
            username = data.gameInfo.thisPlayerName

            player = new Player(thisPlayerId, username)
            player.isOnline = true

            commonListeners(socket)
            startedGameInfo = data.gameInfo.startedGameInfo
            loadClientGameView(data.gameInfo)
        })

        let requestPayload: joinRequest = {
            gameId: gameId,
            requesterUsername: username,
        }

        socket.emit(SocketEventsFromClient.joinRequest, requestPayload)
    }

    function hostGame(event: CustomEvent): void {
        if (!player) {
            const newId = Date.now().toString() // Placeholder ID generation TODO
            username = event.detail.username
            player = new Player(newId, event.detail.username)
            player.isOnline = true // Set the player as online upon game creation
        }
        socket = io(serverUrl)
        socket.emit(SocketEventsCommon.createGame, { username: username })
        commonListeners(socket)

        socket.on(SocketEventsCommon.createGame, (data: { gameId: string; hostId: string }) => {
            gameId = data.gameId
            let host = new Player(data.hostId, username)
            host.isOnline = true
            players = [host]
            thisPlayerId = data.hostId
        })
        playerStore.set(player)
        gameView = import('./lobby/LobbyHost.svelte')
    }

    function leaveGame(): void {
        gameView = undefined
        gameId = null
        player = null // Reset player status or keep for reconnection purposes
        playerStore.set(null)
    }

    function checkForReconnect() {
        let sessionGameId = sessionStorage.getItem('gameId')
        let sessionUid = sessionStorage.getItem('uid')
        if (!sessionUid || !sessionGameId) {
            return
        }

        socket = io(serverUrl)
        const request: reconnectRequestPayload = {
            requesterUid: sessionUid,
            gameId: sessionGameId,
        }
        socket.emit(SocketEventsFromClient.reconnectToGame, request)
        socket.on(SocketEventsFromHost.reconnectToGame, (response: reconnectResponsePayload) => {
            if (!response.didReconnect || !response.gameInfo) {
                socket.disconnect()
                return
            }
            startedGameInfo = response.gameInfo.startedGameInfo
            loadClientGameView(response.gameInfo)
        })
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
        {#if gameView}
            {#await gameView then { default: LobbyView }}
                <LobbyView {gameId} usernameInput="{username}" on:gameClosed="{leaveGame}" {socket} {thisPlayerId} {players} {startedGameInfo} />
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
