import React from 'react';
import { NavLink } from 'react-router';
import ProfastLogo from '../ProFastLogo/ProfastLogo';
import useAuth from '../../../Hooks/useAuth';

const NavBar = () => {

    const { logOut, user } = useAuth()

    const navItems = <>
        <li><NavLink to='/'>Services</NavLink></li>
        <li><NavLink to='/coverage'>Coverage</NavLink></li>
        <li><NavLink to='/'>About Us</NavLink></li>
        <li><NavLink to='/'>Pricing</NavLink></li>
        {
            user && <>
                <li><NavLink to='/dashboard'>Dashboard</NavLink></li>
            </>
        }
        <li><NavLink to='/sendParcel'>Send a Parcel</NavLink></li>
        <li><NavLink to='/'>Be a Rider</NavLink></li>
    </>


    const handleSignOut = () => {
        logOut()
            .then(res => {
                console.log(res)
            })
            .catch(err => {
                console.log(err)
            })
    }

    return (
        <div>
            <div className="navbar bg-white my-5 rounded-xl shadow-sm">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                            {navItems}
                        </ul>
                    </div>

                    <div className='mx-3'>
                        <ProfastLogo></ProfastLogo>
                    </div>


                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1">
                        {navItems}
                    </ul>
                </div>
                <div className="navbar-end space-x-3">
                    {
                        user ? <NavLink onClick={handleSignOut} className='btn bg-transparent  rounded-xl'>LogOut</NavLink> : <>
                            <NavLink className='btn bg-transparent  rounded-xl' to='/login'>SignIn</NavLink>
                            <NavLink className='btn bg-transparent  rounded-xl' to='/register'>Register</NavLink>
                        </>
                    }


                </div>
            </div>
        </div>
    );
};

export default NavBar;