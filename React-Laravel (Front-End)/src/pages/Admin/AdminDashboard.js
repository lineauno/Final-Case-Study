import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardData } from '../../services/api'; 
import '../../pagesstyles/AdminDashboard.css';

/**
 * AdminDashboard Component
 * Renders the central overview page for administrators.
 * This component fetches operational statistics (metrics) and recent user data,
 * providing interactive links to specific management modules.
 */
function AdminDashboard() {
    /**
     * Component state definitions.
     * Manages statistical metrics, activity arrays, and network status flags.
     */
    const [metrics, setMetrics] = useState(null);
    const [activity, setActivity] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    /**
     * Data Initialization Hook
     * Dispatches an API request on mount to populate the dashboard metrics
     * and activity feeds.
     */
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

    /**
     * Metrics Configuration Mapping
     * Transforms raw state data into a structured array for UI rendering.
     * Maps icons, titles, and localized values to their respective navigation paths.
     */
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

    /**
     * Status-based early returns
     * Renders standard loading and error states to maintain a smooth user experience.
     */
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
            
            {/* Grid display for the processed dashboard statistics cards */}
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

            {/* List display for chronologically ordered user registrations */}
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