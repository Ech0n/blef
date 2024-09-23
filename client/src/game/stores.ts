import { writable } from 'svelte/store'
import type { Player } from '../../../common/player'

export const playerStore = writable<Player | null>(null)
export const playersStore = writable<Player[]>([])

export const waitingPlayersCounter = writable(0)
export const readyPlayersCounter = writable(1)
