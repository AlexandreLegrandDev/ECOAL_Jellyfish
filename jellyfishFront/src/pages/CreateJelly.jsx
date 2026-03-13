import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/auth-context.jsx";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Check,
  Pencil,
  Ruler,
  ArrowDownFromLine,
  PaintBucket,
  TriangleAlert,
  Diameter,
  Lightbulb,
  TextWrap,
  LogOut
} from "lucide-react";

const API = "http://localhost:8000/api";

// Inline Jelly SVG component to allow for easy gradient styling
const JellyIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 2C7.58 2 4 5.58 4 10c0 1.66 1.34 3 3 3s3-1.34 3-3V8c0-1.1.9-2 2-2s2 .9 2 2v2c0 1.66 1.34 3 3 3s3-1.34 3-3c0-4.42-3.58-8-8-8z" />
    <path d="M7 13v6a2 2 0 0 0 4 0v-4" />
    <path d="M13 15v4a2 2 0 0 0 4 0v-6" />
    <path d="M10 13v8" />
    <path d="M14 13v8" />
  </svg>
);

const InputField = ({ icon = <JellyIcon className="w-5 h-5" />, label, type = "text", wrapperClass = "", ...props }) => {
  return (
    <div
      className={`relative flex items-center bg-[#0B0D28]/80 border border-accent-purple/50 rounded-full overflow-hidden px-4 py-3 mb-4 shadow-[0_0_10px_rgba(174,48,208,0.15)] focus-within:shadow-[0_0_15px_rgba(174,48,208,0.4)] focus-within:border-accent-purple transition-all ${wrapperClass}`}
    >
      <div className="mr-3 text-[#A855F7] opacity-80 shrink-0">
        {icon}
      </div>
      <input
        type={type}
        placeholder={label}
        className="bg-transparent border-none outline-none text-white placeholder-white/50 w-full text-sm"
        {...props}
      />
    </div>
  );
};

