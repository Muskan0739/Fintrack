
/* GET API for userregistration Form */
document.addEventListener("DOMContentLoaded", () => {
    const registerBtn = document.getElementById("registerBtn");
    if (registerBtn) {
        registerBtn.addEventListener("click", () => {
            window.location.href = "/userRegistration";
        });
    }
});

window.addEventListener("DOMContentLoaded", function () {
    const welcomeEl = document.getElementById("welcome-message");
    const registerBtn = document.getElementById("registerBtn");
    const logoutBtn = document.getElementById("logoutBtn");

    const username = localStorage.getItem("username");
    const token = localStorage.getItem("jwtToken");

    if (username && token) {
        welcomeEl.textContent = `Welcome, ${username}!`;
        if (registerBtn) registerBtn.style.display = "none";
        if (logoutBtn) logoutBtn.style.display = "inline-block";
    } else {
        welcomeEl.textContent = "Welcome to FinTrack!";
        if (registerBtn) registerBtn.style.display = "inline-block";
        if (logoutBtn) logoutBtn.style.display = "none";
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("jwtToken");
            localStorage.removeItem("username");
            window.location.href = "/";
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const registerBtn = document.getElementById("registerBtn");
    if (registerBtn) {
        registerBtn.addEventListener("click", () => {
            window.location.href = "/userRegistration";
        });
    }
});

// Function to check authentication before navigation
function checkAuthAndNavigate(url) {
    const token = localStorage.getItem("jwtToken");
    const username = localStorage.getItem("username");
    
    if (!token || !username) {
        // Not authenticated, redirect to login
        window.location.href = "/login";
    } else {
        // Authenticated, navigate to the page
        window.location.href = url;
    }
};

// Enhanced auth helper with token validation
function authHeaders() {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
        // Redirect to login if no token
        window.location.href = "/login";
        return null;
    }
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };
}

// Check if token is expired (basic check)
function isTokenExpired(token) {
    if (!token) return true;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 < Date.now();
    } catch {
        return true;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const incomeBtns = document.querySelectorAll("#income-btn, #incomeNavBtn");
    const expenseBtns = document.querySelectorAll("#expense-btn, #expenseNavBtn");
    const dashboardBtns = document.querySelectorAll("#dashboard-btn, #dashboardNavBtn");

    incomeBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            checkAuthAndNavigate("/income");
        });
    });
    expenseBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            checkAuthAndNavigate("/expensePage");
        });
    });
    dashboardBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            checkAuthAndNavigate("/dashboard");
        });
    });
});
