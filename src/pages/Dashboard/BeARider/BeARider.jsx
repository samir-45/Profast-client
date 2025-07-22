import { useForm } from 'react-hook-form';
import { useLoaderData } from 'react-router';
import { useState, useMemo } from 'react';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import useAuth from '../../../Hooks/useAuth';
import rider from "../../../assets/agent-pending.png";

const BeARider = () => {
    const { user } = useAuth();
    const warehouses = useLoaderData(); // Make sure to pass warehouses via loader
    const { register, handleSubmit, reset } = useForm();
    const axiosSecure = useAxiosSecure();

    const [selectedRegion, setSelectedRegion] = useState("");

    const uniqueRegions = useMemo(() => {
        const regions = new Set(warehouses.map(w => w.region));
        return Array.from(regions);
    }, [warehouses]);

    const getDistrictsByRegion = (region) => {
        return warehouses
            .filter(w => w.region === region)
            .flatMap(w => w.covered_area);
    };

    const onSubmit = async (data) => {
        const riderApplication = {
            ...data,
            name: user?.displayName || "Anonymous",
            email: user?.email || "unknown@example.com",
            status: 'pending',
            applied_at: new Date().toISOString(),
        };

        try {
            const res = await axiosSecure.post('/riders', riderApplication);
            if (res.data.insertedId) {
                Swal.fire({
                    icon: 'success',
                    title: 'Application Submitted!',
                    text: 'Your application to be a rider is submitted successfully.',
                });
                reset();
                setSelectedRegion("");
            }
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: 'error',
                title: 'Submission Failed',
                text: 'Something went wrong. Please try again later.',
            });
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6 bg-base-200 rounded-xl shadow">
            <h1 className="text-2xl font-bold mb-4">Become a Rider</h1>
            <div className='grid md:grid-cols-2 place-items-center'>
                <div className=' w-full'>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input
                                {...register("name", { required: true })}
                                value={user?.displayName || ""}
                                readOnly
                                className="input input-bordered"
                                placeholder="Name"
                            />
                            <input
                                {...register("email", { required: true })}
                                value={user?.email || ""}
                                readOnly
                                className="input input-bordered"
                                placeholder="Email"
                            />

                            <select
                                {...register("region", { required: true })}
                                className="select select-bordered"
                                onChange={(e) => setSelectedRegion(e.target.value)}
                            >
                                <option value="">Select Region</option>
                                {uniqueRegions.map((region, i) => (
                                    <option key={i} value={region}>{region}</option>
                                ))}
                            </select>

                            <select
                                {...register("district", { required: true })}
                                className="select select-bordered"
                            >
                                <option value="">Select District/Service Center</option>
                                {getDistrictsByRegion(selectedRegion).map((area, i) => (
                                    <option key={i} value={area}>{area}</option>
                                ))}
                            </select>

                            <input
                                {...register("phone", { required: true })}
                                placeholder="Phone Number"
                                className="input input-bordered"
                            />
                            <input
                                {...register("nid", { required: true })}
                                placeholder="NID Card Number"
                                className="input input-bordered"
                            />
                            <input
                                {...register("bike_brand", { required: true })}
                                placeholder="Bike Brand"
                                className="input input-bordered"
                            />
                            <input
                                {...register("bike_registration", { required: true })}
                                placeholder="Bike Registration Number"
                                className="input input-bordered"
                            />
                            <textarea
                                {...register("extra_info")}
                                placeholder="Anything else you want to add?"
                                className="textarea textarea-bordered w-full md:col-span-2"
                            ></textarea>
                        </div>

                        <div className="text-center">
                            <button className="btn border-none shadow-md hover:bg-[#ddff76] w-full bg-[#CAEB66]">Submit Application</button>
                        </div>
                    </form>
                </div>
                <div className='hidden md:block'>
                    <img className='w-sm' src={rider} alt="" />
                </div>
            </div>


        </div>
    );
};

export default BeARider;
