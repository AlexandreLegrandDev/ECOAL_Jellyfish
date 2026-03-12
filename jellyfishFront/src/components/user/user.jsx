import returnIcon from '../../assets/return.png';
import { useRef } from "react"; // Ajout de useRef
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

function User() {
  const containerRef = useRef(); // Référence pour le parent
  const wrapRef = useRef();      // Référence pour l'élément qui défile

  useGSAP(() => {
    const wrap = wrapRef.current;
    
    // Calcul de la distance de défilement : 
    // (Largeur totale du contenu) - (Largeur de la fenêtre)
    const scrollAmount = wrap.scrollWidth - window.innerWidth;

    gsap.to(wrap, {
      x: -scrollAmount,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current, // On déclenche sur le container parent
        start: "top top",
        end: `+=${scrollAmount}`, // Durée du scroll proportionnelle à la largeur
        pin: true,                // Bloque l'écran pendant le scroll
        scrub: 1,                 // Transition fluide avec le scroll
        markers: false,           // Active à true pour déboguer
      }
    });
  }, { scope: containerRef }); // Scope pour limiter les sélecteurs

  return (
    <div ref={containerRef} className="bg-blue-950 min-h-screen overflow-x-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500 to-fuchsia-500 p-[2px] rounded-b-3xl">
        <div className="w-full bg-[#0a1930] py-12 px-6 text-white relative rounded-b-3xl">
          <button className="absolute top-6 left-6 bg-gradient-to-br from-cyan-500/30 to-fuchsia-500/30 border border-cyan-500/40 rounded-lg p-3 hover:scale-105 transition-transform">
            <img src={returnIcon} className="w-5 h-5" alt="return" />
          </button>
          <div className="flex flex-col items-center gap-6">
            <div className="w-32 h-32 rounded-full flex overflow-hidden border-2 border-cyan-500 items-center justify-center">
              <i className='bx bx-user text-5xl text-white'></i>
            </div>
            <h1 className="text-5xl font-bold text-white">Medusa</h1>
          </div>
        </div>
      </div>

      {/* Section Scroll Horizontal */}
      <div className="py-24 px-6">
        <h1 className="text-4xl font-bold text-center text-white mb-12">Your collections</h1>
        
        {/* Le conteneur qui va bouger vers la gauche */}
        <div ref={wrapRef} className="flex gap-6 flex-nowrap w-max">
          
          <div className="box1 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 rounded-2xl h-64 w-80 flex items-center justify-center cursor-pointer hover:border-cyan-500/60 transition-all">
            <span className="text-9xl font-extrabold text-white">+</span>
          </div>

          <div className="box2 relative bg-gray-800 rounded-2xl h-64 w-80 overflow-hidden group">
            <img src="https://images.unsplash.com/photo-1583087045092-8424281e0e45?w=400&h=300&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt="Moon jellyfish" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
              <p className="text-white text-xl font-semibold p-4">Moon jellyfish 1</p>
            </div>
          </div>

          <div className="box3 relative bg-gray-800 rounded-2xl h-64 w-80 overflow-hidden group">
            <img src="https://images.unsplash.com/photo-1583087045092-8424281e0e45?w=400&h=300&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt="Moon jellyfish" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
              <p className="text-white text-xl font-semibold p-4">Moon jellyfish 2</p>
            </div>
          </div>

          <div className="box4 relative bg-gray-800 rounded-2xl h-64 w-80 overflow-hidden group">
            <img src="https://images.unsplash.com/photo-1583087045092-8424281e0e45?w=400&h=300&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt="Moon jellyfish" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
              <p className="text-white text-xl font-semibold p-4">Moon jellyfish 3</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default User;