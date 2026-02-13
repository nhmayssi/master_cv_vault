import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log("Vault: Booting application...");

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log("Vault: Application mounted successfully.");
} else {
  console.error("Vault Error: Root element not found. Check index.html structure.");
}
