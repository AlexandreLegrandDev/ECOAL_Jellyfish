import {useEffect, useRef} from "react";

function BackgroundAnimation({children}) {
    const videoRef = useRef(null)

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = 0.4
        }
    }, [])

    return (
        <div className="relative w-full min-h-dvh overflow-hidden">
            <video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full object-cover z-0"
            >
                <source src="/background-animation.mp4" type="video/mp4"/>
            </video>

            <div className="relative z-10 w-full min-h-dvh flex flex-col p-4 gap-12 overflow-y-auto bg-black/50">
                {children}
            </div>
        </div>
    )
}

export default BackgroundAnimation
