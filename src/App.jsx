import React from 'react'
import Nav from '../../frontend-1/src/components/Nav.jsx'

export default function App(){
  const startOAuth = () => {
  const apiBase = import.meta.env.VITE_API_BASE;
  if (!apiBase) {
    console.error("API base URL is not defined");
    return;
  }
  // redirect to backend, not directly to Airtable
  window.location.href = `${apiBase.replace('/api', '')}/api/auth/airtable/start`;
};
  return (
    <div className="container">
      <div className="header">
        <h1>Airtable Form Builder</h1>
      </div>
      <div className="card">
        <p>Login with Airtable to manage bases and create forms.</p>
        <button onClick={startOAuth}>Log in with Airtable</button>
      </div>
    </div>
  )
}