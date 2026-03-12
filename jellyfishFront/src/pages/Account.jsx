import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/auth-context.jsx";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, LogOut, Pencil, Plus } from "lucide-react";
import CollectionButton from "../components/collection-button.jsx";

function Account() {
    const { user, token, logout } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Since we mock the API response for visual purposes,
    // we can skip the fetch for now if we just want to show the UI
    useEffect(() => {
        // Mocking user profile
        setProfile({
            name: user?.name || "User", avatar: "/jelly.svg" // Guest logo as requested
        });
    }, [user]);

    // Example dummy data
    const collection = [{
        id: 1,
        name: "Moon jellyfish",
        image: "https://images.unsplash.com/photo-1549558549-415fe4c37b60?auto=format&fit=crop&q=80&w=400"
    },];

    const [myJellyfishes, setMyJellyfishes] = useState([]);

    useEffect(() => {
        async function fetchMyJellies() {
            try {
                // Ensure we have a valid ID (handle possible nesting from backend)
                const userId = user.id || user.data?.id || user.user?.id;
                
                if (!userId) {
                    console.error("No user ID found", user);
                    return;
                }

                // Fetch the user's collections structure
                const res = await fetch(`http://localhost:8000/api/user/${userId}/collection`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.ok) {
                    const collections = await res.json();

                    if (collections.length > 0) {
                        // For a simple implementation, let's just make a follow-up request to fetch all jellyfishes for this specific collection 
                        // The user endpoint might not include all jellies inside by default depending on the API resource
                        const collectionRes = await fetch(`http://localhost:8000/api/collection/${collections[0].id}`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });

                        if (collectionRes.ok) {
                            const collectionData = await collectionRes.json();
                            // If the API returns the jellyfishes relation, we use it
                            if (collectionData.jellyfishes) {
                                // Map the fields to what the component expects
                                const displayJellies = collectionData.jellyfishes.map(j => ({
                                    id: j.id, name: j.name, image: j.img // Backend uses 'img', frontend expects 'image'
                                }));
                                setMyJellyfishes(displayJellies);
                            } else {
                                // Fallback if relations aren't loaded in the show route
                                // Depending on how you structured the backend, we might need a different endpoint
                                console.warn("No jellyfishes found in collection response -> relations not loaded?");
                            }
                        }
                    }
                }
            } catch (err) {
                console.error("Failed to fetch my jellies:", err);
            }
        }

        fetchMyJellies();
    }, [user, token]);

    return (
        <div className="w-full flex-1 flex flex-col gap-12 bg-bg-dark relative overflow-hidden">
            {/* Decorative background glows */}
            <div className="absolute top-40 -right-20 w-80 h-80 bg-accent-purple/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-40 -left-20 w-64 h-64 bg-accent-blue/10 blur-[100px] rounded-full pointer-events-none" />

            {/* Top rounded profile header */}
            <div
                className="relative flex-1 flex flex-col bg-gradient-to-b from-[#2a1b4d] via-[#121338] to-[#0B0D28] rounded-b-[40px] border-b border-accent-purple/40 shadow-[0_10px_30px_rgba(174,48,208,0.2)]"
            >
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-4 left-4 z-20 w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/20 hover:bg-white/20 active:scale-95 transition-all text-white/80 hover:text-white"
                >
                    <ArrowLeft size={24} />
                </button>

                <button
                    onClick={() => navigate("/edit-profile")}
                    className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/20 hover:bg-white/20 active:scale-95 transition-all text-white/80 hover:text-white"
                >
                    <Pencil size={24} />
                </button>

                <img
                    src={profile?.avatar}
                    alt="User Avatar"
                    className="w-full h-48 object-cover opacity-80"
                />
            </div>

            {/* "your collection" section */}
            <div className="flex-1 flex flex-col gap-12 p-4">
                <div className="flex-1 flex flex-col gap-4">
                    <div className="w-full h-auto flex flex-row justify-between items-center">
                        <h2 className="text-2xl font-bold text-white text-center">Your collection</h2>
                        <h2 className="text-2xl font-bold text-white text-center">({collection.length})</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {collection.map(item => (
                            <CollectionButton
                                key={item.id}
                                title={item.name}
                                image={item.image}
                                navigateTo={`/item/${item.id}`}
                                height="140px"
                            />
                        ))}
                    </div>
                </div>

                {/* "Your jellyfishes" section */}
                <div className="flex-1 flex flex-col gap-2">
                    <div className="w-full h-auto flex flex-row justify-between items-center">
                        <h2 className="w-full text-2xl font-bold text-white">Your jellyfishes</h2>
                        <h2 className="w-auto text-2xl font-bold text-white">({myJellyfishes.length})</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {/* Add button block */}
                        <div
                            onClick={() => navigate('/create-jelly')}
                            className="group flex flex-col items-center justify-center rounded-2xl border border-accent-purple/40 bg-[#292B57] shadow-[0_0_15px_rgba(174,48,208,0.2)] hover:shadow-[0_0_25px_rgba(174,48,208,0.5)] hover:border-accent-purple active:scale-95 transition-all duration-300 cursor-pointer min-h-[188px]"
                        >
                            <Plus size={80} className="text-white font-bold" strokeWidth={3} />
                        </div>

                        {myJellyfishes.map(item => (<CollectionButton
                            key={item.id}
                            title={item.name}
                            image={item.image}
                            navigateTo={`/item/${item.id}`}
                            height="140px"
                        />))}
                    </div>
                </div>

                <div className="px-6 flex justify-center pb-8">
                    {/*<button
                           onClick={logout}
                           className="w-full max-w-[200px] text-white text-sm py-3 px-4 rounded-full transition-opacity hover:opacity-80 mt-4"
                           style={{ background: 'linear-gradient(to right, #a855f7, #0081FD)' }}
                        >
                            Logout
                        </button>
                        */}

                    <button
                        onClick={logout}
                        className="w-full py-4 text-lg font-bold text-white transition-all transition-transform rounded-full bg-gradient-to-r from-accent-blue to-accent-purple shadow-[0_10px_25px_rgba(28,95,209,0.3)] active:scale-95 active:shadow-none flex items-center justify-center gap-2"
                    >
                        <LogOut size={16} className="inline" />
                        Logout
                    </button>
                </div>
            </div>
        </div>);
}

export default Account;