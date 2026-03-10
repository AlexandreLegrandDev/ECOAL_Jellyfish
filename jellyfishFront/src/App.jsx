import { Routes, Route } from 'react-router-dom'
import Home from './Home'

function App() {
  return (
    <div className="w-full">
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  )
}

export default App
