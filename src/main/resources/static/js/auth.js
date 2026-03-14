// JWT Token Interceptor
function getAuthToken() {
    return localStorage.getItem('jwtToken');
}

// Add JWT token to all fetch requests
(function() {
    const originalFetch = window.fetch;
    
    window.fetch = async function(url, options = {}) {
        // Add token for ALL API endpoints (including registration and login)
        if (url.includes('/api/') || url.includes('/userRegistration') || 
            url.includes('/income') || url.includes('/expense') || 
            url.includes('/dashboard') || url.includes('/expensePage')) {
            
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
    
    // Don't redirect on registration page
    if (!token || !username) {
        if (!window.location.pathname.includes('/login') && 
            !window.location.pathname.includes('/userRegistration') &&
            !window.location.pathname.includes('/index.html')) {
            window.location.href = '/login';
        }
    }
}

// Run auth check on page load
document.addEventListener('DOMContentLoaded', checkAuth);
