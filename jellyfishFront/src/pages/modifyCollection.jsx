import returnIcon from '../assets/return.png';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function ModifyCollection() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    collectionName: '',
    description: '',
    image: null,
    imagePreview: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({
          ...formData,
          image: file,
          imagePreview: event.target?.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Modify Collection:', formData);
    // TODO: Submit to API
    navigate(-1);
  };

  return (
    <div className="bg-blue-950 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500 to-fuchsia-500 p-[2px] rounded-b-3xl">
        <div className="w-full bg-[#0a1930] py-12 px-6 text-white relative rounded-b-3xl">
          <button 
            onClick={() => navigate(-1)}
            className="absolute top-6 left-6 bg-gradient-to-br from-cyan-500/30 to-fuchsia-500/30 border border-cyan-500/40 rounded-lg p-3 hover:scale-105 transition-transform"
          >
            <img src={returnIcon} className="w-5 h-5" alt="return" />
          </button>
          <div className="flex flex-col items-center gap-6">
            <h1 className="text-5xl font-bold text-white">Modify collection</h1>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] p-6">
        <div className="w-full max-w-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload Area */}
            <div
              onClick={handleImageClick}
              className="relative bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-2 border-cyan-500/40 rounded-3xl h-64 flex items-center justify-center cursor-pointer hover:border-cyan-500/60 transition-all group overflow-hidden"
            >
              {formData.imagePreview ? (
                <>
                  <img
                    src={formData.imagePreview}
                    alt="Collection preview"
                    className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-5xl font-bold text-white">+</span>
                  </div>
                </>
              ) : (
                <span className="text-6xl font-extrabold text-white/60 group-hover:text-white transition-colors">+</span>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

            {/* Collection Name */}
            <div className="flex items-center gap-3">
              <i className='bx bx-collection text-cyan-400 text-xl'></i>
              <input
                type="text"
                name="collectionName"
                placeholder="Collection Name"
                value={formData.collectionName}
                onChange={handleInputChange}
                className="w-full bg-transparent border border-cyan-500/40 rounded-full px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            {/* Description */}
            <div className="flex gap-3">
              <i className='bx bx-message-square-detail text-cyan-400 text-xl mt-3'></i>
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className="w-full bg-transparent border border-cyan-500/40 rounded-3xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
              />
            </div>

            {/* Create Button */}
            <button
              type="submit"
              className="w-full mt-8 bg-gradient-to-r from-blue-500 to-fuchsia-500 text-white font-bold py-3 rounded-full hover:shadow-lg hover:shadow-cyan-500/50 transition-all transform hover:scale-105"
            >
              Create
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ModifyCollection;
