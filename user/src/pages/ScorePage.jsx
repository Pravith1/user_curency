import React, { useState, useEffect } from 'react'

// Fetch score from backend
async function fetchScore(backendBase, roll) {
  let url
  if (!backendBase) {
    url = '/score_display'
  } else {
    const base = backendBase.replace(/\/$/, '')
    url = `${base}/score_display`
  }
  
  const res = await fetch(`${url}?rollNo=${encodeURIComponent(roll)}`, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
  })
  
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `HTTP ${res.status}`)
  }
  
  const data = await res.json().catch(() => ({}))
  return data
}

export default function ScorePage({ navigate }) {
  const [roll, setRoll] = useState('')
  const [score, setScore] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const path = window.location.pathname || ''
    const parts = path.split('/')
    const r = parts.pop() || parts.pop() || ''
    const decoded = decodeURIComponent(r)
    setRoll(decoded)

    if (!decoded) return

    let mounted = true

    async function loadScore() {
      setLoading(true)
      setError('')
      
      try {
        const backendBase = import.meta.env.VITE_BACK_URL || ''
        const data = await fetchScore(backendBase, decoded)
        
        if (!mounted) return
        
        const s = data && (data.score ?? (data.data && data.data.score))
        setScore(typeof s === 'number' ? s : data)
      } catch (err) {
        if (!mounted) return
        setError(err?.message || 'Failed to fetch score')
        setScore(null)
      } finally {
        if (!mounted) return
        setLoading(false)
      }
    }

    loadScore()
    return () => { mounted = false }
  }, [])

  return (
    <div className="mobile-root">
      <div className="score-card">
        <h2 className="title">Your Score</h2>
        
        <p className="muted">Roll Number</p>
        <p className="big">{roll || '—'}</p>
        
        <p className="muted">Marks Obtained</p>
        {loading ? (
          <p className="score">Loading...</p>
        ) : error ? (
          <>
            <p className="score">—</p>
            <p style={{ color: '#ef4444', fontSize: '14px', marginTop: '8px' }}>{error}</p>
          </>
        ) : (
          <p className="score">{score === null ? '—' : String(score)}</p>
        )}
        
        <div className="actions">
          <button className="btn" onClick={() => navigate('/')}>
            Back
          </button>
        </div>
      </div>
      <p className="hint">Click back to check another roll number</p>
    </div>
  )
}