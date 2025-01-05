import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import { useDispatch, useSelector } from "react-redux";
import { selectUserEmail } from "../../redux/features/auth/authSlice.jsx"; // Redux selector to get user email
import client from "../../lib/axios.jsx"; // Your API client
import NatureImage from '../../assets/nature.webp';
import { toast } from "react-hot-toast"
const OtpScreen = () => {
    const email = useSelector(selectUserEmail); // Get email from Redux
    const [otp, setOtp] = useState(["", "", "", ""]); // State to store OTP digits
    const [loading, setLoading] = useState(false);
    const [resend, setResend] = useState(false);
    const inputRefs = useRef([]);
    const navigate = useNavigate();

    // Handle OTP input change
    const handleOtpChange = (value, index) => {
        const newOtp = [...otp];
        if (value.length > 1) {
            const pastedOtp = value.slice(0, 4).split("");
            for (let i = 0; i < 4; i++) {
                newOtp[i] = pastedOtp[i] || "";
            }
            setOtp(newOtp);

            // Focus on the last non-empty input or the first empty one
            const lastFilledIndex = newOtp.findLastIndex((digit) => digit !== "");
            const focusIndex = lastFilledIndex < 3 ? lastFilledIndex + 1 : 3;
            inputRefs.current[focusIndex].focus();
        } else {
            newOtp[index] = value;
            setOtp(newOtp);

            // Move focus to the next input field if value is entered
            if (value && index < 3) {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    // Auto submit when all fields are filled
    useEffect(() => {
        if (otp.every((digit) => digit !== "")) {
            handleVerifyOtp();
        }
    }, [otp]);

    // Handle OTP verification
    const handleVerifyOtp = async () => {
        const otpString = otp.join('');
        if (otpString.length !== 4) {
            toast.error("Error: Please enter a valid 4-digit OTP");
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('authToken'); // Use localStorage instead of SecureStore
            const response = await client.post("/auth/verify-email",
                { otp: otpString },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.success) {
                toast.success("OTP verified successfully! Please login!");
                navigate('/login'); // Redirect to login screen
            } else {
                toast.error("Error: Invalid OTP. Please try again.");
            }
        } catch (error) {
            toast.error("Error: " + (error.response?.data?.message || "An error occurred. Please try again."));
        } finally {
            setLoading(false);
        }
    };

    // Handle OTP resend
    const handleResendOtp = async () => {
        setResend(true);
        try {
            const token = localStorage.getItem('authToken'); // Use localStorage instead of SecureStore
            const response = await client.post("/auth/resend-otp", {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                toast.success("OTP resend successful!");
            } else {
                toast.error("Error: Please try again.");
            }
        } catch (error) {
            toast.error("Error: " + (error.response?.data?.message || "An error occurred. Please try again."));
        } finally {
            setResend(false);
        }
    };

    // Focus on the first input when the component mounts
    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    return (
        <div
            className="min-h-screen bg-cover bg-center"
            style={{ backgroundImage: `url(${NatureImage})` }}
        >
            <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-50">
                <div className="flex flex-col items-center justify-center bg-gray-900 text-white relative rounded-xl shadow-lg w-full max-w-md p-8 m-10">
                    <h1 className="text-2xl font-semibold mb-6">Enter OTP</h1>
                    <p className="text-gray-400 text-center mb-8">We have sent a 4-digit OTP to your email: {email}</p>

                    <div className="flex space-x-2 mb-6">
                        {/* Render 4 OTP input fields */}
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                type="text"
                                className="w-16 h-16 text-center text-2xl bg-gray-700 text-white rounded-md border border-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleOtpChange(e.target.value, index)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                ref={(ref) => (inputRefs.current[index] = ref)}
                                autoFocus={index === 0}
                            />
                        ))}
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleVerifyOtp}
                        disabled={loading}
                        className={`w-full py-3 mt-6 bg-indigo-600 text-white rounded-md font-semibold text-lg ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'} transition`}
                    >
                        {loading ? 'Verifying...' : 'Verify OTP'}
                    </button>

                    {/* Resend OTP Button */}
                    <button
                        onClick={handleResendOtp}
                        className="mt-4 text-indigo-400 hover:text-indigo-600 transition"
                    >
                        {resend ? 'Wait...' : 'Resend OTP'}
                    </button>
                </div>

            </div>
        </div>

    );
};

export default OtpScreen;
