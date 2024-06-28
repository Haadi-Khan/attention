// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use active_win_pos_rs::{get_active_window, ActiveWindow};
use notify_rust::Notification;
use tauri::{async_runtime::spawn, Manager};
use tokio::time::{self, Duration};

#[tauri::command]
fn active_window() -> String {
    let window: Result<ActiveWindow, _> = get_active_window();

    match window {
        Ok(window) => window.title,
        Err(_e) => "Error".to_string(),
    }
}

async fn monitor_active_window(app: tauri::AppHandle) {
    let mut interval = time::interval(Duration::from_secs(1));
    loop {
        interval.tick().await;
        let window_title = active_window();
        app.emit_all("active-window-update", window_title).unwrap();
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![active_window])
        .setup(|app| {
            let app_handle = app.handle();
            spawn(async move {
                monitor_active_window(app_handle).await;
            });
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
