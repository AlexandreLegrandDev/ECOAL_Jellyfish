import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header.jsx';
import CollectionButton from "../components/collection-button.jsx";
import { Plus } from "lucide-react";

const API = 'http://localhost:8000/api';

const Collection = () => {
    // const [isUserLoggedIn, setUserLoggedIn] = useState(false);
    const [searchParams] = useSearchParams();
    const isMine = searchParams.get('mine') === 'true';
    const [selectedDepth, setSelectedDepth] = useState(200);
    const [hoveredJelly, setHoveredJelly] = useState(null);
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState('jellys');
    const [jellyfishes, setJellyfishes] = useState([]);
    const [collection, setCollection] = useState([]);
    const pinterestRatios = ['3/4', '1/1', '4/5', '3/5', '2/3', '5/4', '9/16', '5/7'];

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch Jellyfishes
                const jellyRes = await fetch(`${API}/jellyfish`);
                if (jellyRes.ok) {
                    const jellyData = await jellyRes.json();
                    setJellyfishes(jellyData);
                }

                // Fetch Collections
                const collRes = await fetch(`${API}/collection`);
                if (collRes.ok) {
                    const collData = await collRes.json();
                    setCollection(collData);
                }
            } catch (err) {
                console.error("Failed to fetch data:", err);
            }
        }
        fetchData();
    }, []);

    const filteredItems = useMemo(() => {
        if (activeTab === 'jellys') {
            return jellyfishes.filter(j => {
                const matchesSearch = j.name.toLowerCase().includes(search.toLowerCase());
                if (!matchesSearch) return false;

                // Map meter-based selection to DB levels (Level 1: 0-100, Level 2: 100-200, etc.)
                const mappedLevel = Math.max(1, Math.min(10, Math.ceil(selectedDepth / 100)));
                return j.depth === mappedLevel;
            });
        } else {
            return collection.filter(c => {
                const matchesSearch = (c.name || "").toLowerCase().includes(search.toLowerCase());
                return matchesSearch;
            });
        }
    }, [selectedDepth, jellyfishes, collection, search, activeTab]);

    const [isDragging, setIsDragging] = useState(false);

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

        const handlePointerUp = () => {
            setIsDragging(false);
        };

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
        const factor = selectedDepth / 1000; // 0 = surface, 1 = abyss

        // Surface colors (light cyan-blue) → Abyss colors (near-black)
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
            <Header
                title={activeTab === 'jellys' ? 'Jellys' : 'Collections'}
                returnTo="/"
            />

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
                                <img src={hoveredJelly.img} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex flex-col items-center justify-center flex-1">
                                <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] mb-2 text-center">Species Preview</span>
                                <h3 className="text-xl font-black text-center text-white leading-tight px-2">
                                    {hoveredJelly.name}
                                </h3>
                                <div className="mt-4 w-12 h-[2px] bg-accent-blue rounded-full shadow-[0_0_10px_#0081FD]" />
                            </div>
                            {/* Decorative background glow */}
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent-blue/20 blur-[80px] rounded-full" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="w-full h-[calc(115vh-240px)] flex flex-row gap-6 mb-30">
                {activeTab === 'jellys' && (
                    <div className="flex flex-col items-center h-full py-4 px-2 select-none">
                        {/* Digital Depth Readout at the top */}
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
                            {/* Level Markings (1 - 9) */}
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

                            {/* Depth Spoilers - Previews on the left */}
                            {Array.from({ length: 10 }).map((_, i) => {
                                const level = i + 1;
                                const firstJelly = jellyfishes.find(j => j.depth === level);
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
                                            <img src={firstJelly.img} alt="" className="w-full h-full object-cover" />
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

                            {/* Minimalist Line Indicator (The "Risco") */}
                            <motion.div
                                className="absolute left-0 -translate-x-1/2 w-full h-[2px] bg-white shadow-[0_0_15px_white] z-20 pointer-events-none"
                                animate={{ top: `${(selectedDepth / 1000) * 100}%` }}
                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            />

                            {/* Selection Glow */}
                            <motion.div
                                className="absolute w-[2px] bg-gradient-to-b from-transparent via-white/20 to-transparent"
                                animate={{
                                    top: `${(Math.max(0, selectedDepth - 50) / 1000) * 100}%`,
                                    height: '10%'
                                }}
                            />
                        </div>

                    </div>
                )}

                <div className="flex-1 flex flex-col gap-4">
                    <div className="w-full flex flex-row gap-2 items-center">


                        <div
                            className="flex-1 flex flex-row items-center justify-between p-1 rounded-full"
                            style={{ background: 'linear-gradient(to right, #0081FD, #074AD1)' }}
                        >
                            <button
                                className="w-full px-6 py-2 rounded-full text-white font-bold text-sm"
                                style={{ background: activeTab === 'jellys' ? 'rgba(255,255,255,0.15)' : '' }}
                                onClick={() => setActiveTab('jellys')}
                            >
                                jellys
                            </button>

                            <button
                                className="w-full px-6 py-2 rounded-full text-white font-bold text-sm"
                                style={{ background: activeTab === 'collections' ? 'rgba(255,255,255,0.15)' : '' }}
                                onClick={() => setActiveTab('collections')}
                            >
                                collections
                            </button>
                        </div>
                    </div>

                    <div className="flex-1">
                        {filteredItems.length === 0 ? (
                            <div
                                className="flex flex-col items-center justify-center py-20 text-white/40"
                            >
                                <span className="text-4xl mb-3">🪼</span>
                                <p className="text-sm">No items found.</p>
                            </div>
                        ) : (
                            <motion.div layout className="columns-2 gap-3 space-y-3">
                                <AnimatePresence mode="popLayout">
                                    {filteredItems.map((item, idx) => (
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
                                                image={
                                                    activeTab === 'collections'
                                                        ? (item.img && (item.img.startsWith('http') || item.img.startsWith('data:'))
                                                            ? item.img
                                                            : item.img ? `http://localhost:8000/storage/${item.img}` : null)
                                                        : (item.img && (item.img.startsWith('http') || item.img.startsWith('data:'))
                                                            ? item.img
                                                            : item.img ? `http://localhost:8000/storage/${item.img}` : null)
                                                }
                                                navigateTo={activeTab === 'jellys' ? `/item/${item.id}` : `/collection/${item.id}`}
                                                aspectRatio={pinterestRatios[idx % pinterestRatios.length]}
                                            />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            {/* <div className="w-full flex flex-col gap-4">
                <div className="w-full flex flex-row items-start gap-4">
                    <div className="flex flex-col gap-4 items-center">
                        <p style={{writingMode: 'vertical-lr', textOrientation: 'mixed'}}>0-100</p>
                        <p style={{writingMode: 'vertical-lr', textOrientation: 'mixed'}}>100-200</p>
                        <p style={{writingMode: 'vertical-lr', textOrientation: 'mixed'}}>+200</p>
                    </div>

                    <div className="w-full flex flex-row gap-4 items-center">
                        <div
                            className="w-10 h-10 flex flex-row justify-center items-center rounded-full shrink-0"
                            style={{background: 'linear-gradient(to right, #0081FD, #074AD1)'}}
                        >
                            <Plus size={14} color="white"/>
                        </div>

                        <div
                            className="flex-1 flex flex-row items-center justify-between p-1 rounded-full border border-accent-purple"
                            style={{background: 'linear-gradient(to right, #0081FD, #074AD1)'}}>
                            <button className="w-full px-6 py-2 rounded-full text-white font-bold text-sm"
                                    style={{background: 'rgba(255,255,255,0.15)'}}>
                                jellys
                            </button>
                            <button className="w-full px-6 py-2 rounded-full text-white font-bold text-sm">
                                collections
                            </button>
                        </div>
                    </div>
                </div>

                <div className="w-full flex flex-row gap-4">
                    <div className="w-full flex flex-col gap-4">
                        {isMine && (
                            <button className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/10 border border-white/20 hover:bg-accent-purple/30 hover:border-accent-purple transition-all duration-200 text-white text-xl font-light">
                                +
                            </button>
                        )}

                        <main className="flex-1 pb-10">
                            <motion.div layout className="columns-2 gap-3 space-y-3">
                                <AnimatePresence mode="popLayout">
                                    {filteredItems.map((item) => (
                                        <motion.div
                                            layout
                                            initial={{opacity: 0, y: 50}}
                                            animate={{opacity: 1, y: 0}}
                                            exit={{opacity: 0, scale: 0.8}}
                                            transition={{duration: 0.3}}
                                            key={item.id}
                                            className="break-inside-avoid"
                                        >
                                            <CollectionButton
                                                title={item.name}
                                                image={item.image}
                                                navigateTo={`/item/${item.id}`}
                                                height={item.height}
                                            />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </motion.div>

                            {filteredItems.length === 0 && (
                                <motion.div
                                    initial={{opacity: 0}}
                                    animate={{opacity: 1}}
                                    className="flex flex-col items-center justify-center py-20 text-white/40"
                                >
                                    <span className="text-4xl mb-3">🪼</span>
                                    <p className="text-sm">No items found.</p>
                                </motion.div>
                            )}
                        </main>
                    </div>
                </div>
            </div>*/}
        </div>
    );
};

export default Collection;