import { useForm } from 'react-hook-form';
import { useMemo } from 'react';
import { useLoaderData } from 'react-router';
import Swal from 'sweetalert2';
import useAuth from '../../Hooks/useAuth';
import useAxiosSecure from '../../Hooks/useAxiosSecure';

const generateTrackingID = () => {
    const date = new Date();
    const datePart = date.toISOString().split("T")[0].replace(/-/g, ""); // e.g. 20250702
    const rand = Math.random().toString(36).substring(2, 7).toUpperCase(); // e.g. AB123
    return `PCL-${datePart}-${rand}`; // e.g. PCL-20250702-AB123
};


export default function SendParcel() {

    const { user } = useAuth()
    const axiosSecure = useAxiosSecure()

    const warehouses = useLoaderData()

    const { register, handleSubmit, watch, reset } = useForm();

    const parcelType = watch("type");
    const senderRegion = watch("sender_region");
    const receiverRegion = watch("receiver_region");

    const uniqueRegions = useMemo(() => {
        const regions = new Set(warehouses.map(w => w.region));
        return Array.from(regions);
    }, [warehouses]);

    const getServiceCentersByRegion = (region) => {
        return warehouses
            .filter(w => w.region === region)
            .flatMap(w => w.covered_area);
    };


    const onSubmit = (data) => {
        const isSameDistrict = data.same_district === "yes";
        const type = data.type;
        const weight = parseFloat(data.weight || 0);

        let baseCost = 0;
        let extraCost = 0;
        let totalCost = 0;
        let breakdown = "";

        if (type === "document") {
            baseCost = isSameDistrict ? 60 : 80;
            totalCost = baseCost;
            breakdown = `Base Cost (Document): ৳${baseCost}`;
        } else {
            if (weight <= 3) {
                baseCost = isSameDistrict ? 110 : 150;
                totalCost = baseCost;
                breakdown = `Base Cost (Non-Document, up to 3kg): ৳${baseCost}`;
            } else {
                baseCost = isSameDistrict ? 110 : 150;
                extraCost = (weight - 3) * 40;
                totalCost = isSameDistrict ? (baseCost + extraCost) : (baseCost + extraCost + 40);
                breakdown = `
                Base Cost (3kg): ৳${baseCost}<br>
                Extra (${weight - 3}kg × ৳40): ৳${extraCost}<br>
                ${!isSameDistrict ? "Outside District Extra: ৳40<br>" : ""}
                <b>Total Cost: ৳${totalCost}</b>
            `;
            }
        }

        Swal.fire({
            title: 'Confirm Parcel Details',
            html: `
            <p style="text-align: left"><b>Parcel Type:</b> ${type}</p>
            <p style="text-align: left"><b>Weight:</b> ${weight} kg</p>
            <p style="text-align: left"><b>Delivery:</b> ${isSameDistrict ? "Within District" : "Outside District"}</p>
            <hr class="my-2" />
            <p style="text-align: left">${breakdown}</p>
        `,
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Confirm & Submit',
            cancelButtonText: 'Edit Again',
            confirmButtonColor: '#16a34a',
            cancelButtonColor: '#d33',
            position: 'center',
            width: 500,
        }).then((result) => {
            if (result.isConfirmed) {
                const parcel = {
                    ...data,
                    creation_date: new Date().toISOString(),
                    created_by: user?.email || "anonymous",
                    payment_status: 'unpaid',
                    delivery_status: 'not_collected',
                    tracking_id: generateTrackingID(),
                    estimated_cost: totalCost
                };

                // ✅ POST Request to Backend ---------------------------
                axiosSecure.post('/parcels', parcel)
                    .then(res => {
                        console.log(res.data)
                        if (res.data.insertedId || res.data.acknowledged) {

                            // TODO : redirect to a payment geteway page

                            Swal.fire({
                                icon: 'success',
                                title: 'Redirecting...',
                                text: 'proceeding to payment gateway',
                                showConfirmButton: false,
                                timer: 2000,
                                position: 'center'
                            });
                            reset();
                        } else {
                            Swal.fire("Error", "Something went wrong!", "error");
                        }
                    })
                    .catch(error => {
                        console.error(error);
                        Swal.fire("Error", "Failed to save parcel!", "error");
                    });
                    // Post req end ---------------------------------

            }
        });
    };



    return (
        <div className="max-w-4xl mx-auto p-4">
            {/* <Toaster /> */}
            <h1 className="text-3xl font-bold mb-2">Send a Parcel</h1>
            <p className="text-gray-600 mb-6">As the system is based on Door to Door delivery, Parcel needs both pickup and delivery location.</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Parcel Info */}
                <div className="bg-base-200 p-4 rounded-xl shadow">
                    <h2 className="text-xl font-semibold mb-4">Parcel Info</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <select {...register("type", { required: true })} className="select select-bordered">
                            <option value="">Select Type</option>
                            <option value="document">Document</option>
                            <option value="non-document">Non-document</option>
                        </select>
                        <input {...register("title", { required: true })} placeholder="Parcel Title" className="input input-bordered" />
                        {parcelType === "non-document" && (
                            <input type="number" step="0.1" {...register("weight")}
                                placeholder="Weight (kg)" className="input input-bordered" />
                        )}
                        <select {...register("same_district", { required: true })} className="select select-bordered">
                            <option value="">Delivery Location</option>
                            <option value="yes">Within District</option>
                            <option value="no">Outside District</option>
                        </select>
                    </div>
                </div>

                {/* Sender Info */}
                <div className="bg-base-200 p-4 rounded-xl shadow">
                    <h2 className="text-xl font-semibold mb-4">Sender Info</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

                        <input {...register("sender_name", { required: true })} placeholder="Sender Name" className="input input-bordered" />
                        <input {...register("sender_contact", { required: true })} placeholder="Contact" className="input input-bordered" />
                        <select {...register("sender_region", { required: true })} className="select select-bordered">
                            <option value="">Select Region</option>
                            {uniqueRegions.map(region => <option key={region} value={region}>{region}</option>)}
                        </select>
                        <select {...register("sender_center", { required: true })} className="select select-bordered">
                            <option value="">Select Service Center</option>
                            {getServiceCentersByRegion(senderRegion).map((area, index) => <option key={index} value={area}>{area}</option>)}
                        </select>
                        <input {...register("sender_address", { required: true })} placeholder="Sender Address" className="input input-bordered" />
                        <input
                            {...register("sender_email", { required: true })}
                            placeholder="Sender Email"
                            type="email"
                            className="input input-bordered"
                        />
                        <textarea {...register("pickup_instruction", { required: true })} placeholder="Pickup Instruction" className="textarea textarea-bordered w-full col-span-2 md:col-span-3"></textarea>
                    </div>
                </div>

                {/* Receiver Info */}
                <div className="bg-base-200 p-4 rounded-xl shadow">
                    <h2 className="text-xl font-semibold mb-4">Receiver Info</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <input {...register("receiver_name", { required: true })} placeholder="Receiver Name" className="input input-bordered" />
                        <input {...register("receiver_contact", { required: true })} placeholder="Contact" className="input input-bordered" />
                        <select {...register("receiver_region", { required: true })} className="select select-bordered">
                            <option value="">Select Region</option>
                            {uniqueRegions.map(region => <option key={region} value={region}>{region}</option>)}
                        </select>
                        <select {...register("receiver_center", { required: true })} className="select select-bordered">
                            <option value="">Select Service Center</option>
                            {getServiceCentersByRegion(receiverRegion).map((area, index) => <option key={index} value={area}>{area}</option>)}
                        </select>
                        <input {...register("receiver_address", { required: true })} placeholder="Receiver Address" className="input input-bordered" />
                        <input
                            {...register("receiver_email", { required: true })}
                            placeholder="Receiver Email"
                            type="email"
                            className="input input-bordered"
                        />
                        <textarea {...register("delivery_instruction", { required: true })} placeholder="Delivery Instruction" className="textarea w-full col-span-2 md:col-span-3 textarea-bordered"></textarea>
                    </div>
                </div>

                <div className="text-center">
                    <button className="btn btn-primary">Submit Parcel</button>
                </div>
            </form>
        </div>
    );
}
