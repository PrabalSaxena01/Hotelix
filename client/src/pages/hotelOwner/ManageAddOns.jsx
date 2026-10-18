import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAppContext } from '../../context/AppContext';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Sparkles, 
  X, 
  Check, 
  Car, 
  Utensils, 
  Heart, 
  Image as ImageIcon,
  DollarSign
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const ManageAddOns = () => {
  const { currency, getToken } = useAppContext();
  const [addons, setAddons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal & form states
  const [showModal, setShowModal] = useState(false);
  const [editingAddon, setEditingAddon] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    priceType: 'per_stay',
    category: 'general',
    image: '',
    isAvailable: true
  });

  useEffect(() => {
    fetchAddOns();
  }, []);

  const getAuthHeader = async () => {
    try {
      const token = await getToken();
      return token ? { Authorization: `Bearer ${token}` } : {};
    } catch {
      return {};
    }
  };

  const fetchAddOns = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/addons');
      if (res.data?.success && res.data.addons) {
        setAddons(res.data.addons);
      }
    } catch (err) {
      toast.error("Failed to load add-ons: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async (addon) => {
    try {
      const headers = await getAuthHeader();
      const res = await axios.patch(`/api/addons/${addon.id}/toggle`, {}, { headers });
      if (res.data?.success) {
        toast.success(res.data.message);
        setAddons(prev => prev.map(item => item.id === addon.id ? { ...item, isAvailable: !item.isAvailable } : item));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const handleDeleteAddon = async (addonId, addonName) => {
    if (!window.confirm(`Delete add-on '${addonName}'?`)) return;

    try {
      const headers = await getAuthHeader();
      const res = await axios.delete(`/api/addons/${addonId}`, { headers });
      if (res.data?.success) {
        toast.success("Add-on removed");
        setAddons(prev => prev.filter(a => a.id !== addonId));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const handleOpenCreate = () => {
    setEditingAddon(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      priceType: 'per_stay',
      category: 'general',
      image: '',
      isAvailable: true
    });
    setShowModal(true);
  };

  const handleOpenEdit = (addon) => {
    setEditingAddon(addon);
    setFormData({
      name: addon.name,
      description: addon.description || '',
      price: addon.price,
      priceType: addon.priceType || 'per_stay',
      category: addon.category || 'general',
      image: addon.image || '',
      isAvailable: addon.isAvailable !== false
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || formData.price === '') {
      return toast.error("Name and price are required");
    }

    try {
      const headers = await getAuthHeader();
      if (editingAddon) {
        const res = await axios.put(`/api/addons/${editingAddon.id}`, formData, { headers });
        if (res.data?.success) {
          toast.success("Add-on updated successfully");
        }
      } else {
        const res = await axios.post('/api/addons', formData, { headers });
        if (res.data?.success) {
          toast.success("New add-on created successfully");
        }
      }
      setShowModal(false);
      fetchAddOns();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-16">
      {/* Page Title & Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-playfair">Manage Guest Add-Ons & Experiences</h1>
          <p className="text-sm text-gray-500 mt-1">
            Configure bookable upgrades including airport transfers, champagne arrivals, spa passes, and rooftop dining.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Add-On</span>
        </button>
      </div>

      {/* Add-Ons List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm">Loading add-ons...</p>
        </div>
      ) : addons.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300 p-8">
          <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-gray-800">No add-ons created yet</h3>
          <p className="text-sm text-gray-500 mt-1 mb-4">Enhance guest reservation revenue with customized experiential add-ons.</p>
          <button
            onClick={handleOpenCreate}
            className="px-5 py-2.5 bg-blue-600 text-white text-xs font-medium rounded-xl hover:bg-blue-700 shadow-sm cursor-pointer"
          >
            Create First Add-On
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {addons.map((addon) => (
            <div
              key={addon.id}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 w-full bg-gray-100 overflow-hidden">
                  <img
                    src={addon.image || "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80"}
                    alt={addon.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/90 text-gray-800 shadow-2xs">
                    {addon.category}
                  </span>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-gray-900 text-base">{addon.name}</h3>
                    <div className="text-right">
                      <span className="text-lg font-bold text-gray-900 font-playfair">{currency}{addon.price}</span>
                      <span className="text-[10px] text-gray-400 block font-medium">
                        {addon.priceType?.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                    {addon.description}
                  </p>
                </div>
              </div>

              {/* Card Footer Controls */}
              <div className="p-5 pt-0 border-t border-gray-100 mt-auto flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleAvailability(addon)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                      addon.isAvailable
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {addon.isAvailable ? '● Available' : '○ Disabled'}
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(addon)}
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
                    title="Edit Add-On"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteAddon(addon.id, addon.name)}
                    className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                    title="Delete Add-On"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-lg">
                {editingAddon ? "Edit Add-On" : "Create New Add-On"}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Add-On Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. VIP Airport Chauffeur Transfer"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Price ({currency}) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="65.00"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Pricing Rate Model
                  </label>
                  <select
                    value={formData.priceType}
                    onChange={(e) => setFormData({ ...formData, priceType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-blue-600 focus:outline-none bg-white"
                  >
                    <option value="per_stay">Per Stay (One-time)</option>
                    <option value="per_guest">Per Guest</option>
                    <option value="per_night">Per Night</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-blue-600 focus:outline-none bg-white"
                >
                  <option value="general">General Experience</option>
                  <option value="transport">Transport & Transfers</option>
                  <option value="dining">Dining & Culinary</option>
                  <option value="wellness">Wellness & Spa</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detail what is included with this upgrade..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-blue-600 focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isAvailable"
                  checked={formData.isAvailable}
                  onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 cursor-pointer"
                />
                <label htmlFor="isAvailable" className="text-xs font-semibold text-gray-700 cursor-pointer">
                  Available for booking immediately
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm cursor-pointer"
                >
                  {editingAddon ? "Save Changes" : "Create Add-On"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAddOns;
