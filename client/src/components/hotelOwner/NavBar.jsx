import React from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { UserButton } from '@clerk/clerk-react';

const NavBar = () => {
    return (
        <header className='flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white transition-all duration-300'>
             <div className="flex items-center gap-6">
                <Link to='/' className="group active:scale-95 transition-transform" aria-label="Hotelix Home">
                    <img src={assets.logo} alt="Hotelix" className='h-9 invert opacity-80 group-hover:opacity-100 transition-opacity' />
                </Link>
                <Link
                    to='/'
                    className='hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-blue-600 px-3 py-1.5 rounded-full hover:bg-blue-50 transition-all border border-transparent hover:border-blue-200'
                >
                    <span>← Back to Website</span>
                </Link>
             </div>

             <div className="flex items-center gap-4">
                <UserButton />
             </div>
        </header>
    );
};

export default NavBar;