document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("registerButton").addEventListener("click", async () => {
        const userData = {
            username: document.getElementById("username").value,
            password: document.getElementById("password").value
        };

        try {
            const response = await fetch("/userRegistration", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (response.ok) {
                // Auto login after registration
                const loginResponse = await fetch("/api/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(userData)
                });

                const loginData = await loginResponse.json();
                if (loginResponse.ok) {
                    localStorage.setItem("jwtToken", loginData.token);
                    localStorage.setItem("username", loginData.username);
                    window.location.href = "/";
                } else {
                    document.getElementById("content").innerText = "Registration successful, but auto-login failed. Please login manually.";
                }
            } else {
                document.getElementById("content").innerText = data.error || "Registration failed. Please try again.";
            }
        } catch (error) {
            console.error("Registration error:", error);
            document.getElementById("content").innerText = "Network error. Please try again.";
        }
    });
});
