import { writable } from 'svelte/store';
import type { Player } from '../../../definitions/player';

export const playerStore = writable<Player | null>(null);
