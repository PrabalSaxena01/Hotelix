import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Title from '../components/Title';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  MessageSquare, 
  PhoneCall, 
  Mail, 
  CheckCircle2,
  FileQuestion
} from 'lucide-react';
import { Link } from 'react-router-dom';

const FaqPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [openIndex, setOpenIndex] = useState(0);

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/faqs');
      if (res.data?.success && res.data.faqs) {
        setFaqs(res.data.faqs);
      }
    } catch (err) {
      console.error("Error fetching FAQs:", err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', ...new Set(faqs.map(f => f.category || 'General'))];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCat = activeCategory === 'All' || (faq.category || 'General') === activeCategory;
    const matchesSearch = search === '' ||
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="pt-28 pb-20 px-4 md:px-16 lg:px-24 xl:px-32 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <Title 
          title="Frequently Asked Questions" 
          subTitle="Quick answers to common questions about reservations, check-in, amenities, and cancellations."
        />
      </div>

      {/* Search Input */}
      <div className="relative max-w-xl mx-auto mb-10">
        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search question keywords (e.g. check-in, parking, cancellation)..."
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-300 bg-white text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm"
        />
      </div>

      {/* Category Pills */}
      <div className="flex justify-center mb-10 overflow-x-auto pb-2 scrollbar-none">
        <div className="inline-flex p-1 bg-gray-100 rounded-full gap-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs md:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === cat
                  ? 'bg-black text-white shadow-sm'
                  : 'text-gray-600 hover:text-black hover:bg-gray-200/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion FAQ Items */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm">Loading FAQs...</p>
        </div>
      ) : filteredFaqs.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-200">
          <FileQuestion className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-gray-800">No matching questions found</h3>
          <p className="text-sm text-gray-500 mt-1">Please try different keywords or reach out directly.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-gray-200 shadow-xs hover:border-gray-300 transition-all overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-5 md:p-6 text-left flex items-center justify-between gap-4 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <div className="flex items-center gap-3">
                    <span className="p-2 rounded-xl bg-blue-50 text-blue-600 text-xs font-bold">
                      Q{index + 1}
                    </span>
                    <span className="font-semibold text-gray-900 text-base md:text-lg">
                      {faq.question}
                    </span>
                  </div>
                  <div className="p-1 rounded-full text-gray-400 transition-colors">
                    {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 md:px-6 pb-6 pt-1 text-sm md:text-base text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50/30">
                    <p>{faq.answer}</p>
                    <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                      <span className="font-medium px-2 py-0.5 bg-gray-100 rounded-md text-gray-600">
                        Category: {faq.category || 'General'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Support CTA Box */}
      <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400 mb-1">
            <MessageSquare className="w-4 h-4" /> 24/7 Dedicated Support
          </div>
          <h3 className="text-xl md:text-2xl font-bold font-playfair">
            Didn't find what you were looking for?
          </h3>
          <p className="text-sm text-gray-300">
            Our guest support and reservations team is available round-the-clock.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/contact"
            className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold tracking-wide uppercase transition-all shadow-md active:scale-95 whitespace-nowrap"
          >
            Send Inquiry
          </Link>
          <a
            href="tel:+18005550199"
            className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold tracking-wide uppercase transition-all whitespace-nowrap"
          >
            Call Front Desk
          </a>
        </div>
      </div>
    </div>
  );
};

export default FaqPage;
