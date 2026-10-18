import React from 'react';
import { assets } from '../../assets/assets';
import { NavLink } from 'react-router-dom';

const SideBar = () => {
    const sideBarLinks = [
        { name: "Dashboard", path: "/owner", icon: assets.dashboardIcon },
        { name: "Add Room", path: "/owner/add-room", icon: assets.addIcon },
        { name: "List Room", path: "/owner/list-room", icon: assets.listIcon },
    ];

    return (
        <aside className='md:w-64 w-16 border-r h-full text-base border-gray-300 pt-4 flex flex-col transition-all duration-300 select-none'>
            {sideBarLinks.map((link, index) => (
                <NavLink
                    to={link.path}
                    key={index}
                    end={link.path === '/owner'}
                    className={({ isActive }) =>
                        `flex items-center py-3.5 px-4 md:px-8 gap-3.5 transition-all duration-200 outline-none focus-visible:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-500 active:scale-[0.98] ${
                            isActive
                                ? 'border-r-4 md:border-r-[6px] bg-blue-50 border-blue-600 text-blue-600 font-semibold shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]'
                                : 'border-r-4 border-transparent text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }`
                    }
                >
                    <img src={link.icon} alt={link.name} className='w-5 h-5 min-w-5 transition-transform duration-200 group-hover:scale-105' />
                    <p className='md:block hidden text-sm'>{link.name}</p>
                </NavLink>
            ))}
        </aside>
    );
};

export default SideBar;