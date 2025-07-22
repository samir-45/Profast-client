import React from 'react';
import { NavLink, Outlet } from 'react-router';
import ProfastLogo from '../pages/shared/ProFastLogo/ProfastLogo';
import { MdDashboard } from "react-icons/md";
import { FaBoxOpen, FaHistory, FaSearchLocation, FaUserCheck, FaUserClock, FaUserEdit, FaUserPlus, FaUserShield } from "react-icons/fa";
import useUserRole from '../Hooks/useUserRole';
// import { TbPackageSearch } from "react-icons/tb"; // Tabler icon

const DashBoardLayout = () => {

    const { role, roleLoading } = useUserRole()
    console.log(role)

    return (
        <div>
            <div className="drawer lg:drawer-open">
                <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content flex flex-col">
                    <div className="navbar lg:hidden bg-base-300 w-full">
                        <div className="flex-none lg:hidden">
                            <label htmlFor="my-drawer-2" aria-label="open sidebar" className="btn btn-square btn-ghost">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    className="inline-block h-6 w-6 stroke-current"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    ></path>
                                </svg>
                            </label>
                        </div>
                        <div className="mx-2 flex-1 px-2 lg:hidden">Dashboard</div>
                    </div>
                    {/* Page content here */}
                    <Outlet></Outlet>
                </div>
                <div className="drawer-side">
                    <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                    <ul className="menu bg-base-200 text-base-content space-y-2 min-h-full w-80 p-4">
                        {/* Sidebar content here */}
                        <ProfastLogo></ProfastLogo>
                        <li>
                            <NavLink to="/dashboard">
                                <MdDashboard className="inline mr-2" /> Home
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/dashboard/myParcels">
                                <FaBoxOpen className="inline mr-2" /> My Parcels
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/dashboard/paymentHistory">
                                <FaHistory className="inline mr-2" /> Payment History
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/dashboard/track">
                                <FaSearchLocation className="inline mr-2" /> Track Your Package
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/dashboard/profile">
                                <FaUserEdit className="inline mr-2" /> Update Profile
                            </NavLink>
                        </li>
                        {!roleLoading && role === 'admin' &&
                            <>
                                <li>
                                    <NavLink to="/dashboard/assignRider">
                                        <FaUserPlus className="inline mr-2" /> Assign Rider
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/dashboard/activeRiders">
                                        <FaUserCheck className="inline mr-2" /> Active Riders
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/dashboard/pendingRiders">
                                        <FaUserClock className="inline mr-2" /> Pending Riders
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/dashboard/makeAdmin">
                                        <FaUserShield className="inline mr-2" /> Make Admin
                                    </NavLink>
                                </li>
                            </>
                        }

                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DashBoardLayout;