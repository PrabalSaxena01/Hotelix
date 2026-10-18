import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Title from '../components/Title';
import { 
  Wifi, 
  Car, 
  Zap, 
  Waves, 
  Dumbbell, 
  Sparkles, 
  Briefcase, 
  CheckCircle, 
  Coffee, 
  ShieldCheck, 
  Award,
  Star
} from 'lucide-react';
import { Link } from 'react-router-dom';

const getAmenityIcon = (iconName) => {
  const iconProps = { className: "w-6 h-6 text-blue-600" };
  switch (iconName?.toLowerCase()) {
    case 'waves':
    case 'pool':
      return <Waves {...iconProps} />;
    case 'dumbbell':
    case 'gym':
    case 'fitness':
      return <Dumbbell {...iconProps} />;
    case 'sparkles':
    case 'spa':
      return <Sparkles {...iconProps} />;
    case 'wifi':
    case 'internet':
      return <Wifi {...iconProps} />;
    case 'briefcase':
    case 'business':
      return <Briefcase {...iconProps} />;
    case 'car':
    case 'parking':
      return <Car {...iconProps} />;
    case 'zap':
    case 'ev':
    case 'charging':
      return <Zap {...iconProps} />;
    case 'coffee':
    case 'dining':
      return <Coffee {...iconProps} />;
    case 'shield':
      return <ShieldCheck {...iconProps} />;
    default:
      return <CheckCircle {...iconProps} />;
  }
};

const Utilities = () => {
  const [categories, setCategories] = useState([]);
  const [uncategorized, setUncategorized] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    fetchUtilities();
  }, []);

  const fetchUtilities = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/utilities');
      if (res.data?.success) {
        setCategories(res.data.categories || []);
        setUncategorized(res.data.uncategorized || []);
      }
    } catch (err) {
      console.error("Error fetching utilities:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter((cat) => {
    if (activeCategory === 'all') return true;
    return cat.id === activeCategory;
  });

  return (
    <div className="pt-28 pb-20 px-4 md:px-16 lg:px-24 xl:px-32 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <Title 
          title="World-Class Hotel Amenities & Utilities" 
          subTitle="Designed for discerning travelers who value effortless connectivity, bespoke wellness, and premium comforts."
        />
      </div>

      {/* Hero Highlight Banner */}
      <div className="relative rounded-3xl overflow-hidden mb-14 bg-gray-900 text-white min-h-[260px] flex items-center shadow-lg">
        <img
          src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80"
          alt="Luxury Hotelix Facilities"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="relative z-10 p-8 md:p-14 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-white mb-3">
            <Award className="w-3.5 h-3.5 text-amber-400" /> Five-Star Standard
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-playfair mb-3">
            Every Detail Curated for Your Rest & Productivity
          </h2>
          <p className="text-gray-200 text-sm leading-relaxed mb-6">
            From Gigabit Wi-Fi 6 and private executive suites to infinity sky pools and electric vehicle fast chargers, Hotelix anticipates your every requirement.
          </p>
          <Link
            to="/rooms"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-gray-900 text-xs font-semibold hover:bg-gray-100 transition-all cursor-pointer shadow-md active:scale-95"
          >
            Explore Accommodations
          </Link>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex justify-center mb-12">
        <div className="inline-flex p-1 bg-gray-100 rounded-full gap-1 overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-5 py-2 rounded-full text-xs md:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-black text-white shadow-sm'
                : 'text-gray-600 hover:text-black hover:bg-gray-200/60'
            }`}
          >
            All Amenities
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2 rounded-full text-xs md:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-black text-white shadow-sm'
                  : 'text-gray-600 hover:text-black hover:bg-gray-200/60'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Amenities Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm">Loading amenities & utilities...</p>
        </div>
      ) : (
        <div className="space-y-12">
          {filteredCategories.map((cat) => (
            <div key={cat.id}>
              {/* Category Subheader */}
              <div className="flex items-center gap-3 mb-6 border-b border-gray-200 pb-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  {getAmenityIcon(cat.icon || 'Sparkles')}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{cat.name}</h3>
                  <span className="text-xs text-gray-500">
                    {cat.amenities?.length || 0} Facilities Available
                  </span>
                </div>
              </div>

              {/* Amenity Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cat.amenities?.map((item) => (
                  <div
                    key={item.id}
                    className="p-6 rounded-2xl bg-white border border-gray-200 shadow-xs hover:shadow-md hover:border-blue-200 transition-all duration-200 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-50/70 rounded-xl">
                          {getAmenityIcon(item.icon)}
                        </div>
                        {item.isFeatured && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> Featured
                          </span>
                        )}
                      </div>

                      <h4 className="font-semibold text-gray-900 text-base mb-1.5">
                        {item.name}
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {item.description || "Complimentary access for all registered hotel guests."}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-gray-100 flex items-center gap-2 text-xs text-emerald-600 font-medium">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span>Complimentary for Registered Guests</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Uncategorized Amenities if any */}
          {activeCategory === 'all' && uncategorized.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6 border-b border-gray-200 pb-3">
                <div className="p-2 bg-gray-100 text-gray-700 rounded-lg">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">General Services</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {uncategorized.map((item) => (
                  <div
                    key={item.id}
                    className="p-6 rounded-2xl bg-white border border-gray-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="p-3 bg-gray-50 rounded-xl inline-block mb-3">
                        {getAmenityIcon(item.icon)}
                      </div>
                      <h4 className="font-semibold text-gray-900 text-base mb-1">
                        {item.name}
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Facilities Inquiry Banner */}
      <div className="mt-16 p-8 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Hosting a Conference or Corporate Retreat?</h3>
          <p className="text-sm text-gray-600 mt-1">Our executive facilities accommodate boardrooms, banquets, and high-tech AV staging.</p>
        </div>
        <Link
          to="/contact"
          className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-all shadow-sm active:scale-95 whitespace-nowrap"
        >
          Inquire for Event Spaces
        </Link>
      </div>
    </div>
  );
};

export default Utilities;
