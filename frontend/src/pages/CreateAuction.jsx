import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { PlusCircle, Image as ImageIcon, Calendar, DollarSign, Tag, Info, Truck, Upload } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const CreateAuction = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Art',
    startingBid: '',
    increment: '10',
    startTime: '',
    endTime: '',
    deliveryDetails: ''
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (image) data.append('image', image);

    try {
      const config = { 
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        } 
      };
      const res = await axios.post('http://localhost:5000/api/auctions', data, config);
      toast.success('Auction created successfully!');
      navigate(`/auction/${res.data.data._id}`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create auction';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold mb-2">Create New Auction</h1>
        <p className="text-slate-400">List your premium asset with high-quality images.</p>
      </div>

      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Basic Info */}
        <div className="glass-card p-8 space-y-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-sky-400" /> Item Details
          </h3>
          
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Title</label>
            <input 
              name="title" required onChange={onChange}
              className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 px-4 focus:outline-none text-white"
              placeholder="e.g. 1964 Vintage Rolex Daytona"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Category</label>
            <select 
              name="category" onChange={onChange}
              className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 px-4 focus:outline-none text-white scheme-dark"
            >
              <option value="Art" className="bg-slate-900">Art</option>
              <option value="Electronics" className="bg-slate-900">Electronics</option>
              <option value="Collectibles" className="bg-slate-900">Collectibles</option>
              <option value="Real Estate" className="bg-slate-900">Real Estate</option>
              <option value="Vehicles" className="bg-slate-900">Vehicles</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Description</label>
            <textarea 
              name="description" required onChange={onChange} rows="4"
              className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 px-4 focus:outline-none text-white"
              placeholder="Tell the story of this item..."
            />
          </div>
        </div>

        {/* Pricing & Time */}
        <div className="glass-card p-8 space-y-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-400" /> Bidding Rules
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Starting Bid ($)</label>
              <input 
                name="startingBid" type="number" required onChange={onChange}
                className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 px-4 focus:outline-none text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Min Increment ($)</label>
              <input 
                name="increment" type="number" required onChange={onChange}
                className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 px-4 focus:outline-none text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Start Time</label>
            <input 
              name="startTime" type="datetime-local" required onChange={onChange}
              className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 px-4 focus:outline-none text-white scheme-dark"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">End Time</label>
            <input 
              name="endTime" type="datetime-local" required onChange={onChange}
              className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 px-4 focus:outline-none text-white scheme-dark"
            />
          </div>
        </div>

        {/* Shipping & Visuals */}
        <div className="md:col-span-2 glass-card p-8 space-y-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5 text-orange-400" /> Image Upload
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
               <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:border-sky-500/50 transition-colors cursor-pointer relative group">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <ImageIcon className="w-10 h-10 text-slate-500 mx-auto mb-4 group-hover:text-sky-400" />
                  <p className="text-sm text-slate-400">Click or drag image to upload</p>
                  <p className="text-[10px] text-slate-600 mt-2">JPG, PNG, WebP up to 5MB</p>
               </div>
               
               <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Delivery Details</label>
                  <input 
                    name="deliveryDetails" onChange={onChange}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 px-4 focus:outline-none text-white"
                    placeholder="Ships worldwide from London via FedEx"
                  />
                </div>
            </div>

            <div className="h-full flex items-center justify-center bg-slate-900/50 rounded-2xl border border-white/5 overflow-hidden">
               {preview ? (
                 <img src={preview} alt="Preview" className="w-full h-full object-contain" />
               ) : (
                 <p className="text-slate-600 text-sm italic">Image preview will appear here</p>
               )}
            </div>
          </div>
        </div>

        <div className="md:col-span-2 flex justify-center">
          <button 
            disabled={loading}
            className="bg-sky-600 hover:bg-sky-500 px-12 py-4 rounded-xl font-bold text-lg transition-all shadow-xl shadow-sky-900/40 flex items-center gap-3 disabled:opacity-50"
          >
            {loading ? 'Publishing...' : 'Launch Auction'}
            <PlusCircle className="w-6 h-6" />
          </button>
        </div>
        {error && <p className="md:col-span-2 text-center text-red-400">{error}</p>}
      </form>
    </div>
  );
};

export default CreateAuction;
