import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAuth, selectUser, selectUserEmail, selectIsVerified } from "../../redux/features/auth/authSlice.jsx";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/features/auth/authSlice.jsx"; // Assuming logout action exists in your slice
import NatureImage from '../../assets/nature.webp';
import { toast } from "react-hot-toast"
const Home = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Get user data from Redux store
    const user = useSelector(selectAuth);  // Whole auth object
    const username = useSelector(selectUser);
    const email = useSelector(selectUserEmail);
    const isVerified = useSelector(selectIsVerified);

    useEffect(() => {
        // If no user is logged in, redirect to login page
        if (!user.user._id) {
            navigate("/login"); // Redirect to Login if no user is logged in
        }
    }, [user, navigate]);

    const handleLogout = () => {
        localStorage.removeItem("authToken")
        dispatch(logout()); // Dispatch logout action to clear the user state
        toast.success("Logout Successful")
        navigate("/login"); // Redirect to login page after logout
    };

    return (
        <div
            className="min-h-screen bg-cover bg-center"
            style={{ backgroundImage: `url(${NatureImage})` }}
        >
            <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-black bg-opacity-50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome, {username || "User"}!</h1>

                    {/* User Details */}
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <strong className="text-gray-700">Username:</strong>
                            <span>{username}</span>
                        </div>
                        <div className="flex justify-between">
                            <strong className="text-gray-700">Email:</strong>
                            <span>{email}</span>
                        </div>
                        <div className="flex justify-between">
                            <strong className="text-gray-700">Verified:</strong>
                            <span>{isVerified ? "Yes" : "No"}</span>
                        </div>
                    </div>

                    {/* Logout Button */}
                    <div className="mt-6">
                        <button
                            onClick={handleLogout}
                            className="w-full py-2 px-4 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default Home;
