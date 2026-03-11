import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Collection from './pages/Collection'
import ItemDetail from './pages/ItemDetail'

function App() {
  return (
    <div className="w-full">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Collection" element={<Collection />} />
        <Route path="/item/:id" element={<ItemDetail />} />
      </Routes>
    </div>
  )
}

export default App
