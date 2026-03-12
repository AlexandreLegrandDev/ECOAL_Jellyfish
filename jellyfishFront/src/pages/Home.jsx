import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header.jsx';
import cardImage from '../assets/images/moon_jellyfish_card.png';
import BackgroundAnimation from "../components/background-animation.jsx";
import Button from "../components/button.jsx";
import Waves from "../components/waves";
import Video from "../components/Video.jsx";

const Home = () => {
  return (
    <>
    <Video/>
    <BackgroundAnimation>
      <div className="px-4 pt-6">
        <Header />

        <div
          className="relative z-10 flex flex-col items-center justify-center flex-1 px-5 text-center py-7">
          <h1 className="text-4xl font-extrabold leading-tight md:text-6xl mb-10 max-w-[90%]">
            Welcome to <span>Jelly Deep</span>
          </h1>
        </div>

        <section className="relative flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-center md:text-3xl mb-10">Public Collections</h2>

          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12 max-w-[500px] md:max-w-[800px] mx-auto">
            {[1, 2].map((i) => (
              <div key={i}
                className="flex flex-col overflow-hidden transition-all duration-300 border rounded-3xl glass border-white/20 hover:-translate-y-2 hover:border-accent-purple hover:shadow-xl group">
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