"use client";
import React, { useState } from 'react';

export default function ListingForm() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [detectedItems, setDetectedItems] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({ title: '', category: '' });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const body = new FormData();
    body.append('image', file);

    try {
    //   const res = await fetch('http://127.0.0.1:5000/api/analyze', {
    //     method: 'POST',
    //     body,
    //   });
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';
        const res = await fetch(`${apiUrl}/api/analyze`, {
        method: 'POST',
        body,
        });
      const rawText = await res.text();
      if (!res.ok) throw new Error(`Server responded with status: ${res.status}`);

      const data = JSON.parse(rawText);

      if (data.image_data) {
        setImage(data.image_data);
        // Save the array of all detected items
        setDetectedItems(data.all_categories || [data.category]);
        setFormData({
          title: data.title,
          category: data.category
        });
      }
    } catch (err) {
      console.error("AI Analysis failed", err);
      alert("AI failed to recognize item. Please enter manually.");
    } finally {
      setLoading(false);
    }
  };

  // Handle dropdown changes
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    setFormData({
      category: newCategory,
      title: `Japanese-Style ${newCategory.charAt(0).toUpperCase() + newCategory.slice(1)}`
    });
  };

  // The Publish Action
  const handlePublish = () => {
    setPublishing(true);
    
    // Simulate a 1.5 second network request to a database
    setTimeout(() => {
      alert(`✅ Successfully posted "${formData.title}" to Tsunagu!`);
      
      // Reset the form for the next item
      setPublishing(false);
      setImage(null);
      setFormData({ title: '', category: '' });
      setDetectedItems([]);
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-2xl shadow-slate-200/50 rounded-3xl overflow-hidden border border-slate-100">
      <div className="grid grid-cols-1 md:grid-cols-2">
        
        {/* Left Side: Image Upload & Preview */}
        <div className="bg-slate-50 flex flex-col justify-center items-center border-b md:border-b-0 md:border-r border-slate-200">
          <div className="w-full h-full min-h-[400px] relative flex flex-col items-center justify-center bg-white hover:bg-slate-50 transition-colors duration-200 group overflow-hidden">
            
            {image ? (
              // NEW: Premium Studio Grid to show off the transparent background
              <div 
                className="absolute inset-0 w-full h-full flex items-center justify-center p-8 z-10"
                style={{
                  backgroundImage: "radial-gradient(#cbd5e1 2px, transparent 2px)",
                  backgroundSize: "24px 24px"
                }}
              >
                <img 
                  src={image} 
                  alt="Detected object" 
                  className="w-full h-full object-contain drop-shadow-2xl" 
                />
              </div>
            ) : (
              <div className="text-center p-6 z-10">
                {loading ? (
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                    <p className="text-indigo-600 font-medium animate-pulse">AI is isolating subject...</p>
                  </div>
                ) : (
                  <>
                    <svg className="mx-auto h-12 w-12 text-slate-400 group-hover:text-indigo-500 transition-colors mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-slate-600 font-medium mb-1">Click to upload photo</p>
                    <p className="text-slate-400 text-sm">PNG, JPG up to 5MB</p>
                  </>
                )}
                <input type="file" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" disabled={loading || publishing} />
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Form Details */}
        <div className="p-8 md:p-10 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Listing Details</h2>
            <p className="text-slate-500 text-sm mt-1">Review your AI-generated tags before posting.</p>
          </div>

          <div className="space-y-6">
            <div className="relative">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Listing Title</label>
              <input 
                type="text" 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-800 font-medium"
              />
            </div>

            {/* Dynamic Category Dropdown */}
            <div className="relative">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Category</label>
              <div className="relative">
                {detectedItems.length > 1 ? (
                  <select 
                    value={formData.category}
                    onChange={handleCategoryChange}
                    className="w-full px-4 py-3 appearance-none bg-white border border-indigo-300 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm"
                  >
                    {detectedItems.map((item, idx) => (
                      <option key={idx} value={item}>{item}</option>
                    ))}
                  </select>
                ) : (
                  <input 
                    type="text" 
                    value={formData.category}
                    className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-600 font-medium cursor-not-allowed"
                    readOnly
                  />
                )}
                
                {formData.category && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md text-xs font-bold pointer-events-none">
                    <span className="mr-1">✨</span> AI Verified
                  </div>
                )}
              </div>
            </div>

            {/* Action Button */}
            <button 
              onClick={handlePublish}
              className={`w-full mt-4 py-3.5 rounded-xl font-semibold text-white shadow-lg transition-all flex justify-center items-center ${
                formData.title && !publishing ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 hover:-translate-y-0.5' : 'bg-slate-400 cursor-not-allowed shadow-none'
              }`}
              disabled={!formData.title || publishing}
            >
              {publishing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Publishing...
                </>
              ) : 'Publish to Tsunagu'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
