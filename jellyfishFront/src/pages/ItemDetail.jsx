import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import heroImage from '../assets/images/hero_jellyfish.png';
import cardImage from '../assets/images/moon_jellyfish_card.png';

const API = 'http://localhost:8000/api';

// Small generic Jellyfish Icon SVG for bullets
const JellyfishIcon = ({ className = "mr-2" }) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`text-accent-purple inline-block shadow-accent-purple shadow-sm drop-shadow-[0_0_5px_rgba(174,48,208,0.8)] ${className}`}>
        <path d="M12 2C7.58172 2 4 5.58172 4 10C4 11.8565 4.63214 13.565 5.68884 14.9317C6.01235 15.35 6.36836 15.7366 6.75 16.0858V18C6.75 18.9665 5.9665 19.75 5 19.75C4.58579 19.75 4.25 20.0858 4.25 20.5C4.25 20.9142 4.58579 21.25 5 21.25C6.79493 21.25 8.25 19.7949 8.25 18V16.8929C9.40051 17.5936 10.6656 18 12 18C13.3344 18 14.5995 17.5936 15.75 16.8929V18C15.75 19.7949 17.2051 21.25 19 21.25C19.4142 21.25 19.75 20.9142 19.75 20.5C19.75 20.0858 19.4142 19.75 19 19.75C18.0335 19.75 17.25 18.9665 17.25 18V16.0858C17.6316 15.7366 17.9876 15.35 18.3112 14.9317C19.3679 13.565 20 11.8565 20 10C20 5.58172 16.4183 2 12 2Z" fill="currentColor" />
        <path d="M10 17H10.01M14 17H14.01M12 18H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 12V21M12 12V22M16 12V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

// Detailed Jellyfish Icon specifically for the "Danger" visual meter
const DetailedJellyfishIcon = ({ className = "" }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`text-accent-purple inline-block shadow-accent-purple shadow-sm drop-shadow-[0_0_8px_rgba(174,48,208,0.9)] ${className}`}>
        {/* Jellyfish Bell (Top Cap) - Multi-layered for detail */}
        <path d="M12 2C6.47715 2 2 6.47715 2 12C2 13.5 2.5 14.8 3.5 15.5C4 15.8 4.2 16.2 4.2 16.8V17V18C4.2 19 3.5 19.5 3.5 20.5C3.5 21.5 5 21.5 6 20.5C6 19.5 7 19.5 8 20.5C9 21.5 10 21.5 11 20.5C11 19.5 12 19.5 13 20.5C14 21.5 15 21.5 16 20.5C17 19.5 18 19.5 18 20.5C19 21.5 20.5 21.5 20.5 20.5C20.5 19.5 19.8 19 19.8 18V17V16.8C19.8 16.2 20 15.8 20.5 15.5C21.5 14.8 22 13.5 22 12C22 6.47715 17.5228 2 12 2Z" fill="currentColor" opacity="0.8" />

        {/* Internal Bell Structure */}
        <path d="M12 4C8.68629 4 6 6.68629 6 10C6 11 6.3 11.8 6.8 12.5C7.2 13 8.3 13 9 12.5C9.5 12.1 10.5 12.1 11 12.5C11.5 12.9 12.5 12.9 13 12.5C13.5 12.1 14.5 12.1 15 12.5C15.7 13 16.8 13 17.2 12.5C17.7 11.8 18 11 18 10C18 6.68629 15.3137 4 12 4Z" fill="#ff7df8" opacity="0.6" />
        <path d="M7 16C7 16 5 19 6 22C7 25 9 22 8 19C7 16 7 16 7 16Z" fill="currentColor" opacity="0.7" />
        <path d="M10 16.5C10 16.5 8 20 9.5 23.5C11 27 12 23 11 19.5C10 16.5 10 16.5 10 16.5Z" fill="#ff7df8" opacity="0.85" />
        <path d="M14 16.5C14 16.5 16 20 14.5 23.5C13 27 12 23 13 19.5C14 16.5 14 16.5 14 16.5Z" fill="#ff7df8" opacity="0.85" />
        <path d="M17 16C17 16 19 19 18 22C17 25 15 22 16 19C17 16 17 16 17 16Z" fill="currentColor" opacity="0.7" />
    </svg>
);

const ItemDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        async function fetchJelly() {
            try {
                const res = await fetch(`${API}/jellyfish/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setItem(data);
                }
            } catch (err) {
                console.error("Failed to fetch jellyfish detail:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchJelly();
    }, [id]);

    const criteria = React.useMemo(() => {
        if (!item || !item.criteria_values) return {};
        return item.criteria_values.reduce((acc, cv) => {
            acc[cv.criteria_field?.name] = cv.value;
            return acc;
        }, {});
    }, [item]);

    if (loading) {
        return (
            <div className="min-h-screen bg-bg-dark flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-accent-purple/20 border-t-accent-purple rounded-full animate-spin" />
            </div>
        );
    }

    if (!item) {
        return (
            <div className="min-h-screen bg-bg-dark flex flex-col items-center justify-center text-white/40 gap-4">
                <span className="text-6xl">🪼</span>
                <p>Jellyfish not found.</p>
                <button onClick={() => navigate(-1)} className="text-accent-blue font-bold">Go Back</button>
            </div>
        );
    }

    // Danger level logic (clamped between 1-5 for display)
    const dangerValue = parseInt(criteria['Dangerosity'] || criteria['Danger'] || 0);
    const dangerArray = Array.from({ length: Math.min(5, Math.max(1, dangerValue)) });

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col min-h-screen bg-bg-dark text-white relative pb-10"
        >
            {/* Top Image Section */}
            <div className="relative w-full h-[40vh] min-h-[300px] rounded-b-[2.5rem] overflow-hidden">
                <img src={item.img} alt={item.name} className="absolute inset-0 w-full h-full object-cover" />

                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-6 left-5 z-20 flex items-center justify-center w-10 h-10 rounded-full bg-bg-dark/40 border border-white/40 backdrop-blur-md hover:bg-white/20 transition-all cursor-pointer"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </button>

                {/* Gradient Overlay for Title */}
                <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-bg-dark/20 to-transparent flex items-end justify-center pb-6">
                    <h1 className="text-3xl font-black tracking-wide drop-shadow-xl text-center px-4">
                        <span className="text-accent-purple drop-shadow-[0_0_15px_rgba(174,48,208,0.8)]">{item.name} </span>
                        <span className="text-accent-blue drop-shadow-[0_0_15px_rgba(28,95,209,0.8)]">Jellyfish</span>
                    </h1>
                </div>
            </div>

            {/* Info Card Section */}
            <div className="px-5 mt-4 flex-1 flex flex-col">
                <div className="relative rounded-[1.5rem] p-[1px] bg-gradient-to-b from-accent-purple to-accent-blue/30 overflow-hidden flex-1 shadow-[0_0_30px_rgba(174,48,208,0.15)]">
                    <div className="bg-bg-dark h-full w-full rounded-[1.5rem] p-5">

                        {/* Stats List */}
                        <ul className="space-y-4 text-[0.95rem]">
                            <li className="flex items-center">
                                <JellyfishIcon />
                                <strong className="text-white">Size:</strong> 
                                <span className="text-white/80 ml-2">{criteria['Size'] || 'N/A'} cm</span>
                            </li>
                            <li className="flex items-center">
                                <JellyfishIcon />
                                <strong className="text-white">Deep:</strong> 
                                <span className="text-white/80 ml-2">{item.depth * 100} m</span>
                            </li>
                            <li className="flex items-center">
                                <JellyfishIcon />
                                <strong className="text-white">Dangerosity:</strong>
                                <span className="flex items-center ml-3 gap-1.5">
                                    {dangerArray.map((_, i) => (
                                        <DetailedJellyfishIcon key={i} className="opacity-95" />
                                    ))}
                                    {dangerArray.length === 0 && <span className="text-white/30 text-xs italic">Harmless</span>}
                                </span>
                            </li>
                            <li className="flex items-center">
                                <JellyfishIcon />
                                <strong className="text-white">Diameter:</strong> 
                                <span className="text-white/80 ml-2">{criteria['Diameter'] || 'N/A'} cm</span>
                            </li>
                            <li className="flex items-center">
                                <JellyfishIcon />
                                <strong className="text-white">Bioluminescent:</strong> 
                                <span className="text-white/80 ml-2">{parseInt(criteria['Bioluminescent']) === 1 ? 'Yes' : 'No'}</span>
                            </li>
                        </ul>

                        {/* Description */}
                        {item.collection?.description && (
                            <div className="mt-8 border-t border-white/5 pt-6">
                                <h3 className="font-bold text-white mb-2 underline decoration-accent-purple/40 underline-offset-4">Description :</h3>
                                <p className="text-white/80 text-sm leading-relaxed italic">
                                    {item.collection.description}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Remove from collection button (Visual placeholder) */}
                <div className="flex justify-center mt-6 mb-2">
                    <button className="px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-white/30 border border-white/10 bg-transparent transition-all duration-300 hover:text-white hover:border-accent-purple/60 hover:shadow-[0_0_15px_rgba(174,48,208,0.2)]">
                        Remove from collection
                    </button>
                </div>

                {/* Background decorative waves */}
                <div className="fixed bottom-0 left-0 w-full rounded-t-full h-32 opacity-10 pointer-events-none" style={{ background: 'radial-gradient(ellipse at bottom, var(--accent-blue), transparent)', zIndex: -1 }}></div>
                <div className="fixed bottom-10 left-[-20%] w-[140%] rounded-t-full h-20 border-t border-accent-blue/20 pointer-events-none" style={{ zIndex: -1 }}></div>
                <div className="fixed bottom-0 left-[-10%] w-[120%] rounded-t-full h-16 border-t border-accent-purple/20 pointer-events-none" style={{ zIndex: -1 }}></div>
            </div>
        </motion.div>
    );
};

export default ItemDetail;
