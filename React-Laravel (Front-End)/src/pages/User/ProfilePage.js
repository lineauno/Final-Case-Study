// src/pages/User/ProfilePage.js

import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ProfileForm from '../../components/User/ProfileForm';

export default function ProfilePage() {
    // Assuming useAuth provides a 'user' object with { name, email, role }
    const { user } = useAuth(); 

    // Handle loading state while user data is being fetched
    if (!user) {
        // You might replace this with a spinner or better loading indicator
        return <div className="loading-container ">Loading user data...</div>; 
    }

    // Ensure the role is displayed nicely (e.g., 'customer' -> 'Customer')
    const userRole = user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User';

    return (
        // 1. Outer container: Apply the card styling similar to checkout/details pages
        // This class likely provides the large centered box with shadow/border.
        <div className="details-container profile-container">
            
            <h1 className="profile-title brand">My Profile</h1> 
            <hr className="profile-divider" /> 
            {/* The main layout wrapper for details and form - 
                Use a simple div for stacking sections vertically. */}
            <div className="profile-content-wrapper"> 
                
                {/* 2. Account Details Display Section */}
                {/* Style this section with appropriate spacing/padding */}
                <div className="user-info-display">
                    <h2>Account Details</h2>
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Role:</strong> {userRole}</p>
                </div>

                {/* Horizontal Divider (Optional, but looks good) */}
                <hr className="profile-divider" /> 

                {/* 3. Profile Edit Form Section */}
                {/* This section holds the actual ProfileForm component */}
                <div className="profile-edit-section">
                    <h2>Update Information</h2>
                    {/* Pass the current user data to the form for initial values */}
                    <ProfileForm initialData={user} />
                </div>
            </div>
        </div>
    );
}