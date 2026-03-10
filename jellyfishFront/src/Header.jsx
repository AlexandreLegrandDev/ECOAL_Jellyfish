import React from 'react';
import logo from './assets/images/logo.png';

const Header = () => {
    return (
        <nav className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-8 md:px-8">
            {/* Logo Container */}
            <div className="flex items-center justify-center w-20 h-20 p-2 transition-transform duration-300 hover:scale-110">
                <img src={logo} alt="Jellyfish Logo" className="object-contain w-full h-full" />
            </div>

            {/* Menu Button */}
            <button className="flex flex-col gap-1.5 p-2.5 transition-opacity hover:opacity-80 bg-transparent border-none cursor-pointer">
                <span className="block w-8 h-0.5 bg-white rounded-full"></span>
                <span className="block w-8 h-0.5 bg-white rounded-full"></span>
                <span className="block w-8 h-0.5 bg-white rounded-full"></span>
            </button>
        </nav>
    );
};

export default Header;
