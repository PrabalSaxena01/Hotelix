import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAppContext } from '../../context/AppContext';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Tag, 
  X, 
  Check, 
  Calendar, 
  Percent, 
  DollarSign, 
  Clock, 
  Users
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const ManagePromotions = () => {
  const { currency, getToken } = useAppContext();
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal & form states
  const [showModal, setShowModal] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    validFrom: new Date().toISOString().split('T')[0],
    validTo: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
    minNights: 1,
    maxUses: '',
    bannerImage: '',
    isActive: true
  });

  useEffect(() => {
    fetchPromotions();
  }, []);

  const getAuthHeader = async () => {
    try {
      const token = await getToken();
      return token ? { Authorization: `Bearer ${token}` } : {};
    } catch {
      return {};
    }
  };

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const headers = await getAuthHeader();
      const res = await axios.get('/api/promotions/all', { headers });
      if (res.data?.success && res.data.promotions) {
        setPromotions(res.data.promotions);
      }
    } catch (err) {
      toast.error("Failed to load promotions: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePromo = async (promo) => {
    try {
      const headers = await getAuthHeader();
      const res = await axios.patch(`/api/promotions/${promo.id}/toggle`, {}, { headers });
      if (res.data?.success) {
        toast.success(res.data.message);
        setPromotions(prev => prev.map(p => p.id === promo.id ? { ...p, isActive: !p.isActive } : p));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const handleDeletePromo = async (promoId, promoCode) => {
    if (!window.confirm(`Delete promotion code '${promoCode}'?`)) return;

    try {
      const headers = await getAuthHeader();
      const res = await axios.delete(`/api/promotions/${promoId}`, { headers });
      if (res.data?.success) {
        toast.success("Promotion deleted");
        setPromotions(prev => prev.filter(p => p.id !== promoId));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const handleOpenCreate = () => {
    setEditingPromo(null);
    setFormData({
      code: '',
      title: '',
      description: '',
      discountType: 'percentage',
      discountValue: '',
      validFrom: new Date().toISOString().split('T')[0],
      validTo: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
      minNights: 1,
      maxUses: '',
      bannerImage: '',
      isActive: true
    });
    setShowModal(true);
  };

  const handleOpenEdit = (promo) => {
    setEditingPromo(promo);
    setFormData({
      code: promo.code,
      title: promo.title,
      description: promo.description || '',
      discountType: promo.discountType || 'percentage',
      discountValue: promo.discountValue,
      validFrom: promo.validFrom ? new Date(promo.validFrom).toISOString().split('T')[0] : '',
      validTo: promo.validTo ? new Date(promo.validTo).toISOString().split('T')[0] : '',
      minNights: promo.minNights || 1,
      maxUses: promo.maxUses || '',
      bannerImage: promo.bannerImage || '',
      isActive: promo.isActive !== false
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.code || !formData.title || formData.discountValue === '' || !formData.validTo) {
      return toast.error("Code, title, discount value, and expiry date are required");
    }

    try {
      const headers = await getAuthHeader();
      if (editingPromo) {
        const res = await axios.put(`/api/promotions/${editingPromo.id}`, formData, { headers });
        if (res.data?.success) {
          toast.success("Promotion updated successfully");
        }
      } else {
        const res = await axios.post('/api/promotions', formData, { headers });
        if (res.data?.success) {
          toast.success("New promotion coupon created successfully");
        }
      }
      setShowModal(false);
      fetchPromotions();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-16">
      {/* Header & Create */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-playfair">Manage Promotions & Discounts</h1>
          <p className="text-sm text-gray-500 mt-1">
            Create coupon codes, specify percentage or dollar discounts, minimum night rules, and validity caps.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Promotion</span>
        </button>
      </div>

      {/* Promotions List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm">Loading promotions...</p>
        </div>
      ) : promotions.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300 p-8">
          <Tag className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-gray-800">No promo codes created yet</h3>
          <p className="text-sm text-gray-500 mt-1 mb-4">Drive bookings with limited-time promotional discount vouchers.</p>
          <button
            onClick={handleOpenCreate}
            className="px-5 py-2.5 bg-blue-600 text-white text-xs font-medium rounded-xl hover:bg-blue-700 shadow-sm cursor-pointer"
          >
            Create First Coupon
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {promotions.map((promo) => (
            <div
              key={promo.id}
              className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl shrink-0">
                  <Tag className="w-6 h-6" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-mono font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-lg text-sm tracking-wider">
                      {promo.code}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {promo.discountType === 'percentage' ? `${promo.discountValue}% OFF` : `${currency}${promo.discountValue} OFF`}
                    </span>
                    {new Date(promo.validTo) < new Date() && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                        Expired
                      </span>
                    )}
                  </div>

                  <h3 className="font-semibold text-gray-900 text-base">{promo.title}</h3>
                  <p className="text-xs text-gray-500 max-w-xl line-clamp-1">{promo.description}</p>

                  <div className="flex items-center gap-4 text-xs text-gray-400 pt-1 flex-wrap">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Valid: {formatDate(promo.validFrom)} - {formatDate(promo.validTo)}</span>
                    </div>
                    {promo.minNights > 1 && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Min {promo.minNights} nights</span>
                      </div>
                    )}
                    {promo.maxUses && (
                      <div className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        <span>Used: {promo.usedCount || 0}/{promo.maxUses}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100">
                <button
                  onClick={() => handleTogglePromo(promo)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                    promo.isActive
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                      : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {promo.isActive ? '● Active' : '○ Paused'}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(promo)}
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
                    title="Edit Promotion"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeletePromo(promo.id, promo.code)}
                    className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                    title="Delete Promotion"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Create / Edit Promotion */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-lg">
                {editingPromo ? "Edit Promo Code" : "Create New Promotion"}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Coupon Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. LUXURY20"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm font-mono font-bold uppercase focus:border-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Discount Type
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-blue-600 focus:outline-none bg-white"
                  >
                    <option value="percentage">Percentage (% off)</option>
                    <option value="fixed">Fixed Dollar ({currency} off)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Discount Value *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.discountValue}
                  onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                  placeholder={formData.discountType === 'percentage' ? "20 (for 20%)" : "50.00"}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Campaign Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Early Summer Getaway 20% Off"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Valid From
                  </label>
                  <input
                    type="date"
                    value={formData.validFrom}
                    onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Valid Until *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.validTo}
                    onChange={(e) => setFormData({ ...formData, validTo: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Minimum Nights
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.minNights}
                    onChange={(e) => setFormData({ ...formData, minNights: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Max Total Redemptions
                  </label>
                  <input
                    type="number"
                    value={formData.maxUses}
                    onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                    placeholder="Unlimited"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Banner Image URL (Optional)
                </label>
                <input
                  type="url"
                  value={formData.bannerImage}
                  onChange={(e) => setFormData({ ...formData, bannerImage: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Promotion terms and details..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-blue-600 focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 cursor-pointer"
                />
                <label htmlFor="isActive" className="text-xs font-semibold text-gray-700 cursor-pointer">
                  Activate promo code immediately
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
                  {editingPromo ? "Save Changes" : "Create Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePromotions;
