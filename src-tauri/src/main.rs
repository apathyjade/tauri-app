// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::collections::HashMap;
use sysinfo::{System, SystemExt, NetworksExt, NetworkExt, CpuExt, DiskExt};
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

#[derive(Serialize)]
struct SystemInfo {
    cpu: Vec<String>,
    memory: String,
    disks: Vec<String>,
    networks: HashMap<String, String>,
}

#[tauri::command]
fn get_system_info() -> SystemInfo {
    let mut sys = System::new_all();
    sys.refresh_all();

    // 获取CPU信息
    let cpus: Vec<String> = sys.cpus()
        .iter()
        .map(|cpu| format!("{}: {} MHz", cpu.name(), cpu.frequency()))
        .collect();

    // 获取内存信息
    let memory = format!(
        "Total: {} MB, Used: {} MB",
        sys.total_memory() / 1024 / 1024,
        sys.used_memory() / 1024 / 1024
    );

    // 获取磁盘信息
    let disks: Vec<String> = sys.disks()
        .iter()
        .map(|disk| {
            format!(
                "{}: {} GB / {} GB",
                disk.name().to_string_lossy(),
                disk.available_space() / 1024 / 1024 / 1024,
                disk.total_space() / 1024 / 1024 / 1024
            )
        })
        .collect();

    // 获取网络接口信息
    let mut networks = HashMap::new();
    for (interface_name, data) in sys.networks().iter() {
        networks.insert(
            interface_name.to_string(),
            format!(
                "Received: {} B, Transmitted: {} B, MAC: {:?}",
                data.total_received(),
                data.total_transmitted(),
                data.mac_address()
            )
        );
    }

    SystemInfo {
        cpu: cpus,
        memory,
        disks,
        networks,
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_system_info, query_ollama])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
