// JWT Token Interceptor
function getAuthToken() {
    return localStorage.getItem('jwtToken');
}

// Add JWT token to all fetch requests
(function() {
    const originalFetch = window.fetch;
    
    window.fetch = async function(url, options = {}) {
        // Only add token for API endpoints (not for static files)
        if (url.includes('/api/') || url.includes('/income') || url.includes('/expense') || url.includes('/dashboard')) {
            const token = getAuthToken();
            if (token) {
                options.headers = {
                    ...options.headers,
                    'Authorization': `Bearer ${token}`
                };
            }
        }
        
        return originalFetch(url, options);
    };
})();

// Check authentication on page load
function checkAuth() {
    const token = getAuthToken();
    const username = localStorage.getItem('username');
    
    if (!token || !username) {
        // Redirect to login if not authenticated
        if (!window.location.pathname.includes('/login') && 
            !window.location.pathname.includes('/userRegistration')) {
            window.location.href = '/login';
        }
    }
}

// Run auth check on page load
document.addEventListener('DOMContentLoaded', checkAuth);
