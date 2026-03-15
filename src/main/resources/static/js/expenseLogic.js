
// ✅ Enhanced Auth helper with automatic redirect
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

// Check authentication on page load
const token = localStorage.getItem("jwtToken");
if (!token) {
    window.location.href = "/login";
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("Expense JS loaded ✅");

    const addExpenseBtn = document.getElementById("addExpense");
    if (addExpenseBtn) {
        addExpenseBtn.addEventListener("click", () => {
            window.location.href = "/addExpense";
        });
    }

    // Navigation handlers for authenticated pages
    const navIncome = document.getElementById("nav-income");
    const navDashboard = document.getElementById("nav-dashboard");

    if (navIncome) {
        navIncome.addEventListener("click", (e) => {
            e.preventDefault();
            checkAuthAndNavigate("/income");
        });
    }

    if (navDashboard) {
        navDashboard.addEventListener("click", (e) => {
            e.preventDefault();
            checkAuthAndNavigate("/dashboard");
        });
    }

    if (document.getElementById("expense-table-body")) {
        loadExpenses();
    }

    setupSetBudget();
});

// Function to check authentication before navigation (shared with script.js)
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
}

// 🔁 Load Expenses and render the table
function loadExpenses() {
    fetch('/api/expenses', { headers: authHeaders() })
        .then(response => response.json())
        .then(data => {
            console.log("Fetched expense data ✅:", data);
            renderExpenses(data);
            populateCategoryDropdown(data);
        })
        .catch(error => {
            console.error("Error fetching expense records ❌:", error);
        });
}

// ✨ Render expenses in table
function renderExpenses(expenses) {
    const tableBody = document.getElementById("expense-table-body");
    if (!tableBody) return;

    tableBody.innerHTML = "";

    expenses.forEach(expense => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${expense.date}</td>
            <td>${expense.category}</td>
            <td>₹${expense.amount}</td>
            <td>${expense.note}</td>
            <td>
                <div class="action-buttons">
                    <button class="update-btn" data-id="${expense.id}">Update</button>
                    <i class="fa-solid fa-trash delete-icon" data-id="${expense.id}"></i>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });

    setupTableListeners();
    displayTotalAmount(expenses);
}

// ✏️ Update/Delete Actions
function setupTableListeners() {
    document.addEventListener("click", (event) => {
        if (event.target.classList.contains("update-btn")) {
            const id = event.target.getAttribute("data-id");
            window.location.href = `/addExpense?id=${id}`;
        }

        if (event.target.classList.contains("delete-icon")) {
            const id = event.target.getAttribute("data-id");
            if (id && confirm("Are you sure you want to delete this expense?")) {
                fetch(`/expensePage/${id}`, {
                    method: "DELETE",
                    headers: authHeaders()
                })
                    .then(response => {
                        if (response.ok) {
                            alert("Expense deleted successfully");
                            loadExpenses();
                        } else {
                            alert("Failed to delete expense");
                        }
                    })
                    .catch(error => {
                        console.error("❌ Error deleting expense:", error);
                    });
            }
        }
    });
}

// 🧹 Filtering logic
function populateCategoryDropdown(expenses) {
    const dropdown = document.getElementById("customDropdown");
    const filterIcon = document.getElementById("filterToggle");

    if (!dropdown || !filterIcon) {
        console.warn("⚠️ Filter icon or dropdown not found.");
        return;
    }

    dropdown.innerHTML = "";

    const categories = new Set(expenses.map(exp => exp.category?.trim()).filter(Boolean));

    const allOption = createDropdownOption("All Categories", "all");
    dropdown.appendChild(allOption);

    categories.forEach(category => {
        dropdown.appendChild(createDropdownOption(category, category.toLowerCase()));
    });

    setupCategoryFilter();
}

function createDropdownOption(label, value) {
    const option = document.createElement("div");
    option.className = "dropdown-option";
    option.setAttribute("data-value", value);
    option.textContent = label;
    return option;
}

function setupCategoryFilter() {
    const dropdown = document.getElementById("customDropdown");
    const filterIcon = document.getElementById("filterToggle");

    if (!dropdown || !filterIcon) return;

    filterIcon.onclick = () => dropdown.classList.toggle("show");

    document.addEventListener("click", (e) => {
        if (!e.target.closest(".filter-wrapper")) {
            dropdown.classList.remove("show");
        }
    });

    dropdown.onclick = async (e) => {
        if (!e.target.classList.contains("dropdown-option")) return;

        const selected = e.target.getAttribute("data-value");

        try {
            const response = await fetch('/api/expenses', { headers: authHeaders() });
            const data = await response.json();

            const filtered = selected === "all"
                ? data
                : data.filter(exp => exp.category?.trim().toLowerCase() === selected);

            renderExpenses(filtered);
            dropdown.classList.remove("show");
        } catch (err) {
            console.error("Error filtering expenses ❌:", err);
        }
    };
}

// 📅 Today's Total
function displayTotalAmount(expenses) {
    const today = new Date().toISOString().split("T")[0];
    let total = 0;

    expenses.forEach(expense => {
        if (expense.date === today) {
            total += expense.amount;
        }
    });

    const totalEl = document.querySelector(".expense-count span");
    if (totalEl) totalEl.textContent = total;
}

// 💰 Set Budget
function setupSetBudget() {
    const setBtn = document.getElementById("set-btn");
    const budgetInput = document.getElementById("budget");
    const confirmationMessage = document.getElementById("confirmationMessage");

    if (!setBtn || !budgetInput || !confirmationMessage) return;

    setBtn.addEventListener("click", async () => {
        const budgetValue = budgetInput.value.trim();
        const budget = parseInt(budgetValue, 10);

        if (isNaN(budget) || budget <= 0) {
            alert("Please enter a valid budget.");
            return;
        }

        confirmationMessage.style.display = "none";

        try {
            const response = await fetch('/expensePage', {
                method: 'POST',
                headers: authHeaders(),
                body: JSON.stringify({ budget })
            });

            if (response.ok) {
                confirmationMessage.style.display = 'block';
                confirmationMessage.style.color = 'red';
                budgetInput.value = "";

                setTimeout(() => {
                    confirmationMessage.style.display = "none";
                }, 3000);
            } else {
                alert('Something went wrong, please try again.');
            }
        } catch (error) {
            console.error('Error setting budget ❌:', error);
            alert('There was an error setting the budget. Please try again.');
        }
    });
}