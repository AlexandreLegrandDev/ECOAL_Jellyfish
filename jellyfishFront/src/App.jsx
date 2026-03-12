import {Routes, Route} from 'react-router-dom'
import {AuthProvider} from "./contexts/auth-context.jsx";
import {PrivateRoute} from "./utils/private-route.jsx";
import Home from './pages/Home.jsx';
import Collection from './pages/Collection.jsx';
import ItemDetail from './pages/ItemDetail.jsx';
import Account from './pages/Account.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Create-account.jsx';
import CreateJelly from './pages/CreateJelly.jsx';

function App() {
    return (
        <div className="w-full">
            <AuthProvider>
                <Routes>
                    {/* Rotas Públicas */}
                    <Route path="/" element={<Home/>}/>
                    <Route path="/collection" element={<Collection/>}/>
                    <Route path="/item/:id" element={<ItemDetail/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/create-account" element={<Register/>}/>
                    <Route path="/account" element={<Account/>}/>
                    <Route path="/create-jelly" element={<CreateJelly/>}/>

                    {/* Rotas Protegidas */}
                    {/*<Route path="/account" element={
                        <PrivateRoute><Account /></PrivateRoute>
                    } />*/}
                </Routes>
            </AuthProvider>
        </div>
        
    )
}

export default App
