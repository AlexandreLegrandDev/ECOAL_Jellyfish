import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "./assets/images/logo.png";
import cardImage from "./assets/images/moon_jellyfish_card.png";

const DEPTH_FILTERS = [
    { label: "0 - 100", value: "0-100" },
    { label: "100 - 200", value: "100-200" },
    { label: "200 +", value: "200+" }
];

const CollectionDetail = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [items, setItems] = useState([]);
    const [activeFilter, setActiveFilter] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

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
                        ? (j.img.startsWith("http")
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

    const filteredItems = items.filter((item) => {

        if (!activeFilter) return true;

        if (activeFilter === "0-100") return item.depth <= 100;
        if (activeFilter === "100-200") return item.depth > 100 && item.depth <= 200;
        if (activeFilter === "200+") return item.depth > 200;

        return true;

    });

    return (

        <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-[#0D0F2B] text-white">

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

            {/* Depth Filters */}
            <div className="flex items-center gap-2 px-5 pb-5 flex-wrap">

                {DEPTH_FILTERS.map((f) => (

                    <button
                        key={f.value}
                        onClick={() => setActiveFilter(activeFilter === f.value ? null : f.value)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all duration-200
                        ${activeFilter === f.value
                            ? "bg-accent-purple/30 border-accent-purple text-white"
                            : "bg-white/10 border-white/20 text-white/70 hover:bg-white/20 hover:text-white"
                        }`}
                    >
                        {f.label}
                    </button>

                ))}

            </div>

            {/* Jellyfish Grid */}
            <main className="flex-1 px-5 pb-10">

                <motion.div layout className="columns-2 gap-3 space-y-3">

                    <AnimatePresence mode="popLayout">

                        {filteredItems.map((item) => (

                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                                onClick={() => navigate(`/item/${item.id}`)}
                                className="group flex flex-col overflow-hidden rounded-2xl border border-accent-purple/40 bg-white/5 shadow-[0_0_15px_rgba(174,48,208,0.2)] hover:shadow-[0_0_25px_rgba(174,48,208,0.5)] hover:border-accent-purple hover:-translate-y-1 cursor-pointer break-inside-avoid"
                            >

                                <div
                                    className="w-full relative overflow-hidden"
                                    style={{ height: item.height }}
                                >

                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        onError={(e) => { e.target.src = cardImage }}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />

                                </div>

                                <div className="p-3 bg-bg-dark/60 backdrop-blur-sm flex justify-center items-center">

                                    <p className="text-sm font-semibold text-white/90 truncate">
                                        {item.name}
                                    </p>

                                </div>

                            </motion.div>

                        ))}

                    </AnimatePresence>

                </motion.div>

                {isLoading && (

                    <div className="flex justify-center py-20 text-white/40">
                        Loading...
                    </div>

                )}

                {!isLoading && filteredItems.length === 0 && (

                    <div className="flex flex-col items-center justify-center py-20 text-white/40">
                        <span className="text-4xl mb-3">🪼</span>
                        <p>No jellyfishes found.</p>
                    </div>

                )}

            </main>

        </div>

    );

};

export default CollectionDetail;