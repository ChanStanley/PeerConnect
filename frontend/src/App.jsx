import { useEffect, useState } from "react";

function App() {
  const [status, setStatus] = useState("checking...");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/`)
      .then((res) => res.json())
      .then((data) => setStatus(`Connected: ${data.status}`))
      .catch(() => setStatus("Could not reach backend"));
  }, []);

  return (
    <div style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      <h1>PeerConnect</h1>
      <p>Backend status: {status}</p>
    </div>
  );
}

export default App;
