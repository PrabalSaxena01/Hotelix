import React, { useEffect } from 'react';
import NavBar from '../../components/hotelOwner/NavBar';
import SideBar from '../../components/hotelOwner/SideBar';
import { Outlet } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const Layout = () => {
    const { isOwner, setIsOwner, navigate, loadingUser, fetchUser } = useAppContext();

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <div className='flex flex-col h-screen overflow-hidden'>
           <NavBar />

           <div className='flex h-[calc(100vh-64px)] overflow-hidden'>
            <SideBar />
            <main className='flex-1 p-4 md:p-8 lg:p-10 overflow-y-auto bg-gray-50/50'>
                {!isOwner && !loadingUser ? (
                    <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-2xl border border-gray-200 text-center shadow-lg">
                        <h2 className="text-xl font-bold text-gray-900 font-playfair mb-2">Hotelix Owner Portal</h2>
                        <p className="text-sm text-gray-600 mb-6">
                            You are not currently logged in as a registered hotel owner.
                        </p>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => setIsOwner(true)}
                                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all cursor-pointer"
                            >
                                Continue as Demo Hotel Owner
                            </button>
                            <button
                                onClick={() => navigate("/")}
                                className="w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                            >
                                Return to Homepage
                            </button>
                        </div>
                    </div>
                ) : (
                    <Outlet />
                )}
            </main>
           </div>
        </div>
    );
};

export default Layout;