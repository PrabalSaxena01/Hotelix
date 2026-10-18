import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'

const HotelCards = ({ room, index }) => {
  const { currency } = useAppContext();

  return (
    <Link
      to={`/rooms/${room._id}`}
      onClick={() => scrollTo(0, 0)}
      key={room._id}
      className='group relative max-w-70 w-full rounded-xl overflow-hidden bg-white text-gray-500/90 shadow-[0px_4px_12px_rgba(0,0,0,0.06)] hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between'
    > 
        <div className="overflow-hidden aspect-[4/3] w-full bg-gray-100">
            <img
              src={room.images[0]}
              alt={room.hotel?.name || 'Hotel'}
              draggable="false"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
        </div>

        {index % 2 === 0 && (
            <p className='px-3 py-1 absolute top-3 left-3 text-xs bg-white/95 backdrop-blur-sm text-gray-800 font-semibold rounded-full shadow-sm'>
                Best Seller
            </p>
        )}

        <div className='p-4 pt-5 flex-1 flex flex-col justify-between'>
            <div>
              <div className='flex items-center justify-between'>
                  <p className='font-playfair text-xl font-medium text-gray-800 group-hover:text-blue-600 transition-colors'>{room.hotel.name}</p>
                  <div className='flex items-center gap-1 text-sm font-medium text-amber-500'>
                      <img src={assets.starIconFilled} alt="Rating" className="w-4 h-4" /> 4.5
                  </div>
              </div>
              <div className='flex items-center gap-1.5 text-sm mt-1.5 text-gray-500'>
                  <img src={assets.locationIcon} alt="Location" className="w-3.5 h-3.5 opacity-70" />
                  <span className="line-clamp-1">{room.hotel.address}</span>
              </div>
            </div>

            <div className='flex items-center justify-between mt-5 pt-3 border-t border-gray-100'>
                <p className="text-sm"><span className='text-xl font-semibold text-gray-900'>{currency}{room.pricePerNight}</span>/night</p>
                <span className='px-4 py-1.5 text-xs font-semibold rounded-full border border-gray-300 text-gray-700 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-200'>
                    Book Now
                </span>
            </div>
        </div>
    </Link>
  )
}

export default HotelCards
