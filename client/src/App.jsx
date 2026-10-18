import React from 'react';
import Navbar from './components/Navbar';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Footer from './components/Footer';
import AllRooms from './pages/AllRooms';
import RoomDetails from './pages/RoomDetails';
import { useUser } from '@clerk/clerk-react';
import MyBookings from './pages/MyBookings';
import Error404 from './components/Error404';
import HotelReg from './components/HotelReg';
import Layout from './pages/hotelOwner/Layout';
import Dashboard from './pages/hotelOwner/Dashboard';
import AddRoom from './pages/hotelOwner/AddRoom';
import ListRoom from './pages/hotelOwner/ListRoom';
import ManagePolicies from './pages/hotelOwner/ManagePolicies';
import ManageAddOns from './pages/hotelOwner/ManageAddOns';
import ManagePromotions from './pages/hotelOwner/ManagePromotions';
import ManageUtilities from './pages/hotelOwner/ManageUtilities';
import ManageFaqs from './pages/hotelOwner/ManageFaqs';
import InquiriesList from './pages/hotelOwner/InquiriesList';

// Public pages
import Policies from './pages/Policies';
import Promotions from './pages/Promotions';
import AddOns from './pages/AddOns';
import Utilities from './pages/Utilities';
import FaqPage from './pages/FaqPage';
import Contact from './pages/Contact';

import { Toaster } from 'react-hot-toast';
import { useAppContext } from './context/AppContext';
import Loader from './components/Loader';

const App = () => {
  const user = useUser();
  const isOwnerPath = useLocation().pathname.includes("owner");
  const { showHotelReg } = useAppContext();

  return (
    <div>
      <Toaster position="top-right" />
      {!isOwnerPath && <Navbar />}
      {showHotelReg && <HotelReg />}
      <div className='min-h-[70vh]'>
        <Routes>
          {/* Public Guest Routes */}
          <Route path='/' element={<Home />} />
          <Route path='/rooms' element={<AllRooms />} />
          <Route path='/rooms/:id' element={<RoomDetails />} />
          <Route path='/policies' element={<Policies />} />
          <Route path='/promotions' element={<Promotions />} />
          <Route path='/add-ons' element={<AddOns />} />
          <Route path='/utilities' element={<Utilities />} />
          <Route path='/faqs' element={<FaqPage />} />
          <Route path='/contact' element={<Contact />} />

          {/* User Bookings */}
          {user && <Route path='/my-bookings' element={<MyBookings />} />}
          <Route path='/loader/:nextUrl' element={<Loader />} />

          {/* Hotel Owner Dashboard & Dynamic CRUD Routes */}
          <Route path='/owner' element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path='add-room' element={<AddRoom />} />
            <Route path='list-room' element={<ListRoom />} />
            <Route path='policies' element={<ManagePolicies />} />
            <Route path='add-ons' element={<ManageAddOns />} />
            <Route path='promotions' element={<ManagePromotions />} />
            <Route path='utilities' element={<ManageUtilities />} />
            <Route path='faqs' element={<ManageFaqs />} />
            <Route path='inquiries' element={<InquiriesList />} />
          </Route>

          {/* Catch-all 404 */}
          <Route path='*' element={<Error404 />} />
        </Routes>
      </div>
      {!isOwnerPath && <Footer />}
    </div>
  );
};

export default App;