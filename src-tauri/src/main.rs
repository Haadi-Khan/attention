// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use active_win_pos_rs as aw;
use std::fs::OpenOptions;
use std::fs::File;
use std::io::Read;
use std::io::Write;
use notify_rust::Notification;
use tauri::{async_runtime::spawn, Manager};
use tokio::time::{self, Duration};

#[tauri::command]
fn active_window() -> String {
    match aw::get_active_window() {
        Ok(window) => format!("{}",window.title.as_str()),
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
    let mut interval = time::interval(Duration::from_secs(5));
    // let mut data_file = OpenOptions::new()
    //         .read(true)
    //         .write(true)
    //         .create(true)
    //         .append(true)
    //         .open("distractions.csv")
    //         .expect("cannot open file");

    loop {
        interval.tick().await;
        let active_window = active_window();
        // send_notification("Attention", &active_window);
        
        // Writing to file
        // let csv_str = format!("{},1\n", active_window);
        // let mut contents = String::new();

        // data_file.read_to_string(&mut contents).expect("read failed");

        // if !contents.contains(&csv_str) {
        //     data_file
        //         .write(csv_str.as_bytes())
        //         .expect("write failed");
        // }

        app.emit_all("active-window-update", &active_window).unwrap();
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
