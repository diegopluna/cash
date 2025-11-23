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
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
