import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/auth-context.jsx";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Check, Info, Droplet, Maximize2, Activity, Zap } from "lucide-react";

const CreateJelly = () => {
    const navigate = useNavigate();
    const { user, token, showNotification } = useAuth();
    const fileInputRef = useRef(null);

    const [name, setName] = useState("");
    const [dangerLevel, setDangerLevel] = useState(1);
    const [isLightYes, setIsLightYes] = useState(true);
    const [collectionId, setCollectionId] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [size, setSize] = useState("");
    const [deep, setDeep] = useState("");
    const [color, setColor] = useState("");
    const [diameter, setDiameter] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch user collections to get an ID we can post to
        async function fetchCollection() {
            if (!user || !token) return;
            try {
                const userId = user.id || user.data?.id || user.user?.id;
                if (!userId) {
                    console.error("No user ID found", user);
                    return;
                }

                const res = await fetch(`http://localhost:8000/api/user/${userId}/collection`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.ok) {
                    const collectionsList = await res.json();

                    if (collectionsList.length > 0) {
                        setCollectionId(collectionsList[0].id);
                    } else {
                        // FALLBACK: If user has no collection, create a default one
                        const createRes = await fetch("http://localhost:8000/api/collection", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({
                                id_user: userId,
                                name: "My Discoveries",
                                description: "Automatic collection for my new jellyfish",
                                status: 0,
                                img: "https://images.unsplash.com/photo-1544923246-77307dd654ca?q=80&w=400"
                            }),
                        });

                        if (createRes.ok) {
                            const newColl = await createRes.json();
                            setCollectionId(newColl.id);
                        }
                    }
                }
            } catch (err) {
                console.error("Failed to fetch/create collection", err);
            }
        }
        fetchCollection();
    }, [user, token]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFilePicker = () => {
        fileInputRef.current.click();
    };

    const handleCreate = async (e) => {
        if (e && e.preventDefault) e.preventDefault();

        if (!collectionId) {
            showNotification("No collection found for this user.", "error");
            return;
        }

        if (!name || !imagePreview) {
            showNotification("Please provide at least a name and an image.", "error");
            return;
        }

        setLoading(true);

        const mappedDepth = Math.max(1, Math.min(10, Math.ceil(parseInt(deep || "0") / 100)));

        const payload = {
            id_collection: collectionId,
            name: name,
            img: imagePreview,
            depth: mappedDepth || 1,
            criteria: {
                "Size": parseInt(size) || 0,
                "Diameter": parseInt(diameter) || 0,
                "Dangerosity": dangerLevel,
                "Bioluminescent": isLightYes ? 1 : 0
            }
        };

        try {
            const res = await fetch("http://localhost:8000/api/jellyfish", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                showNotification("Jellyfish registered successfully!", "success");
                navigate("/account");
            } else {
                const data = await res.json();
                showNotification(data.message || "Failed to create jellyfish", "error");
            }
        } catch (error) {
            console.error("Error creating jellyfish:", error);
            showNotification("Error connecting to server", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen bg-bg-dark flex flex-col pb-20">
            {/* Hidden File Input */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
                accept="image/*"
            />

            {/* Header Section (Like Edit Profile) */}
            <div className="relative bg-gradient-to-b from-[#21234F] to-[#121338] rounded-b-[40px] border-b border-accent-purple/30 shadow-[0_10px_30px_rgba(174,48,208,0.1)] overflow-hidden min-h-[192px]">
                {/* Back Button */}
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="absolute top-4 left-4 z-20 w-10 h-10 bg-black/30 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/10 hover:bg-black/50 active:scale-95 transition-all text-white/80 hover:text-white"
                >
                    <ArrowLeft size={24} />
                </button>

                {/* Header Image Preview / Placeholder */}
                <div className="relative w-full h-48 group cursor-pointer" onClick={triggerFilePicker}>
                    {imagePreview ? (
                        <img
                            src={imagePreview}
                            alt="Jelly Preview"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-[#1A1C3D] flex flex-col items-center justify-center text-white/20 gap-2">
                            <Plus size={48} />
                            <span className="text-xs font-bold uppercase tracking-tighter">Choose Image</span>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                        <p className="text-white/0 group-hover:text-white/60 text-xs font-bold uppercase tracking-widest transition-all">
                            {imagePreview ? "Change Photo" : "Upload Photo"}
                        </p>
                    </div>
                </div>

                <div className="absolute bottom-4 left-6 z-10">
                    <h1 className="text-xl font-bold text-white uppercase tracking-wider drop-shadow-lg">Create New Jelly</h1>
                </div>
            </div>

            <div className="flex-1 px-6 pt-10 max-w-lg mx-auto w-full">
                <form onSubmit={handleCreate} className="space-y-6">
                    {/* Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white/60 ml-1 flex items-center gap-2">
                             Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Blue Lagoon"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-accent-purple/50 focus:bg-white/10 outline-none transition-all placeholder:text-white/20"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Size */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/60 ml-1 flex items-center gap-2">
                                <Maximize2 size={14} /> Size (cm)
                            </label>
                            <input
                                type="number"
                                value={size}
                                onChange={(e) => setSize(e.target.value)}
                                placeholder="0"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-accent-purple/50 focus:bg-white/10 outline-none transition-all placeholder:text-white/20"
                            />
                        </div>

                        {/* Diameter */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/60 ml-1 flex items-center gap-2">
                                <Maximize2 size={14} /> Diameter (cm)
                            </label>
                            <input
                                type="number"
                                value={diameter}
                                onChange={(e) => setDiameter(e.target.value)}
                                placeholder="0"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-accent-purple/50 focus:bg-white/10 outline-none transition-all placeholder:text-white/20"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Depth */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/60 ml-1 flex items-center gap-2">
                                <Droplet size={14} /> Depth (m)
                            </label>
                            <input
                                type="number"
                                value={deep}
                                onChange={(e) => setDeep(e.target.value)}
                                placeholder="0"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-accent-purple/50 focus:bg-white/10 outline-none transition-all placeholder:text-white/20"
                            />
                        </div>

                        {/* Color */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/60 ml-1 flex items-center gap-2">
                                 Color
                            </label>
                            <input
                                type="text"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                placeholder="Jelly color"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-accent-purple/50 focus:bg-white/10 outline-none transition-all placeholder:text-white/20"
                            />
                        </div>
                    </div>

                    {/* Danger Rating */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-white/60 ml-1 flex items-center gap-2">
                            <Activity size={14} /> Danger Level
                        </label>
                        <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-[2rem] px-5 py-3">
                            {[1, 2, 3, 4, 5].map((lvl) => (
                                <button
                                    key={lvl}
                                    type="button"
                                    onClick={() => setDangerLevel(lvl)}
                                    className={`w-10 h-10 rounded-full border transition-all flex items-center justify-center font-bold ${lvl <= dangerLevel
                                        ? 'bg-accent-purple border-accent-purple shadow-[0_0_15px_rgba(174,48,208,0.5)] scale-110 text-white'
                                        : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
                                        }`}
                                >
                                    {lvl}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Light Toggle */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-white/60 ml-1 flex items-center gap-2">
                            <Zap size={14} /> Bioluminescent
                        </label>
                        <div className="flex bg-white/5 border border-white/10 rounded-[2rem] p-1.5">
                            <button
                                type="button"
                                onClick={() => setIsLightYes(true)}
                                className={`flex-1 py-3 rounded-full transition-all font-bold text-sm ${isLightYes ? 'bg-accent-purple text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
                            >
                                YES
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsLightYes(false)}
                                className={`flex-1 py-3 rounded-full transition-all font-bold text-sm ${!isLightYes ? 'bg-accent-purple text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
                            >
                                NO
                            </button>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white/60 ml-1 flex items-center gap-2">
                            <Info size={14} /> Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Details about your discovery..."
                            rows={4}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-accent-purple/50 focus:bg-white/10 outline-none transition-all placeholder:text-white/20 resize-none pt-4"
                        />
                    </div>

                    <div className="pt-8">
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
                                    Discovering...
                                </span>
                            ) : (
                                <>
                                    <Plus size={20} className="group-hover:scale-110 transition-transform" />
                                    Register Discovery
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateJelly;
