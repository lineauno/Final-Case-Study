import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
    return (
        <div style={{ textAlign: 'center', padding: '100px 20px', minHeight: '80vh' }}>
            <h1>404 - Page Not Found</h1>
            <p style={{ margin: '20px 0' }}>
                Sorry, the page you are looking for does not exist.
            </p>
            <Link to="/" style={{ padding: '10px 20px', backgroundColor: '#ff8ba7', color: 'white', borderRadius: '5px', textDecoration: 'none' }}>
                Go to Homepage
            </Link>
        </div>
    );
}

export default NotFoundPage;