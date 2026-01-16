
/*GET API for userregistration Form*/
document.addEventListener("DOMContentLoaded", () => {
    const registerBtn = document.getElementById("registerBtn");
    if (registerBtn) {
        registerBtn.addEventListener("click", () => {
            window.location.href = "/userRegistration";
        });
    }
});
window.addEventListener("DOMContentLoaded", async function () {
    const welcomeEl = document.getElementById("welcome-message");
    const registerBtn = document.getElementById("registerBtn");

    try {
        const response = await fetch("/currentUser");
        const data = await response.json();
        const username = data.username;

        if (username && username !== "") {
            welcomeEl.textContent = `Welcome, ${username}!`;
            registerBtn.style.display = "none";
        } else {
            welcomeEl.textContent = "Welcome to FinTrack!";
            registerBtn.style.display = "inline-block";
        }
    } catch (error) {
        console.error("Failed to fetch current user:", error);
        welcomeEl.textContent = "Welcome to FinTrack!";
        registerBtn.style.display = "inline-block";
    }
});

/* GET API Nav and main body buttons */
document.addEventListener("DOMContentLoaded", () => {
   
    const incomeBtns = document.querySelectorAll("#income-btn, #incomeNavBtn");
    const expenseBtns = document.querySelectorAll("#expense-btn, #expenseNavBtn");
    const dashboardBtns = document.querySelectorAll("#dashboard-btn, #dashboardNavBtn");

    // event listener for Income button
    incomeBtns.forEach(btn => {
        btn.addEventListener("click", () => {  // <-- Add e as the parameter
           
            window.location.href = "/income"; 
        });
    });

    // event listener for Expense button
    expenseBtns.forEach(btn => {
        btn.addEventListener("click", () => {  // <-- Add e as the parameter

            window.location.href = "/expensePage";
        });
    });

    // event listener for Dashboard button
    dashboardBtns.forEach(btn => {
        btn.addEventListener("click", () => {  // <-- Add e as the parameter
         
            window.location.href = "/dashboard";
        });
    });
});
