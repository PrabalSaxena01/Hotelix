import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { assets } from '../assets/assets';
import { useClerk, UserButton } from '@clerk/clerk-react';
import { useAppContext } from '../context/AppContext';

const BookIcon = () => (
    <svg className="w-4 h-4 text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 19V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v13H7a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h12M9 3v14m7 0v4" />
    </svg>
);

const Navbar = () => {
    const navLinks = [
        { name: 'Home', path: '/', isSection: false },
        { name: 'Hotels', path: '/rooms', isSection: false },
        { name: 'Offers', path: '/promotions', isSection: false },
        { name: 'Amenities', path: '/utilities', isSection: false },
        { name: 'Add-Ons', path: '/add-ons', isSection: false },
        { name: 'Policies', path: '/policies', isSection: false },
        { name: 'Contact', path: '/contact', isSection: false },
    ];

    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { openSignIn } = useClerk();
    const location = useLocation();

    const { user, navigate, setShowHotelReg, isOwner, loadingUser } = useAppContext();

    useEffect(() => {
        if (location.pathname !== '/') {
            setIsScrolled(true);
            return;
        } else {
            setIsScrolled(false);
        }

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10 || location.pathname !== '/');
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [location.pathname]);

    const handleNavClick = (link) => {
        setIsMenuOpen(false);
        if (link.isSection) {
            if (location.pathname === '/') {
                const el = document.getElementById(link.sectionId);
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                navigate(`/#${link.sectionId}`);
            }
        }
    };

    const isLinkActive = (link) => {
        if (link.isSection) {
            return location.pathname === '/' && location.hash === `#${link.sectionId}`;
        }
        if (link.path === '/') {
            return location.pathname === '/' && !location.hash;
        }
        return location.pathname.startsWith(link.path);
    };

    return (
        <nav className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-300 z-50 ${isScrolled ? "bg-white/90 shadow-sm text-gray-800 backdrop-blur-md py-3 md:py-4" : "py-4 md:py-6 text-white"}`}>

            {/* Logo */}
            <Link to='/' className="flex items-center gap-2 group transition-transform active:scale-95" aria-label="Hotelix Home">
                <img src={assets.logo} alt="Hotelix" className={`h-9 transition-all duration-300 ${isScrolled ? "invert opacity-90" : "opacity-100"}`} />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
                {navLinks.map((link, i) => {
                    const active = isLinkActive(link);
                    return link.isSection ? (
                        <button
                            key={i}
                            onClick={() => handleNavClick(link)}
                            className={`group relative flex flex-col gap-0.5 text-sm font-medium transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-1 ${
                                active
                                    ? (isScrolled ? "text-blue-600 font-semibold" : "text-white font-semibold")
                                    : (isScrolled ? "text-gray-700 hover:text-black" : "text-white/80 hover:text-white")
                            }`}
                        >
                            <span>{link.name}</span>
                            <div className={`h-0.5 transition-all duration-300 ${isScrolled ? "bg-blue-600" : "bg-white"} ${active ? "w-full" : "w-0 group-hover:w-full"}`} />
                        </button>
                    ) : (
                        <NavLink
                            key={i}
                            to={link.path}
                            className={`group relative flex flex-col gap-0.5 text-sm font-medium transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-1 ${
                                active
                                    ? (isScrolled ? "text-blue-600 font-semibold" : "text-white font-semibold")
                                    : (isScrolled ? "text-gray-700 hover:text-black" : "text-white/80 hover:text-white")
                            }`}
                        >
                            <span>{link.name}</span>
                            <div className={`h-0.5 transition-all duration-300 ${isScrolled ? "bg-blue-600" : "bg-white"} ${active ? "w-full" : "w-0 group-hover:w-full"}`} />
                        </NavLink>
                    );
                })}

                <button
                    className={`border px-3.5 py-1.5 text-xs tracking-wide uppercase font-semibold rounded-full cursor-pointer transition-all duration-200 active:scale-95 ${
                        isScrolled
                            ? 'border-gray-800 text-gray-800 hover:bg-gray-900 hover:text-white'
                            : 'border-white text-white hover:bg-white hover:text-gray-900'
                    }`}
                    onClick={() => isOwner ? navigate('/owner') : (user ? setShowHotelReg(true) : navigate('/owner'))}
                >
                    {isOwner ? 'Owner Dashboard' : (user ? 'Register Hotel' : 'Hotel Portal')}
                </button>
            </div>

            {/* Desktop Right */}
            <div className="hidden md:flex items-center gap-4">
                <button
                    onClick={() => navigate('/rooms')}
                    className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer active:scale-90"
                    title="Search Hotels"
                    aria-label="Search Hotels"
                >
                    <img src={assets.searchIcon} alt="Search" className={`${isScrolled && "invert"} h-6 w-6 transition-all duration-300`} />
                </button>

                {user ? (
                    <UserButton>
                        <UserButton.MenuItems>
                            <UserButton.Action label='My Bookings' labelIcon={<BookIcon />} onClick={() => navigate('/my-bookings')} />
                        </UserButton.MenuItems>
                    </UserButton>
                ) : (
                    <button
                        onClick={openSignIn}
                        className="bg-black hover:bg-neutral-800 active:scale-95 text-white px-7 py-2 text-sm font-medium rounded-full ml-2 transition-all duration-200 cursor-pointer shadow-sm hover:shadow"
                    >
                        Login
                    </button>
                )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-3 md:hidden">
                {user && (
                    <UserButton>
                        <UserButton.MenuItems>
                            <UserButton.Action label='My Bookings' labelIcon={<BookIcon />} onClick={() => navigate('/my-bookings')} />
                        </UserButton.MenuItems>
                    </UserButton>
                )}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle navigation menu"
                    className="p-1.5 rounded-lg active:scale-90 transition-transform cursor-pointer"
                >
                    <img src={assets.menuIcon} alt="Menu" className={`${isScrolled && "invert"} h-5 w-5`} />
                </button>
            </div>

            {/* Mobile Menu */}
            <div className={`fixed top-0 left-0 w-full h-screen bg-white text-base flex flex-col md:hidden items-center justify-center gap-6 font-medium text-gray-800 transition-all duration-300 z-50 ${isMenuOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 pointer-events-none"}`}>
                <button
                    className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 active:scale-90 transition-all cursor-pointer"
                    onClick={() => setIsMenuOpen(false)}
                    aria-label="Close menu"
                >
                    <img src={assets.closeIcon} alt="Close" className='h-6 w-6' />
                </button>

                {navLinks.map((link, i) => {
                    const active = isLinkActive(link);
                    return link.isSection ? (
                        <button
                            key={i}
                            onClick={() => handleNavClick(link)}
                            className={`text-xl font-medium px-6 py-2 rounded-full transition-all cursor-pointer ${
                                active ? "bg-blue-50 text-blue-600 font-semibold" : "text-gray-700 hover:text-black hover:bg-gray-50 active:scale-95"
                            }`}
                        >
                            {link.name}
                        </button>
                    ) : (
                        <NavLink
                            key={i}
                            to={link.path}
                            onClick={() => setIsMenuOpen(false)}
                            className={`text-xl font-medium px-6 py-2 rounded-full transition-all cursor-pointer ${
                                active ? "bg-blue-50 text-blue-600 font-semibold" : "text-gray-700 hover:text-black hover:bg-gray-50 active:scale-95"
                            }`}
                        >
                            {link.name}
                        </NavLink>
                    );
                })}

                <button
                    className="mt-4 border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-6 py-2 text-sm font-medium rounded-full cursor-pointer transition-all active:scale-95"
                    onClick={() => {
                        setIsMenuOpen(false);
                        isOwner ? navigate('/owner') : (user ? setShowHotelReg(true) : navigate('/owner'));
                    }}
                >
                    {isOwner ? 'Owner Dashboard' : (user ? 'Register Hotel' : 'Hotel Owner Portal')}
                </button>

                {!user && (
                    <button
                        onClick={() => {
                            setIsMenuOpen(false);
                            openSignIn();
                        }}
                        className="mt-4 bg-black hover:bg-neutral-800 text-white px-8 py-2.5 rounded-full font-medium transition-all active:scale-95 cursor-pointer shadow"
                    >
                        Login
                    </button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;