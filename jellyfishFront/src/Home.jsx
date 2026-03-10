import React from 'react';
import Header from './Header';
import heroImage from './assets/images/hero_jellyfish.png';
import cardImage from './assets/images/moon_jellyfish_card.png';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section
        className="relative flex flex-col h-[85vh] min-h-[500px] max-h-[800px] bg-center bg-cover rounded-b-[40px] shadow-2xl overflow-hidden mb-5"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-bg-dark/40 to-bg-dark/90"></div>

        <Header />

        <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-5 text-center">
          <h1 className="text-4xl font-extrabold leading-tight md:text-6xl mb-10 max-w-[90%]">
            Welcome in <span>Name</span>
          </h1>


        </div>
      </section>

      {/* Public Collections Section */}
      <section className="relative px-5 py-10 pb-24 md:px-10">
        <h2 className="text-2xl font-bold text-center md:text-3xl mb-10">Public Collections</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12 max-w-[500px] md:max-w-[800px] mx-auto">
          {[1, 2].map((i) => (
            <div key={i} className="flex flex-col overflow-hidden transition-all duration-300 border rounded-3xl glass border-white/20 hover:-translate-y-2 hover:border-accent-purple hover:shadow-xl group">
              <div className="overflow-hidden aspect-square">
                <img
                  src={cardImage}
                  alt="Moon Jellyfish"
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-4 text-center bg-white/5">
                <span className="text-base font-medium text-white/90">Moon jellyfish</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mb-16">
          <button className="px-12 py-4 text-lg font-bold text-white transition-all rounded-full bg-gradient-to-r from-accent-blue to-accent-purple shadow-[0_10px_25px_rgba(28,95,209,0.3)] hover:scale-105 hover:shadow-[0_15px_30px_rgba(174,48,208,0.4)]">
            See more
          </button>
        </div>

        {/* Wave Decoration */}
        <div className="absolute bottom-0 left-0 w-full leading-[0] pointer-events-none">
          <svg className="w-full h-20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#ffffff10" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>
    </div>
  );
};

export default Home;
