import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "./contexts/auth-context.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";
import Header from "./components/Header.jsx";
import CollectionButton from "./components/collection-button.jsx";
import cardImage from "./assets/images/moon_jellyfish_card.png";

const CollectionDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, token } = useAuth();

    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDepth, setSelectedDepth] = useState(200);
    const [hoveredJelly, setHoveredJelly] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchCollection = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/collection/${id}`);
                if (!response.ok) throw new Error("Failed to load");
                const data = await response.json();
                const heights = [220, 180, 260, 160, 240, 280, 200, 170];
                const formattedItems = (data.jellyfishes || []).map((j, i) => {
                    const imgUrl = j.img
                        ? (j.img.startsWith("http") || j.img.startsWith("data:")
                            ? j.img
                            : `http://localhost:8000/storage/${j.img}`)
                        : cardImage;

                    return {
                        id: j.id,
                        name: j.name,
                        image: imgUrl,
                        depth: j.depth || 0,
                        height: heights[i % heights.length]
                    };
                });
                setItems(formattedItems);
            } catch (error) {
                console.error("Error fetching collection:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCollection();
    }, [id]);

    const filteredItems = useMemo(() => {
        return items.filter(j => {
            const mappedLevel = Math.max(1, Math.min(10, Math.ceil(selectedDepth / 100)));
            return j.depth === mappedLevel;
        });
    }, [selectedDepth, items]);

    async function handleDeleteJellyfish(jellyfishId) {
        if (!token) return;
        try {
            const res = await fetch(`http://localhost:8000/api/jellyfish/${jellyfishId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Accept": "application/json"
                }
            });
            if (res.ok) {
                setItems(prev => prev.filter(item => item.id !== jellyfishId));
            }
        } catch (err) {
            console.error("Failed to delete jellyfish:", err);
        }
    }

    const updateDepthFromPointer = (e, rect) => {
        const y = e.clientY - rect.top;
        const percentage = Math.max(0, Math.min(1, y / rect.height));
        const depth = Math.round(percentage * 1000);
        setSelectedDepth(depth);
    };

    const handlePointerDown = (e) => {
        setIsDragging(true);
        const rect = e.currentTarget.getBoundingClientRect();
        updateDepthFromPointer(e, rect);
    };

    useEffect(() => {
        const handlePointerMove = (e) => {
            if (!isDragging) return;
            const container = document.getElementById('depth-meter-container');
            if (container) {
                const rect = container.getBoundingClientRect();
                updateDepthFromPointer(e, rect);
            }
        };
        const handlePointerUp = () => setIsDragging(false);

        if (isDragging) {
            window.addEventListener('pointermove', handlePointerMove);
            window.addEventListener('pointerup', handlePointerUp);
        }

        return () => {
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
        };
    }, [isDragging]);

    // Calculate ocean depth gradient — surface to abyss
    const getOceanGradient = () => {
        const factor = selectedDepth / 1000;

        const topH = 200 + factor * 15;
        const topS = 85 - factor * 30;
        const topL = Math.max(3, 45 - factor * 42);

        const midH = 215 + factor * 15;
        const midS = 75 - factor * 35;
        const midL = Math.max(2, 30 - factor * 28);

        const botH = 230 + factor * 10;
        const botS = 60 - factor * 40;
        const botL = Math.max(1, 12 - factor * 11);

        return `linear-gradient(180deg, 
            hsl(${topH}, ${topS}%, ${topL}%) 0%, 
            hsl(${midH}, ${midS}%, ${midL}%) 40%, 
            hsl(${botH}, ${botS}%, ${botL}%) 100%)`;
    };

    return (
        <div
            className="relative z-10 w-full min-h-dvh flex flex-col p-4 gap-12 overflow-y-auto transition-all duration-1000 ease-in-out"
            style={{ background: getOceanGradient() }}
        >
            {/* Surface light glow */}
            <div
                className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-1000"
                style={{
                    background: `radial-gradient(ellipse 120% 40% at 50% -5%, hsla(200, 80%, ${Math.max(5, 55 - (selectedDepth / 1000) * 50)}%, ${Math.max(0, 0.3 - (selectedDepth / 1000) * 0.28)}) 0%, transparent 100%)`,
                }}
            />
            <Header title="Collection Details" returnTo="/collection" />

            {/* Spotlight Preview Overlay */}
            <AnimatePresence>
                {hoveredJelly && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -20 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
                    >
                        <div className="relative w-64 h-80 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/20 backdrop-blur-xl bg-white/5 p-4 flex flex-col gap-4">
                            <div className="w-full h-48 rounded-2xl overflow-hidden">
                                <img src={hoveredJelly.image} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex flex-col items-center justify-center flex-1">
                                <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] mb-2 text-center">Species Preview</span>
                                <h3 className="text-xl font-black text-center text-white leading-tight px-2">
                                    {hoveredJelly.name}
                                </h3>
                                <div className="mt-4 w-12 h-[2px] bg-accent-blue rounded-full shadow-[0_0_10px_#0081FD]" />
                            </div>
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent-blue/20 blur-[80px] rounded-full" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="w-full h-[calc(115vh-240px)] flex flex-row gap-6 mb-30">
                <div className="flex flex-col items-center h-full py-4 px-2 select-none">
                    <div className="mb-8 flex flex-col items-center animate-in fade-in duration-700">
                        <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] leading-none mb-2">Depth</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-black text-white tabular-nums drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                                {selectedDepth}
                            </span>
                            <span className="text-xs font-bold text-white/50">m</span>
                        </div>
                    </div>

                    <div
                        id="depth-meter-container"
                        className="relative w-12 flex-1 cursor-ns-resize flex flex-col items-center group touch-none"
                        onPointerDown={handlePointerDown}
                    >
                        {Array.from({ length: 51 }).map((_, i) => (
                            <div
                                key={i}
                                className={`absolute transition-all ${i % 5 === 0 ? "w-4 h-[1px] bg-white/40" : "w-1.5 h-[0.5px] bg-white/20"}`}
                                style={{ top: `${(i / 50) * 100}%` }}
                            >
                                {i % 10 === 0 && (
                                    <span className="absolute left-6 -translate-y-1/2 text-[7px] font-bold text-white/20 uppercase tracking-tighter">
                                        {i * 20}
                                    </span>
                                )}
                            </div>
                        ))}

                        {Array.from({ length: 10 }).map((_, i) => {
                            const level = i + 1;
                            const firstJelly = items.find(j => j.depth === level);
                            if (!firstJelly) return null;

                            return (
                                <motion.div
                                    key={`spoiler-${level}`}
                                    className="absolute right-8 -translate-y-1/2 flex flex-row-reverse items-center gap-2 cursor-help z-30"
                                    style={{ top: `${((level * 100 - 50) / 1000) * 100}%` }}
                                    onMouseEnter={() => setHoveredJelly(firstJelly)}
                                    onMouseLeave={() => setHoveredJelly(null)}
                                    whileHover="hover"
                                    initial="initial"
                                >
                                    <motion.div
                                        className="relative w-5 h-5 rounded-full overflow-hidden border border-white/20 shadow-lg"
                                        variants={{
                                            initial: { scale: 1, opacity: 0.3 },
                                            hover: { scale: 1.8, opacity: 1, x: -5 }
                                        }}
                                    >
                                        <img src={firstJelly.image} alt="" className="w-full h-full object-cover" />
                                    </motion.div>

                                    <motion.div
                                        className="flex flex-col items-end"
                                        variants={{
                                            initial: { opacity: 0.1, x: 5 },
                                            hover: { opacity: 1, x: 0 }
                                        }}
                                    >
                                        <span className="text-[5.5px] font-black text-white uppercase tracking-[0.2em] whitespace-nowrap drop-shadow-md">
                                            {firstJelly.name}
                                        </span>
                                        <div className="w-6 h-[1px] bg-white/20 mt-0.5" />
                                    </motion.div>
                                </motion.div>
                            );
                        })}

                        <motion.div
                            className="absolute left-0 -translate-x-1/2 w-full h-[2px] bg-white shadow-[0_0_15px_white] z-20 pointer-events-none"
                            animate={{ top: `${(selectedDepth / 1000) * 100}%` }}
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />

                        <motion.div
                            className="absolute w-[2px] bg-gradient-to-b from-transparent via-white/20 to-transparent"
                            animate={{
                                top: `${(Math.max(0, selectedDepth - 50) / 1000) * 100}%`,
                                height: '10%'
                            }}
                        />
                    </div>
                </div>

                <div className="flex-1 flex flex-col gap-4">
                    <div className="flex-1">
                        {isLoading && items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-white/40">
                                <p className="text-sm">Loading...</p>
                            </div>
                        ) : filteredItems.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-white/40">
                                <span className="text-4xl mb-3">🪼</span>
                                <p className="text-sm">No items found here.</p>
                            </div>
                        ) : (
                            <motion.div layout className="columns-2 gap-3 space-y-3">
                                <AnimatePresence mode="popLayout">
                                    {filteredItems.map((item) => (
                                        <motion.div
                                            layout
                                            initial={{ opacity: 0, y: 50 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            transition={{ duration: 0.3 }}
                                            key={item.id}
                                            className="break-inside-avoid"
                                        >
                                            <CollectionButton
                                                title={item.name}
                                                image={item.image}
                                                navigateTo={`/item/${item.id}`}
                                                height={item.height}
                                            >
                                                {user && (
                                                    <button
                                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDeleteJellyfish(item.id); }}
                                                        className="absolute top-2 right-2 z-20 w-7 h-7 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center transition-all active:scale-90"
                                                    >
                                                        <Trash2 size={13} className="text-white/70" />
                                                    </button>
                                                )}
                                            </CollectionButton>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CollectionDetail;