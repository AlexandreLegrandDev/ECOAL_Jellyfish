import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header.jsx';
import CollectionButton from "../components/collection-button.jsx";

const API = 'http://localhost:8000/api';

const CollectionDetail = () => {
    const { id } = useParams();
    const [collectionName, setCollectionName] = useState("Collection");
    const [jellyfishes, setJellyfishes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const cardsHeights = [220, 180, 260, 160, 240, 280, 200, 170];

    const filteredJellys = jellyfishes.filter(j => 
        j.name.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        async function fetchCollectionDetail() {
            try {
                const res = await fetch(`${API}/collection/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    // Assuming data has { name: "...", jellyfishes: [...] }
                    setCollectionName(data.name || "My Collection");
                    setJellyfishes(data.jellyfishes || []);
                }
            } catch (err) {
                console.error("Failed to fetch collection detail:", err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchCollectionDetail();
    }, [id]);

    return (
        <motion.div
            initial={{ backgroundColor: "#050529", opacity: 0 }}
            animate={{ backgroundColor: "#081225", opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="relative z-10 w-full h-screen flex flex-col p-4 md:p-8 gap-8 overflow-hidden"
        >
            <Header
                title={collectionName}
                returnTo="/collection"
            />

            {/* Decorative background glow */}
            <div className="absolute top-20 -right-20 w-80 h-80 bg-accent-purple/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 -left-20 w-64 h-64 bg-accent-blue/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="w-full flex-1 flex flex-row gap-6 overflow-hidden">
                <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                         <div className="flex flex-col">
                            <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] leading-none mb-1">
                                Viewing Collection
                            </span>
                            <h2 className="text-xl font-bold text-white uppercase tracking-wider">{collectionName}</h2>
                         </div>
                         
                         <div className="flex flex-row items-center gap-4 flex-1 md:max-w-md">
                            <div className="relative flex-1">
                                <input 
                                    type="text"
                                    placeholder="Search in collection..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-full py-2 px-5 text-sm text-white focus:outline-none focus:border-accent-blue/50 transition-all"
                                />
                            </div>
                            <div className="px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md shrink-0">
                                <span className="text-xs font-bold text-white/60">{filteredJellys.length} Species</span>
                            </div>
                         </div>
                    </div>

                    <div className="flex-1 overflow-y-auto overflow-x-hidden pr-2 custom-scrollbar pb-20">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 text-white/40">
                                <div className="w-8 h-8 border-2 border-white/20 border-t-white/80 rounded-full animate-spin mb-4" />
                                <p className="text-sm">Loading collection...</p>
                            </div>
                        ) : filteredJellys.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-white/40">
                                <span className="text-4xl mb-3">🪼</span>
                                <p className="text-sm">{search ? "No matches found." : "This collection is empty."}</p>
                            </div>
                        ) : (
                            <motion.div 
                                layout 
                                initial="hidden"
                                animate="visible"
                                variants={{
                                    hidden: { opacity: 0 },
                                    visible: {
                                        opacity: 1,
                                        transition: {
                                            staggerChildren: 0.1
                                        }
                                    }
                                }}
                                className="columns-2 gap-3 space-y-3"
                            >
                                <AnimatePresence mode="popLayout">
                                    {filteredJellys.map((item, idx) => (
                                        <motion.div
                                            layout
                                            variants={{
                                                hidden: { opacity: 0, y: 30, scale: 0.9 },
                                                visible: { opacity: 1, y: 0, scale: 1 }
                                            }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            transition={{ duration: 0.5, ease: "easeOut" }}
                                            key={item.id}
                                            className="break-inside-avoid"
                                        >
                                            <CollectionButton
                                                title={item.name}
                                                image={item.img || item.image}
                                                navigateTo={`/item/${item.id}`}
                                                height={cardsHeights[idx % cardsHeights.length]}
                                            />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default CollectionDetail;
