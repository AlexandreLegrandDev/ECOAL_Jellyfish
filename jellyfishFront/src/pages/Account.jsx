import { useEffect, useState, useRef } from "react";
import { useAuth } from "../contexts/auth-context.jsx";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, LogOut, Pencil, Plus } from "lucide-react";
import CollectionButton from "../components/collection-button.jsx";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

function Account() {

    const { user, token, logout } = useAuth();
    const [profile, setProfile] = useState(null);
    const navigate = useNavigate();
    const jelliesContainerRef = useRef();
    const jelliesWrapRef = useRef();

    useGSAP(() => {
        const wrap = jelliesWrapRef.current;
        if (!wrap) return;

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

    useEffect(() => {
        setProfile({
            name: user?.name || "User",
            avatar: "/jelly.svg"
        });
    }, [user]);

    const collection = [
        {
            id: 1,
            name: "Moon jellyfish",
            image: "https://images.unsplash.com/photo-1549558549-415fe4c37b60?auto=format&fit=crop&q=80&w=400"
        },
    ];

    const [myJellyfishes, setMyJellyfishes] = useState([]);

    useEffect(() => {
        async function fetchMyJellies() {
            if (!user || !token) return;

            try {
                const res = await fetch(`http://localhost:8000/api/user/${user.id}/collection`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.ok) {
                    const collections = await res.json();

                    if (collections.length > 0) {
                        const collectionRes = await fetch(`http://localhost:8000/api/collection/${collections[0].id}`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });

                        if (collectionRes.ok) {
                            const collectionData = await collectionRes.json();

                            if (collectionData.jellyfishes) {
                                const displayJellies = collectionData.jellyfishes.map(j => ({
                                    id: j.id,
                                    name: j.name,
                                    image: j.img
                                }));

                                setMyJellyfishes(displayJellies);
                            } else {
                                console.warn("No jellyfishes found in collection response");
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
        <div className="w-full flex-1 flex flex-col gap-12 bg-bg-dark relative">

            {/* Profile header */}
            <div className="relative flex-1 flex flex-col bg-gradient-to-b from-[#21234F] to-[#121338] rounded-b-[40px] border-b border-accent-purple/30 shadow-[0_10px_30px_rgba(174,48,208,0.1)]">

                <button
                    onClick={() => navigate("/")}
                    className="absolute top-4 left-4 w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/20 hover:bg-white/20 active:scale-95 transition-all text-white/80 hover:text-white"
                >
                    <ArrowLeft size={24} />
                </button>

                <button
                    onClick={() => navigate("/edit-profile")}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/20 hover:bg-white/20 active:scale-95 transition-all text-white/80 hover:text-white"
                >
                    <Pencil size={24} />
                </button>

                <img
                    src={profile?.avatar}
                    alt="User Avatar"
                    className="w-full h-48 object-cover"
                />
            </div>

            {/* Collection */}
            <div className="px-6">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">
                    your collection
                </h2>

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

            {/* Horizontal jellyfish scroll */}
            <div ref={jelliesContainerRef} className="overflow-x-hidden">
                <div className="px-6 mb-8">

                    <h2 className="text-2xl font-bold text-white mb-6 text-center">
                        Your jellyfishes
                    </h2>

                    <div ref={jelliesWrapRef} className="flex gap-6 flex-nowrap w-max">

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

            {/* Logout */}
            <div className="px-6 flex justify-center pb-8">
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