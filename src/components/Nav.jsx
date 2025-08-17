import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Nav(){
  const nav = useNavigate()
  const logout = () => { localStorage.removeItem('token'); nav('/') }
  return (
    <nav style={{ marginBottom: 12 }}>
      <Link to="/dashboard">Dashboard</Link> | &nbsp;
      <Link to="/builder">Create</Link> | &nbsp;
      <a href="/" onClick={(e)=>{e.preventDefault(); logout()}}>Logout</a>
    </nav>
  )
}