import { useState, useRef, useEffect } from 'react'
import videoBg from '../assets/video1.mp4'

export default function SignIn() {

    const [isLogin, setIsLogin] = useState(false)
    const [formData, setFormData] = useState({ name: '', email: '', password: '' })
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    const videoRef = useRef(null)

    useEffect(() => {
        const video = videoRef.current
        if (video) {
            video.defaultMuted = true
            video.muted = true
            video.play().catch((err) => {
                console.log("Autoplay bloqué par le navigateur :", err)
            })
        }
    }, [])

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setMessage('')

        const endpoint = isLogin ? '/api/login' : '/api/register'
        const payload = isLogin
            ? { email: formData.email, password: formData.password }
            : formData

        try {

            const response = await fetch(`http://localhost:8000${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Une erreur est survenue.')
            }

            localStorage.setItem('access_token', data.access_token)

            setMessage(`Réussite : Token Sanctum enregistré !`)

        } catch (err) {
            setError(err.message)
        }
    }

    const JellyfishIcon = () => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6 text-fuchsia-400 drop-shadow-[0_0_8px_rgba(217,70,239,0.8)]"
        >
            <path d="M12 2C7.58 2 4 5.58 4 10v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2c0-4.42-3.58-8-8-8z" />
            <path d="M6 14s.5 4 2 5" />
            <path d="M10 14s.5 6 2 7" />
            <path d="M14 14s-.5 6-2 7" />
            <path d="M18 14s-.5 4-2 5" />
        </svg>
    )

    return (
        <div className="flex items-center justify-center h-screen w-screen bg-blue-100 p-[2vh] sm:p-[2vw] overflow-hidden">

            <div className="relative w-full h-full rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-2xl border border-gray-800 font-sans flex items-center justify-center">

                {/* VIDEO BACKGROUND */}

                <video
                    ref={videoRef}
                    src={videoBg}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover z-0"
                    onLoadedData={(e) => {
                        e.target.defaultMuted = true
                        e.target.muted = true
                        e.target.play().catch(console.error)
                    }}
                />

                {/* OVERLAY */}

                <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 via-[#010816]/60 to-[#00050e]/95 z-[1]"></div>

                {/* CONTENT */}

                <div className="relative z-10 flex flex-col w-full max-w-sm h-full max-h-[750px] px-6 sm:px-8 py-10">

                    {/* TITLE */}

                    <div className="text-center mt-6 mb-12">
                        <h1 className="text-[2.8rem] font-bold text-white leading-[1.1] tracking-tight drop-shadow-md">
                            {isLogin ? 'Welcome back' : <>Join the<br />abysses</>}
                        </h1>
                    </div>

                    {/* FORM */}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5 flex-grow mt-2">

                        {!isLogin && (
                            <div className="relative group">

                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <JellyfishIcon />
                                </div>

                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-[#0a1930]/40 border border-t-cyan-500/40 border-b-fuchsia-500/60 border-l-blue-500/30 border-r-fuchsia-500/30 rounded-full py-4 pl-14 pr-6 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-fuchsia-400 backdrop-blur-md transition-all shadow-[0_0_15px_rgba(217,70,239,0.15)] text-[1.05rem]"
                                />
                            </div>
                        )}

                        <div className="relative group">

                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <JellyfishIcon />
                            </div>

                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full bg-[#0a1930]/40 border border-t-cyan-500/40 border-b-fuchsia-500/60 border-l-blue-500/30 border-r-fuchsia-500/30 rounded-full py-4 pl-14 pr-6 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-fuchsia-400 backdrop-blur-md transition-all shadow-[0_0_15px_rgba(217,70,239,0.15)] text-[1.05rem]"
                            />
                        </div>

                        <div className="relative group">

                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <JellyfishIcon />
                            </div>

                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full bg-[#0a1930]/40 border border-t-cyan-500/40 border-b-fuchsia-500/60 border-l-blue-500/30 border-r-fuchsia-500/30 rounded-full py-4 pl-14 pr-6 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-fuchsia-400 backdrop-blur-md transition-all shadow-[0_0_15px_rgba(217,70,239,0.15)] text-[1.05rem]"
                            />
                        </div>

                        {error && (
                            <div className="text-red-400 text-sm text-center font-medium">
                                {error}
                            </div>
                        )}

                        {message && (
                            <div className="text-green-400 text-sm text-center font-medium">
                                {message}
                            </div>
                        )}

                        <div className="mt-6 flex justify-center">
                            <button
                                type="submit"
                                className="bg-gradient-to-r from-[#2176ff] to-[#bd34fe] hover:from-blue-500 hover:to-fuchsia-400 font-medium rounded-full px-12 py-3 text-white text-[1.3rem] shadow-[0_0_20px_rgba(189,52,254,0.4)] transition-all transform hover:scale-[1.02]"
                            >
                                {isLogin ? 'Login' : 'Sign in'}
                            </button>
                        </div>

                    </form>

                    {/* SWITCH LOGIN */}

                    <div className="mt-auto text-center pb-4">

                        <p className="text-white font-light text-[1rem]">

                            {isLogin
                                ? "Don't have an account ? "
                                : "Already signed in ? "
                            }
                            <button
                                type="button"
                                onClick={() => {
                                    setIsLogin(!isLogin)
                                    setError('')
                                    setMessage('')
                                }}
                                className="inline-block bg-transparent border-none appearance-none outline-none font-normal text-white decoration-fuchsia-400/50 hover:text-fuchsia-300 hover:decoration-fuchsia-300 transition-colors"
                            >
                                {isLogin ? 'Sign in' : 'Login'}
                            </button>

                        </p>

                    </div>

                </div>

            </div>

        </div>
    )
}