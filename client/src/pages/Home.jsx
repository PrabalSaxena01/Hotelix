import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Hero from '../components/Hero'
import FeaturedDestination from '../components/FeaturedDestination'
import ExclusiveOffers from '../components/ExclusiveOffers'
import Testimonial from '../components/Testimonial'
import Newsletter from '../components/Newsletter'
import RecommendedHotels from '../components/RecommendedHotels'

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  return (
    <div>
        <Hero/>
        <RecommendedHotels/>
        <div id="experience">
          <FeaturedDestination/>
          <ExclusiveOffers/>
        </div>
        <div id="about">
          <Testimonial />
          <Newsletter />
        </div>
    </div>
  )
}

export default Home