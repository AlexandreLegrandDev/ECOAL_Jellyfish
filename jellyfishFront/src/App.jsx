import { Routes, Route } from 'react-router-dom'
import Home from './Home'
import Collection from './Collection'
import ItemDetail from './ItemDetail'

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