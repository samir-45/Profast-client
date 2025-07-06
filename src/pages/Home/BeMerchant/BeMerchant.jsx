import React from 'react';
import lication from '../../../assets/location-merchant.png'

const BeMerchant = () => {
    return (
        <div>
            <div data-aos="fade-up" className="bg-no-repeat bg-[url('assets/be-a-merchant-bg.png')] md:p-20 p-10 rounded-2xl bg-[#03373D] overflow-hidden">
                <div className="flex flex-col lg:flex-row justify-between">
                    <div className='lg:w-2/3 py-5 '>
                        <h1 className="text-4xl text-center md:text-start text-white font-bold">Merchant and Customer Satisfaction is Our First Priority</h1>
                        <p className="py-6 text-gray-300">
                            We offer the lowest delivery charge with the highest value along with 100% safety of your product. Pathao courier delivers your parcels in every corner of Bangladesh right on time.
                        </p>
                        <div className='mx-auto flex md:mx-0 w-fit gap-3'>
                            <button className="text-sm md:text-lg px-5 font-semibold transition-all hover:bg-[#b8d26b] cursor-pointer py-2 border-none text-white rounded-full bg-[#CAEB66]">Become a Merchant</button>
                            <button className="text-sm md:text-lg px-5 font-semibold transition-all hover:bg-[#caeb6631] cursor-pointer py-2 border bg-transparent text-[#CAEB66] rounded-full border-[#CAEB66]">Earn with Profast Courier</button>
                        </div>

                    </div>

                    <div className=''>
                        <img
                            src={lication}
                            className="max-w-sm mx-auto rounded-lg "
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BeMerchant;