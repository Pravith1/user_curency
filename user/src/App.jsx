import React, { useEffect, useState } from 'react'
import './App.css'
import RollPage from './pages/RollPage'
import ScorePage from './pages/ScorePage'

function App() {
  const [path, setPath] = useState(window.location.pathname)

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  function navigate(to) {
    if (to === window.location.pathname) return
    window.history.pushState({}, '', to)
    setPath(to)
    // notify listeners
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  if (path.startsWith('/score')) {
    return <ScorePage navigate={navigate} />
  }

  return <RollPage navigate={navigate} />
}

export default App
