import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardData } from '../../services/api'; 
import '../../pagesstyles/AdminDashboard.css';

// AdminDashboard component displays key metrics and recent activities for administrators
function AdminDashboard() {
    const [metrics, setMetrics] = useState(null);
    const [activity, setActivity] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const data = await getDashboardData(); 
                
                setMetrics(data.metrics);
                setActivity(data.recentActivity.recentUsers || []); 
                
            } catch (err) {
                setError("Failed to load dashboard data. Check API endpoints.");
                console.error("Dashboard Data Fetch Error:", err);
            } finally {
                setIsLoading(false);
            }
        };

        loadDashboardData();
    }, []); 

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
            title: "Total Users", 
            value: metrics.totalUsers ? metrics.totalUsers.toLocaleString() : '0', 
            icon: "👤", 
            path: "/admin/users" 
        },
        { 
            title: "Low Stock Count", 
            value: metrics.lowStockCount ? metrics.lowStockCount.toLocaleString() : '0', 
            icon: "⚠️", 
            path: "/admin/inventory" 
        },
    ] : [];

    if (isLoading) {
        return <div className="loading-style">Loading Dashboard...</div>;
    }

    if (error) {
        return <div className="admin-error-message">🚨 {error}</div>;
    }

    return (
        <div className="admin-dashboard-page"> 
            
            <h2 className="welcome-heading">Welcome back, Admin!</h2>
            <p className="overview-text">Quick overview of Crafty Corner operations.</p>
            
            {/* Grid container for displaying key metrics */}
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

            {/* Section dedicated to displaying recent user activity */}
            <section className="admin-recent-activity">
                <h3>Recent Activity ({activity.length} Users)</h3>
                <div className="activity-list">
                    {activity.length > 0 ? (
                        activity.map((user) => (
                            <div key={user.id} className="activity-item">
                                New User: {user.name} ({user.created_at})
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