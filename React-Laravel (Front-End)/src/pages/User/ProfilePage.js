import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ProfileForm from '../../components/User/ProfileForm';

export default function ProfilePage() {
	const { user } = useAuth(); 

	if (!user) {
		return <div className="loading-style ">Loading user data...</div>; 
	}

	const userRole = user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User';

	return (
		<div className="details-container profile-container">
			
			<h1 className="profile-title brand">My Profile</h1> 
			<hr className="profile-divider" /> 
			<div className="profile-content-wrapper"> 
				
				<div className="user-info-display">
					<h2>Account Details</h2>
					<p><strong>Name:</strong> {user.name}</p>
					<p><strong>Email:</strong> {user.email}</p>
					<p><strong>Role:</strong> {userRole}</p>
				</div>

				<hr className="profile-divider" /> 

				<div className="profile-edit-section">
					<h2>Update Information</h2>
					<ProfileForm initialData={user} />
				</div>
			</div>
		</div>
	);
}