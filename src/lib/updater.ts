import { invoke } from '@tauri-apps/api/core';
import { ask, message } from '@tauri-apps/plugin-dialog';
import { error } from '@tauri-apps/plugin-log';
import { check } from '@tauri-apps/plugin-updater';
import { fromPromise } from 'neverthrow';

export async function checkForAppUpdates(onUserClick: boolean = false) {
	const result = await fromPromise(check(), (error) => error);

	if (result.isErr()) {
		if (onUserClick) {
			await message('Failed to check for updates.\nPlease try again later.', {
				title: 'Error',
				kind: 'error',
				buttons: {
					ok: 'OK'
				}
			});
		}
		error(`Failed to check for updates: ${result.error}`);
		return;
	}

	const update = result.value;

	if (update) {
		const yes = await ask(
			`Update to ${update.version} is available!\n\nRelease notes: ${update.body}`,
			{
				title: 'Update Available',
				kind: 'info',
				okLabel: 'Update',
				cancelLabel: 'Cancel'
			}
		);

		if (yes) {
			await update.downloadAndInstall();
			await invoke('polite_restart');
		}
	} else if (onUserClick) {
		await message('You are on the latest version!', {
			title: 'No Update Available',
			kind: 'info',
			buttons: {
				ok: 'OK'
			}
		});
	}
}
