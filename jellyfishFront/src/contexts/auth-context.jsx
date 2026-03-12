import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const API = "http://localhost:8000/api";

    // Auto-fetch user on mount if token exists
    useEffect(() => {
        const fetchUserData = async () => {
            if (token) {
                try {
                    const res = await fetch(`${API}/user`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (res.ok) {
                        const data = await res.json();
                        // Support various response formats: user object directly, { user: ... }, or { data: ... }
                        const userData = data.user || data.data || data;
                        setUser(userData);
                    } else {
                        // Token might be invalid/expired
                        localStorage.removeItem("token");
                        setToken(null);
                        setUser(null);
                    }
                } catch (err) {
                    console.error("Error fetching user session:", err);
                }
            }
            setLoading(false);
        };

        fetchUserData();
    }, [token]);

    async function login(email, password) {
        setLoading(true);
        try {
            const res = await fetch(`${API}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            // Support both "token" and "access_token" keys
            const receivedToken = data.token || data.access_token;

            if (receivedToken) {
                localStorage.setItem("token", receivedToken);
                setToken(receivedToken);

                const userRes = await fetch(`${API}/user`, {
                    headers: { Authorization: `Bearer ${receivedToken}` },
                });
                const userDataResponse = await userRes.json();
                const userData = userDataResponse.user || userDataResponse.data || userDataResponse;
                setUser(userData);
            }

            navigate("/");
        } finally {
            setLoading(false);
        }
    }

    async function register(name, email, password) {
        setLoading(true);
        try {
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
        } finally {
            setLoading(false);
        }
        localStorage.setItem("token", data.access_token);
        setToken(data.token);
        setUser(data.user);
        navigate("/");
    }

    async function logout() {
        try {
            if (token) {
                await fetch(`${API}/logout`, {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                });
            }
        } catch (err) {
            console.error("Erro ao fazer logout no servidor:", err);
            // Prosseguimos para limpar os dados locais mesmo que o servidor falhe
        }

        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        showNotification("Sessão terminada!", "success");
        navigate("/");
    }

    const [notification, setNotification] = useState(null);

    const showNotification = (message, type = "success") => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, setUser, loading, notification, showNotification }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);