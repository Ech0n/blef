import { writable } from 'svelte/store';
import type { Player } from '../../../common/player';

export const playerStore = writable<Player | null>(null);
