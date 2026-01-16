document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form");

    // ✅ Load income breakdown by source
    async function loadIncomeBySource() {
        const contentDiv = document.querySelector("#income-source-card .breakdown-content");

        if (!contentDiv) {
            console.error("❌ Content div not found!");
            return;
        }

        contentDiv.innerHTML = "";
        let totalIncome = 0;

        try {
            const response = await fetch('/income/sources');
            const data = await response.json();

            for (const [source, total] of Object.entries(data)) {
                totalIncome += total;

                const row = document.createElement("div");
                row.classList.add("breakdown-row");
                row.innerHTML = `
                    <p>${source}: <span class="amount-box">₹ ${total}</span></p>
                `;
                contentDiv.appendChild(row);
            }

            const totalRow = document.createElement("div");
            totalRow.classList.add("breakdown-row");
            totalRow.innerHTML = `
                <p><strong>Total Income:</strong> <span class="amount-box">₹ ${totalIncome}</span></p>
            `;
            contentDiv.appendChild(totalRow);

        } catch (error) {
            console.error("❌ Error fetching income by source:", error);
        }
    }

    // ✅ Load all income records
    async function loadIncome() {
        try {
            const response = await fetch('/income/data');
            const data = await response.json();
            const tableBody = document.getElementById("table-body");
            tableBody.innerHTML = "";

            data.forEach(income => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${income.date}</td>
                    <td>${income.source}</td>
                    <td>${income.amount}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="edit-btn" data-id="${income.id}">Edit</button>
                            <button class="delete-btn" data-id="${income.id}">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    </td>
                `;
                tableBody.appendChild(row);
            });

        } catch (error) {
            console.error("❌ Error loading income records:", error);
        }
    }

    // ✅ Submit income form
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // -------- CLEAR PREVIOUS ERRORS --------
        document.getElementById("dateError").innerText = "";
        document.getElementById("sourceError").innerText = "";
        document.getElementById("amountError").innerText = "";

        const incomeId = document.getElementById("incomeId").value;
        const url = incomeId ? `/income/${incomeId}` : '/income';
        const method = incomeId ? 'PUT' : 'POST';

        const payload = {
            id: incomeId || null,
            date: document.getElementById("date").value,
            source: document.getElementById("source").value,
            amount: Number(document.getElementById("amount").value)
        };

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            // -------- 🔴 UPDATED ERROR HANDLING (CORE FIX) --------
            if (!response.ok) {
                let errors = {};

                try {
                    // Try reading JSON (validation errors)
                    errors = await response.json();
                } catch (err) {
                    console.error("❌ Non-JSON error response");
                }

                // Handle field-level errors safely
                if (errors.amount) {
                    document.getElementById("amountError").innerText = errors.amount;
                }
                if (errors.source) {
                    document.getElementById("sourceError").innerText = errors.source;
                }
                if (errors.date) {
                    document.getElementById("dateError").innerText = errors.date;
                }

                // Generic fallback (important)
                if (Object.keys(errors).length === 0) {
                    document.getElementById("amountError").innerText =
                        "Invalid input. Please check your data.";
                }

                return; // ❗ stop further execution
            }

            // -------- SUCCESS --------
            const data = await response.text();
            console.log("✅ Saved:", data);

            form.reset();
            document.getElementById("incomeId").value = "";

            await loadIncome();
            await loadIncomeBySource();

        } catch (error) {
            console.error("❌ Network / Server error:", error);
        }
    });

    // ✅ Event delegation for Edit/Delete buttons
    document.getElementById("table-body").addEventListener("click", async (e) => {
        const deleteBtn = e.target.closest(".delete-btn");
        const editBtn = e.target.closest(".edit-btn");

        if (deleteBtn) {
            const id = deleteBtn.getAttribute("data-id");
            const confirmed = confirm("Are you sure you want to delete this income record?");
            if (confirmed) {
                try {
                    const response = await fetch(`/income/${id}`, { method: 'DELETE' });
                    if (!response.ok) throw new Error("Failed to delete");

                    await loadIncome();
                    await loadIncomeBySource();

                } catch (error) {
                    console.error("❌ Error deleting income:", error);
                }
            }
        }

        if (editBtn) {
            const id = editBtn.getAttribute("data-id");
            try {
                const response = await fetch(`/income/${id}`);
                const data = await response.json();

                document.getElementById("incomeId").value = data.id;
                document.getElementById("amount").value = data.amount;
                document.getElementById("source").value = data.source;
                document.getElementById("date").value = data.date.split("T")[0];

            } catch (error) {
                console.error("❌ Error loading income for edit:", error);
            }
        }
    });

    // ✅ Initial load
    loadIncome();
    loadIncomeBySource();
});
