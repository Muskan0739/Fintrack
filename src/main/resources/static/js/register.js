document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("registerButton").addEventListener("click", async () => {
        const userData = {
            username: document.getElementById("username").value,
            password: document.getElementById("password").value
        };

        try {
            const response = await fetch("/userRegistration", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();
            if (data.username) {
                // Session now handles username tracking — no need for localStorage
                window.location.href = "/home";
            }
        } catch (error) {
            console.error("Error:", error);
        }
    });
});
