import React,{useMemo, useState} from 'react'
import {roomsDummyData} from '../assets/assets'
import {useSearchParams} from 'react-router-dom'
import StarRating from '../components/StarRating'
import {assets, facilityIcons} from '../assets/assets'
import { useAppContext } from '../context/AppContext'

const CheckBox = ({label, selected=false, onchange=() => {}}) =>{
  return(
    <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
      <input type="checkbox" checked={selected} onChange={(e)=>onchange(e.target.checked, label)} />
      <span className='font-light select-none'>{label}</span>
    </label>
  )
} 

const RadioButton = ({label, selected=false, onchange=() => {}}) =>{
  return(
    <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
      <input type="radio" name="sortOption" checked={selected} onChange={()=>onchange(label)} />
      <span className='font-light select-none'>{label}</span>
    </label>
  )
} 

const AllRooms = () =>{

    const [openFilters, setOpenFilters] = useState(false)
    const [searchParams, setSearchParams] = useSearchParams();
    const {rooms, navigate, currency} = useAppContext();

    const [selectedFilters, setSelectedFilters] = useState({
      roomType: [],
      priceRange: [],
    });

    const [selectedSort, setSelectedSort] = useState("");

    const roomTypes = [
      "Single Bed",
      "Double Bed",
      "Luxury Bed",
      "Family Suite",
    ];

    const priceRanges = [
      "0 to 500",
      "500 to 1000",
      "1000 to 2000",
      "2000 to 3000",
    ];

    const sortOptions = [
      "Price Low to High",
      "Price High to Low",
      "Newest First",
    ];

    // Handle filter changes
    const handleFilterChange = (checked, value, type) => {
      setSelectedFilters((prevFilters) => {
        const updatedFilters = { ...prevFilters };
        if (checked) {
          if (!updatedFilters[type].includes(value)) {
            updatedFilters[type].push(value);
          }
        }
        else {
          updatedFilters[type] = updatedFilters[type].filter(item => item !== value);
        }
        return updatedFilters;
      });
    };

    const handleSortChange = (sortOption) => {
      setSelectedSort(sortOption);
    };


    //function to check if room matches selected room type
    const matchesRoomType = (room) => {
      return selectedFilters.roomType.length === 0 || selectedFilters.roomType.includes(room.roomType || room.type);
    }

    //function to check if room matches selected price range
    const matchesPriceRange = (room) => {
      return selectedFilters.priceRange.length === 0 || selectedFilters.priceRange.some(range => {
        const [min, max] = range.split(' to ').map(Number);
        return room.pricePerNight >= min && room.pricePerNight <= max;
      })
    }

    //function to sort rooms based on selected filters
    const sortRooms = (a,b) => {
      if (selectedSort === "Price Low to High") {
        return a.pricePerNight - b.pricePerNight;
      }
      if (selectedSort === "Price High to Low") {
        return b.pricePerNight - a.pricePerNight;
      }
      if (selectedSort === "Newest First") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return 0; // Default case
    }

    //Filter destination based on search params
    const filterDestination = (room) => {
      const destination = searchParams.get('destination');
      if (!destination) return true; // If no destination is specified, return all rooms
      return room.hotel.city.toLowerCase().includes(destination.toLowerCase());
    }

    //FILTER ROOMS BASED ON SELECTED FILTERS AND SORT OPTIONS
    const filteredRooms = useMemo(() => {
      return rooms.filter(room => matchesRoomType(room) && matchesPriceRange(room) && filterDestination(room)).sort(sortRooms);
    }, [rooms, selectedFilters, selectedSort, searchParams]);


    //clear all filters
    const clearFilters = () => {
      setSelectedFilters({
        roomType: [],
        priceRange: [],
      });
      setSelectedSort("");
      setSearchParams({});
    };

    return (
        <div className='flex flex-col-reverse lg:flex-row items-start justify-between pt-28 md:pt-35 px-4 md:px-16 lg:px-24'>
            {/*Hotel List*/}
          <div>
            <div className='flex flex-col items-start text-left'>
                <h1 className='font-playfair text-4xl md:text-[40px]'>Hotel Rooms</h1>
                <p className='text-xs md:text-base text-gray-500/90 mt-2 max-w-174'>Take advantage of our limited-time offers and special packages to enhance your stay and create unforgettable memories.</p>
            </div>

            {filteredRooms.map((room)=>(
              <div key={room._id} className='group flex flex-col md:flex-row items-start py-10 gap-6 border-b border-gray-200 last:pb-30 last:border-0 transition-colors'>
                <div className="md:w-1/2 overflow-hidden rounded-xl shadow-md group-hover:shadow-xl transition-all duration-300">
                  <img
                    onClick={()=> {navigate(`/rooms/${room._id}`); (scrollTo(0,0))}}
                    src={room.images[0]}
                    alt={room.hotel?.name || "Room"}
                    title="View Room"
                    className='w-full max-h-65 object-cover cursor-pointer group-hover:scale-105 transition-transform duration-500'
                  />
                </div>
                <div className='md:w-1/2 flex flex-col gap-2'>
                  <p className='text-xs uppercase tracking-wider font-medium text-gray-500'>{room.hotel.city}</p>
                  <p
                    onClick={()=> {navigate(`/rooms/${room._id}`); (scrollTo(0,0))}}
                    className='text-gray-900 text-3xl font-playfair cursor-pointer hover:text-blue-600 active:text-blue-700 transition-colors'
                  >
                    {room.hotel.name}
                  </p>
                  <div className='flex items-center text-sm text-gray-600'>
                    <StarRating />
                    <p className='ml-2 text-xs text-gray-500'>200+ reviews</p>
                  </div>
                  <div className='flex items-center gap-1.5 text-gray-500 mt-1 text-sm'>
                    <img src={assets.locationIcon} alt="" className="w-3.5 h-3.5" />
                    <span>{room.hotel.address}</span>
                  </div>
                  <div className="flex flex-wrap items-center mt-3 mb-4 gap-3">
                    {room.amenities.map((item,index)=>(
                      <div key={index} className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 rounded-md border border-gray-100 text-xs text-gray-600">
                        <img src={facilityIcons[item]} alt={item} className='w-4 h-4'/>
                        <p>{item}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-3">
                    <p className='text-2xl font-bold text-gray-900'>{currency}{room.pricePerNight} <span className="text-sm font-normal text-gray-500">/ night</span></p>
                    <button
                      onClick={()=> {navigate(`/rooms/${room._id}`); (scrollTo(0,0))}}
                      className="px-5 py-2 text-xs font-semibold rounded-full border border-gray-800 text-gray-800 hover:bg-gray-900 hover:text-white active:scale-95 transition-all cursor-pointer shadow-sm"
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
            {/* Filters */}
          <div className='bg-white w-80 border border-gray-300 text-gray-600 max-lg:mb-8 min-lg:mt-16'>
            <div className={`flex items-center justify-between px-5 py-2.5 min-lg:border-b border-gray-300 ${openFilters && 'border-b'}`}>
              <p className='text-base font-medium text-gray-800'>FILTERS</p>
              <div className='text-xs cursor-pointer'>
                <span onClick={()=> setOpenFilters(!openFilters)} className='lg:hidden'>{openFilters ? 'HIDE' : 'SHOW'}</span>
                <span onClick={clearFilters} className='hidden lg:block'>CLEAR</span>
              </div>
            </div>

            <div className={`${openFilters ? 'h-auto' : 'h-0 lg:h-auto'} overflow-hidden transition-all duration-all`}>
              <div className='px-5 pt-5'>
                <p className='font-medium text-gray-800 pb-2'>Popular Filters</p>

                {roomTypes.map((room, index)=>(
                  <CheckBox key={index} label={room} selected={selectedFilters.roomType.includes(room)} onchange={(checked)=> handleFilterChange(checked, room, "roomType")}/>
                ))}
              </div>

                <div className='px-5 pt-5'>
                <p className='font-medium text-gray-800 pb-2'>Price Range</p>

                {priceRanges.map((range, index)=>(
                  <CheckBox key={index} label={`${currency} ${range}`} selected={selectedFilters.priceRange.includes(range)} onchange={(checked)=> handleFilterChange(checked, range, "priceRange")}/>
                ))}
              </div>

              <div className='px-5 pt-5 pb-7'>
                <p className='font-medium text-gray-800 pb-2'>Sort By</p>

                {sortOptions.map((option, index)=>(
                  <RadioButton key={index} label={option} selected={selectedSort === option} onchange={()=> handleSortChange(option)}/>
                ))}
              </div>
            </div>
          </div>
        </div>
    )
}

export default AllRooms
