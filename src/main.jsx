import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App.jsx'
import OAuthDone from '../../frontend-1/src/pages/OAuthDone.jsx'
import Dashboard from './pages/Dashboard.jsx'
import BuildForm from '../../frontend-1/src/pages/BuildForm.jsx'
import ViewForm from './pages/ViewForm.jsx'
import Home from '../../frontend-1/src/pages/Home.jsx'
import './index.css'

const Root = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App/>} />
      <Route path="/oauth/done" element={<OAuthDone/>} />
      <Route path="/dashboard" element={<Dashboard/>} />
      <Route path="/builder" element={<BuildForm/>} />
      <Route path="/form/:id" element={<ViewForm/>} />
      <Route path="/home" element={<Home/>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
)

createRoot(document.getElementById('root')).render(<Root />)