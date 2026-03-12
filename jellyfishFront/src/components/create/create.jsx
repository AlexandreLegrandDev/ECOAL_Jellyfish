import returnIcon from '../../assets/return.png';
import { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

function Form() {
  const containerRef = useRef();
  const wrapRef = useRef();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    size: '',
    deep: '',
    color: '',
    danger: 0,
    diameter: '',
    light: false,
    description: ''
  });

  useGSAP(() => {
    const wrap = wrapRef.current;
    const scrollAmount = wrap.scrollWidth - window.innerWidth;

    gsap.to(wrap, {
      x: -scrollAmount,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: `+=${scrollAmount}`,
        pin: true,
        scrub: 1,
        markers: false,
      }
    });
  }, { scope: containerRef });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCheckboxChange = (e) => {
    const { checked } = e.target;
    setFormData({
      ...formData,
      light: checked
    });
  };

  const handleDangerChange = (level) => {
    setFormData({
      ...formData,
      danger: level
    });
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    console.log('New Jellyfish:', formData);
    // Reset form and close modal
    setFormData({
      size: '',
      deep: '',
      color: '',
      danger: 0,
      diameter: '',
      light: false,
      description: ''
    });
    setShowCreateModal(false);
  };

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
          
          <div 
            onClick={() => setShowCreateModal(true)}
            className="box1 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 rounded-2xl h-64 w-80 flex items-center justify-center cursor-pointer hover:border-cyan-500/60 transition-all"
          >
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

      {/* Create Jellyfish Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-blue-900 to-blue-950 rounded-3xl p-8 w-full max-w-md border border-cyan-500/30">
            {/* Close button */}
            <button 
              onClick={() => setShowCreateModal(false)}
              className="float-right text-white text-2xl hover:text-cyan-400 transition-colors"
            >
              ✕
            </button>

            <div className="mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl font-bold text-white">+</span>
              </div>
              <h2 className="text-2xl font-bold text-white text-center">Create new jelly</h2>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              {/* Size */}
              <div className="flex items-center gap-3">
                <i className='bx bx-expand text-cyan-400 text-xl'></i>
                <input
                  type="text"
                  name="size"
                  placeholder="Size"
                  value={formData.size}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border border-cyan-500/40 rounded-full px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              {/* Deep */}
              <div className="flex items-center gap-3">
                <i className='bx bx-down-arrow text-cyan-400 text-xl'></i>
                <input
                  type="text"
                  name="deep"
                  placeholder="Deep"
                  value={formData.deep}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border border-cyan-500/40 rounded-full px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              {/* Color */}
              <div className="flex items-center gap-3">
                <i className='bx bx-palette text-cyan-400 text-xl'></i>
                <input
                  type="text"
                  name="color"
                  placeholder="Color"
                  value={formData.color}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border border-cyan-500/40 rounded-full px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              {/* Danger */}
              <div className="flex items-center gap-3">
                <i className='bx bx-radiation text-cyan-400 text-xl'></i>
                <div className="flex gap-2 flex-wrap">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => handleDangerChange(level)}
                      className={`w-6 h-6 rounded-full border-2 transition-all ${
                        formData.danger >= level 
                          ? 'border-cyan-500 bg-cyan-500/20' 
                          : 'border-gray-600 bg-transparent'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Diameter */}
              <div className="flex items-center gap-3">
                <i className='bx bx-circle text-cyan-400 text-xl'></i>
                <input
                  type="text"
                  name="diameter"
                  placeholder="Diameter"
                  value={formData.diameter}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border border-cyan-500/40 rounded-full px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              {/* Light */}
              <div className="flex items-center gap-3">
                <i className='bx bx-bulb text-cyan-400 text-xl'></i>
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-gray-300">Light</span>
                  <button
                    type="button"
                    onClick={() => handleCheckboxChange({ target: { checked: !formData.light } })}
                    className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${
                      formData.light 
                        ? 'border-cyan-500 bg-cyan-500' 
                        : 'border-gray-600 bg-transparent'
                    }`}
                  >
                    {formData.light && <span className="text-white text-sm">✓</span>}
                  </button>
                  <span className="text-gray-300">
                    {formData.light ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="flex gap-3">
                <i className='bx bx-message-square-detail text-cyan-400 text-xl mt-2'></i>
                <textarea
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full bg-transparent border border-cyan-500/40 rounded-2xl px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                />
              </div>

              {/* Create Button */}
              <button
                type="submit"
                className="w-full mt-6 bg-gradient-to-r from-blue-500 to-fuchsia-500 text-white font-bold py-3 rounded-full hover:shadow-lg hover:shadow-cyan-500/50 transition-all transform hover:scale-105"
              >
                Create
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Form;