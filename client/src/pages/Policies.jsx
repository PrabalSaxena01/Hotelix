import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Title from '../components/Title';
import { 
  ShieldCheck, 
  Clock, 
  Home, 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

const getCategoryIcon = (iconName) => {
  switch (iconName) {
    case 'ShieldAlert':
    case 'ShieldCheck':
      return <ShieldCheck className="w-5 h-5 text-rose-500" />;
    case 'Clock':
      return <Clock className="w-5 h-5 text-amber-500" />;
    case 'Home':
      return <Home className="w-5 h-5 text-blue-500" />;
    case 'Sparkles':
      return <Sparkles className="w-5 h-5 text-indigo-500" />;
    default:
      return <FileText className="w-5 h-5 text-gray-500" />;
  }
};

const getImportanceBadge = (importance) => {
  switch (importance?.toLowerCase()) {
    case 'mandatory':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          <AlertCircle className="w-3 h-3" /> Mandatory
        </span>
      );
    case 'recommended':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <Sparkles className="w-3 h-3" /> Recommended
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          <CheckCircle2 className="w-3 h-3" /> Standard
        </span>
      );
  }
};

const Policies = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedPolicies, setExpandedPolicies] = useState({});

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/policies');
      if (res.data?.success && res.data.categories) {
        setCategories(res.data.categories);
        // Expand first policy of each category by default
        const initialExpanded = {};
        res.data.categories.forEach((cat) => {
          if (cat.policies && cat.policies.length > 0) {
            initialExpanded[cat.policies[0].id] = true;
          }
        });
        setExpandedPolicies(initialExpanded);
      }
    } catch (err) {
      console.error("Error fetching policies:", err);
    } finally {
      setLoading(false);
    }
  };

  const togglePolicy = (policyId) => {
    setExpandedPolicies(prev => ({
      ...prev,
      [policyId]: !prev[policyId]
    }));
  };

  // Filter categories and policies based on search & category tab
  const filteredCategories = categories.map(cat => {
    const matchesCategory = activeCategory === 'all' || cat.id === activeCategory;
    if (!matchesCategory) return null;

    const filteredPolicies = (cat.policies || []).filter(policy => {
      const matchSearch = searchTerm === '' ||
        policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        policy.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchSearch;
    });

    if (filteredPolicies.length === 0 && searchTerm !== '') return null;

    return {
      ...cat,
      policies: filteredPolicies
    };
  }).filter(Boolean);

  return (
    <div className="pt-28 pb-20 px-4 md:px-16 lg:px-24 xl:px-32 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <Title 
          title="Guest & Property Policies" 
          subTitle="Transparent guidelines ensuring a comfortable, secure, and serene hospitality experience for every guest."
        />
      </div>

      {/* Search and Category Filter */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search policies or rules..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-300 bg-white text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all shadow-sm"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-black text-white shadow-sm'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            All Policies
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-black text-white shadow-sm'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm">Loading Hotelix policies...</p>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-200">
          <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-800">No matching policies found</h3>
          <p className="text-sm text-gray-500 mt-1">Try adjusting your search terms or view all categories.</p>
          <button
            onClick={() => { setSearchTerm(''); setActiveCategory('all'); }}
            className="mt-4 px-5 py-2 bg-black text-white text-xs font-medium rounded-full hover:bg-neutral-800 cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {filteredCategories.map((cat) => (
            <div key={cat.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              {/* Category Header */}
              <div className="p-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-white border border-gray-200 shadow-xs">
                    {getCategoryIcon(cat.icon)}
                  </div>
                  <div>
                    <h2 className="text-lg md:text-xl font-bold text-gray-900">{cat.name}</h2>
                    {cat.description && (
                      <p className="text-xs md:text-sm text-gray-500 mt-0.5">{cat.description}</p>
                    )}
                  </div>
                </div>
                <span className="text-xs text-gray-400 font-medium px-3 py-1 bg-white border border-gray-200 rounded-full">
                  {cat.policies?.length || 0} {cat.policies?.length === 1 ? 'Rule' : 'Rules'}
                </span>
              </div>

              {/* Policy Accordions */}
              <div className="divide-y divide-gray-100">
                {cat.policies?.map((policy) => {
                  const isOpen = expandedPolicies[policy.id];
                  return (
                    <div key={policy.id} className="transition-colors hover:bg-gray-50/50">
                      <button
                        onClick={() => togglePolicy(policy.id)}
                        className="w-full py-4 px-6 flex items-center justify-between text-left cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                      >
                        <div className="flex items-center gap-3 pr-4">
                          <span className="font-semibold text-gray-800 text-sm md:text-base">
                            {policy.title}
                          </span>
                          {getImportanceBadge(policy.importance)}
                        </div>
                        <div className="p-1 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </div>
                      </button>

                      {isOpen && (
                        <div className="px-6 pb-5 pt-1 text-sm text-gray-600 leading-relaxed animate-in fade-in duration-200">
                          <p>{policy.content}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Assistance Footer Card */}
      <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-white border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Have specific requirements or questions?</h3>
          <p className="text-sm text-gray-600 mt-1">Our front desk concierge is available 24/7 to assist with special arrangements.</p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/faqs"
            className="px-5 py-2.5 rounded-full border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-all cursor-pointer shadow-xs"
          >
            Read FAQs
          </Link>
          <Link
            to="/contact"
            className="px-6 py-2.5 rounded-full bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-all cursor-pointer shadow-sm active:scale-95"
          >
            Contact Concierge
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Policies;
