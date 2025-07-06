import React from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../../Hooks/useAuth';
import { Link } from 'react-router';
import ProfastLogo from '../../shared/ProFastLogo/ProfastLogo';

const Register = () => {

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm()

    const { createUser, signInWithGoogle } = useAuth()

    const onSubmit = (data) => {
        // console.log(data)
        createUser(data.email, data.password)
            .then(result => {
                console.log(result.user)
            })
            .catch(err => {
                console.error(err)
            })
    }

    const handleGoogleSignIn = () => {
        signInWithGoogle()
            .then(res => {
                console.log(res.user)
            })
            .catch(err => {
                console.log(err)
            })
    }

    return (
        <div>
            <div className="w-fit">
                <div className='absolute top-0 left-0 z-10 m-3 2xl:m-8'><ProfastLogo></ProfastLogo></div>
                <div className="flex flex-col p-16">
                    <div className="text-center lg:text-left">
                        <h1 className="text-5xl font-bold">Create an Account</h1>
                        <p className="py-4">
                            Register with Profast
                        </p>
                    </div>
                    <div className="card w-full shrink-0 ">
                        <div className="card-body max-w-10/12 p-0">
                            <form onSubmit={handleSubmit(onSubmit)} className="fieldset">

                                <label className="label">Name</label>
                                <input required type="text" {...register('name')} className="input w-full" placeholder="Name" />

                                <label className="label">Email</label>
                                <input required type="email" {...register('email')} className="input w-full" placeholder="Email" />

                                <label className="label">Password</label>
                                <input type="password" {...register('password', {
                                    required: true,
                                    minLength: 6
                                })} className="input w-full" placeholder="Password" />

                                {
                                    errors.password?.type === 'required' &&
                                    <p className='text-red-700'>Password is required</p>
                                }

                                {
                                    errors.password?.type === 'minLength' &&
                                    <p className='text-red-700'>Password must me 6 characters or longer</p>
                                }

                                <div className=''><p>Already have an account? <Link to='/login' className='text-[#bede5c] hover:underline'>Login</Link></p>
                                </div>

                                <button className="btn btn-neutral bg-[#CAEB66] border-none text-black mt-4">Register</button>
                                <div className="divider">OR</div>
                                <button onClick={handleGoogleSignIn} type='button' className="btn bg-white text-black border-[#e5e5e5]">
                                    <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
                                    Register with Google
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;