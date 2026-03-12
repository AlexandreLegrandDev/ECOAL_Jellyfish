import React from 'react';
import { Link } from "react-router-dom";
import * as Icons from "lucide-react";

const Button = ({ title, icon, navigateTo, variant = "primary", className = "", fullWidth = false }) => {
    const IconComponent = icon ? Icons[icon] : null;

    const baseStyles = `${fullWidth ? "w-full" : "px-12"} py-4 text-lg font-bold text-white transition-all transition-transform rounded-full`;

    const variants = {
        primary: "bg-gradient-to-r from-accent-blue to-accent-purple shadow-[0_10px_25px_rgba(28,95,209,0.3)] active:scale-95 active:shadow-none",
        outline: "border border-[rgba(0,129,253,0.6)] bg-transparent active:scale-95 active:opacity-70",
        small: "!px-4 !py-2 !text-sm bg-gradient-to-r from-accent-blue to-accent-purple active:scale-95 active:opacity-70",
        "small-outline": "!px-4 !py-2 !text-sm border border-[rgba(0,129,253,0.6)] bg-transparent active:scale-95 active:opacity-70",
    };

    const button = (
        <button className={`${baseStyles} ${variants[variant]} ${className} flex items-center justify-center gap-2`}>
            {IconComponent && <IconComponent size={16} className="inline" />}
            {title}
        </button>
    );

    return navigateTo ? (
        <div className={`flex justify-center ${fullWidth ? "w-full" : ""}`}>
            <Link to={navigateTo} className={fullWidth ? "w-full" : ""}>{button}</Link>
        </div>
    ) : button;
};

export default Button;