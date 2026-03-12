import React from 'react';
import { Link } from "react-router-dom";
import * as Icons from "lucide-react";

const CollectionButton = ({ title, icon, image, navigateTo, height }) => {
    const IconComponent = icon ? Icons[icon] : null;

    return (
        <Link to={navigateTo} className="group flex flex-col overflow-hidden rounded-2xl border border-accent-purple/40 bg-white/5 shadow-[0_0_15px_rgba(174,48,208,0.2)] hover:shadow-[0_0_25px_rgba(174,48,208,0.5)] hover:border-accent-purple active:scale-95 transition-all duration-300 cursor-pointer">

            <div className="w-full relative overflow-hidden flex items-center justify-center bg-white/5" style={{ height }}>
                {image ? (
                    <img
                        src={image}
                        alt={title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : IconComponent ? (
                    <IconComponent size={48} className="text-accent-purple/70" />
                ) : null}
            </div>

            <div className="p-3 bg-bg-dark/60 backdrop-blur-sm flex justify-center items-center">
                <p className="text-sm font-semibold text-white/90 truncate">{title}</p>
            </div>

        </Link>
    );
};

export default CollectionButton;