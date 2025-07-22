import React from 'react';
import useAuth from '../../../Hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import Loading from '../../shared/Loading/Loading';
import { format } from 'date-fns';

const PaymentHistory = () => {

    const { user } = useAuth()
    const axiosSecure = useAxiosSecure()

    const { isPending, data: payments = [] } = useQuery({
        queryKey: ['payments', user.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/payments?email=${user.email}`)
            return res.data;
        }
    })

    if(isPending){
        return <Loading></Loading>
    }

    return (
<div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Payment History</h2>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Transaction ID</th>
              <th>Tracking ID</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment, index) => (
              <tr key={payment._id}>
                <td>{index + 1}</td>
                <td className="text-xs">{payment.transaction_id}</td>
                <td>{payment.parcel_id}</td>
                <td className="text-green-600 font-semibold">৳{payment.amount}</td>
                <td>{format(new Date(payment.paid_at), 'PPpp')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    );
};

export default PaymentHistory;