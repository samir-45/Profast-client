import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
// import { useState } from 'react';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import Loading from '../../shared/Loading/Loading';

const PendingRiders = () => {
    const axiosSecure = useAxiosSecure();
    //   const [selectedRider, setSelectedRider] = useState(null);

    const { data: riders = [], refetch, isLoading, isPending } = useQuery({
        queryKey: ['pendingRiders'],
        queryFn: async () => {
            const res = await axiosSecure.get('/riders/pending');
            return res.data;
        }
    });

    if (isPending) {
        return <Loading></Loading>
    }

    const handleView = (rider, email) => {
        // setSelectedRider(rider);

        Swal.fire({
            title: `<strong>${rider.name}</strong>`,
            html: `
  <div style="text-align: left;">
    <p><b>Email:</b> ${rider.email}</p>
    <p><b>Phone:</b> ${rider.phone}</p>
    <p><b>NID:</b> ${rider.nid}</p>
    <p><b>Region:</b> ${rider.region}</p>
    <p><b>District:</b> ${rider.district}</p>
    <p><b>Bike Brand:</b> ${rider.bike_brand}</p>
    <p><b>Bike Number:</b> ${rider.bike_number}</p>
    <p><b>Status:</b> ${rider.status}</p>
  </div>
`,
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Approve',
            denyButtonText: `Reject`,
            confirmButtonColor: '#16a34a',
            denyButtonColor: '#dc2626',
        }).then(async (result) => {
            if (result.isConfirmed) {
                await updateStatus(rider._id, 'active', email); 
            } else if (result.isDenied) {
                await updateStatus(rider._id, 'rejected');
            }
        });
    };

    const updateStatus = async (id, newStatus, email) => {
        try {
            const res = await axiosSecure.patch(`/riders/status/${id}`, { status: newStatus, email });
            if (res.data.modifiedCount > 0) {
                Swal.fire('Success!', `Rider ${newStatus}`, 'success');
                refetch();
            }
        } catch (err) {
            console.log(err)
            Swal.fire('Error', 'Failed to update rider status', 'error');
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Pending Riders</h2>

            {isLoading ? (
                <p><Loading></Loading></p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Region</th>
                                <th>District</th>
                                <th>Phone</th>
                                <th>Bike</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {riders.map((rider, index) => (
                                <tr key={rider._id}>
                                    <td>{index + 1}</td>
                                    <td>{rider.name}</td>
                                    <td>{rider.region}</td>
                                    <td>{rider.district}</td>
                                    <td>{rider.phone}</td>
                                    <td>{rider.bike_brand}</td>
                                    <td>
                                        <span className="badge badge-warning capitalize">{rider.status}</span>
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-info"
                                            onClick={() => handleView(rider, rider.email)}
                                        >
                                            View & Action
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {riders.length === 0 && (
                                <tr>
                                    <td colSpan="8" className="text-center text-gray-500 py-4">
                                        No pending riders found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default PendingRiders;
