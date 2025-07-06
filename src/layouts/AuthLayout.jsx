import React from 'react';
import { Outlet } from 'react-router';
import authImage from '../assets/authImage.png'
import ProfastLogo from '../pages/shared/ProFastLogo/ProfastLogo';

const AuthLayout = () => {
    return (
        <div className="place-items-center w-full border h-screen grid grid-cols-2">
            <div className='w-full h-full flex justify-center items-center bg-white'>
                <Outlet></Outlet>
            </div>
            <div className='bg-[#FAFDF0] flex justify-center items-center w-full h-full'>
                <img
                    src={authImage}
                    className=""
                />
            </div>
        </div>


    );
};

export default AuthLayout;