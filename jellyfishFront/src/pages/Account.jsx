import { useEffect, useState } from "react";
import {useAuth} from "../contexts/auth-context.jsx";

function Account() {
    const { user, token, logout } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await fetch(`http://localhost:8000/api/user/${user.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message);
                setProfile(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        if (user) fetchProfile();
    }, [user, token]);

    if (loading) return <p>A carregar...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="max-w-xl mx-auto p-8">
            <h1 className="text-2xl font-bold mb-6">A minha conta</h1>

            <div className="flex flex-col gap-3">
                <div>
                    <span className="font-semibold">Nome: </span>
                    <span>{profile?.name}</span>
                </div>
                <div>
                    <span className="font-semibold">Email: </span>
                    <span>{profile?.email}</span>
                </div>
                <div>
                    <span className="font-semibold">Membro desde: </span>
                    <span>{new Date(profile?.created_at).toLocaleDateString("pt-PT")}</span>
                </div>
            </div>

            <button
                onClick={logout}
                className="mt-8 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
                Logout
            </button>
        </div>
    );
}

export default Account;