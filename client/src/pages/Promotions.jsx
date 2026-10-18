import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Title from '../components/Title';
import { Tag, Copy, Check, Calendar, Moon, Sparkles, ArrowRight, Percent, DollarSign } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const Promotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/promotions');
      if (res.data?.success && res.data.promotions) {
        setPromotions(res.data.promotions);
      }
    } catch (err) {
      console.error("Error fetching promotions:", err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Coupon code ${code} copied to clipboard!`);
    setTimeout(() => {
      setCopiedCode(null);
    }, 3000);
  };

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="pt-28 pb-20 px-4 md:px-16 lg:px-24 xl:px-32 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <Title 
          title="Exclusive Offers & Promotions" 
          subTitle="Elevate your stay with our seasonal discounts, curated luxury packages, and limited-time savings."
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm">Retrieving active promotions...</p>
        </div>
      ) : promotions.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-200">
          <Tag className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-800">No active promotions at this time</h3>
          <p className="text-sm text-gray-500 mt-1">Check back soon for upcoming holiday deals and flash sales!</p>
          <Link
            to="/rooms"
            className="inline-block mt-4 px-6 py-2.5 bg-black text-white text-xs font-medium rounded-full hover:bg-neutral-800 transition-all cursor-pointer"
          >
            Browse Available Suites
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {promotions.map((promo) => (
            <div 
              key={promo.id}
              className="group bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Banner Image */}
                <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                  <img
                    src={promo.bannerImage || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"}
                    alt={promo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/95 text-gray-900 shadow-md backdrop-blur-xs">
                      {promo.discountType === 'percentage' ? (
                        <>
                          <Percent className="w-3.5 h-3.5 text-blue-600" />
                          {promo.discountValue}% OFF
                        </>
                      ) : (
                        <>
                          <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                          ${promo.discountValue} OFF
                        </>
                      )}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-playfair text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {promo.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                    {promo.description}
                  </p>

                  <div className="space-y-2 text-xs text-gray-500 border-t border-gray-100 pt-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>Valid until: <strong className="text-gray-700">{formatDate(promo.validTo)}</strong></span>
                    </div>
                    {promo.minNights > 1 && (
                      <div className="flex items-center gap-2">
                        <Moon className="w-4 h-4 text-gray-400" />
                        <span>Min stay: <strong className="text-gray-700">{promo.minNights} nights</strong></span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Code Voucher Footer */}
              <div className="p-6 pt-0">
                <div className="p-3 bg-gray-50 rounded-xl border border-dashed border-gray-300 flex items-center justify-between gap-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase">Coupon Code</span>
                    <span className="font-mono font-bold text-gray-800 text-base tracking-wider">{promo.code}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(promo.code)}
                    className="p-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 active:scale-95 transition-all cursor-pointer shadow-2xs flex items-center gap-1.5 text-xs font-semibold"
                    title="Copy code"
                  >
                    {copiedCode === promo.code ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-gray-600" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <Link
                  to="/rooms"
                  className="mt-4 w-full py-2.5 px-4 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-medium flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.98]"
                >
                  <span>Apply on Booking</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Promotion Policy Notice */}
      <div className="mt-16 p-6 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-500 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
          <p>
            Promotional codes are valid exclusively for direct reservations made on Hotelix. Discounts apply before taxes and cannot be combined with selected corporate rates.
          </p>
        </div>
        <Link to="/policies" className="text-blue-600 hover:underline whitespace-nowrap font-medium">
          View full terms
        </Link>
      </div>
    </div>
  );
};

export default Promotions;
