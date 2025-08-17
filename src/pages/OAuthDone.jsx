import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function OAuthDone(){
  const nav = useNavigate()
  useEffect(()=>{
    // URL will contain token in hash: #token=...
    const hash = new URLSearchParams(window.location.hash.slice(1))
    const token = hash.get('token')
    if (token) {
      localStorage.setItem('token', token)
      nav('/dashboard', { replace: true })
    } else {
      nav('/', { replace: true })
    }
  }, [])
  return <div className="container">Finishing login...</div>
}