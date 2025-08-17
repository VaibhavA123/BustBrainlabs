import React, { useEffect, useState } from 'react'
import { api } from '../api'
import Nav from '../../../frontend-1/src/components/Nav'

export default function Dashboard(){
  const [forms, setForms] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    setLoading(true)
    api.get('/forms')
      .then(res => setForms(res.data))
      .catch(err => console.error(err))
      .finally(()=>setLoading(false))
  }, [])

  return (
    <div className="container">
      <Nav />
      <h2>Your Forms</h2>
      <div style={{ marginBottom: 12 }}>
        <a href="/builder">Create new form</a>
      </div>
      {loading ? <div>Loading...</div> : (
        forms.length === 0 ? (
          <div>No forms yet — create one.</div>
        ) : (
          <ul>
            {forms.map(f => (
              <li key={f._id} style={{ marginBottom:8 }}>
                <strong>{f.title}</strong> — <a href={`/form/${f._id}`} target="_blank">Open form</a>
              </li>
            ))}
          </ul>
        )
      )}
    </div>
  )
}