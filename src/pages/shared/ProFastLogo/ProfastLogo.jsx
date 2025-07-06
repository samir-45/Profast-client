import React from 'react';
import logo from '../../../assets/logo.png'
import { Link } from 'react-router';

const ProfastLogo = () => {
    return (
<Link to='/'>
        <div className='flex -space-x-4 w-9 items-baseline'>
            <img src={logo} alt="" />
            <p className='text-3xl font-bold'>Profast</p>
        </div>
</Link>
    );
};

export default ProfastLogo;