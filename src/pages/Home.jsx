import React from 'react'
import { Link } from 'react-router-dom'

export default function Home(){
  return (
    <div className="container">
      <h1>Welcome</h1>
      <p>Create dynamic forms with conditional logic and save responses directly to Airtable.</p>
      <Link to="/">Get Started</Link>
    </div>
  )
}