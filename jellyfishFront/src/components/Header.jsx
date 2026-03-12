import React from 'react';
import { Menu } from "lucide-react";

const Header = () => {
    return (
        <div
            className="relative w-full h-16 flex flex-row justify-between items-center p-4 rounded-full border border-[#0081FD]"
        >
            <div className="absolute inset-0 bg-black opacity-50 rounded-full" />

            <img src="/jelly.svg" alt="Jellyfish Logo" className="relative z-10 object-contain w-8 h-8" />

            <Menu size={32} color="white" className="relative z-10" />
        </div>
    );
};

export default Header;