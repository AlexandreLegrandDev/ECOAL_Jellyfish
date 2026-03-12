import { useState } from "react";
import animation from "../assets/animation.mp4";
import "./video.css";

function Video() {
    const [showIntro, setShowIntro] = useState(true);

    if (!showIntro) return null;

    // fade-out via CSS
    const handleEnded = () => {
        const intro = document.getElementById("intro");
        intro.style.opacity = 0; // déclenche le fade
        setTimeout(() => setShowIntro(false), 800); // après la transition, on cache la div
    };

    return (
        <div id="intro">
            <video
                autoPlay
                muted
                playsInline
                onEnded={handleEnded}
            >
                <source src={animation} type="video/mp4" />
            </video>
        </div>
    );
}

export default Video;