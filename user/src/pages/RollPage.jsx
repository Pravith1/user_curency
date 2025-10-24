import React, { useState } from 'react'

export default function RollPage({ navigate }) {
  const [roll, setRoll] = useState('')

  function handleSubmit(e) {
    if (e) e.preventDefault()
    const trimmed = roll.trim()
    if (!trimmed) return
    navigate(`/score/${encodeURIComponent(trimmed)}`)
  }

  function handleKeyPress(e) {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <div className="mobile-root">
      <form className="form" onSubmit={handleSubmit}>
        <h2 className="title">Enter Roll Number</h2>
        <label className="label">
          Roll Number
          <input
            className="input"
            type="text"
            inputMode="text"
            placeholder="e.g. 23N237"
            value={roll}
            onChange={(e) => setRoll(e.target.value.toUpperCase())}
            onKeyPress={handleKeyPress}
            aria-label="Roll number"
            autoFocus
          />
        </label>
        <button className="btn" type="submit" disabled={!roll.trim()}>
          View Score
        </button>
      </form>
      <p className="hint">Enter your roll number to check your score</p>
    </div>
  )
}