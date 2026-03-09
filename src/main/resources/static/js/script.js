
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
            window.location.href = "/home";
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

document.addEventListener("DOMContentLoaded", () => {
    const incomeBtns = document.querySelectorAll("#income-btn, #incomeNavBtn");
    const expenseBtns = document.querySelectorAll("#expense-btn, #expenseNavBtn");
    const dashboardBtns = document.querySelectorAll("#dashboard-btn, #dashboardNavBtn");

    incomeBtns.forEach(btn => {
        btn.addEventListener("click", () => { window.location.href = "/income"; });
    });
    expenseBtns.forEach(btn => {
        btn.addEventListener("click", () => { window.location.href = "/expensePage"; });
    });
    dashboardBtns.forEach(btn => {
        btn.addEventListener("click", () => { window.location.href = "/dashboard"; });
    });
});