import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAppContext } from '../../context/AppContext';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  HelpCircle, 
  X, 
  Check, 
  FileQuestion,
  Search
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const ManageFaqs = () => {
  const { getToken } = useAppContext();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal & form states
  const [showModal, setShowModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'Booking',
    order: 0
  });

  useEffect(() => {
    fetchFaqs();
  }, []);

  const getAuthHeader = async () => {
    try {
      const token = await getToken();
      return token ? { Authorization: `Bearer ${token}` } : {};
    } catch {
      return {};
    }
  };

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/faqs');
      if (res.data?.success && res.data.faqs) {
        setFaqs(res.data.faqs);
      }
    } catch (err) {
      toast.error("Failed to load FAQs: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFaq = async (faqId, question) => {
    if (!window.confirm(`Delete FAQ "${question}"?`)) return;

    try {
      const headers = await getAuthHeader();
      const res = await axios.delete(`/api/faqs/${faqId}`, { headers });
      if (res.data?.success) {
        toast.success("FAQ deleted");
        setFaqs(prev => prev.filter(f => f.id !== faqId));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const handleOpenCreate = () => {
    setEditingFaq(null);
    setFormData({
      question: '',
      answer: '',
      category: 'Booking',
      order: faqs.length + 1
    });
    setShowModal(true);
  };

  const handleOpenEdit = (faq) => {
    setEditingFaq(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category || 'Booking',
      order: faq.order || 0
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.question || !formData.answer) {
      return toast.error("Question and answer are required");
    }

    try {
      const headers = await getAuthHeader();
      if (editingFaq) {
        const res = await axios.put(`/api/faqs/${editingFaq.id}`, formData, { headers });
        if (res.data?.success) {
          toast.success("FAQ updated successfully");
        }
      } else {
        const res = await axios.post('/api/faqs', formData, { headers });
        if (res.data?.success) {
          toast.success("FAQ created successfully");
        }
      }
      setShowModal(false);
      fetchFaqs();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const filteredFaqs = faqs.filter(f =>
    search === '' ||
    f.question.toLowerCase().includes(search.toLowerCase()) ||
    f.answer.toLowerCase().includes(search.toLowerCase()) ||
    f.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-playfair">Manage Frequently Asked Questions</h1>
          <p className="text-sm text-gray-500 mt-1">
            Maintain accurate, direct answers for prospective guests regarding booking terms, pet policies, and amenities.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New FAQ</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md mb-6">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter FAQs by keyword..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-blue-600 focus:outline-none bg-white"
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm">Loading FAQs...</p>
        </div>
      ) : filteredFaqs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300 p-8">
          <FileQuestion className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-gray-800">No FAQs found</h3>
          <p className="text-sm text-gray-500 mt-1 mb-4">Add your first guest FAQ to reduce front desk inquiry volume.</p>
          <button
            onClick={handleOpenCreate}
            className="px-5 py-2.5 bg-blue-600 text-white text-xs font-medium rounded-xl hover:bg-blue-700 shadow-sm cursor-pointer"
          >
            Add First FAQ
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFaqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs hover:border-gray-300 transition-all flex flex-col md:flex-row md:items-start justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    {faq.category || 'General'}
                  </span>
                  <span className="text-xs text-gray-400">Order: {faq.order}</span>
                </div>
                <h3 className="font-semibold text-gray-900 text-base">{faq.question}</h3>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0 pt-1">
                <button
                  onClick={() => handleOpenEdit(faq)}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
                  title="Edit FAQ"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteFaq(faq.id, faq.question)}
                  className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                  title="Delete FAQ"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-lg">
                {editingFaq ? "Edit FAQ" : "Add New FAQ"}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-full hover:bg-gray-100 text-gray-500 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Question *
                </label>
                <input
                  type="text"
                  required
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="e.g. What is your check-in and check-out time?"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-blue-600 focus:outline-none bg-white"
                  >
                    <option value="Booking">Booking</option>
                    <option value="Facilities">Facilities</option>
                    <option value="Policies">Policies</option>
                    <option value="General">General</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Answer *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  placeholder="Detailed, helpful answer..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-blue-600 focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-100 cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm cursor-pointer">
                  {editingFaq ? "Save Changes" : "Create FAQ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageFaqs;
