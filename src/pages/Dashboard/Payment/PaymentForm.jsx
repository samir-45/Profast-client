import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import Loading from '../../shared/Loading/Loading';
import useAuth from '../../../Hooks/useAuth';
import Swal from 'sweetalert2';

const PaymentForm = () => {
    const { user } = useAuth()
    const stripe = useStripe();
    const elements = useElements()
    const axiosSecure = useAxiosSecure()

    const { parcelId } = useParams()

    const navigate = useNavigate()

    const [error, setError] = useState('')

    const { isPending, data: parcelInfo = {} } = useQuery({
        queryKey: ['parcels', parcelId],
        queryFn: async () => {
            const res = await axiosSecure.get(`/parcels/${parcelId}`)
            return res.data;
        }
    })

    if (isPending) {
        return <Loading></Loading>
    }

    // console.log(parcelInfo)

    const amount = parcelInfo.estimated_cost;
    const amountInCents = amount * 100;
    // console.log(amountInCents)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!stripe || !elements) {
            return;
        }

        const card = elements.getElement(CardElement);

        if (!card) {
            return;
        }

        // step - 1: Validate the card

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card
        })

        if (error) {
            setError(error.message)
        }
        else {
            setError('')
            console.log('Payment Method', paymentMethod)

            // Step:2 create payment intent
            const res = await axiosSecure.post('/create-payment-intent', {
                amountInCents,
                parcelId
            })

            // step-3: Conform payment

            const clientSecret = res.data.clientSecret;

            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: {
                        name: user.displayName,
                        email: user.email
                    },
                },
            });

            if (result.error) {
                setError(result.error.message);
            } else {
                if (result.paymentIntent.status === 'succeeded') {
                    setError('');
                    console.log('Payment succeeded!');
                    console.log(result)



                    try {
                        // step-4: mark parcel paid also create payment history
                        const paymentData = {
                            parcelId,
                            userEmail: user.email,
                            amount,
                            transactionId: result.paymentIntent.id,
                            method: result.paymentIntent.payment_method_types
                        }

                        const paymentRes = await axiosSecure.post('/payments', paymentData);

                        console.log(paymentRes)

                        if (paymentRes.data?.payment_id) {
                            // SweetAlert success message
                            Swal.fire({
                                icon: 'success',
                                title: 'Payment Successful!',
                                html: `
          <p>Your transaction was completed.</p>
          <p><b>Transaction ID:</b> ${paymentData.transactionId}</p>
        `,
                                confirmButtonText: 'Go to My Parcels',
                                confirmButtonColor: '#16a34a',
                                allowOutsideClick: false,
                            }).then(result => {
                                if (result.isConfirmed) {
                                    navigate('/dashboard/myParcels');
                                }
                            });
                        }
                    } catch (err) {
                        console.error("Payment error:", err);
                        Swal.fire({
                            icon: 'error',
                            title: 'Payment Failed!',
                            text: 'Something went wrong while processing your payment.',
                        });
                    }

                }
            }
        }



    }

    return (
        <div>
            <form onSubmit={handleSubmit} className='space-y-4 p-6 rounded-xl bg-white shadow-md w-full max-w-md mx-auto'>
                <CardElement></CardElement>
                <button className='btn btn-primary w-full' type='submit' disabled={!stripe}>
                    Pay ${amount} For Parcel Pickup
                </button>
                {
                    error && <p className='text-red-600'>{error}</p>
                }
            </form>
        </div>
    );
};

export default PaymentForm;