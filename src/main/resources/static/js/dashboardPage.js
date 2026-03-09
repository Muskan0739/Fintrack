const token = localStorage.getItem("jwtToken");
if (!token) window.location.href = "/login";

// ✅ Auth helper
function authHeaders() {
    const token = localStorage.getItem("jwtToken");
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };
}

document.addEventListener("DOMContentLoaded", function () {
    const expenseColors = ["#1B3A4B", "#467A92", "#8CCDD0", "#A5C4D5"];
    const incomeColors = ["#0F969C", "#6DA5C0", "#294D61"];
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    font: { size: 12, weight: "bold" },
                    color: "#F9F7F7",
                    padding: 10
                }
            },
            tooltip: {
                backgroundColor: "#294D61",
                titleFont: { size: 14, weight: "bold" },
                bodyFont: { size: 12 },
                bodySpacing: 5,
                cornerRadius: 8,
                callbacks: {
                    label: function (context) {
                        const category = context.label;
                        const amount = context.parsed;
                        return `${category}: ₹${amount}`;
                    }
                }
            }
        }
    };

    // Savings Summary
    fetch('/dashboard/saving-summary', { headers: authHeaders() })
        .then(response => response.json())
        .then(data => {
            const incomeElem = document.getElementById("totalIncome");
            const expenseElem = document.getElementById("totalExpense");
            const savingElem = document.getElementById("savingBalance");
            const deficitMessage = document.getElementById("deficitMessage");
            const deficitAmountElem = document.getElementById("deficitAmount");

            const income = data.income || 0;
            const expense = data.expense || 0;
            const saving = data.saving || 0;

            incomeElem.textContent = `₹${income.toFixed(2)}`;
            expenseElem.textContent = `₹${expense.toFixed(2)}`;

            if (saving < 0) {
                savingElem.textContent = `-₹${Math.abs(saving).toFixed(2)}`;
                deficitAmountElem.textContent = Math.abs(saving).toFixed(2);
                deficitMessage.style.display = "block";
            } else {
                savingElem.textContent = `₹${saving.toFixed(2)}`;
                deficitMessage.style.display = "none";
            }
        })
        .catch(error => console.error("Error loading savings data:", error));

    document.getElementById("addIncome").addEventListener("click", () => {
        window.location.href = "/income";
    });
    document.getElementById("addExpense").addEventListener("click", () => {
        window.location.href = "/expensePage";
    });

    updateBudgetBreakdown();

    // Income Breakdown Chart
    fetch('/dashboard/income-breakdown', { headers: authHeaders() })
        .then(response => response.json())
        .then(data => {
            const labels = Object.keys(data);
            const values = Object.values(data);
            const backgroundColors = [...incomeColors, "#A0C3D2", "#4B6587", "#C7D6D5"];

            new Chart(document.getElementById("incomeChart"), {
                type: "pie",
                data: {
                    labels: labels,
                    datasets: [{
                        data: values,
                        backgroundColor: backgroundColors.slice(0, labels.length),
                        borderColor: "#F9F7F7",
                        borderWidth: 1
                    }]
                },
                options: chartOptions
            });
        })
        .catch(error => console.error("Error loading income breakdown:", error));

    // Expense Breakdown Chart
    fetch('/dashboard/expense-breakdown', { headers: authHeaders() })
        .then(response => response.json())
        .then(data => {
            const labels = Object.keys(data);
            const values = Object.values(data);
            const backgroundColors = [...expenseColors, "#E29578", "#F4A261", "#F6BD60"];

            new Chart(document.getElementById("expenseChart"), {
                type: "pie",
                data: {
                    labels: labels,
                    datasets: [{
                        data: values,
                        backgroundColor: backgroundColors.slice(0, labels.length),
                        borderColor: "#F9F7F7",
                        borderWidth: 1
                    }]
                },
                options: chartOptions
            });
        })
        .catch(error => console.error("Error loading expense breakdown:", error));

    // Savings Trend Chart
    fetch('/dashboard/savings-trend', { headers: authHeaders() })
        .then(res => res.json())
        .then(data => {
            const labels = Object.keys(data);
            const values = Object.values(data);

            new Chart(document.getElementById("savingsTrendChart"), {
                type: "line",
                data: {
                    labels: labels,
                    datasets: [{
                        label: "Savings Over Time",
                        data: values,
                        borderColor: "#FFCE56",
                        backgroundColor: "rgba(255, 206, 86, 0.2)",
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            title: { display: true, text: "Weeks", color: "#FFFFFF", font: { size: 14, weight: "bold" } },
                            ticks: { color: "#FFFFFF", font: { size: 12 }, autoSkip: false, maxRotation: 0, minRotation: 0 },
                            grid: { color: "rgba(255, 255, 255, 0.1)" }
                        },
                        y: {
                            title: { display: true, text: "Savings (₹)", color: "#FFFFFF", font: { size: 14, weight: "bold" } },
                            ticks: { color: "#FFFFFF", font: { size: 12 }, beginAtZero: true },
                            grid: { color: "rgba(255, 255, 255, 0.1)" }
                        }
                    }
                }
            });
        })
        .catch(err => console.error("Savings trend error:", err));

    // Recent Transactions
    fetch('/dashboard/recent-transactions', { headers: authHeaders() })
        .then(response => response.json())
        .then(data => {
            const transactionList = document.getElementById("transactions-list");

            if (!Array.isArray(data)) {
                transactionList.innerHTML = "<p>No transactions available.</p>";
                return;
            }

            transactionList.innerHTML = "";

            const categoryIcons = {
                "Flight Ticket": "fas fa-plane",
                "Food": "fas fa-utensils",
                "Shopping": "fas fa-shopping-cart",
                "Transport": "fas fa-bus",
                "Hotel Stay": "fas fa-hotel",
                "Entertainment": "fas fa-film",
                "Bills": "fas fa-file-invoice-dollar",
                "Salary": "fas fa-wallet",
                "Others": "fas fa-tag"
            };

            data.forEach((transaction, index) => {
                const iconClass = categoryIcons[transaction.category] || "fas fa-tag";
                const typeSign = transaction.type === "expense" ? "-" : "+";
                const colorClass = transaction.type === "expense" ? "text-red" : "text-green";

                transactionList.innerHTML += `
                    <div class="transaction-item ${colorClass}">
                        <p><i class="${iconClass}"></i> ${transaction.category}</p>
                        <span>${typeSign}₹${transaction.amount}</span>
                    </div>
                    ${index < data.length - 1 ? '<hr>' : ''}
                `;
            });
        })
        .catch(error => {
            console.error("Transaction history error:", error);
            document.getElementById("transactions-list").innerHTML = "<p>Error loading transactions.</p>";
        });

    // Budget Breakdown Function
    function updateBudgetBreakdown() {
        fetch('/dashboard/budget-breakdown', { headers: authHeaders() })
            .then(res => res.json())
            .then(data => {
                const budgetEl = document.getElementById("budget");
                const spentEl = document.getElementById("spent");
                const remainingEl = document.getElementById("remaining");

                if (data.status === "no-data") {
                    budgetEl.textContent = "No data";
                    spentEl.textContent = "No data";
                    remainingEl.textContent = "No data";
                    remainingEl.style.color = "#F9F7F7";
                } else {
                    budgetEl.textContent = `₹${data.budget.toLocaleString()}`;
                    spentEl.textContent = `₹${data.spent.toLocaleString()}`;
                    remainingEl.textContent = `₹${data.remaining.toLocaleString()}`;

                    if (data.remaining < 0) {
                        remainingEl.style.color = "red";
                        remainingEl.textContent += " (Deficit)";
                    } else {
                        remainingEl.style.color = "#F9F7F7";
                    }
                }
            })
            .catch(error => console.error("Error fetching budget breakdown:", error));
    }
});