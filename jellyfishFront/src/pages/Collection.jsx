import React, {useEffect, useMemo, useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import {motion, AnimatePresence} from 'framer-motion';
import Header from '../components/Header.jsx';
import CollectionButton from "../components/collection-button.jsx";
import {Plus} from "lucide-react";

const API = 'http://localhost:8000/api';

const Collection = () => {
    // const [isUserLoggedIn, setUserLoggedIn] = useState(false);
    const [searchParams] = useSearchParams();
    const isMine = searchParams.get('mine') === 'true';
    const [activeFilter, setActiveFilter] = useState(['0-100', '100-200', '+200']);
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState('jellys');
    const [jellyfishes, setJellyfishes] = useState([]);

    const [collection, setCollection] = useState([]);

    const cardsHeights= [220, 180, 260, 160, 240, 280, 200, 170];

    useEffect(() => {
        async function fetchJellyfishes() {
            const res = await fetch(`${API}/jellyfish`);
            const data = await res.json();

            console.log(JSON.stringify(data, null, 2));

            setJellyfishes(data);
        }

        fetchJellyfishes();
    }, []);

    const filteredItems = useMemo(() => {
        if (activeFilter.length === 0) return [];

        return jellyfishes.filter(j =>
            activeFilter.some(f => {
                if (f === '0-100') return j.depth >= 0 && j.depth <= 100;
                if (f === '100-200') return j.depth > 100 && j.depth <= 200;
                if (f === '+200') return j.depth > 200;
                return true;
            })
        );
    }, [activeFilter, jellyfishes]);

    return (
        <div
            className="relative z-10 w-full min-h-dvh flex flex-col p-4 gap-12 overflow-y-auto"
            style={{background: 'linear-gradient(to bottom, #0081FD, #074AD1, #0E17A8)'}}
        >
            <Header
                title={activeTab === 'jellys' ? 'Jellys' : 'Collections'}
                returnTo="/"
            />

            <div className="w-full flex-1 flex flex-row gap-6">
                {activeTab === 'jellys' && (
                    <div
                        className="h-full flex flex-col items-center justify-between p-1 gap-1 rounded-full"
                        style={{background: 'linear-gradient(to right, #0081FD, #074AD1)'}}
                    >
                        <button
                            className={`w-full px-6 py-2 text-white font-bold text-sm ${
                                activeFilter.includes('0-100')
                                    ? activeFilter.includes('100-200')
                                        ? 'rounded-t-full'
                                        : 'rounded-full'
                                    : 'rounded-t-full'
                            }`}
                            style={{
                                background: activeFilter.includes('0-100') ? 'rgba(255,255,255,0.15)' : '',
                                writingMode: 'vertical-lr', textOrientation: 'mixed'
                            }}
                            onClick={() => setActiveFilter(prev =>
                                prev.includes('0-100')
                                    ? prev.filter(f => f !== '0-100')
                                    : [...prev, '0-100']
                            )}
                        >
                            0-100
                        </button>

                        <button
                            className={`w-full px-6 py-2 text-white font-bold text-sm ${
                                activeFilter.includes('100-200')
                                    ? activeFilter.includes('0-100') && activeFilter.includes('+200')
                                        ? ''
                                        : activeFilter.includes('0-100')
                                            ? 'rounded-b-full'
                                            : activeFilter.includes('+200')
                                                ? 'rounded-t-full'
                                                : 'rounded-full'
                                    : ''
                            }`}
                            style={{
                                background: activeFilter.includes('100-200') ? 'rgba(255,255,255,0.15)' : '',
                                writingMode: 'vertical-lr', textOrientation: 'mixed'
                            }}
                            onClick={() => setActiveFilter(prev =>
                                prev.includes('100-200')
                                    ? prev.filter(f => f !== '100-200')
                                    : [...prev, '100-200']
                            )}
                        >
                            100-200
                        </button>

                        <button
                            className={`w-full px-6 py-2 text-white font-bold text-sm ${
                                activeFilter.includes('+200')
                                    ? activeFilter.includes('100-200')
                                        ? 'rounded-b-full'
                                        : 'rounded-full'
                                    : 'rounded-b-full'
                            }`}
                            style={{
                                background: activeFilter.includes('+200') ? 'rgba(255,255,255,0.15)' : '',
                                writingMode: 'vertical-lr', textOrientation: 'mixed'
                            }}
                            onClick={() => setActiveFilter(prev =>
                                prev.includes('+200')
                                    ? prev.filter(f => f !== '+200')
                                    : [...prev, '+200']
                            )}
                        >
                            +200
                        </button>
                    </div>
                )}

                <div className="flex-1 flex flex-col gap-4">
                    <div className="w-full flex flex-row gap-2 items-center">
                        <div
                            className="w-10 h-10 flex flex-row justify-center items-center rounded-full shrink-0"
                            style={{background: 'linear-gradient(to right, #0081FD, #074AD1)'}}
                        >
                            <Plus size={14} color="white"/>
                        </div>

                        <div
                            className="flex-1 flex flex-row items-center justify-between p-1 rounded-full"
                            style={{background: 'linear-gradient(to right, #0081FD, #074AD1)'}}
                        >
                            <button
                                className="w-full px-6 py-2 rounded-full text-white font-bold text-sm"
                                style={{background: activeTab === 'jellys' ? 'rgba(255,255,255,0.15)' : ''}}
                                onClick={() => setActiveTab('jellys')}
                            >
                                jellys
                            </button>

                            <button
                                className="w-full px-6 py-2 rounded-full text-white font-bold text-sm"
                                style={{background: activeTab === 'collections' ? 'rgba(255,255,255,0.15)' : ''}}
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
                                            initial={{opacity: 0, y: 50}}
                                            animate={{opacity: 1, y: 0}}
                                            exit={{opacity: 0, scale: 0.8}}
                                            transition={{duration: 0.3}}
                                            key={item.id}
                                            className="break-inside-avoid"
                                        >
                                            <CollectionButton
                                                title={item.name}
                                                image={item.img}
                                                navigateTo={`/item/${item.id}`}
                                                height={cardsHeights[idx % 3]}
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