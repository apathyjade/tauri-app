// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::collections::HashMap;
use tauri::Manager;
use sysinfo::{System, Networks, SystemExt, NetworksExt, NetworkExt};
use reqwest::Client;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
struct OllamaResponse {
    response: String,
}

#[tauri::command]
async fn query_ollama(prompt: String) -> Result<OllamaResponse, String> {
    let client = Client::new();
    let res = client
        .post("http://localhost:11434/api/generate")
        .json(&serde_json::json!({
            "model": "deepseek-coder-v2:16b",
            "prompt": prompt,
            "stream": false
        }))
        .send()
        .await
        .map_err(|e| e.to_string())?;
    
    let response: OllamaResponse = res.json().await.map_err(|e| e.to_string())?;
    Ok(response)
}

#[tauri::command]
fn get_network_interfaces() -> HashMap<String, String> {
    let mut sys = System::new_all();
    
    let mut interfaces = HashMap::new();
    
    for (interface_name, data) in sys.networks().iter() {
        interfaces.insert(
            interface_name.to_string(),
            format!(
                "Received: {} B, Transmitted: {} B, MAC: {:?}",
                data.total_received(),
                data.total_transmitted(),
                data.mac_address()
            )
        );
    }
    
    interfaces
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_network_interfaces, query_ollama])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
