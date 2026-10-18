import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAppContext } from '../../context/AppContext';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Sparkles, 
  FolderPlus, 
  X, 
  Check, 
  Star, 
  Wifi, 
  Car, 
  Dumbbell, 
  Waves, 
  Zap, 
  Briefcase,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const ManageUtilities = () => {
  const { getToken } = useAppContext();
  const [categories, setCategories] = useState([]);
  const [uncategorized, setUncategorized] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showAmenityModal, setShowAmenityModal] = useState(false);
  const [editingAmenity, setEditingAmenity] = useState(null);

  // Forms state
  const [categoryForm, setCategoryForm] = useState({ name: '', icon: 'Sparkles' });
  const [amenityForm, setAmenityForm] = useState({
    name: '',
    description: '',
    icon: 'Waves',
    categoryId: '',
    isFeatured: false
  });

  useEffect(() => {
    fetchUtilities();
  }, []);

  const getAuthHeader = async () => {
    try {
      const token = await getToken();
      return token ? { Authorization: `Bearer ${token}` } : {};
    } catch {
      return {};
    }
  };

  const fetchUtilities = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/utilities');
      if (res.data?.success) {
        setCategories(res.data.categories || []);
        setUncategorized(res.data.uncategorized || []);
        if (res.data.categories?.length > 0 && !amenityForm.categoryId) {
          setAmenityForm(prev => ({ ...prev, categoryId: res.data.categories[0].id }));
        }
      }
    } catch (err) {
      toast.error("Failed to load utilities: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!categoryForm.name) return toast.error("Category name required");

    try {
      const headers = await getAuthHeader();
      const res = await axios.post('/api/utilities/category', categoryForm, { headers });
      if (res.data?.success) {
        toast.success("Amenity category created");
        setShowCategoryModal(false);
        setCategoryForm({ name: '', icon: 'Sparkles' });
        fetchUtilities();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const handleDeleteCategory = async (catId, catName) => {
    if (!window.confirm(`Delete category '${catName}'?`)) return;

    try {
      const headers = await getAuthHeader();
      const res = await axios.delete(`/api/utilities/category/${catId}`, { headers });
      if (res.data?.success) {
        toast.success("Category deleted");
        fetchUtilities();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const handleToggleFeatured = async (amenity) => {
    try {
      const headers = await getAuthHeader();
      const res = await axios.patch(`/api/utilities/${amenity.id}/toggle-featured`, {}, { headers });
      if (res.data?.success) {
        toast.success(res.data.message);
        fetchUtilities();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const handleDeleteAmenity = async (amenityId, amenityName) => {
    if (!window.confirm(`Delete amenity '${amenityName}'?`)) return;

    try {
      const headers = await getAuthHeader();
      const res = await axios.delete(`/api/utilities/${amenityId}`, { headers });
      if (res.data?.success) {
        toast.success("Amenity removed");
        fetchUtilities();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const handleOpenCreateAmenity = (catId = null) => {
    setEditingAmenity(null);
    setAmenityForm({
      name: '',
      description: '',
      icon: 'Waves',
      categoryId: catId || categories[0]?.id || '',
      isFeatured: false
    });
    setShowAmenityModal(true);
  };

  const handleOpenEditAmenity = (amenity) => {
    setEditingAmenity(amenity);
    setAmenityForm({
      name: amenity.name,
      description: amenity.description || '',
      icon: amenity.icon || 'Waves',
      categoryId: amenity.categoryId || '',
      isFeatured: Boolean(amenity.isFeatured)
    });
    setShowAmenityModal(true);
  };

  const handleSubmitAmenity = async (e) => {
    e.preventDefault();
    if (!amenityForm.name) return toast.error("Amenity name is required");

    try {
      const headers = await getAuthHeader();
      if (editingAmenity) {
        const res = await axios.put(`/api/utilities/${editingAmenity.id}`, amenityForm, { headers });
        if (res.data?.success) {
          toast.success("Amenity updated successfully");
        }
      } else {
        const res = await axios.post('/api/utilities', amenityForm, { headers });
        if (res.data?.success) {
          toast.success("Amenity created successfully");
        }
      }
      setShowAmenityModal(false);
      fetchUtilities();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-16">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-playfair">Manage Utilities & Amenities</h1>
          <p className="text-sm text-gray-500 mt-1">
            Publish and manage property amenities, rooftop facilities, fitness equipment, and highlight featured amenities.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCategoryModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold shadow-2xs transition-all active:scale-95 cursor-pointer"
          >
            <FolderPlus className="w-4 h-4 text-blue-600" />
            <span>Add Category</span>
          </button>

          <button
            onClick={() => handleOpenCreateAmenity()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Amenity</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm">Loading amenities & utilities...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
              {/* Category Header */}
              <div className="p-5 bg-gray-50/80 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 text-base">{cat.name}</h3>
                  <span className="text-xs text-gray-400">
                    {cat.amenities?.length || 0} Facilities
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenCreateAmenity(cat.id)}
                    className="p-1.5 rounded-lg bg-white border border-gray-200 text-blue-600 hover:bg-blue-50 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Add Amenity</span>
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat.id, cat.name)}
                    className="p-1.5 rounded-lg bg-white border border-gray-200 text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Delete Category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Items */}
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(!cat.amenities || cat.amenities.length === 0) ? (
                  <div className="col-span-full py-6 text-center text-xs text-gray-400">
                    No amenities in this category. Click "Add Amenity" to populate.
                  </div>
                ) : (
                  cat.amenities.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl border border-gray-200 bg-white hover:border-gray-300 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                            {item.icon}
                          </span>
                          <button
                            onClick={() => handleToggleFeatured(item)}
                            className={`p-1 rounded-full transition-colors cursor-pointer ${
                              item.isFeatured ? 'text-amber-500 hover:text-amber-600' : 'text-gray-300 hover:text-gray-400'
                            }`}
                            title={item.isFeatured ? "Featured amenity" : "Click to mark featured"}
                          >
                            <Star className={`w-4 h-4 ${item.isFeatured ? 'fill-amber-500' : ''}`} />
                          </button>
                        </div>
                        <h4 className="font-semibold text-gray-900 text-sm mb-1">{item.name}</h4>
                        <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
                      </div>

                      <div className="flex items-center justify-end gap-1.5 mt-4 pt-3 border-t border-gray-100">
                        <button
                          onClick={() => handleOpenEditAmenity(item)}
                          className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteAmenity(item.id, item.name)}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Category */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-lg">Add Amenity Category</h3>
              <button onClick={() => setShowCategoryModal(false)} className="p-1 rounded-full hover:bg-gray-100 text-gray-500 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateCategory} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="e.g. Wellness & Recreation"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-blue-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Category Icon
                </label>
                <select
                  value={categoryForm.icon}
                  onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-blue-600 focus:outline-none bg-white"
                >
                  <option value="Sparkles">Sparkles</option>
                  <option value="Activity">Activity / Fitness</option>
                  <option value="Wifi">Wifi / Connectivity</option>
                  <option value="Car">Car / Transport</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setShowCategoryModal(false)} className="px-4 py-2 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-100 cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm cursor-pointer">Create Category</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Amenity */}
      {showAmenityModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-lg">
                {editingAmenity ? "Edit Amenity" : "Add Property Amenity"}
              </h3>
              <button onClick={() => setShowAmenityModal(false)} className="p-1 rounded-full hover:bg-gray-100 text-gray-500 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmitAmenity} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Amenity Name *
                </label>
                <input
                  type="text"
                  required
                  value={amenityForm.name}
                  onChange={(e) => setAmenityForm({ ...amenityForm, name: e.target.value })}
                  placeholder="e.g. Heated Infinity Sky Pool"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Category
                </label>
                <select
                  value={amenityForm.categoryId}
                  onChange={(e) => setAmenityForm({ ...amenityForm, categoryId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-blue-600 focus:outline-none bg-white"
                >
                  <option value="">(None - Uncategorized)</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Visual Icon
                </label>
                <select
                  value={amenityForm.icon}
                  onChange={(e) => setAmenityForm({ ...amenityForm, icon: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-blue-600 focus:outline-none bg-white"
                >
                  <option value="Waves">Waves / Pool</option>
                  <option value="Dumbbell">Dumbbell / Fitness</option>
                  <option value="Sparkles">Sparkles / Spa</option>
                  <option value="Wifi">Wifi / Internet</option>
                  <option value="Briefcase">Briefcase / Business</option>
                  <option value="Car">Car / Valet</option>
                  <option value="Zap">Zap / EV Charging</option>
                  <option value="CheckCircle">CheckCircle / Standard</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={amenityForm.description}
                  onChange={(e) => setAmenityForm({ ...amenityForm, description: e.target.value })}
                  placeholder="Describe operating hours, features, or guidelines..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-blue-600 focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={amenityForm.isFeatured}
                  onChange={(e) => setAmenityForm({ ...amenityForm, isFeatured: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 cursor-pointer"
                />
                <label htmlFor="isFeatured" className="text-xs font-semibold text-gray-700 cursor-pointer">
                  Feature this amenity on the homepage and highlights
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setShowAmenityModal(false)} className="px-4 py-2 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-100 cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm cursor-pointer">
                  {editingAmenity ? "Save Changes" : "Add Amenity"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUtilities;
