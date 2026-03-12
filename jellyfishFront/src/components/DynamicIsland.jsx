import React, { useEffect, useState } from "react";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

const TYPES = {
    success: {
        color: "text-green-400",
        icon: <CheckCircle2 size={20} className="text-green-400" />,
        label: "Success",
        border: "border-green-500/30"
    },
    error: {
        color: "text-red-400",
        icon: <XCircle size={20} className="text-red-400" />,
        label: "Error",
        border: "border-red-500/30"
    },
    alert: {
        color: "text-yellow-400",
        icon: <AlertCircle size={20} className="text-yellow-400" />,
        label: "Alert",
        border: "border-yellow-500/30"
    }
};

const DynamicIsland = ({ notification }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        if (notification) {
            setIsVisible(true);
            // Small delay before expanding
            const timer = setTimeout(() => setIsExpanded(true), 100);
            return () => clearTimeout(timer);
        } else {
            setIsExpanded(false);
            const timer = setTimeout(() => setIsVisible(false), 300);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    if (!isVisible) return null;

    const type = TYPES[notification?.type] || TYPES.success;

    return (
        <div className="fixed top-4 left-0 right-0 z-[100] flex justify-center pointer-events-none">
            <div 
                className={`
                    pointer-events-auto
                    bg-black/90 backdrop-blur-xl border ${type.border}
                    flex items-center gap-3 px-4
                    transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
                    shadow-[0_20px_40px_rgba(0,0,0,0.4)]
                    ${isExpanded ? "w-[280px] h-[52px] rounded-[24px]" : "w-[120px] h-[36px] rounded-[18px] opacity-0 scale-90 translate-y-[-10px]"}
                    overflow-hidden
                `}
            >
                {isExpanded && (
                    <>
                        <div className="animate-in fade-in zoom-in duration-500 flex items-center gap-3 w-full">
                            <div className="p-1 rounded-full bg-white/5">
                                {type.icon}
                            </div>
                            <div className="flex flex-col flex-1 min-w-0">
                                <span className={`text-[10px] font-bold uppercase tracking-widest ${type.color} leading-tight`}>
                                    {type.label}
                                </span>
                                <span className="text-white text-sm font-medium truncate leading-tight">
                                    {notification?.message}
                                </span>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default DynamicIsland;
