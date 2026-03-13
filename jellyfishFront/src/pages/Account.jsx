import { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/auth-context.jsx";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, LogOut, Pencil, Plus, Globe, Lock, Trash2, Check, X } from "lucide-react";
import CollectionButton from "../components/collection-button.jsx";

function Account() {

    const { user, token, logout } = useAuth();
    const [profile, setProfile] = useState(null);
    const navigate = useNavigate();
    const [myJellyfishes, setMyJellyfishes] = useState([]);
    const [myCollection, setMyCollection] = useState(null);
    const [isPublic, setIsPublic] = useState(false);
    const [togglingVisibility, setTogglingVisibility] = useState(false);
    const [editingName, setEditingName] = useState(false);
    const [collectionNameDraft, setCollectionNameDraft] = useState("");
    const collectionScrollRef = useRef(null);
    const jellyfishScrollRef = useRef(null);

    const handleHorizontalScroll = (e, ref) => {
        if (ref.current) {
            e.preventDefault();
            ref.current.scrollBy({ left: e.deltaY * 2, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        setProfile({
            name: user?.name || "User",
            avatar: user?.avatar || null
        });
    }, [user]);

    useEffect(() => {
        async function fetchMyCollection() {
            if (!user || !token) return;

            try {
                const res = await fetch(`http://localhost:8000/api/user/${user.id}/collection`, {
                    headers: { Authorization: `Bearer ${token}`, "Accept": "application/json" }
                });

                if (res.ok) {
                    const collections = await res.json();

                    if (collections.length > 0) {
                        const col = collections[0];
                        setMyCollection(col);
                        setIsPublic(col.status === 0);

                        const collectionRes = await fetch(`http://localhost:8000/api/collection/${col.id}`, {
                            headers: { Authorization: `Bearer ${token}`, "Accept": "application/json" }
                        });

                        if (collectionRes.ok) {
                            const collectionData = await collectionRes.json();

                            if (collectionData && collectionData.jellyfishes) {
                                const displayJellies = collectionData.jellyfishes.map(j => ({
                                    id: j?.id,
                                    name: j?.name || "Unknown",
                                    image: j?.img ? (j.img.startsWith('http') || j.img.startsWith('data:') ? j.img : `http://localhost:8000/storage/${j.img}`) : null
                                }));

                                setMyJellyfishes(displayJellies);
                            } else {
                                setMyJellyfishes([]);
                            }
                        }
                    } else {
                        setMyCollection(null);
                        setMyJellyfishes([]);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch collection:", err);
                setMyJellyfishes([]);
            }
        }

        fetchMyCollection();
    }, [user, token]);

    async function toggleVisibility() {
        if (!myCollection || !token) return;
        setTogglingVisibility(true);
        try {
            const newStatus = isPublic ? 1 : 0;
            const res = await fetch(`http://localhost:8000/api/collection/${myCollection.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                setIsPublic(!isPublic);
            }
        } catch (err) {
            console.error("Failed to toggle visibility:", err);
        } finally {
            setTogglingVisibility(false);
        }
    }

    async function handleDeleteJellyfish(id) {
        try {
            const res = await fetch(`http://localhost:8000/api/jellyfish/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}`, "Accept": "application/json" }
            });
            if (res.ok) {
                setMyJellyfishes(prev => prev.filter(j => j.id !== id));
            }
        } catch (err) {
            console.error("Failed to delete jellyfish:", err);
        }
    }

    async function handleRenameCollection() {
        if (!myCollection || !collectionNameDraft.trim()) return;
        try {
            const res = await fetch(`http://localhost:8000/api/collection/${myCollection.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ name: collectionNameDraft.trim() })
            });
            if (res.ok) {
                setMyCollection(prev => ({ ...prev, name: collectionNameDraft.trim() }));
            }
        } catch (err) {
            console.error("Failed to rename collection:", err);
        } finally {
            setEditingName(false);
        }
    }

    if (!user) {
        return (
            <div className="w-full flex-1 flex flex-col items-center justify-center bg-bg-dark text-white gap-4">
               <p className="text-xl">Authentication required. Please log in.</p>
               <button onClick={() => navigate("/login")} className="px-6 py-2 bg-accent-purple rounded-full">Go to Login</button>
            </div>
        );
    }


    return (
        <div className="w-full flex-1 flex flex-col gap-8 bg-bg-dark relative pb-8">

            {/* Profile header */}
            <div className="relative flex flex-col bg-gradient-to-b from-[#21234F] to-[#121338] rounded-b-[40px] border-b border-accent-purple/30 shadow-[0_10px_30px_rgba(174,48,208,0.1)]">

                <button
                    onClick={() => navigate("/")}
                    className="absolute top-4 left-4 z-10 w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/20 hover:bg-white/20 active:scale-95 transition-all text-white/80 hover:text-white"
                >
                    <ArrowLeft size={24} />
                </button>

                <button
                    onClick={() => navigate("/edit-profile")}
                    className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/20 hover:bg-white/20 active:scale-95 transition-all text-white/80 hover:text-white"
                >
                    <Pencil size={24} />
                </button>

                {/* Avatar or solid color for new users */}
                {profile?.avatar && profile.avatar !== "/jelly.svg" ? (
                    <img
                        src={profile.avatar}
                        alt="User Avatar"
                        className="w-full h-48 object-cover rounded-b-[40px]"
                    />
                ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-[#2D2F6B] via-[#1C1E4A] to-[#0F1029] rounded-b-[40px]" />
                )}

                {/* User name overlay */}
                <div className="absolute bottom-4 left-6 z-10">
                    <h1 className="text-xl font-bold text-white drop-shadow-lg">{profile?.name}</h1>
                </div>
            </div>

            {/* Collection section */}
            <div className="px-6">
                <div className="flex items-center justify-end mb-4">
                    {/* Public/Private toggle */}
                    {myCollection && (
                        <button
                            onClick={toggleVisibility}
                            disabled={togglingVisibility}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 active:scale-95 ${
                                isPublic 
                                    ? "bg-green-500/20 text-green-400 border border-green-500/40 hover:bg-green-500/30" 
                                    : "bg-white/10 text-white/60 border border-white/20 hover:bg-white/20"
                            }`}
                        >
                            {isPublic ? <Globe size={16} /> : <Lock size={16} />}
                            {togglingVisibility ? "..." : isPublic ? "Public" : "Private"}
                        </button>
                    )}
                </div>

                {myCollection ? (
                    <div
                        onClick={() => !editingName && navigate(`/collection/${myCollection.id}`)}
                        className="group overflow-hidden rounded-2xl border border-accent-purple/40 bg-gradient-to-br from-[#292B57] to-[#1A1C3A] shadow-[0_0_15px_rgba(174,48,208,0.2)] hover:shadow-[0_0_25px_rgba(174,48,208,0.5)] hover:border-accent-purple transition-all duration-300 cursor-pointer p-6 flex flex-col items-center justify-center min-h-[120px]"
                    >
                        {editingName ? (
                            <div className="flex items-center gap-2 w-full max-w-xs" onClick={e => e.stopPropagation()}>
                                <input
                                    autoFocus
                                    value={collectionNameDraft}
                                    onChange={e => setCollectionNameDraft(e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter') handleRenameCollection(); if (e.key === 'Escape') setEditingName(false); }}
                                    className="flex-1 bg-white/10 border border-white/30 rounded-full px-4 py-2 text-white text-center text-lg font-bold outline-none focus:border-accent-purple"
                                />
                                <button onClick={handleRenameCollection} className="w-8 h-8 bg-accent-purple/30 hover:bg-accent-purple/60 rounded-full flex items-center justify-center transition-all">
                                    <Check size={14} className="text-white" />
                                </button>
                                <button onClick={() => setEditingName(false)} className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all">
                                    <X size={14} className="text-white/60" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 group/name" onClick={e => { e.stopPropagation(); setCollectionNameDraft(myCollection.name); setEditingName(true); }}>
                                <h2 className="text-2xl font-bold text-white text-center group-hover/name:text-accent-purple transition-colors">{myCollection.name}</h2>
                                <Pencil size={14} className="text-white/30 group-hover/name:text-accent-purple transition-colors flex-shrink-0" />
                            </div>
                        )}
                        <span className="text-xs text-white/40 mt-2">{myJellyfishes.length} items</span>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-white/40 rounded-2xl border border-dashed border-white/10">
                        <span className="text-3xl mb-2">🪼</span>
                        <p className="text-sm">No collection yet</p>
                    </div>
                )}

                {/* Horizontal scroll for collection items */}
                {myJellyfishes.length > 0 && (
                    <div
                        className="mt-4 flex gap-4 flex-nowrap overflow-x-auto pb-2"
                        style={{ scrollbarWidth: 'none' }}
                        ref={collectionScrollRef}
                        onWheel={(e) => handleHorizontalScroll(e, collectionScrollRef)}
                    >
                        {myJellyfishes.map(item => (
                            <div key={item.id} className="flex-shrink-0 w-48 relative">
                                <CollectionButton
                                    title={item.name}
                                    image={item.image}
                                    navigateTo={`/item/${item.id}`}
                                >
                                    <button
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDeleteJellyfish(item.id); }}
                                        className="absolute top-2 right-2 z-20 w-7 h-7 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center transition-all active:scale-90"
                                    >
                                        <Trash2 size={13} className="text-white/70" />
                                    </button>
                                </CollectionButton>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Horizontal jellyfish scroll */}
            <div className="px-6">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">
                    Your jellyfishes
                </h2>

                <div
                    className="flex gap-6 flex-nowrap overflow-x-auto pb-4"
                    style={{ scrollbarWidth: 'none' }}
                    ref={jellyfishScrollRef}
                    onWheel={(e) => handleHorizontalScroll(e, jellyfishScrollRef)}
                >

                    <div
                        onClick={() => navigate('/create-jelly')}
                        className="group flex flex-col items-center justify-center rounded-2xl border border-accent-purple/40 bg-[#292B57] shadow-[0_0_15px_rgba(174,48,208,0.2)] hover:shadow-[0_0_25px_rgba(174,48,208,0.5)] hover:border-accent-purple active:scale-95 transition-all duration-300 cursor-pointer min-h-[188px] w-64 flex-shrink-0"
                    >
                        <Plus size={80} className="text-white font-bold" strokeWidth={3} />
                    </div>

                    {myJellyfishes.map(item => (
                        <div key={item.id} className="flex-shrink-0 w-64 relative">
                            <CollectionButton
                                title={item.name}
                                image={item.image}
                                navigateTo={`/item/${item.id}`}
                            >
                                <button
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDeleteJellyfish(item.id); }}
                                    className="absolute top-2 right-2 z-20 w-7 h-7 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center transition-all active:scale-90"
                                >
                                    <Trash2 size={13} className="text-white/70" />
                                </button>
                            </CollectionButton>
                        </div>
                    ))}

                </div>
            </div>

            {/* Logout */}
            <div className="px-6 flex justify-center">
                <button
                    onClick={logout}
                    className="w-full py-4 text-lg font-bold text-white transition-all rounded-full bg-gradient-to-r from-accent-blue to-accent-purple shadow-[0_10px_25px_rgba(28,95,209,0.3)] active:scale-95 flex items-center justify-center gap-2"
                >
                    <LogOut size={16} />
                    Logout
                </button>
            </div>

        </div>
    );
}

export default Account;