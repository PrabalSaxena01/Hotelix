import React, { useState } from 'react';
import axios from 'axios';
import Title from '../components/Title';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  MessageSquare,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await axios.post('/api/inquiries', formData);
      if (res.data?.success) {
        toast.success(res.data.message || "Inquiry sent successfully!");
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        toast.error(res.data?.message || "Failed to submit inquiry.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Error submitting inquiry.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-28 pb-20 px-4 md:px-16 lg:px-24 xl:px-32 max-w-7xl mx-auto">
      {/* Title */}
      <div className="text-center mb-12">
        <Title 
          title="Contact Hotelix Concierge" 
          subTitle="Whether planning a luxury group reservation, requesting airport transfers, or inquiring about property policies, we are here to assist."
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Contact Info Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gray-900 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <span className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-2 block">
                24/7 Guest Relations
              </span>
              <h3 className="font-playfair text-2xl font-bold mb-4">
                We're Here to Perfect Your Stay
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-8">
                Reach out anytime. Our multilingual front desk staff and concierge team are on standby day and night.
              </p>

              <div className="space-y-6 text-sm">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/10 rounded-xl">
                    <MapPin className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Central Flagship</h4>
                    <p className="text-gray-400 text-xs mt-0.5">
                      742 Grand Boulevard, Suite 500<br />
                      New York, NY 10019
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/10 rounded-xl">
                    <Phone className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Telephone Support</h4>
                    <p className="text-gray-400 text-xs mt-0.5">
                      Toll-Free: +1 (800) 555-0199<br />
                      International: +1 (212) 555-0144
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/10 rounded-xl">
                    <Mail className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Electronic Mail</h4>
                    <p className="text-gray-400 text-xs mt-0.5">
                      concierge@hotelix.com<br />
                      reservations@hotelix.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/10 rounded-xl">
                    <Clock className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Check-in / Check-out Desk</h4>
                    <p className="text-gray-400 text-xs mt-0.5">
                      Check-in: From 3:00 PM<br />
                      Check-out: Until 11:00 AM
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Guarantee pill card */}
          <div className="p-6 rounded-2xl border border-gray-200 bg-white shadow-xs flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">Guaranteed Response in 4 Hours</h4>
              <p className="text-xs text-gray-500 mt-0.5">All electronic inquiries receive priority concierge attention.</p>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl border border-gray-200 p-8 md:p-10 shadow-sm">
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold font-playfair text-gray-900 mb-2">
                  Thank You for Your Inquiry
                </h3>
                <p className="text-sm text-gray-600 max-w-md mx-auto mb-8">
                  Your message has been received by our concierge desk. We will review your request and get back to you shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 rounded-full bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-all cursor-pointer shadow-sm"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    Send Us a Message
                  </h3>
                  <p className="text-xs text-gray-500">
                    Fill out the form below and our team will get in touch promptly.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Eleanor Vance"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all bg-gray-50/50 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. eleanor@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all bg-gray-50/50 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Subject / Topic *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g. Airport Transfer Booking / Custom Dining Request"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all bg-gray-50/50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Your Message *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Provide details about your upcoming reservation, dates, special preferences, or questions..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all bg-gray-50/50 focus:bg-white resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 px-6 rounded-xl bg-black hover:bg-neutral-800 text-white font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Transmitting Inquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Transmit Message to Concierge</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
