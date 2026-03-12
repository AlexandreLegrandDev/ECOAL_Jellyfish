import React, {useState} from "react";
import {Link} from "react-router-dom";
import {useAuth} from "../contexts/auth-context.jsx";
import BackgroundAnimation from "../components/background-animation.jsx";
import Header from "../components/Header.jsx";
import {LockKeyhole, Mail} from "lucide-react";
import Toast from "../components/toast-message.jsx";

function Login() {
    const {login, showNotification} = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();

        setError(null);
        setLoading(true);

        try {
            await login(email, password);
            showNotification("Login feito com sucesso!", "success");
        } catch (err) {
            setError(err.message);

            setTimeout(() => {
                setError(null);
                setLoading(false);
            }, 2000);
        } finally {
            setLoading(false);
        }
    }

    return (
        <BackgroundAnimation>
            <div className="flex-1 flex flex-col items-center gap-12 mt-10">
                <img
                    src="/jelly.svg"
                    alt="Jellyfish Logo"
                    className="relative z-10 w-28 h-28 object-contain"
                />

                <div className="w-full h-auto flex flex-col">
                    <h1 className="text-5xl font-bold text-center">Jelly</h1>
                    <h1 className="text-5xl font-bold text-center">connect</h1>
                </div>

                <div className="w-full flex-1 flex flex-col">
                    <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-4">
                        <div className="relative w-full h-16 flex flex-row items-center gap-4 p-4 rounded-full border border-[#0081FD] overflow-hidden">
                            <div className="absolute inset-0 bg-black opacity-50 backdrop-blur-md rounded-full" />

                            <Mail size={28} color="white" className="z-10" />

                            <input
                                type="email"
                                placeholder="Mail"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-transparent outline-none border-none relative z-10 text-white placeholder-white/50"
                                required
                            />
                        </div>

                        <div className="relative w-full h-16 flex flex-row items-center gap-4 p-4 rounded-full border border-[#0081FD] overflow-hidden">
                            <div className="absolute inset-0 bg-black opacity-50 backdrop-blur-md rounded-full" />

                            <LockKeyhole size={28} color="white" className="z-10" />

                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-transparent outline-none border-none relative z-10 text-white placeholder-white/50"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-auto mt-12 py-4 text-lg font-bold text-white transition-all transition-transform rounded-full bg-gradient-to-r from-accent-blue to-accent-purple shadow-[0_10px_25px_rgba(28,95,209,0.3)] active:scale-95 active:shadow-none"
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>

                    <div className="w-full flex flex-col items-center mb-5">
                        <p>Don't have an account? <Link to="/create-account" className="text-[#0081FD] hover:underline">Sign up</Link></p>
                    </div>
                </div>
            </div>

            {error && <Toast message={error} type="error" />}
        </BackgroundAnimation>
    );
}

export default Login;