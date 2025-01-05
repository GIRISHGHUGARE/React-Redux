import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, setLoading, setError } from '../../redux/features/auth/authSlice.jsx';
import client from '../../lib/axios.jsx';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import NatureImage from '../../assets/nature.webp';
import LogoImage from "../../assets/logo.png";
import { Alert } from "react-bootstrap"

const SignUp = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const loading = useSelector((state) => state.auth.loading);
    const error = useSelector((state) => state.auth.error);

    // Handle sign up submission
    const handleSubmit = async () => {
        dispatch(setLoading(true)); // Set loading state
        dispatch(setError(null)); // Clear previous errors

        try {
            if (!username || !email || !password) {
                toast.error("Please fill in all fields.");
                return;
            }

            const response = await client.post("/auth/register", { username, email, password });
            const data = response.data;

            localStorage.setItem('authToken', data.token); // Store token in localStorage
            dispatch(login(data.user)); // Update Redux state with user info
            toast.success("Registration successful!");

            navigate('/otp-screen'); // Navigate to OTP screen after success
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Registration failed"));
            toast.error("Registration failed! " + (error.response?.data?.message || ""));
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <div
            className="min-h-screen bg-cover bg-center"
            style={{ backgroundImage: `url(${NatureImage})` }}
        >
            <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-50">
                {/* Sign Up Card */}
                <div className="relative bg-white rounded-xl shadow-lg w-full max-w-md p-8">
                    {/* Logo Image */}
                    <div className="flex justify-center">
                        <img src={LogoImage} alt="Logo" className="w-24 h-24" />
                    </div>
                    <h2 className="text-center text-2xl font-bold text-gray-800 mt-4">Get Regiser Yourself!!</h2>

                    {/* Form */}
                    <div className="mt-8">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-gray-700">Username</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-gray-700">Email</label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-gray-700">Password</label>
                                <input
                                    type="password"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <Alert variant="danger" className="mt-4">
                                {error}
                            </Alert>
                        )}

                        {/* Sign Up Button */}
                        <div className="mt-6">
                            <button
                                onClick={handleSubmit}
                                className={`w-full py-2 px-4 bg-blue-600 font-bold text-white rounded-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={loading}
                            >
                                {loading ? "Signing up..." : "Sign Up"}
                            </button>
                        </div>

                        {/* Already have an account? */}
                        <div className="mt-4 text-center">
                            <p className="text-gray-600">
                                Already have an account?{' '}
                                <span
                                    className="text-blue-600 cursor-pointer font-bold"
                                    onClick={() => navigate('/login')}
                                >
                                    Sign in
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
