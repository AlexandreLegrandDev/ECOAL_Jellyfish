import React, { useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Menu, X, CheckCircle2, AlertCircle, Info } from "lucide-react";
import Button from "./button.jsx";
import { useAuth } from "../contexts/auth-context.jsx";

const Header = ({title, returnTo = "/"}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { token, logout, notification } = useAuth();
    const isLoggedIn = !!token;

    const location = useLocation();
    const navigate = useNavigate();

    const isNotifying = !!notification;
    const type = notification?.type || "success";

    const getDynamicHeight = () => {
        if (isNotifying) return "h-20 py-4";
        if (isMenuOpen) return "h-auto min-h-[180px] py-6 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]";
        return "h-16 py-0";
    };

    const getDynamicBorder = () => {
        if (isNotifying) {
            if (type === "success") return "border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)] bg-green-500/10";
            if (type === "error") return "border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)] bg-red-500/10";
            return "border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.3)] bg-yellow-500/10";
        }
        if (isMenuOpen) return "border-white/20 bg-black/20 shadow-[0_0_30px_rgba(0,0,0,0.2)]";
        return "border-white/10 bg-white/5";
    };

    return (
        <div className="relative w-full px-4 pt-4 z-[100]">
            <div 
                className={`
                    relative w-full flex flex-col items-center px-6 rounded-[32px] border 
                    transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
                    ${getDynamicHeight()}
                    ${getDynamicBorder()}
                    ${isNotifying ? "scale-[1.02]" : "scale-100"}
                    backdrop-blur-2xl overflow-hidden
                `}
            >
                {/* Top Row / Navigation */}
                <div className={`w-full flex flex-row justify-between items-center h-16 flex-shrink-0 transition-opacity duration-300 ${isNotifying ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
                    <div className="flex items-center gap-3">
                        {location.pathname === "/" ? (
                            <img
                                src="/jelly.svg"
                                alt="Jellyfish Logo"
                                className="object-contain w-8 h-8 transition-transform hover:rotate-[15deg]"
                            />
                        ) : (
                            <ArrowLeft
                                size={26}
                                color="white"
                                className="cursor-pointer hover:scale-110 transition-transform p-1 bg-white/5 rounded-lg"
                                onClick={() => navigate(-1)}
                            />
                        )}
                    </div>

                    {title && !isMenuOpen && (
                        <p className="absolute left-1/2 -translate-x-1/2 font-bold text-white uppercase tracking-[0.2em] text-[10px] animate-in fade-in duration-500">
                            {title}
                        </p>
                    )}

                    <div className="flex items-center">
                        <div 
                            className="p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsMenuOpen(!isMenuOpen);
                            }}
                        >
                            {isMenuOpen ? (
                                <X size={26} color="white" className="animate-in zoom-in duration-300" />
                            ) : (
                                <Menu size={26} color="white" className="animate-in zoom-in duration-300" />
                            )}
                        </div>
                    </div>
                </div>

                {/* Notification State (Absolute to overlay) */}
                {isNotifying && (
                    <div className="absolute inset-0 w-full h-full flex items-center justify-start px-8 gap-4 animate-in fade-in slide-in-from-top-2 duration-500">
                        <div className="p-2 rounded-xl bg-white/5 border border-white/10 shadow-inner">
                            {type === "success" && <CheckCircle2 size={24} className="text-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]" />}
                            {type === "error" && <AlertCircle size={24} className="text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" />}
                            {type === "alert" && <Info size={24} className="text-yellow-400 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 leading-none mb-1">
                                System Alert
                            </span>
                            <p className="text-white font-bold text-sm leading-tight">
                                {notification.message}
                            </p>
                        </div>
                    </div>
                )}

                {/* Expanded Menu Content */}
                {isMenuOpen && !isNotifying && (
                    <div className="w-full flex flex-col gap-4 pb-4 animate-in fade-in slide-in-from-top-4 duration-700">
                        <div className="h-[1px] w-full bg-white/5 shadow-sm" />
                        <div className="px-2">
                            {isLoggedIn ? (
                                <div className="flex flex-col gap-3">
                                    <button
                                        className="w-full group text-white/70 text-sm font-semibold py-4 px-5 rounded-2xl transition-all hover:bg-white/5 hover:text-white flex items-center justify-center border border-transparent hover:border-white/10"
                                        onClick={() => {
                                            setIsMenuOpen(false);
                                            navigate("/account");
                                        }}
                                    >
                                        Manage Account
                                    </button>
                                    <button
                                        className="w-full text-white/60 text-sm font-bold py-4 rounded-2xl transition-all bg-white/5 hover:bg-white/10 hover:text-white border border-white/5 hover:border-white/10 active:scale-[0.98]"
                                        onClick={() => {
                                            setIsMenuOpen(false);
                                            logout();
                                        }}
                                    >
                                        Log Out
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    <Button
                                        title="Log In"
                                        icon="LogIn"
                                        navigateTo="/login"
                                        variant="small-outline"
                                        fullWidth
                                    />
                                    <Button
                                        title="Create Account"
                                        icon="UserPlus"
                                        navigateTo="/create-account"
                                        variant="small"
                                        fullWidth
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Header;