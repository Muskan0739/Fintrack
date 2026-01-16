document.addEventListener("DOMContentLoaded", function () {
    const filterIcon = document.querySelector(".filter-icon");
    const filterDropdown = document.getElementById("categoryFilter");
    const tableBody = document.getElementById("table-body");

    if (!filterIcon || !filterDropdown || !tableBody) {
        console.error("Filter icon, dropdown, or table body not found.");
        return;
    }

    function getDataRows() {
        return Array.from(tableBody.querySelectorAll("tr:not(.no-records)"));
    }

    function populateFilterDropdown() {
        const sources = new Set();

        getDataRows().forEach(row => {
            const sourceCell = row.cells[1]; // 2nd column: Source
            if (sourceCell) {
                sources.add(sourceCell.textContent.trim());
            }
        });

        // Clear old options
        filterDropdown.innerHTML = "";

        // Add "All Categories"
        const allOption = document.createElement("option");
        allOption.value = "all";
        allOption.textContent = "All Categories";
        filterDropdown.appendChild(allOption);

        // Add unique sources
        sources.forEach(source => {
            const option = document.createElement("option");
            option.value = source.toLowerCase();
            option.textContent = source;
            filterDropdown.appendChild(option);
        });
    }

    function filterTable(selectedCategory) {
        const rows = getDataRows();
        let visibleCount = 0;

        rows.forEach(row => {
            const sourceText = row.cells[1]?.textContent.trim().toLowerCase();
            if (selectedCategory === "all" || sourceText === selectedCategory) {
                row.style.display = "table-row";
                visibleCount++;
            } else {
                row.style.display = "none";
            }
        });

        // Handle no matching records
        const existing = document.querySelector(".no-records");
        if (existing) existing.remove();

        if (visibleCount === 0) {
            const noRow = document.createElement("tr");
            noRow.className = "no-records";
            const colCount = document.querySelectorAll("thead th").length;
            noRow.innerHTML = `<td colspan="${colCount}">No records found</td>`;
            tableBody.appendChild(noRow);
        }
    }

    // Toggle dropdown when filter icon is clicked
    filterIcon.addEventListener("click", function (e) {
        e.stopPropagation();
        populateFilterDropdown(); // refresh options
        filterDropdown.classList.toggle("show"); // assumes you use CSS to show/hide
    });

    // Filter when dropdown value changes
    filterDropdown.addEventListener("change", function () {
        filterTable(this.value.trim().toLowerCase());
    });

    // Close dropdown on outside click
    document.addEventListener("click", function (e) {
        if (!filterDropdown.contains(e.target) && !filterIcon.contains(e.target)) {
            filterDropdown.classList.remove("show");
        }
    });
});

