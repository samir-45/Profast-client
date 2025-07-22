import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Loading from "../../shared/Loading/Loading";

const AssignRider = () => {
    const axiosSecure = useAxiosSecure();
    const [selectedParcel, setSelectedParcel] = useState(null);
    const [riders, setRiders] = useState([]);
    const [selectedRider, setSelectedRider] = useState(null);
    const [loadingRiders, setLoadingRiders] = useState(false);

    const { data: parcels = [], isLoading, refetch } = useQuery({
        queryKey: ['assignableParcels'],
        queryFn: async () => {
            const res = await axiosSecure.get('/parcels/assignable');
            return res.data;
        }
    });

    useEffect(() => {
        refetch();
    }, []);

    const handleOpenModal = async (parcel) => {
        setSelectedParcel(parcel);
        setSelectedRider(null);
        setLoadingRiders(true);
        try {
            const res = await axiosSecure.get(`/riders/by-district/${parcel.sender_region}`);
            setRiders(res.data);
        } catch (err) {
            console.error("Error loading riders:", err);
            setRiders([]);
        } finally {
            setLoadingRiders(false);
        }
        document.getElementById('assign_modal').showModal();
    };

    const handleAssign = async () => {
        try {
            const res = await axiosSecure.patch(`/parcels/${selectedParcel._id}/assign`, {
                assigned_rider: {
                    name: selectedRider.name,
                    email: selectedRider.email,
                    phone: selectedRider.phone
                }
            });

            if (res.data.modifiedCount) {
                await axiosSecure.patch(`/parcels/${selectedParcel._id}/assign`, {
                    assigned_rider: selectedRider
                });
            }

            if (res.data.modifiedCount > 0) {
                Swal.fire("Success", "Rider assigned successfully!", "success");
                document.getElementById('assign_modal').close();
                refetch(); // reload the parcel list
            }
        } catch (err) {
            Swal.fire("Error", "Failed to assign rider", "error");
            console.error(err);
        }
    };

    if (isLoading) return <Loading></Loading>

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Assignable Parcels</h2>
            {
                parcels.length === 0 ? (
                    <p>No parcels available for assignment.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Tracking ID</th>
                                    <th>Sender</th>
                                    <th>Destination</th>
                                    <th>Cost</th>
                                    <th>Assigned</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    parcels.map(parcel => (
                                        <tr key={parcel._id}>
                                            <td>{parcel.tracking_id}</td>
                                            <td>{parcel.sender_name} ({parcel.sender_region})</td>
                                            <td>{parcel.receiver_name} ({parcel.receiver_region})</td>
                                            <td>${parcel.estimated_cost}</td>
                                            <td>{parcel.assigned_rider?.name || "Not Assigned"}</td>
                                            <td>
                                                <button
                                                    className="btn btn-sm btn-primary"
                                                    onClick={() => handleOpenModal(parcel)}
                                                >
                                                    Assign Rider
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                )
            }

            {/* Modal */}
            <dialog id="assign_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-4">Assign Rider</h3>

                    {
                        loadingRiders ? <p>Loading riders...</p> :
                            riders.length === 0 ? (
                                <p>No riders available in {selectedParcel?.sender_center}</p>
                            ) : (
                                <select
                                    className="select select-bordered w-full"
                                    onChange={(e) => {
                                        const rider = riders.find(r => r.email === e.target.value);
                                        setSelectedRider(rider);
                                    }}
                                >
                                    <option disabled selected>Select a rider</option>
                                    {
                                        riders.map(rider => (
                                            <option key={rider.email} value={rider.email}>
                                                {rider.name} ({rider.phone})
                                            </option>
                                        ))
                                    }
                                </select>
                            )
                    }

                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn">Cancel</button>
                        </form>
                        <button
                            onClick={handleAssign}
                            disabled={!selectedRider}
                            className="btn btn-success"
                        >
                            Confirm Assign
                        </button>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default AssignRider;
