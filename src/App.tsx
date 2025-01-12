import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

interface NetworkInterface {
  name: string;
  details: string;
}

interface OllamaResponse {
  response: string;
}

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");
  const [interfaces, setInterfaces] = useState<NetworkInterface[]>([]);
  const [ollamaPrompt, setOllamaPrompt] = useState("");
  const [ollamaResponse, setOllamaResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke("greet", { name }));
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <main className="container">
            <h1>Welcome to Tauri + React</h1>

            <div className="row">
              <a href="https://vitejs.dev" target="_blank">
                <img src="/vite.svg" className="logo vite" alt="Vite logo" />
              </a>
              <a href="https://tauri.app" target="_blank">
                <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
              </a>
              <a href="https://reactjs.org" target="_blank">
                <img src={reactLogo} className="logo react" alt="React logo" />
              </a>
            </div>
            <p>Click on the Tauri, Vite, and React logos to learn more.</p>

            <form
              className="row"
              onSubmit={(e) => {
                e.preventDefault();
                greet();
              }}
            >
              <input
                id="greet-input"
                onChange={(e) => setName(e.currentTarget.value)}
                placeholder="Enter a name..."
              />
              <button type="submit">Greet</button>
            </form>
            <p>{greetMsg}</p>

            <div className="ollama-section">
              <h2>Ollama Chat</h2>
              <form
                className="row"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setIsLoading(true);
                  try {
                    const response = await invoke<OllamaResponse>("query_ollama", {
                      prompt: ollamaPrompt,
                    });
                    setOllamaResponse(response.response);
                  } catch (error) {
                    console.error("Ollama query failed:", error);
                    setOllamaResponse("Error: " + (error as Error).message);
                  } finally {
                    setIsLoading(false);
                  }
                }}
              >
                <input
                  value={ollamaPrompt}
                  onChange={(e) => setOllamaPrompt(e.currentTarget.value)}
                  placeholder="Ask me anything..."
                  disabled={isLoading}
                />
                <button type="submit" disabled={isLoading}>
                  {isLoading ? "Thinking..." : "Ask"}
                </button>
              </form>
              {ollamaResponse && (
                <div className="ollama-response">
                  <p>{ollamaResponse}</p>
                </div>
              )}
            </div>

            <div className="network-section">
              <h2>Network Interfaces</h2>
              <div className="interface-list">
{interfaces.map((iface: NetworkInterface, index: number) => (
  <div key={index} className="interface-item">
    <h3>{iface.name}</h3>
    <p>{iface.details}</p>
  </div>
))}
              </div>
              <button onClick={async () => {
                try {
                  const data = await invoke<Record<string, string>>("get_network_interfaces");
                  const formattedInterfaces = Object.entries(data).map(([name, details]) => ({
                    name,
                    details
                  }));
                  setInterfaces(formattedInterfaces);
                } catch (error) {
                  console.error("Failed to get network interfaces:", error);
                }
              }}>
                Refresh Interfaces
              </button>
            </div>
          </main>
        } />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

function About() {
  return (
    <main className="container">
      <h1>About Page</h1>
      <p>This is the about page.</p>
    </main>
  );
}

export default App;
