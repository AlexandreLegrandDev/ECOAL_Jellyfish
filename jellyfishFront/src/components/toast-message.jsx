const TYPES = {
    success: {
        bg: "bg-green-500",
        icon: (
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
        ),
    },
    error: {
        bg: "bg-red-500",
        icon: (
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        ),
    },
    alert: {
        bg: "bg-yellow-500",
        icon: (
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
        ),
    },
};

function Toast({ message, type = "error" }) {
    const { bg, icon } = TYPES[type];

    return (
        <div className={`fixed bottom-8 left-4 right-4 ${bg} text-white flex items-center gap-3 py-3 px-4 rounded-full shadow-lg z-50`}>
            {icon}
            <span className="font-medium">{message}</span>
        </div>
    );
}

export default Toast;