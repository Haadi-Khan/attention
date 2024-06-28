// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use active_win_pos_rs::get_active_window;
use notify_rust::Notification;
use tauri::{async_runtime::spawn, Manager};
use tokio::time::{self, Duration};

#[tauri::command]
fn active_window() -> String {
    match get_active_window() {
        Ok(window) => window.title,
        Err(_e) => "Error".to_string(),
    }
}

fn send_notification(title: &str, message: &str) {
    Notification::new()
        .summary(title)
        .body(message)
        .show()
        .unwrap();
}

async fn monitor_active_window(app: tauri::AppHandle) {
    let mut interval = time::interval(Duration::from_secs(1));
    loop {
        interval.tick().await;
        let window_title = active_window();
        send_notification("Attention", &window_title);
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
