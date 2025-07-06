// components/ClientLogoSlider.jsx
import React from 'react';
import Marquee from 'react-fast-marquee';

// Import your client logos
import logo1 from '../../../assets/brands/amazon.png';
import logo2 from '../../../assets/brands/amazon_vector.png';
import logo3 from '../../../assets/brands/casio.png';
import logo4 from '../../../assets/brands/moonstar.png';
import logo5 from '../../../assets/brands/randstad.png';
import logo6 from '../../../assets/brands/start-people 1.png';
import logo7 from '../../../assets/brands/start.png';

const ClientLogoSlider = () => {
  const logos = [logo1, logo2, logo3, logo4, logo5, logo6, logo7];

  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto text-center mb-8">
        <h2 className="text-3xl font-bold text-base-content mb-2">We've helped thousands of sales teams</h2>
      </div>

      <Marquee gradient={false} speed={40}>
        {logos.map((logo, idx) => (
          <div key={idx} className="mx-8 flex items-center justify-center">
            <img
              src={logo}
              alt={`Client Logo ${idx + 1}`}
              className="h-6 mx-14 w-auto object-contain"
            />
          </div>
        ))}
      </Marquee>
    </section>
  );
};

export default ClientLogoSlider;
