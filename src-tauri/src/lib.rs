use tauri::Manager;
use tauri_plugin_dialog::{DialogExt, MessageDialogButtons, MessageDialogKind};

use crate::drizzle_proxy::{setup_db, AppState};

mod drizzle_proxy;
include!(concat!(env!("OUT_DIR"), "/generated_migrations.rs"));
// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

#[tauri::command]
fn polite_restart(app: tauri::AppHandle) {
    app.restart();
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let migrations = load_migrations();
    tauri::Builder::default()
        .plugin(
            tauri_plugin_log::Builder::new()
                .level(tauri_plugin_log::log::LevelFilter::Info)
                .build(),
        )
        .plugin(tauri_plugin_svelte::init())
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:database.db", migrations)
                .build(),
        )
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            polite_restart,
            drizzle_proxy::run_sql
        ])
        .setup(|app| {
            tauri::async_runtime::block_on(async move {
                match setup_db(&app).await {
                    Ok(db) => {
                        app.manage(AppState { db });
                    }
                    Err(e) => {
                        log::error!("Failed to initialize database: {}", e);
                        app.dialog()
                            .message("Failed to initialize database. See logs for details.")
                            .kind(MessageDialogKind::Error)
                            .title("Error")
                            .buttons(MessageDialogButtons::Ok)
                            .blocking_show();
                    }
                }
            });
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
