import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAppContext } from '../../context/AppContext';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  ShieldAlert, 
  FolderPlus, 
  X, 
  Check, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const ManagePolicies = () => {
  const { getToken } = useAppContext();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState(null);

  // Category form state
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    icon: 'FileText',
    order: 0
  });

  // Policy form state
  const [policyForm, setPolicyForm] = useState({
    title: '',
    content: '',
    importance: 'standard',
    categoryId: ''
  });

  useEffect(() => {
    fetchPolicies();
  }, []);

  const getAuthHeader = async () => {
    try {
      const token = await getToken();
      return token ? { Authorization: `Bearer ${token}` } : {};
    } catch {
      return {};
    }
  };

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/policies');
      if (res.data?.success && res.data.categories) {
        setCategories(res.data.categories);
        if (res.data.categories.length > 0 && !policyForm.categoryId) {
          setPolicyForm(prev => ({ ...prev, categoryId: res.data.categories[0].id }));
        }
      }
    } catch (err) {
      toast.error("Failed to load policies: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!categoryForm.name) return toast.error("Category name required");

    try {
      const headers = await getAuthHeader();
      const res = await axios.post('/api/policies/category', categoryForm, { headers });
      if (res.data?.success) {
        toast.success("Policy category created!");
        setShowCategoryModal(false);
        setCategoryForm({ name: '', description: '', icon: 'FileText', order: 0 });
        fetchPolicies();
      } else {
        toast.error(res.data?.message || "Failed to create category");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const handleDeleteCategory = async (catId, catName) => {
    if (!window.confirm(`Are you sure you want to delete '${catName}' and all policies under it?`)) return;

    try {
      const headers = await getAuthHeader();
      const res = await axios.delete(`/api/policies/category/${catId}`, { headers });
      if (res.data?.success) {
        toast.success("Category deleted");
        fetchPolicies();
      } else {
        toast.error(res.data?.message || "Error deleting category");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const handleSavePolicy = async (e) => {
    e.preventDefault();
    if (!policyForm.title || !policyForm.content || !policyForm.categoryId) {
      return toast.error("Title, content, and category are required");
    }

    try {
      const headers = await getAuthHeader();
      if (editingPolicy) {
        const res = await axios.put(`/api/policies/${editingPolicy.id}`, policyForm, { headers });
        if (res.data?.success) {
          toast.success("Policy updated successfully");
        }
      } else {
        const res = await axios.post('/api/policies', policyForm, { headers });
        if (res.data?.success) {
          toast.success("New policy added successfully");
        }
      }
      setShowPolicyModal(false);
      setEditingPolicy(null);
      setPolicyForm({ title: '', content: '', importance: 'standard', categoryId: categories[0]?.id || '' });
      fetchPolicies();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const openEditPolicy = (policy, categoryId) => {
    setEditingPolicy(policy);
    setPolicyForm({
      title: policy.title,
      content: policy.content,
      importance: policy.importance || 'standard',
      categoryId: policy.categoryId || categoryId
    });
    setShowPolicyModal(true);
  };

  const handleDeletePolicy = async (policyId, policyTitle) => {
    if (!window.confirm(`Delete policy '${policyTitle}'?`)) return;

    try {
      const headers = await getAuthHeader();
      const res = await axios.delete(`/api/policies/${policyId}`, { headers });
      if (res.data?.success) {
        toast.success("Policy deleted successfully");
        fetchPolicies();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-16">
      {/* Page Title & Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-playfair">Manage Hotel Policies</h1>
          <p className="text-sm text-gray-500 mt-1">
            Dynamically insert, modify, or reorganize cancellation guidelines, check-in rules, and property terms.
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
            onClick={() => {
              setEditingPolicy(null);
              setPolicyForm({
                title: '',
                content: '',
                importance: 'standard',
                categoryId: categories[0]?.id || ''
              });
              setShowPolicyModal(true);
            }}
            disabled={categories.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Policy Rule</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm">Loading hotel policies...</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300 p-8">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-gray-800">No policy categories yet</h3>
          <p className="text-sm text-gray-500 mt-1 mb-4">Start by adding a category (e.g., Cancellation & Refund, Check-in Rules).</p>
          <button
            onClick={() => setShowCategoryModal(true)}
            className="px-5 py-2.5 bg-blue-600 text-white text-xs font-medium rounded-xl hover:bg-blue-700 shadow-sm cursor-pointer"
          >
            Create First Category
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
              {/* Category Header */}
              <div className="p-5 bg-gray-50/80 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-gray-900 text-base">{cat.name}</span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 bg-white border border-gray-200 rounded-md text-gray-500">
                      Order: {cat.order}
                    </span>
                  </div>
                  {cat.description && (
                    <p className="text-xs text-gray-500 mt-0.5">{cat.description}</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingPolicy(null);
                      setPolicyForm({ title: '', content: '', importance: 'standard', categoryId: cat.id });
                      setShowPolicyModal(true);
                    }}
                    className="p-1.5 rounded-lg bg-white border border-gray-200 text-blue-600 hover:bg-blue-50 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                    title="Add policy to this category"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Add Rule</span>
                  </button>

                  <button
                    onClick={() => handleDeleteCategory(cat.id, cat.name)}
                    className="p-1.5 rounded-lg bg-white border border-gray-200 text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Delete category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Policies List */}
              <div className="divide-y divide-gray-100">
                {(!cat.policies || cat.policies.length === 0) ? (
                  <div className="p-6 text-center text-xs text-gray-400">
                    No policy rules added to this category yet.
                  </div>
                ) : (
                  cat.policies.map((policy) => (
                    <div key={policy.id} className="p-5 flex flex-col md:flex-row md:items-start justify-between gap-4 hover:bg-gray-50/40 transition-colors">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-3">
                          <h4 className="font-semibold text-gray-900 text-sm md:text-base">
                            {policy.title}
                          </h4>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            policy.importance === 'mandatory'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : policy.importance === 'recommended'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}>
                            {policy.importance}
                          </span>
                        </div>
                        <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                          {policy.content}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 pt-1">
                        <button
                          onClick={() => openEditPolicy(policy, cat.id)}
                          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
                          title="Edit policy"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePolicy(policy.id, policy.title)}
                          className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                          title="Delete policy"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Modal: Create Category */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-lg">Add Policy Category</h3>
              <button 
                onClick={() => setShowCategoryModal(false)}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-500 cursor-pointer"
              >
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
                  placeholder="e.g. Cancellation & Refund"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Short Description
                </label>
                <input
                  type="text"
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  placeholder="e.g. Guidelines on arrival and refund schedules"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={categoryForm.order}
                    onChange={(e) => setCategoryForm({ ...categoryForm, order: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Icon Name
                  </label>
                  <select
                    value={categoryForm.icon}
                    onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-blue-600 focus:outline-none bg-white"
                  >
                    <option value="ShieldCheck">ShieldCheck</option>
                    <option value="Clock">Clock</option>
                    <option value="Home">Home</option>
                    <option value="FileText">FileText</option>
                    <option value="Sparkles">Sparkles</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm cursor-pointer"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create / Edit Policy */}
      {showPolicyModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-lg">
                {editingPolicy ? "Edit Policy Rule" : "Add Policy Rule"}
              </h3>
              <button 
                onClick={() => setShowPolicyModal(false)}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePolicy} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Assign Category *
                </label>
                <select
                  required
                  value={policyForm.categoryId}
                  onChange={(e) => setPolicyForm({ ...policyForm, categoryId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-blue-600 focus:outline-none bg-white"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Policy Title *
                </label>
                <input
                  type="text"
                  required
                  value={policyForm.title}
                  onChange={(e) => setPolicyForm({ ...policyForm, title: e.target.value })}
                  placeholder="e.g. Free 48-Hour Cancellation"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Importance Level
                </label>
                <select
                  value={policyForm.importance}
                  onChange={(e) => setPolicyForm({ ...policyForm, importance: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-blue-600 focus:outline-none bg-white"
                >
                  <option value="standard">Standard</option>
                  <option value="mandatory">Mandatory</option>
                  <option value="recommended">Recommended</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Policy Content / Explanation *
                </label>
                <textarea
                  required
                  rows={4}
                  value={policyForm.content}
                  onChange={(e) => setPolicyForm({ ...policyForm, content: e.target.value })}
                  placeholder="Detail exact rules, conditions, deadlines, and exceptions..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-blue-600 focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowPolicyModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm cursor-pointer"
                >
                  {editingPolicy ? "Save Changes" : "Create Policy"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePolicies;
