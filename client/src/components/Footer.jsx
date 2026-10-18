import React from 'react';
import { assets } from '../assets/assets';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className='bg-[#F6F9FC] text-gray-500/80 pt-16 px-6 md:px-16 lg:px-24 xl:px-32'>
            <div className='flex flex-wrap justify-between gap-12 md:gap-6'>
                <div className='max-w-80'>
                    <Link to='/' className="inline-block group active:scale-95 transition-transform" aria-label="Hotelix Home">
                        <img src={assets.logo} alt="Hotelix" className='mb-4 h-8 md:h-9 invert opacity-80 group-hover:opacity-100 transition-opacity' />
                    </Link>
                    <p className='text-sm text-gray-600'>
                        Discover the world's most extraordinary places to stay, from boutique hotels to luxury villas.
                    </p>
                    <div className='flex items-center gap-2 mt-5'>
                        {/* Instagram */}
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className='p-2 rounded-full hover:bg-gray-200/70 hover:scale-110 active:scale-95 transition-all duration-200'>
                            <img src={assets.instagramIcon} alt="Instagram" className='w-5 h-5'/>
                        </a>
                        
                        {/* Facebook */}
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className='p-2 rounded-full hover:bg-gray-200/70 hover:scale-110 active:scale-95 transition-all duration-200'>
                            <img src={assets.facebookIcon} alt="Facebook" className='w-5 h-5'/>
                        </a>
                        
                        {/* Twitter */}
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className='p-2 rounded-full hover:bg-gray-200/70 hover:scale-110 active:scale-95 transition-all duration-200'>
                            <img src={assets.twitterIcon} alt="Twitter" className='w-5 h-5'/>
                        </a>
                        
                        {/* LinkedIn */}
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className='p-2 rounded-full hover:bg-gray-200/70 hover:scale-110 active:scale-95 transition-all duration-200'>
                            <img src={assets.linkedinIcon} alt="LinkedIn" className='w-5 h-5'/>
                        </a>
                    </div>
                </div>

                <div>
                    <p className='font-playfair text-base font-semibold tracking-wider text-gray-800 uppercase'>Company</p>
                    <ul className='mt-4 flex flex-col gap-2.5 text-sm'>
                        <li><Link to="/#about" className="hover:text-blue-600 hover:translate-x-1 transition-all duration-200 inline-block">About Us</Link></li>
                        <li><Link to="/rooms" className="hover:text-blue-600 hover:translate-x-1 transition-all duration-200 inline-block">Destinations</Link></li>
                        <li><Link to="/#experience" className="hover:text-blue-600 hover:translate-x-1 transition-all duration-200 inline-block">Experiences</Link></li>
                        <li><a href="#about" className="hover:text-blue-600 hover:translate-x-1 transition-all duration-200 inline-block">Careers</a></li>
                        <li><a href="#about" className="hover:text-blue-600 hover:translate-x-1 transition-all duration-200 inline-block">Partners</a></li>
                    </ul>
                </div>

                <div>
                    <p className='font-playfair text-base font-semibold tracking-wider text-gray-800 uppercase'>Support</p>
                    <ul className='mt-4 flex flex-col gap-2.5 text-sm'>
                        <li><a href="#support" className="hover:text-blue-600 hover:translate-x-1 transition-all duration-200 inline-block">Help Center</a></li>
                        <li><a href="#support" className="hover:text-blue-600 hover:translate-x-1 transition-all duration-200 inline-block">Safety Information</a></li>
                        <li><a href="#support" className="hover:text-blue-600 hover:translate-x-1 transition-all duration-200 inline-block">Cancellation Options</a></li>
                        <li><a href="mailto:support@hotelix.com" className="hover:text-blue-600 hover:translate-x-1 transition-all duration-200 inline-block">Contact Us</a></li>
                        <li><a href="#support" className="hover:text-blue-600 hover:translate-x-1 transition-all duration-200 inline-block">Accessibility</a></li>
                    </ul>
                </div>

                <div className='max-w-80'>
                    <p className='font-playfair text-base font-semibold tracking-wider text-gray-800 uppercase'>Stay Updated</p>
                    <p className='mt-4 text-sm text-gray-600'>
                        Subscribe to our newsletter for curated destinations and exclusive seasonal discounts.
                    </p>
                    <form onSubmit={(e) => { e.preventDefault(); alert('Thank you for subscribing to Hotelix!'); }} className='flex items-center mt-4'>
                        <input
                            type="email"
                            required
                            className='bg-white rounded-l border border-gray-300 h-10 px-3.5 text-sm text-gray-800 outline-none focus:border-blue-500 transition-colors w-full'
                            placeholder='Your email address'
                        />
                        <button
                            type="submit"
                            aria-label="Subscribe"
                            className='flex items-center justify-center bg-black hover:bg-neutral-800 active:scale-95 h-10 w-10 aspect-square rounded-r transition-all duration-200 cursor-pointer shadow-sm'
                        >
                            <svg className="w-4 h-4 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 12H5m14 0-4 4m4-4-4-4" />
                            </svg>
                        </button>
                    </form>
                </div>
            </div>

            <hr className='border-gray-200 mt-12' />

            <div className='flex flex-col md:flex-row gap-3 items-center justify-between py-6 text-xs text-gray-500'>
                <p>© {new Date().getFullYear()} Hotelix. All rights reserved.</p>
                <ul className='flex items-center gap-5'>
                    <li><a href="#privacy" className='hover:text-black hover:underline transition-colors'>Privacy Policy</a></li>
                    <li><a href="#terms" className='hover:text-black hover:underline transition-colors'>Terms of Service</a></li>
                    <li><a href="#sitemap" className='hover:text-black hover:underline transition-colors'>Sitemap</a></li>
                </ul>
            </div>
        </footer>
    );
};

export default Footer;