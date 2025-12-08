import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ProfileForm from '../../components/User/ProfileForm';

/**
 * ProfilePage Component
 * Displays the authenticated user's account information and provides
 * an interface for profile updates. It consumes the AuthContext to 
 * ensure real-time synchronization with the logged-in user's state.
 */
export default function ProfilePage() {
    /**
     * Consumes user state from the global AuthContext.
     */
    const { user } = useAuth(); 

    /**
     * Early Return logic: Loading State
     * Prevents rendering if user data is still being initialized.
     */
    if (!user) {
        return <div className="loading-style ">Loading user data...</div>; 
    }

    /**
     * Data Formatting
     * Capitalizes the first letter of the user's role for semantic UI display.
     */
    const userRole = user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User';

    return (
        <div className="details-container profile-container">
            
            <h1 className="profile-title brand">My Profile</h1> 
            <hr className="profile-divider" /> 
            <div className="profile-content-wrapper"> 
                
                {/* Visual section displaying current persistent account credentials */}
                <div className="user-info-display">
                    <h2>Account Details</h2>
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Role:</strong> {userRole}</p>
                </div>

                <hr className="profile-divider" /> 

                {/* Modularized form section for account modification */}
                <div className="profile-edit-section">
                    <h2>Update Information</h2>
                    <ProfileForm initialData={user} />
                </div>
            </div>
        </div>
    );
}