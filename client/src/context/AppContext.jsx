import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';
import { useUser, useAuth} from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import {toast} from 'react-hot-toast';
import { roomsDummyData } from '../assets/assets';

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

const AppContext = createContext();

export const AppProvider = ({ children }) => {

    const currency = import.meta.env.VITE_CURRENCY || import.meta.env.CURRENCY || '$';
    const {user} = useUser();
    const { getToken } = useAuth();
    const navigate = useNavigate();

    const [isOwner, setIsOwner] = useState(false);
    const [loadingUser, setLoadingUser] = useState(true); // NEW
    const [showHotelReg, setShowHotelReg] = useState(false);
    const [searchedCities, setSearchedCities] = useState(["New York", "Dubai", "Singapore"]);
    const [rooms, setRooms] = useState(roomsDummyData);
    
    const fetchRooms = async () => {
        try {
            const {data} = await axios.get('/api/rooms');
            if(data && data.success && data.rooms && data.rooms.length > 0) {
                setRooms(data.rooms);
            }
        } catch (error) {
            console.log("Backend offline or loading, using preloaded demo rooms");
        }
    }

    const fetchUser = async () => {
        try {
            setLoadingUser(true);
            const response = await axios.get('/api/user', {
            headers: { Authorization: `Bearer ${await getToken()}` }
            });

            if (response.data.success) {
            setIsOwner(response.data.role === "hotelOwner");
            setSearchedCities(response.data.recentSearchedCities);
            } else {
            setTimeout(fetchUser, 5000);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoadingUser(false);
        }
    }


    useEffect(() => {
        if(user) {
            fetchUser();
        } else {
            setLoadingUser(false); // user is definitely null
        }
    }, [user])

    useEffect(() => {
        fetchRooms();
    }, []);

    const value = {
        currency,
        user,
        getToken,
        navigate,
        isOwner,
        setIsOwner,
        showHotelReg,
        setShowHotelReg,
        axios,
        searchedCities,
        setSearchedCities,
        rooms,
        setRooms,
        loadingUser,
        fetchUser,
    }

    return (
        <AppContext.Provider value={value}>
        {children}
        </AppContext.Provider>
    );
}

export const useAppContext = () => useContext(AppContext);