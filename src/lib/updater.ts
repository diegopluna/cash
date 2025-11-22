import { invoke } from '@tauri-apps/api/core';
import { ask, message } from '@tauri-apps/plugin-dialog';
import { check } from '@tauri-apps/plugin-updater';

export async function checkForAppUpdates(onUserClick: boolean = false) {
	const update = await check();
	if (update === null) {
		await message('Failed to check for updates.\n Please try again later.', {
			title: 'Error',
			kind: 'error',
			buttons: {
				ok: 'OK'
			}
		});

		return;
	} else if (update !== null) {
		const yes = await ask(
			`Update to ${update.version} is available!\n\n Release notes: ${update.body}`,
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
