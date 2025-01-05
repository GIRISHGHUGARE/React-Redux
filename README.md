# MERN Stack Authentication App
This is a full-stack MERN (MongoDB, Express, React, Node.js) web application built with robust JWT Authentication, Redux State Management, Email Verification, and Protected Routes. It is designed to manage user sign-ups, logins, and secure route access with JWT tokens. The application is styled using Tailwind CSS and provides real-time notifications with React Hot Toast.

## Key Features
JWT Authentication: Users can sign up, log in, and access protected routes only after successful authentication.
State Management with Redux: Redux is used for global state management to handle user sessions across the app.
Protected Routes: Certain routes are protected, and users must be authenticated to access them.
Email Verification: Users are required to verify their email address after registration to activate their account.
Resend OTP: Users can request a new OTP if they miss the first one.
Tailwind CSS: The frontend is styled with Tailwind CSS, ensuring a responsive and modern UI.
React Hot Toast: Beautiful, responsive toast notifications to alert users of important actions (e.g., successful login, errors, etc.).
Backend with Nodemailer: Nodemailer is used to send email notifications for registration, email verification, and password reset.
## Tech Stack
Frontend: React, Redux, Tailwind CSS, React Router DOM, Axios, React Hot Toast
Backend: Node.js, Express, JWT, MongoDB, Mongoose, Nodemailer
Development Tools: Vite, ESLint, PostCSS

## Installation
Prerequisites
Make sure you have the following installed on your machine:

Node.js (v14+)
MongoDB (local or use MongoDB Atlas for a cloud database)
npm or yarn
