import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, setLoading, setError } from "./redux/features/auth/authSlice.jsx";
import { selectUser, selectIsVerified } from "./redux/features/auth/authSlice.jsx";
import client from "./lib/axios.jsx";
import Home from "./pages/clientPages/Home.jsx";
import Login from "./pages/authPages/Login.jsx";
import SignUp from "./pages/authPages/SignUp.jsx";
import OtpScreen from "./pages/authPages/OtpScreen.jsx";
import "./App.css"
const App = () => {
  const dispatch = useDispatch();
  const username = useSelector(selectUser);
  const isVerified = useSelector(selectIsVerified);
  const [loading, setLoadingState] = useState(true); // Local loading state to manage async check
  const authenticatedUser = username && isVerified;

  // Fetch token and authenticate user on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("authToken"); // Using localStorage for token storage
      if (token) {
        try {
          dispatch(setLoading(true)); // Dispatch global loading state
          const response = await client.get("/auth/verify-user", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.data.success && response.data.user) {
            // Dispatch user data to Redux store
            dispatch(login(response.data.user));
          } else {
            dispatch(setError("Authentication failed"));
          }
        } catch (error) {
          dispatch(setError("Token verification failed"));
          console.error("Error during token verification:", error);
        } finally {
          dispatch(setLoading(false)); // Dispatch to stop loading in the global state
          setLoadingState(false); // Stop local loading
        }
      } else {
        setLoadingState(false); // No token found, stop loading
      }
    };

    checkAuth();
  }, [dispatch]);


  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      {/* Redirecting the user based on authentication */}
      <Route
        path="/"
        element={isVerified ? <Navigate to="/home" /> : (username ? <Navigate to="/otp-screen" /> : <Navigate to="/login" />)}
      />
      {/* Define all routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/otp-screen" element={<OtpScreen />} />
      {/* Protected route for authenticated users */}
      <Route
        path="/home"
        element={<Home />}
      />
      {/* Fallback route */}
      <Route path="*" element={<Navigate to={authenticatedUser ? "/home" : "/login"} />} />
    </Routes>
  );
};

export default App;
