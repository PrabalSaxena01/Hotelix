import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Title from '../components/Title';
import { useAppContext } from '../context/AppContext';
import { 
  Sparkles, 
  Car, 
  Utensils, 
  Heart, 
  Coffee, 
  CheckCircle2, 
  ArrowRight,
  Filter,
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';

const getCategoryBadge = (category) => {
  switch (category?.toLowerCase()) {
    case 'transport':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
          <Car className="w-3.5 h-3.5" /> Transport
        </span>
      );
    case 'dining':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          <Utensils className="w-3.5 h-3.5" /> Dining
        </span>
      );
    case 'wellness':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <Heart className="w-3.5 h-3.5" /> Wellness & Spa
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
          <Sparkles className="w-3.5 h-3.5" /> Experience
        </span>
      );
  }
};

const AddOns = () => {
  const { currency } = useAppContext();
  const [addons, setAddons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchAddOns();
  }, []);

  const fetchAddOns = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/addons');
      if (res.data?.success && res.data.addons) {
        setAddons(res.data.addons);
      }
    } catch (err) {
      console.error("Error fetching addons:", err);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'all', label: 'All Experiences' },
    { id: 'transport', label: 'VIP Transfers' },
    { id: 'dining', label: 'Gourmet Dining' },
    { id: 'wellness', label: 'Wellness & Spa' }
  ];

  const filteredAddons = addons.filter((item) => {
    if (activeTab === 'all') return true;
    return item.category?.toLowerCase() === activeTab.toLowerCase();
  });

  const formatPriceType = (type) => {
    switch (type) {
      case 'per_guest':
        return '/ guest';
      case 'per_night':
        return '/ night';
      default:
        return '/ stay';
    }
  };

  return (
    <div className="pt-28 pb-20 px-4 md:px-16 lg:px-24 xl:px-32 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <Title 
          title="Enhance Your Journey" 
          subTitle="Personalize your stay with bespoke luxury add-ons, wellness therapies, and VIP airport services."
        />
      </div>

      {/* Category Tabs */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex p-1 bg-gray-100 rounded-full gap-1 overflow-x-auto max-w-full">
          {categories.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 rounded-full text-xs md:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-black text-white shadow-sm'
                  : 'text-gray-600 hover:text-black hover:bg-gray-200/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm">Loading bespoke add-ons...</p>
        </div>
      ) : filteredAddons.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-200">
          <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-800">No add-ons available in this category</h3>
          <p className="text-sm text-gray-500 mt-1">Try switching to all experiences or contact concierge for tailored requests.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAddons.map((addon) => (
            <div
              key={addon.id}
              className="group bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Media Image */}
                <div className="relative h-52 w-full overflow-hidden bg-gray-100">
                  <img
                    src={addon.image || "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80"}
                    alt={addon.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    {getCategoryBadge(addon.category)}
                  </div>
                  {addon.isAvailable ? (
                    <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-[11px] font-semibold text-emerald-700 border border-emerald-200 flex items-center gap-1 shadow-xs">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Available
                    </div>
                  ) : (
                    <div className="absolute bottom-4 right-4 bg-gray-900/80 backdrop-blur-xs px-2.5 py-1 rounded-full text-[11px] font-medium text-white shadow-xs">
                      Seasonal / Unavailable
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-6">
                  <div className="flex items-baseline justify-between gap-2 mb-2">
                    <h3 className="font-playfair text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {addon.name}
                    </h3>
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    {addon.description}
                  </p>
                </div>
              </div>

              {/* Price & Action */}
              <div className="p-6 pt-0 border-t border-gray-100 flex items-center justify-between mt-auto">
                <div>
                  <span className="text-xs text-gray-400 uppercase font-semibold">Pricing</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-gray-900 font-playfair">
                      {currency}{addon.price}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">
                      {formatPriceType(addon.priceType)}
                    </span>
                  </div>
                </div>

                <Link
                  to="/rooms"
                  className="px-4 py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-medium flex items-center gap-2 transition-all active:scale-95 shadow-sm"
                >
                  <span>Book with Stay</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Concierge Custom Experience Request */}
      <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50 to-white border border-amber-200 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-amber-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" /> Bespoke Concierge
          </div>
          <h3 className="text-lg md:text-xl font-bold text-gray-900">Seeking a personalized anniversary setup or private charter?</h3>
          <p className="text-sm text-gray-600 mt-1">Our dedicated luxury curators craft tailor-made itineraries and private dining experiences.</p>
        </div>
        <Link
          to="/contact"
          className="px-6 py-2.5 rounded-full bg-black text-white text-sm font-medium hover:bg-neutral-800 transition-all cursor-pointer whitespace-nowrap shadow-sm active:scale-95"
        >
          Request Custom Experience
        </Link>
      </div>
    </div>
  );
};

export default AddOns;
