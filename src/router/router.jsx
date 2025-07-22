import {
    createBrowserRouter,
} from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home/Home";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Auth/Login/Login";
import Register from "../pages/Auth/Register/Register";
import Coverage from "../pages/coverage/Coverage";
import SendParcel from "../pages/SendParcel/SendParcel";
import PrivetRoute from '../routes/PrivetRoute'
import DashBoardLayout from "../layouts/DashBoardLayout";
import MyParcels from "../pages/Dashboard/MyParcels/MyParcels";
import Payment from "../pages/Dashboard/Payment/Payment";
import PaymentHistory from "../pages/Dashboard/PaymentHistory/PaymentHistory";
import TrackParcel from "../pages/Dashboard/TrackParcel/TrackParcel";
import BeARider from "../pages/Dashboard/BeARider/BeARider";
import PendingRiders from "../pages/Dashboard/PendingRiders/PendingRiders";
import ActiveRiders from "../pages/Dashboard/ActiveRiders/ActiveRiders";
import MakeAdmin from "../pages/Dashboard/MakeAdmin/MakeAdmin";
import Forbidden from "../pages/Forbidden/Forbidden";
import AdminRoute from "../routes/AdminRoute";
import AssignRider from "../pages/Dashboard/AssignRider/AssignRider";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: RootLayout,
        children: [
            {
                index: true,
                Component: Home
            },
            {
                path: 'coverage',
                Component: Coverage,
                loader: () => fetch('./serviceCenter.json')
            },
            {
                path: 'sendParcel',
                loader: () => fetch('./serviceCenter.json'),
                element: <PrivetRoute><SendParcel></SendParcel></PrivetRoute>
            },
            {
                path: 'beARider',
                loader: () => fetch('./serviceCenter.json'),
                element: <PrivetRoute><BeARider></BeARider></PrivetRoute>
            },
            {
                path: 'forbidden',
                Component: Forbidden
            }
        ]
    },
    {
        path: '/',
        Component: AuthLayout,
        children: [
            {
                path: 'login',
                Component: Login
            },
            {
                path: 'register',
                Component: Register
            }
        ]
    },
    {
        path: '/dashboard',
        element: <PrivetRoute><DashBoardLayout></DashBoardLayout></PrivetRoute>,
        children: [
            {
                path: 'myParcels',
                Component: MyParcels
            },
            {
                path: 'payment/:parcelId',
                Component: Payment
            },
            {
                path: 'paymentHistory',
                Component: PaymentHistory
            },
            {
                path: 'track',
                Component: TrackParcel
            },
            {
                path: 'assignRider',
                element: <AdminRoute><AssignRider></AssignRider></AdminRoute>
            },
            {
                path: 'pendingRiders',
                // Component: PendingRiders
                element: <AdminRoute><PendingRiders></PendingRiders></AdminRoute>
            },
            {
                path: 'activeRiders',
                // Component: ActiveRiders
                element: <AdminRoute><ActiveRiders></ActiveRiders></AdminRoute>
            },
            {
                path: 'makeAdmin',
                // Component: MakeAdmin
                element: <AdminRoute><MakeAdmin></MakeAdmin></AdminRoute>
            }
        ]
    }
]);