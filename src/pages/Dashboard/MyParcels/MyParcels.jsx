import React from 'react';
import useAuth from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { Eye, Trash2, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router';

const MyParcels = () => {

  const { user } = useAuth()
  const axiosSecure = useAxiosSecure()
  const navigate = useNavigate()

  const { data: parcels = [], refetch } = useQuery({
    queryKey: ['my-parcels', user.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels?email=${user.email}`);
      return res.data;
    }
  })

  // console.log(parcels)

  const handlePay = (id) => {
    // console.log('proceed to payment for', id)
    navigate(`/dashboard/payment/${id}`)
  }

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to delete this parcel?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosSecure.delete(`/parcels/${id}`);
        if (res.data.deletedCount > 0) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Parcel has been deleted.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          });
          refetch(); // reload the updated parcel list
        }
      } catch (error) {
        console.error(error);
        Swal.fire('Error!', 'Failed to delete the parcel.', 'error');
      }
    }
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead className="bg-base-200">
            <tr>
              <th>#</th>
              <th>Type</th>
              <th>Title</th>
              <th>Payment</th>
              <th>Created At</th>
              <th>Cost (৳)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {parcels?.map((parcel, index) => (
              <tr key={parcel._id}>
                <td>{index + 1}</td>
                <td className="capitalize">{parcel.type.replace('-', ' ')}</td>

                {/* Parcel Title */}
                <td>{parcel.title}</td>

                {/* Payment Status with Color */}
                <td>
                  <span
                    className={`badge px-3 py-2 text-white ${parcel.payment_status === 'paid'
                      ? 'bg-green-500'
                      : 'bg-red-500'
                      }`}
                  >
                    {parcel.payment_status}
                  </span>
                </td>

                {/* Created At */}
                <td>{format(new Date(parcel.creation_date), 'PPpp')}</td>

                {/* Cost */}
                <td className="font-semibold">৳{parcel.estimated_cost}</td>

                {/* Actions */}
                <td className="flex flex-wrap gap-2">
                  <button className="btn btn-sm btn-info text-white">
                    <Eye size={16} className="mr-1" /> View
                  </button>
                  {
                    parcel.payment_status === "unpaid" && (
                      <button
                        onClick={() => handlePay(parcel._id)}
                        className="btn btn-sm btn-success text-white">
                        <CreditCard size={16} className="mr-1" /> Pay
                      </button>
                    )
                  }


                  <button onClick={() => handleDelete(parcel._id)} className="btn btn-sm btn-error text-white">
                    <Trash2 size={16} className="mr-1" /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyParcels;