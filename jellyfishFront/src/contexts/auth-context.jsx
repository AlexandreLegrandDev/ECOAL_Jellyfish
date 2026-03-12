import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const navigate = useNavigate();

    const API = "http://localhost:8000/api";

    /*async function login(email, password) {
        const res = await fetch(`${API}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        localStorage.setItem("token", data.token);
        setToken(data.token);
        setUser(data.user);
        navigate("/");
    }*/

    async function login(email, password) {
        const res = await fetch(`${API}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        // "access_token" em vez de "token"
        localStorage.setItem("token", data.access_token);
        setToken(data.access_token);

        // Buscar o user separadamente
        const userRes = await fetch(`${API}/user`, {
            headers: { Authorization: `Bearer ${data.access_token}` },
        });
        const userData = await userRes.json();
        setUser(userData);

        navigate("/");
    }

    async function register(name, email, password) {
        const res = await fetch(`${API}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        localStorage.setItem("token", data.access_token);
        setToken(data.token);
        setUser(data.user);
        navigate("/");
    }

    async function logout() {
        await fetch(`${API}/logout`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
        });

        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        navigate("/");
    }

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);