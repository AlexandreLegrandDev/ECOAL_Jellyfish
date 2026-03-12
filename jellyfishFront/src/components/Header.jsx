import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import {ArrowLeft, Menu, X} from "lucide-react";
import Button from "./button.jsx";
import { useAuth } from "../contexts/auth-context.jsx";

const Header = ({title, returnTo = "/"}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { token, logout } = useAuth();
    const isLoggedIn = !!token;

    const location = useLocation();
    const navigate = useNavigate();

    /*useEffect(() => {
        console.log("Rota atual:", location.pathname);
    }, [location.pathname]);*/

    return (
        <div className="relative">
            <div className="relative w-full h-16 flex flex-row justify-between items-center p-4 rounded-full border border-gradient">
                <div className="absolute inset-0 bg-black opacity-50 rounded-full" />

                {location.pathname === "/" ? (
                    <img
                        src="/jelly.svg"
                        alt="Jellyfish Logo"
                        className="relative z-10 object-contain w-8 h-8"
                    />
                ) : (
                    <ArrowLeft
                        size={32}
                        color="white"
                        className="relative z-10"
                        onClick={() => navigate(`${returnTo}`)}
                    />
                )}

                {title && (
                    <p className="relative z-10 w-full text-center text-white">{title}</p>
                )}

                {isMenuOpen ? (
                    <X
                        size={32}
                        color="white"
                        className="relative z-10 cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsMenuOpen(false);
                        }}
                    />
                ) : (
                    <Menu
                        size={32}
                        color="white"
                        className="relative z-10 cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsMenuOpen(true);
                        }}
                    />
                )}
            </div>

            {isMenuOpen && (
                <div className="absolute top-20 right-0 w-48 rounded-2xl p-3 flex flex-col gap-2 z-50"
                     style={{ background: 'rgba(0, 0, 20, 0.85)', border: '1px solid rgba(0, 129, 253, 0.4)', backdropFilter: 'blur(10px)' }}
                >
                    {isLoggedIn ? (
                        <>
                            <button
                                className="w-full text-white text-sm py-2 px-4 rounded-full transition-opacity hover:opacity-80"
                                style={{ border: '1px solid rgba(0, 129, 253, 0.6)', background: 'transparent' }}
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    navigate("/account");
                                }}
                            >
                                Account
                            </button>
                            <button
                                className="w-full text-white text-sm py-2 px-4 rounded-full transition-opacity hover:opacity-80"
                                style={{ background: 'linear-gradient(to right, #a855f7, #0081FD)' }}
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    logout();
                                }}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Button
                                title="Login"
                                icon="LogIn"
                                navigateTo="/login"
                                variant="small-outline"
                                fullWidth
                            />

                            <Button
                                title="Create account"
                                icon="UserPlus"
                                navigateTo="/create-account"
                                variant="small"
                                fullWidth
                            />
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default Header;