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

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form");

    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const isEditMode = id !== null;

    function clearErrors() {
        const amountError = document.getElementById("amountError");
        const categoryError = document.getElementById("categoryError");
        const dateError = document.getElementById("dateError");

        if (amountError) amountError.innerText = "";
        if (categoryError) categoryError.innerText = "";
        if (dateError) dateError.innerText = "";
    }

    // ---------- EDIT MODE: FETCH EXISTING DATA ----------
    if (isEditMode) {
        fetch(`/addExpense/${id}`, { headers: authHeaders() })
            .then(response => response.json())
            .then(data => {
                document.getElementById("category").value = data.category;
                document.getElementById("date").value = data.date;
                document.getElementById("amount").value = data.amount;
                document.getElementById("note").value = data.note;
            })
            .catch(error => console.error("Error fetching expense data ❌", error));
    }

    // ---------- FORM SUBMIT ----------
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        clearErrors();

        const formData = {
            category: document.getElementById("category").value,
            date: document.getElementById("date").value,
            amount: Number(document.getElementById("amount").value),
            note: document.getElementById("note").value
        };

        if (isEditMode) {
            try {
                const response = await fetch(`/addExpense/${id}`, {
                    method: "PUT",
                    headers: authHeaders(),
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    window.location.href = "/expensePage";
                } else {
                    let errors = {};
                    try {
                        errors = await response.json();
                    } catch (e) {
                        // Non-JSON error (e.g., 401/403 from Spring Security)
                        if (response.status === 401 || response.status === 403) {
                            alert("Your session has expired or you are not authorized. Please log in again.");
                            localStorage.removeItem("jwtToken");
                            localStorage.removeItem("username");
                            window.location.href = "/login";
                            return;
                        }
                        console.error("Unexpected error response ❌:", e);
                        alert("Something went wrong. Please try again.");
                        return;
                    }

                    if (errors.amount) document.getElementById("amountError").innerText = errors.amount;
                    if (errors.category) document.getElementById("categoryError").innerText = errors.category;
                    if (errors.date) document.getElementById("dateError").innerText = errors.date;
                }
            } catch (error) {
                console.error("Error during update ❌:", error);
            }

        } else {
            try {
                const response = await fetch("/addExpense", {
                    method: "POST",
                    headers: authHeaders(),
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    window.location.href = "/expensePage";
                } else {
                    let errors = {};
                    try {
                        errors = await response.json();
                    } catch (e) {
                        // Non-JSON error (e.g., 401/403 from Spring Security)
                        if (response.status === 401 || response.status === 403) {
                            alert("Your session has expired or you are not authorized. Please log in again.");
                            localStorage.removeItem("jwtToken");
                            localStorage.removeItem("username");
                            window.location.href = "/login";
                            return;
                        }
                        console.error("Unexpected error response ❌:", e);
                        alert("Something went wrong. Please try again.");
                        return;
                    }

                    if (errors.amount) document.getElementById("amountError").innerText = errors.amount;
                    if (errors.category) document.getElementById("categoryError").innerText = errors.category;
                    if (errors.date) document.getElementById("dateError").innerText = errors.date;
                }
            } catch (error) {
                console.error("Error during add ❌:", error);
            }
        }
    });
});