import { RuneStore } from '@tauri-store/svelte';

export const initStore = new RuneStore('init', { seeded: false }, { saveOnChange: true });