function CreateJelly() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [dangerLevel, setDangerLevel] = useState(0);
  const [isLightYes, setIsLightYes] = useState(true);

  // State for the user's collection ID
  const [collectionId, setCollectionId] = useState(null);

  // Form states
  const [imagePreview, setImagePreview] = useState(null);
  const [jellyName, setJellyName] = useState("");
  const [size, setSize] = useState("");
  const [deep, setDeep] = useState("");
  const [diameter, setDiameter] = useState("");

  useEffect(() => {
    // Fetch user collections to get an ID we can post to
    async function fetchCollection() {
      if (!user || !token) return;
      const currentUser = user?.data || user?.user || user;
      const userId = currentUser?.id;
      if (!userId) return;

      try {
        const res = await fetch(`${API}/user/${userId}/collection`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const collections = await res.json();
          if (collections.length > 0) {
            setCollectionId(collections[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to fetch collection", err);
      }
    }

    fetchCollection();
  }, [user, token]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreate = async () => {
    if (!collectionId) {
      alert("No collection found for this user. Create a collection first.");
      return;
    }

    const payload = {
      id_collection: collectionId,
      name: jellyName || "Custom Jelly",
      img: imagePreview || "https://images.unsplash.com/photo-1549558549-415fe4c37b60?auto=format&fit=crop&q=80&w=400",
      depth: parseInt(deep) || 1,
      criteria: {
        ...(size !== "" && { Size: parseFloat(size) }),
        ...(diameter !== "" && { Diameter: parseFloat(diameter) }),
        ...(dangerLevel > 0 && { Dangerosity: dangerLevel }),
        Bioluminescent: isLightYes ? 1 : 0,
      }
    };

    try {
      const res = await fetch(`${API}/jellyfish`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        navigate("/account");
      } else {
        console.error("Failed to create jellyfish:", data);
        alert("Failed to create jellyfish: " + (data.message || data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error creating jellyfish:", error);
      alert("Error creating jellyfish. Check console.");
    }
  };

  return (
    <div className="w-full min-h-screen bg-bg-dark text-white p-6 relative pb-10">
      <div className="flex items-center justify-center relative mb-8 mt-4">
        <button
          onClick={() => navigate("/account")}
          className="absolute left-0 text-white/80 hover:text-white transition-colors"
        >
          <ArrowLeft size={28} />
        </button>
        <h1 className="text-xl font-bold">Create new jelly</h1>
      </div>

      <div className="relative w-full aspect-square max-h-[250px] bg-[#292B57]/50 rounded-3xl border border-accent-purple/40 shadow-[0_0_20px_rgba(174,48,208,0.2)] flex items-center justify-center mb-8 cursor-pointer hover:bg-[#292B57]/70 transition-colors overflow-hidden">
        {imagePreview ? (
          <div className="relative w-full h-full">
            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            <button
              className="absolute bottom-4 right-4 w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/20 hover:bg-white/20 active:scale-95 transition-all text-white/80 hover:text-white"
            >
              <Pencil size={24} />
            </button>
          </div>
        ) : (
          <Plus
            size={80}
            className="text-white font-bold drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
            strokeWidth={2.5}
          />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>

      <div className="flex flex-col">
        <InputField
          icon={<TextWrap className="w-5 h-5" />}
          label="Nom de la jellyfish"
          value={jellyName}
          onChange={(e) => setJellyName(e.target.value)}
        />
        <InputField
          icon={<Ruler className="w-5 h-5" />}
          label="Size"
          value={size}
          onChange={(e) => setSize(e.target.value)}
        />
        <InputField
          icon={<ArrowDownFromLine className="w-5 h-5" />}
          label="Deep"
          value={deep}
          onChange={(e) => setDeep(e.target.value)}
        />

        <div className="relative flex items-center bg-[#0B0D28]/80 border border-accent-purple/50 rounded-full px-4 py-3 mb-4 shadow-[0_0_10px_rgba(174,48,208,0.15)]">
          <div className="mr-3 text-[#A855F7] opacity-80 shrink-0">
            <TriangleAlert className="w-5 h-5" />
          </div>
          <span className="text-white/50 text-sm mr-4">Danger</span>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((lvl) => (
              <div
                key={lvl}
                onClick={() => setDangerLevel(lvl)}
                className={`w-5 h-5 rounded-full border border-white cursor-pointer transition-colors ${
                  lvl <= dangerLevel
                    ? "bg-white shadow-[0_0_5px_rgba(255,255,255,0.8)]"
                    : "bg-transparent"
                }`}
              />
            ))}
          </div>
        </div>

        <InputField
          icon={<Diameter className="w-5 h-5" />}
          label="Diameter"
          value={diameter}
          onChange={(e) => setDiameter(e.target.value)}
        />

        <div className="relative flex items-center bg-[#0B0D28]/80 border border-accent-purple/50 rounded-full px-4 py-3 mb-4 shadow-[0_0_10px_rgba(174,48,208,0.15)] max-w-max pr-8">
          <div className="mr-3 text-[#A855F7] opacity-80 shrink-0">
            <Lightbulb className="w-5 h-5" />
          </div>
          <span className="text-white/50 text-sm mr-6">Light</span>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <div
                className={`w-5 h-5 rounded border border-accent-purple flex items-center justify-center transition-colors ${
                  isLightYes ? "bg-accent-purple/20" : "bg-transparent"
                }`}
                onClick={() => setIsLightYes(true)}
              >
                {isLightYes && <Check size={14} className="text-[#A855F7]" />}
              </div>
              <span className="text-sm text-white/80">Yes</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <div
                className={`w-5 h-5 rounded border border-accent-purple flex items-center justify-center transition-colors ${
                  !isLightYes ? "bg-accent-purple/20" : "bg-transparent"
                }`}
                onClick={() => setIsLightYes(false)}
              >
                {!isLightYes && <Check size={14} className="text-[#A855F7]" />}
              </div>
              <span className="text-sm text-white/80">No</span>
            </label>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleCreate}
            className="w-full py-4 text-lg font-bold text-white transition-all transition-transform rounded-full bg-gradient-to-r from-accent-blue to-accent-purple shadow-[0_10px_25px_rgba(28,95,209,0.3)] active:scale-95 active:shadow-none flex items-center justify-center gap-2"
          >
            <LogOut size={16} className="inline" />
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateJelly;