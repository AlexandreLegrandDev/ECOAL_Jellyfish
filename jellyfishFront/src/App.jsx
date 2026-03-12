import {Routes, Route} from 'react-router-dom'
import {AuthProvider, useAuth} from "./contexts/auth-context.jsx";
import {PrivateRoute} from "./utils/private-route.jsx";
import Home from './pages/Home.jsx';
import Collection from './pages/Collection.jsx';
import ItemDetail from './pages/ItemDetail.jsx';
import Account from './pages/Account.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Create-account.jsx';
import CreateJelly from './pages/CreateJelly.jsx';
import EditProfile from './pages/EditProfile.jsx';
import CollectionDetail from "./collectionDetails.jsx";

const AppContent = () => {
    // We remove the global DynamicIsland here because the Header will now handle it
    return (
        <div className="w-full">
            <Routes>
                {/* Rotas Públicas */}
                <Route path="/" element={<Home/>}/>
                <Route path="/collection" element={<Collection/>}/>
                <Route path="/collection/:id" element={<CollectionDetail />} />
                <Route path="/item/:id" element={<ItemDetail/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/create-account" element={<Register/>}/>
                <Route path="/account" element={<Account/>}/>
                <Route path="/create-jelly" element={<CreateJelly/>}/>
                <Route path="/edit-profile" element={<EditProfile/>}/>

                {/* Rotas Protegidas */}
                {/*<Route path="/account" element={
                    <PrivateRoute><Account /></PrivateRoute>
                } />*/}
            </Routes>
        </div>
    );
};

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App
