import React, { useState, useEffect } from 'react';
import { getAdminUsers, deleteAdminUser, toggleBan, updateAdminUser } from '../../services/api'; 
import DeleteConfirmationModal from '../../components/Layout/DeleteConfirmationModal';
import SuccessModal from '../../components/Layout/SuccessModal';

import '../../pagesstyles/AdminUserManagement.css';

const ITEMS_PER_PAGE = 15; 
const ALL_ROLES = ['User', 'Admin']; 

function AdminUserManagement() {
	const [users, setUsers] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	
	const [deleteModal, setDeleteModal] = useState({ show: false, id: null, name: '' });
	const [successModal, setSuccessModal] = useState({ show: false, message: '' });

	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	
	const fetchUsers = async (page = 1) => {
		setIsLoading(true);
		try {
			const responseData = await getAdminUsers({ page: page, per_page: ITEMS_PER_PAGE }); 
			
			setUsers(responseData.data || []); 
			setTotalPages(responseData.last_page);
			setCurrentPage(responseData.current_page);
			setError(null);

		} catch (err) {
			console.error("User Fetch Error:", err);
			setError(`Failed to load user list: ${err.message || 'Server error'}`);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchUsers(currentPage);
	}, [currentPage]);
	
	const initiateDelete = (user) => {
		setDeleteModal({
			show: true,
			id: user.id, 
			name: user.name 
		});
	};

	const confirmDelete = async () => {
		const idToDelete = deleteModal.id;
		setDeleteModal({ show: false, id: null, name: '' });
		setIsLoading(true);

		try {
			await deleteAdminUser(idToDelete);
			
			setSuccessModal({ show: true, message: `${deleteModal.name} was successfully deleted.` });
			
			await fetchUsers(users.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage); 

		} catch (error) {
			console.error("Delete Error:", error);
			setError(`Failed to delete user: ${error.message || 'Server error'}`);
		} finally {
			setIsLoading(false);
		}
	};

	const handleToggleBan = async (user) => {
		setIsLoading(true);
		try {
			const response = await toggleBan(user.id);

			setUsers(prevUsers => 
				prevUsers.map(u => u.id === user.id ? response.user : u)
			);

			setSuccessModal({ show: true, message: response.message });

		} catch (error) {
			console.error("Ban Toggle Error:", error);
			setError(`Failed to change ban status: ${error.message || 'Server error'}`);
		} finally {
			setIsLoading(false);
		}
	};

	const handleRoleChange = async (userId, newRoleString) => {
		setIsLoading(true);
		try {
			const isAdminValue = newRoleString === 'Admin' ? 1 : 0;

			const response = await updateAdminUser(userId, { is_admin: isAdminValue });

			setUsers(prevUsers => 
				prevUsers.map(u => u.id === userId ? response.user : u)
			);

			const updatedRoleName = response.user.is_admin ? 'Admin' : 'User';
			setSuccessModal({ show: true, message: `Role for ${response.user.name} changed to ${updatedRoleName}.` });

		} catch (error) {
			console.error("Role Change Error:", error);
			setError(`Failed to change role: ${error.message || 'Server error'}`);
		} finally {
			setIsLoading(false);
		}
	};

	const cancelDelete = () => setDeleteModal({ show: false, id: null, name: '' });
	const closeSuccessModal = () => setSuccessModal({ show: false, message: '' });

	return (
		<div className="admin-page-container">
			<DeleteConfirmationModal 
				show={deleteModal.show}
				itemName={deleteModal.name}
				onConfirm={confirmDelete}
				onCancel={cancelDelete}
			/>
			<SuccessModal show={successModal.show} message={successModal.message} onClose={closeSuccessModal}/>
			
			<h2 className="page-header">👤 User Management</h2>

			{error && <div className="admin-error-message">🚨 {error}</div>}

			<div className="admin-card user-table-card">
				{isLoading && users.length === 0 ? (
					<div className="admin-loading">Loading Users...</div>
				) : (
					<>
						<table className="user-table">
							<thead>
								<tr>
									<th>ID</th>
									<th>Name</th>
									<th>Email</th>
									<th>Role</th>
									<th>Status</th>
									<th>Joined</th>
									<th>Actions</th>
								</tr>
							</thead>
							<tbody>
								{users.map((user) => {
									const userRoleString = user.is_admin ? 'Admin' : 'User';
									
									return (
										<tr 
											key={user.id} 
											className={`user-row ${user.is_banned ? 'banned-row' : ''}`}
										>
											<td>{user.id}</td>
											<td>{user.name}</td>
											<td>{user.email}</td>
											<td>
												<select
													value={userRoleString} 
													onChange={(e) => handleRoleChange(user.id, e.target.value)}
													disabled={isLoading}
													className={`role-select ${user.is_admin ? 'admin-role' : 'user-role'}`}
												>
													{ALL_ROLES.map(role => (
														<option key={role} value={role}>{role}</option>
													))}
												</select>
											</td>
											<td>
												<span className={`status-badge ${user.is_banned ? 'banned' : 'active'}`}>
													{user.is_banned ? 'Banned' : 'Active'}
												</span>
											</td>
											<td>{new Date(user.created_at).toLocaleDateString()}</td>
											<td className="actions-cell">
												<button 
													className={`action-btn ${user.is_banned ? 'unban-btn' : 'ban-btn'}`} 
													onClick={() => handleToggleBan(user)}
													disabled={user.is_admin || isLoading} 
												>
													{user.is_banned ? 'Unban' : 'Ban'}
												</button>
												
												<button 
													className="action-btn delete-btn" 
													onClick={() => initiateDelete(user)}
													disabled={user.is_admin || isLoading} 
												>
													Delete
												</button>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>

						<div className="pagination-controls">
							<button 
								onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
								disabled={currentPage === 1 || isLoading}
							>
								Previous
							</button>
							<span className="page-info">
								Page {currentPage} of {totalPages}
							</span>
							<button 
								onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
								disabled={currentPage === totalPages || isLoading}
							>
								Next
							</button>
						</div>
					</>
				)}
			</div>
			
			{users.length === 0 && !isLoading && !error && <p className="no-users-message">No users found.</p>}
		</div>
	);
}

export default AdminUserManagement;