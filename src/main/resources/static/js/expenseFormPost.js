document.addEventListener("DOMContentLoaded", () => {
    const addBtn = document.getElementById("add-expense");
    const form = document.getElementById("form");

    // Read id from URL query params
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const isEditMode = id !== null;

    // ---------- CLEAR ERROR MESSAGES ----------
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
        fetch(`/addExpense/${id}`)
            .then(response => response.json())
            .then(data => {
                console.log("Fetched data ✅:", data);
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

        clearErrors(); // ⭐ important

        const formData = {
            category: document.getElementById("category").value,
            date: document.getElementById("date").value,
            amount: Number(document.getElementById("amount").value), // ⭐ ensure number
            note: document.getElementById("note").value
        };

        // ---------- UPDATE EXPENSE ----------
        if (isEditMode) {
            try {
                const response = await fetch(`/addExpense/${id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    console.log("Expense updated ✅");
                    window.location.href = "/expensePage";
                } else {
                    const errors = await response.json();

                    if (errors.amount) {
                        document.getElementById("amountError").innerText = errors.amount;
                    }
                    if (errors.category) {
                        document.getElementById("categoryError").innerText = errors.category;
                    }
                    if (errors.date) {
                        document.getElementById("dateError").innerText = errors.date;
                    }
                }
            } catch (error) {
                console.error("Error during update ❌:", error);
            }

        } else {
            // ---------- ADD EXPENSE ----------
            try {
                const response = await fetch("/addExpense", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    console.log("Expense added ✅");
                    window.location.href = "/expensePage";
                } else {
                    const errors = await response.json();

                    if (errors.amount) {
                        document.getElementById("amountError").innerText = errors.amount;
                    }
                    if (errors.category) {
                        document.getElementById("categoryError").innerText = errors.category;
                    }
                    if (errors.date) {
                        document.getElementById("dateError").innerText = errors.date;
                    }
                }
            } catch (error) {
                console.error("Error during add ❌:", error);
            }
        }
    });
});
