// components/Benefits.jsx
import React from 'react';
import trackingImg from '../../../assets/live-tracking.png';
import safeImg from '../../../assets/safe-delivery.png';
import supportImg from '../../../assets/live-tracking.png';

const benefits = [
    {
        id: 1,
        title: 'Live Parcel Tracking',
        description: 'Stay updated in real-time with our live parcel tracking feature. From pick-up to delivery, monitor your shipment\'s journey and get instant status updates for complete peace of mind.',
        image: trackingImg
    },
    {
        id: 2,
        title: '100% Safe Delivery',
        description: 'We ensure your parcels are handled with the utmost care and delivered securely to their destination. Our reliable process guarantees safe and damage-free delivery every time.',
        image: safeImg
    },
    {
        id: 3,
        title: '24/7 Call Center Support',
        description: 'Our dedicated support team is available around the clock to assist you with any questions, updates, or delivery concerns—anytime you need us.',
        image: supportImg
    }
];

const Benefits = () => {
    return (
        <section className="py-14">
            <div className="mx-auto w-full">
                <h2 className="text-3xl font-bold text-center mb-12 text-base-content">
                    Why Choose <span className="text-primary">Profast?</span>
                </h2>

                <div className="space-y-10">
                    {benefits.map((benefit) => (
                        <div
                            key={benefit.id}
                            className="card p-8 md:p-2 md:card-side w-full rounded-2xl bg-white flex items-center  shadow-md hover:shadow-xl transition duration-300"
                        >
                            {/* Left Illustration */}
                            <div className="p-6 w-fit flex justify-center items-center">
                                <img
                                    src={benefit.image}
                                    alt={benefit.title}
                                    className="w-52 h-52 object-contain"
                                />
                            </div>

                            {/* Dotted Vertical Line (hidden on small screens) */}
                            <div className='flex justify-center items-center'>
                                <div className="hidden md:block w-px bg-dotted h-36 mx-8 border-r-[1.5px] border-dashed border-gray-500"></div>
                            </div>


                            {/* Right Content */}
                            <div className="md:w-2/3 flex flex-col justify-center">
                                <h3 className="card-title text-xl text-base-content">{benefit.title}</h3>
                                <p className="text-base-content/70">{benefit.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="hidden md:block w-full bg-dotted mt-18  border-b-[1.5px] border-dashed border-gray-500"></div>
            </div>
        </section>
    );
};

export default Benefits;
