import React from 'react';
import Banner from './Banner/Banner';
import Services from './Services/Services';
import ClientLogoSlider from './ClientLogoSlider/ClientLogoSlider';
import Benefits from './Benefits/Benefits';
import BeMerchant from './BeMerchant/BeMerchant';
import HowItWorks from './HowItWorks/HowItWorks';
import ReviewSlider from './ReviewSlider/ReviewSlider';

const Home = () => {
    return (
        <div>
            <div><Banner></Banner></div>
            <div><HowItWorks></HowItWorks></div>
            <div><Services></Services></div>
            <div><ClientLogoSlider></ClientLogoSlider></div>
            <div><Benefits></Benefits></div>
            <div><BeMerchant></BeMerchant></div>
            <div><ReviewSlider></ReviewSlider></div>
        </div>
    );
};

export default Home;