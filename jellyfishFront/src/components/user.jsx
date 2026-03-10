import returnIcon from '../assets/return.png';

function User() {
  return (
    <>
      <body className="bg-blue-950">
        <div className="bg-gradient-to-r from-cyan-500 to-fuchsia-500 p-[2px] rounded-b-3xl">
          <div className="w-full bg-[#0a1930] py-12 px-6 text-white relative rounded-b-3xl">
            <button className="absolute top-6 left-6 bg-gradient-to-br from-cyan-500/30 to-fuchsia-500/30 border border-cyan-500/40 rounded-lg p-3 hover:scale-105 transition-transform">
              <img src={returnIcon} className="w-5 h-5" />
            </button>

            {/* Profile section - centered */}
            <div className="flex flex-col items-center gap-6">
              {/* Profile image */}
              <div className="w-32 h-32 rounded-full flex overflow-hidden">
                <i className='bx bx-user text-5xl text-white'></i>
              </div>

              {/* Profile name */}
              <h1 className="text-5xl font-bold text-white">Medusa</h1>
            </div>
          </div>
        </div>

        {/* Your collections section */}
        <div className="py-12 px-6">
          <h1 className="text-4xl font-bold text-center text-white mb-8">Your collections</h1>
          
          <div className="flex gap-6">
            {/* Add new collection card */}
            <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 rounded-2xl h-64 flex items-center justify-center cursor-pointer hover:border-cyan-500/60 transition-all">
              <span className="text-6xl text-white font-light">+</span>
            </div>

            {/* Example collection card */}
            <div className="relative bg-gray-800 rounded-2xl h-64 overflow-hidden group">
              {/* Background image */}
              <img 
                src="https://images.unsplash.com/photo-1583087045092-8424281e0e45?w=400&h=300&fit=crop" 
                alt="Moon jellyfish" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
                <p className="text-white text-xl font-semibold p-4">Moon jellyfish</p>
              </div>
            </div>
          </div>
        </div>
      </body>
    </>
  );
}

export default User;