import React, { useState, useRef } from "react";
import { useAuth } from "../contexts/auth-context.jsx";
import { useNavigate } from "react-router-dom";
import {ArrowLeft, Camera, Check, Mail, Ruler, User, WholeWord} from "lucide-react";

const InputField = ({icon = <JellyIcon className="w-5 h-5"/>, label, type = "text", wrapperClass = "", ...props}) => {
    return (
        <div
            className={`relative flex items-center bg-[#0B0D28]/80 border border-accent-purple/50 rounded-full overflow-hidden px-4 py-3 mb-4 shadow-[0_0_10px_rgba(174,48,208,0.15)] focus-within:shadow-[0_0_15px_rgba(174,48,208,0.4)] focus-within:border-accent-purple transition-all ${wrapperClass}`}>
            <div className="mr-3 text-[#A855F7] opacity-80 shrink-0">
                {/*<JellyIcon className="w-5 h-5"/>*/}
                {icon}
            </div>
            <input
                type={type}
                placeholder={label}
                className="bg-transparent border-none outline-none text-white placeholder-white/50 w-full text-sm"
                {...props}
            />
        </div>
    );
};

const EditProfile = () => {
    const { user, token, setUser, loading: authLoading, showNotification } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        avatar: "/jelly.svg",
    });

    // Update form when user data is available
    React.useEffect(() => {
        if (user) {
            const userData = user.data || user;
            setFormData({
                name: userData.name || userData.username || "",
                email: userData.email || "",
                avatar: userData.avatar || "/jelly.svg",
            });
        }
    }, [user]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if (authLoading && !user) {
        return (
            <div className="w-full min-h-screen bg-bg-dark flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-purple"></div>
            </div>
        );
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, avatar: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFilePicker = () => {
        fileInputRef.current.click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch("http://localhost:8000/api/user/update", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Failed to update profile");
            }

            const updatedUser = await response.json();
            setUser(updatedUser);
            showNotification("Perfil atualizado com sucesso!", "success");
            navigate("/account");
        } catch (err) {
            setError(err.message);
            showNotification(err.message, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen bg-bg-dark flex flex-col">
            {/* Hidden File Input */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
            />

            <div className="relative bg-gradient-to-b from-[#21234F] to-[#121338] rounded-b-[40px] border-b border-accent-purple/30 shadow-[0_10px_30px_rgba(174,48,208,0.1)] overflow-hidden min-h-[192px]">
                {/* Back Button */}
                <button
                    onClick={() => navigate("/account")}
                    className="absolute top-4 left-4 z-20 w-10 h-10 bg-black/30 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/10 hover:bg-black/50 active:scale-95 transition-all text-white/80 hover:text-white"
                >
                    <ArrowLeft size={24} />
                </button>

                {/* Camera/Edit Button - Positioned like the Pencil in Account */}
                <button
                    onClick={triggerFilePicker}
                    className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/30 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/10 hover:bg-black/50 active:scale-95 transition-all text-white/80 hover:text-white"
                >
                    <Camera size={22} />
                </button>

                {/* Banner-style Avatar like in Account.jsx */}
                <div className="relative w-full h-48 group cursor-pointer" onClick={triggerFilePicker}>
                    <img
                        src={formData.avatar}
                        alt="User Avatar"
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = "/jelly.svg" }}
                    />
                    {/* Subtle Overlay to indicate it's clickable */}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                        <p className="text-white/0 group-hover:text-white/60 text-xs font-bold uppercase tracking-widest transition-all">Change Photo</p>
                    </div>
                </div>

                <div className="absolute bottom-4 left-6 z-10">
                    <h1 className="text-xl font-bold text-white uppercase tracking-wider drop-shadow-lg">Edit Profile</h1>
                </div>
            </div>

            <div className="flex-1 px-6 pt-10 bg-green-300 max-w-lg mx-auto w-full">
                <form onSubmit={handleSubmit} className="flex-1 flex flex-col bg-red-300 space-y-6">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl text-sm text-center">
                            {error}
                        </div>
                    )}

                    <InputField icon={<WholeWord className="w-5 h-5"/>} label="Your Name" value={formData.name} onChange={handleInputChange}/>

                    <InputField icon={<WholeWord className="w-5 h-5"/>} label="Email" value={formData.email} onChange={handleInputChange}/>

                    <div className="flex-1 bg-blue-300 pt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 text-lg font-bold text-white transition-all rounded-full bg-gradient-to-r from-accent-blue to-accent-purple shadow-[0_10px_25px_rgba(174,48,208,0.3)] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 group"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving...
                                </span>
                            ) : (
                                <>
                                    <Check size={20} className="group-hover:scale-110 transition-transform" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;