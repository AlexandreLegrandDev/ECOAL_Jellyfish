import { useEffect, useState, useRef } from "react";
import { useAuth } from "../contexts/auth-context.jsx";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import CollectionButton from "../components/collection-button.jsx";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

function Account() {
    
    const { user, token, logout } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const jelliesContainerRef = useRef();
    const jelliesWrapRef = useRef();
    

      useGSAP(() => {
        const wrap = jelliesWrapRef.current;
        
        const scrollAmount = wrap.scrollWidth - window.innerWidth;
    
        gsap.to(wrap, {
          x: -scrollAmount,
          ease: "none",
          scrollTrigger: {
            trigger: jelliesContainerRef.current, 
            start: "top top",
            end: `+=${scrollAmount}`, 
            pin: true,                
            scrub: 1,                 
            markers: false,           
          }
        });
      }, { scope: jelliesContainerRef });

    // Since we mock the API response for visual purposes,
    // we can skip the fetch for now if we just want to show the UI
    useEffect(() => {
        // Mocking user profile
        setProfile({
            name: user?.name || "User",
            avatar: "/jelly.svg" // Guest logo as requested
        });
    }, [user]);

    // Example dummy data
    const collection = [
        { id: 1, name: "Moon jellyfish", image: "https://images.unsplash.com/photo-1549558549-415fe4c37b60?auto=format&fit=crop&q=80&w=400" },
    ];

    const [myJellyfishes, setMyJellyfishes] = useState([]);

    useEffect(() => {
        async function fetchMyJellies() {
            if (!user || !token) return;
            try {
                // Fetch the user's collections structure
                const res = await fetch(`http://localhost:8000/api/user/${user.id}/collection`, {
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
                                    id: j.id,
                                    name: j.name,
                                    image: j.img // Backend uses 'img', frontend expects 'image'
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
        <div className="w-full min-h-screen bg-bg-dark relative pb-20">
            {/* Top rounded profile header */}
            <div className="bg-gradient-to-b from-[#21234F] to-[#121338] rounded-b-[40px] pt-12 pb-10 px-6 relative mb-8 border-b border-accent-purple/30 shadow-[0_10px_30px_rgba(174,48,208,0.1)]">
                <button 
                    onClick={() => navigate(-1)}
                    className="absolute top-10 left-6 w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/20 hover:bg-white/20 hover:scale-105 transition-all text-white/80 hover:text-white"
                >
                    <ArrowLeft size={24} />
                </button>
                <div className="flex justify-center mt-2">
                    <div className="w-28 h-28 rounded-full border-4 border-[#8A7942] overflow-hidden shadow-lg">
                        <img 
                            src={profile?.avatar} 
                            alt="User Avatar" 
                            className="w-full h-full object-cover" 
                        />
                    </div>
                </div>
            </div>

            {/* "your collection" section */}
            <div className="px-6 mb-8">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">your collection</h2>
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
            <div ref={jelliesContainerRef} className="overflow-x-hidden">
                <div className="px-6 mb-8">
                    <h2 className="text-2xl font-bold text-white mb-6 text-center">Your jellyfishes</h2>
                    <div ref={jelliesWrapRef} className="flex gap-6 flex-nowrap w-max">
                        {/* Add button block */}
                        <div 
                            onClick={() => navigate('/create-jelly')}
                            className="group flex flex-col items-center justify-center rounded-2xl border border-accent-purple/40 bg-[#292B57] shadow-[0_0_15px_rgba(174,48,208,0.2)] hover:shadow-[0_0_25px_rgba(174,48,208,0.5)] hover:border-accent-purple active:scale-95 transition-all duration-300 cursor-pointer min-h-[188px] w-64 flex-shrink-0"
                        >
                            <Plus size={80} className="text-white font-bold" strokeWidth={3} />
                        </div>
                        
                        {myJellyfishes.map(item => (
                            <div key={item.id} className="flex-shrink-0 w-64">
                                <CollectionButton 
                                    title={item.name} 
                                    image={item.image} 
                                    navigateTo={`/item/${item.id}`} 
                                    height="140px" 
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            <div className="px-6 flex justify-center pb-8">
               <button
                   onClick={logout}
                   className="w-full max-w-[200px] text-white text-sm py-3 px-4 rounded-full transition-opacity hover:opacity-80 mt-4"
                   style={{ background: 'linear-gradient(to right, #a855f7, #0081FD)' }}
               >
                   Logout
               </button>
            </div>
        </div>
    );
}

export default Account;