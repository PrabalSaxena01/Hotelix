import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAppContext } from '../../context/AppContext';
import { 
  Inbox, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Mail, 
  MessageSquare, 
  User, 
  Archive,
  RefreshCw
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const InquiriesList = () => {
  const { getToken } = useAppContext();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchInquiries();
  }, [statusFilter]);

  const getAuthHeader = async () => {
    try {
      const token = await getToken();
      return token ? { Authorization: `Bearer ${token}` } : {};
    } catch {
      return {};
    }
  };

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const headers = await getAuthHeader();
      const query = statusFilter !== 'all' ? `?status=${statusFilter}` : '';
      const res = await axios.get(`/api/inquiries${query}`, { headers });
      if (res.data?.success && res.data.inquiries) {
        setInquiries(res.data.inquiries);
      }
    } catch (err) {
      toast.error("Failed to load inquiries: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const headers = await getAuthHeader();
      const res = await axios.patch(`/api/inquiries/${id}/status`, { status }, { headers });
      if (res.data?.success) {
        toast.success(`Inquiry marked as ${status}`);
        setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status } : inq));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const handleDelete = async (id, subject) => {
    if (!window.confirm(`Delete inquiry '${subject}'?`)) return;

    try {
      const headers = await getAuthHeader();
      const res = await axios.delete(`/api/inquiries/${id}`, { headers });
      if (res.data?.success) {
        toast.success("Inquiry deleted");
        setInquiries(prev => prev.filter(inq => inq.id !== id));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> Resolved
          </span>
        );
      case 'replied':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <MessageSquare className="w-3 h-3" /> Replied
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3" /> Pending Review
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-playfair">Guest Inquiries & Messages</h1>
          <p className="text-sm text-gray-500 mt-1">
            Review incoming requests from guests regarding special arrangements, custom events, and policies.
          </p>
        </div>

        <button
          onClick={fetchInquiries}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold shadow-2xs transition-all active:scale-95 cursor-pointer self-start md:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Messages</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        {['all', 'pending', 'replied', 'resolved'].map((filter) => (
          <button
            key={filter}
            onClick={() => setStatusFilter(filter)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all cursor-pointer ${
              statusFilter === filter
                ? 'bg-black text-white shadow-xs'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Inquiries List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm">Loading guest inquiries...</p>
        </div>
      ) : inquiries.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300 p-8">
          <Inbox className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-gray-800">No inquiries found</h3>
          <p className="text-sm text-gray-500 mt-1">Guest inquiries submitted via the Contact page will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inq) => (
            <div
              key={inq.id}
              className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-start justify-between gap-6"
            >
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  {getStatusBadge(inq.status)}
                  <span className="text-xs text-gray-400">
                    Received: {new Date(inq.createdAt).toLocaleDateString()} at {new Date(inq.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 text-base md:text-lg mb-1">{inq.subject}</h3>
                  <p className="text-xs md:text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                    "{inq.message}"
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap pt-1">
                  <div className="flex items-center gap-1.5 font-medium text-gray-800">
                    <User className="w-3.5 h-3.5 text-blue-600" />
                    <span>{inq.name}</span>
                  </div>
                  <a
                    href={`mailto:${inq.email}?subject=RE: ${encodeURIComponent(inq.subject)}`}
                    className="flex items-center gap-1.5 text-blue-600 hover:underline"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{inq.email}</span>
                  </a>
                </div>
              </div>

              {/* Status Actions */}
              <div className="flex flex-col sm:flex-row md:flex-col items-end gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
                <a
                  href={`mailto:${inq.email}?subject=RE: ${encodeURIComponent(inq.subject)}`}
                  onClick={() => inq.status === 'pending' && handleUpdateStatus(inq.id, 'replied')}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold text-center transition-colors shadow-2xs cursor-pointer"
                >
                  Reply via Email
                </a>

                <div className="flex items-center gap-1.5">
                  {inq.status !== 'resolved' && (
                    <button
                      onClick={() => handleUpdateStatus(inq.id, 'resolved')}
                      className="px-3 py-1.5 rounded-lg border border-emerald-200 text-emerald-700 hover:bg-emerald-50 text-xs font-semibold transition-colors cursor-pointer"
                      title="Mark as Resolved"
                    >
                      Resolve
                    </button>
                  )}
                  {inq.status !== 'pending' && (
                    <button
                      onClick={() => handleUpdateStatus(inq.id, 'pending')}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-semibold transition-colors cursor-pointer"
                      title="Reopen"
                    >
                      Reopen
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(inq.id, inq.subject)}
                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                    title="Delete Inquiry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InquiriesList;
