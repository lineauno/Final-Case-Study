import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// 💡 FIXED IMPORT: Use the unified fetch function (getDashboardData must be defined in api.js)
import { getDashboardData } from '../../services/api'; 
import '../../pagesstyles/AdminDashboard.css';

function AdminDashboard() {
    const [metrics, setMetrics] = useState(null);
    const [activity, setActivity] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                // 1. FIX: Make a single call to the unified endpoint
                const data = await getDashboardData(); 
                
                // 2. Map data based on the Controller's return structure (metrics and recentActivity)
                setMetrics(data.metrics);
                
                // 3. Extract the array for activity (Controller returns recentActivity as an object containing recentUsers)
                setActivity(data.recentActivity.recentUsers || []); 
                
            } catch (err) {
                // Display the user-friendly error
                setError("Failed to load dashboard data. Check API endpoints.");
                // Log the technical error for console debugging
                console.error("Dashboard Data Fetch Error:", err);
            } finally {
                setIsLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    // Helper structure to map fetched data to the UI layout
    // NOTE: Keys like totalProducts, totalCategories, totalUsers must match the ones returned by the controller
    const dashboardMetrics = metrics ? [
        { 
            title: "Total Products", 
            value: metrics.totalProducts ? metrics.totalProducts.toLocaleString() : '0', 
            icon: "📦", 
            path: "/admin/products" 
        },
        { 
            title: "Categories", 
            value: metrics.totalCategories ? metrics.totalCategories.toLocaleString() : '0', 
            icon: "🏷️", 
            path: "/admin/categories" 
        },
        { 
            // Changed to reflect the 'totalUsers' metric returned by your controller
            title: "Total Users", 
            value: metrics.totalUsers ? metrics.totalUsers.toLocaleString() : '0', 
            icon: "👤", 
            path: "/admin/users" 
        },
        { 
            // Reflects the 'lowStockCount' metric from your controller
            title: "Low Stock Count", 
            value: metrics.lowStockCount ? metrics.lowStockCount.toLocaleString() : '0', 
            icon: "⚠️", 
            path: "/admin/inventory" 
        },
    ] : [];

    if (isLoading) {
        return <div className="admin-loading1">Loading Dashboard...</div>;
    }

    if (error) {
        return <div className="admin-error-message">🚨 {error}</div>;
    }

    return (
        <div className="admin-dashboard-page"> 
            
            <h2 className="welcome-heading">Welcome back, Admin!</h2>
            <p className="overview-text">Quick overview of Crafty Corner operations.</p>
            
            <div className="metrics-grid">
                {dashboardMetrics.map((metric, index) => (
                    <Link 
                        key={index} 
                        to={metric.path} 
                        className="metric-card" 
                    >
                        <div className="metric-icon">{metric.icon}</div>
                        <h3 className="metric-value">{metric.value}</h3>
                        <p className="metric-title">{metric.title}</p>
                    </Link>
                ))}
            </div>

            {/* Added a section to display the recent activity */}
            <section className="admin-recent-activity">
                <h3>Recent Activity ({activity.length} Users)</h3>
                <div className="activity-list">
                    {activity.length > 0 ? (
                        activity.map((user) => (
                            <div key={user.id} className="activity-item">
                                New User: **{user.name}** ({user.created_at})
                            </div>
                        ))
                    ) : (
                        <p>No recent activity found.</p>
                    )}
                </div>
            </section>
        </div>
    );
}

export default AdminDashboard;