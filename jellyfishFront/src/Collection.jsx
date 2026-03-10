import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logo from './assets/images/logo.png';
import cardImage from './assets/images/moon_jellyfish_card.png';

const PRICE_FILTERS = [
    { label: '0 - 100', value: '0-100' },
    { label: '100 - 200', value: '100-200' },
    { label: '200 +', value: '200+' },
];

const items = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    name: `Moon Jellyfish #${i + 1}`,
    price: [80, 150, 220, 95, 175, 310, 60, 130][i],
    image: cardImage,
    // Add a pseudo-random height between 150px and 280px to simulate masonry effect 
    height: [220, 180, 260, 160, 240, 280, 200, 170][i]
}));

const Collection = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const isMine = searchParams.get('mine') === 'true';
    const [activeFilter, setActiveFilter] = useState(null);
    const [search, setSearch] = useState('');

    const filteredItems = items.filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
        if (!matchesSearch) return false;
        if (!activeFilter) return true;
        if (activeFilter === '0-100') return item.price <= 100;
        if (activeFilter === '100-200') return item.price > 100 && item.price <= 200;
        if (activeFilter === '200+') return item.price > 200;
        return true;
    });

    return (
        <div className="flex flex-col min-h-screen bg-bg-dark text-white">

            {/* Top Navigation */}
            <nav className="flex items-center justify-between px-5 py-5">
                <div className="flex items-center gap-3">
                    <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
                    <span className="text-lg font-bold tracking-wide">Collection</span>
                </div>
                <button className="flex flex-col gap-1.5 p-2 bg-transparent border-none cursor-pointer hover:opacity-80 transition-opacity">
                    <span className="block w-7 h-0.5 bg-white rounded-full"></span>
                    <span className="block w-7 h-0.5 bg-white rounded-full"></span>
                    <span className="block w-7 h-0.5 bg-white rounded-full"></span>
                </button>
            </nav>

            {/* Search Bar */}
            <div className="px-5 mb-4">
                <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 focus-within:border-accent-purple transition-colors duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white/50 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 bg-transparent text-white text-sm placeholder-white/40 outline-none"
                    />
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex items-center gap-2 px-5 pb-5 flex-wrap">
                {/* Add Button - only in personal collection */}
                {isMine && (
                    <button className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/10 border border-white/20 hover:bg-accent-purple/30 hover:border-accent-purple transition-all duration-200 text-white text-xl font-light">
                        +
                    </button>
                )}

                {/* Price range filters */}
                {PRICE_FILTERS.map((f) => (
                    <button
                        key={f.value}
                        onClick={() => setActiveFilter(activeFilter === f.value ? null : f.value)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all duration-200
                            ${activeFilter === f.value
                                ? 'bg-accent-purple/30 border-accent-purple text-white'
                                : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/20 hover:text-white'
                            }`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* 2-Column Masonry Grid */}
            <main className="flex-1 px-5 pb-10">
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
                                onClick={() => navigate(`/item/${item.id}`)}
                                className="group flex flex-col overflow-hidden rounded-2xl border border-accent-purple/40 bg-white/5 shadow-[0_0_15px_rgba(174,48,208,0.2)] hover:shadow-[0_0_25px_rgba(174,48,208,0.5)] hover:border-accent-purple hover:-translate-y-1 cursor-pointer break-inside-avoid"
                            >
                                <div className="w-full relative overflow-hidden" style={{ height: item.height }}>
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                                <div className="p-3 bg-bg-dark/60 backdrop-blur-sm flex justify-center items-center">
                                    <p className="text-sm font-semibold text-white/90 truncate">{item.name}</p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {filteredItems.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-20 text-white/40"
                    >
                        <span className="text-4xl mb-3">🪼</span>
                        <p className="text-sm">No items found.</p>
                    </motion.div>
                )}
            </main>
        </div>
    );
};

export default Collection;
