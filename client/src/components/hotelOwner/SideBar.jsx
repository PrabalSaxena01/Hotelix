import React from 'react';
import { assets } from '../../assets/assets';
import { NavLink } from 'react-router-dom';
import { 
  FileText, 
  Sparkles, 
  Tag, 
  Waves, 
  HelpCircle, 
  Inbox,
  LayoutDashboard,
  PlusCircle,
  BedDouble
} from 'lucide-react';

const SideBar = () => {
    const sideBarLinks = [
        { name: "Dashboard", path: "/owner", icon: <LayoutDashboard className="w-5 h-5 min-w-5" /> },
        { name: "Add Room", path: "/owner/add-room", icon: <PlusCircle className="w-5 h-5 min-w-5" /> },
        { name: "List Rooms", path: "/owner/list-room", icon: <BedDouble className="w-5 h-5 min-w-5" /> },
        { name: "Policies", path: "/owner/policies", icon: <FileText className="w-5 h-5 min-w-5" /> },
        { name: "Add-Ons", path: "/owner/add-ons", icon: <Sparkles className="w-5 h-5 min-w-5" /> },
        { name: "Promotions", path: "/owner/promotions", icon: <Tag className="w-5 h-5 min-w-5" /> },
        { name: "Utilities", path: "/owner/utilities", icon: <Waves className="w-5 h-5 min-w-5" /> },
        { name: "FAQs", path: "/owner/faqs", icon: <HelpCircle className="w-5 h-5 min-w-5" /> },
        { name: "Guest Inquiries", path: "/owner/inquiries", icon: <Inbox className="w-5 h-5 min-w-5" /> },
    ];

    return (
        <aside className='md:w-64 w-16 border-r h-full text-base border-gray-200 py-4 flex flex-col transition-all duration-300 select-none overflow-y-auto bg-white'>
            <div className="px-4 pb-2 mb-2 hidden md:block">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Owner Management</span>
            </div>
            {sideBarLinks.map((link, index) => (
                <NavLink
                    to={link.path}
                    key={index}
                    end={link.path === '/owner'}
                    className={({ isActive }) =>
                        `flex items-center py-3 px-4 md:px-6 gap-3.5 transition-all duration-200 outline-none focus-visible:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-500 active:scale-[0.98] ${
                            isActive
                                ? 'border-r-4 md:border-r-[5px] bg-blue-50/80 border-blue-600 text-blue-600 font-semibold'
                                : 'border-r-4 border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`
                    }
                >
                    <div className='transition-transform duration-200 group-hover:scale-105'>
                        {link.icon}
                    </div>
                    <p className='md:block hidden text-xs md:text-sm font-medium'>{link.name}</p>
                </NavLink>
            ))}
        </aside>
    );
};

export default SideBar;