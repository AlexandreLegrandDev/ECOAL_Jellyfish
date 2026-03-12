import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header.jsx';
import BackgroundAnimation from "../components/background-animation.jsx";
import Button from "../components/button.jsx";
import Waves from "../components/waves.jsx"
import Video from "../components/Video.jsx";

const Home = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRandomCollections = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/random');
        if (response.ok) {
          const data = await response.json();
          setCollections(data);
        }
      } catch (error) {
        console.error("Failed to fetch collections:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRandomCollections();
  }, []);

  return (
    <>
    <Video/>
    <BackgroundAnimation>
      <div className="px-4 pt-6">
        <Header />

        <div
          className="relative z-10 flex flex-col items-center justify-center flex-1 px-5 text-center py-7">
          <h1 className="text-4xl font-extrabold leading-tight md:text-6xl mb-10 max-w-[90%] drop-shadow-lg">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-blue to-accent-purple drop-shadow-[0_0_15px_rgba(28,95,209,0.5)]">Jelly Deep</span>
          </h1>
        </div>

        <section className="relative flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-center md:text-3xl mb-10 drop-shadow-md">Public Collections</h2>

          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12 max-w-[500px] md:max-w-[800px] mx-auto min-h-[180px]">
            {loading ? (
              <p className="col-span-2 md:col-span-4 text-center text-white/50">Loading collections...</p>
            ) : collections.length > 0 ? (
              collections.map((collection) => {
                const imageUrl = collection.img && collection.img.startsWith('http') 
                  ? collection.img 
                  : `http://localhost:8000/storage/${collection.img}`;

                return (
                  <Link to={`/collection` /* You can change this to point to the actual collection ID view if it exists later */} key={collection.id}
                    className="flex flex-col overflow-hidden transition-all duration-300 border rounded-3xl glass border-white/20 hover:-translate-y-2 hover:border-accent-purple hover:shadow-[0_0_20px_rgba(174,48,208,0.3)] group cursor-pointer bg-black/20 backdrop-blur-sm">
                    <div className="overflow-hidden aspect-square">
                      <img
                        src={imageUrl}
                        alt={collection.name}
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          e.target.onerror = null; 
                          e.target.src = "https://images.unsplash.com/photo-1543722530-d2c3201371e7?w=500&q=80"; // Beautiful fallback jellyfish
                        }}
                      />
                    </div>
                    <div className="p-4 text-center bg-white/5">
                      <span className="text-base font-medium text-white/90 drop-shadow-sm">{collection.name}</span>
                    </div>
                  </Link>
                );
              })
            ) : (
                <p className="col-span-2 md:col-span-4 text-center text-white/50">No collections available.</p>
            )}
          </div>

          <Button
            title="See more"
            navigateTo="/collection"
          />

        </section>
      </div>
      <Waves/>
    </BackgroundAnimation>
    </>
  );
};

export default Home;