import { writable } from 'svelte/store';
import type { Player } from '../model/Player';

export const playerStore = writable<Player | null>(null);
