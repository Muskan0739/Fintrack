document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("loginButton").addEventListener("click", async function () {
        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!username || !password) {
            document.getElementById("content").innerText = "Please enter username and password.";
            return;
        }

        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();
		
			console.log("Status:", response.status);
			console.log("Data:", data);

            if (response.ok) {
                // Store the token in localStorage
				console.log("Login response:", data);
                localStorage.setItem("jwtToken", data.token);
                localStorage.setItem("username", data.username);

                // Redirect to home page
                window.location.href = "/";
            } else {
                document.getElementById("content").innerText = data.error || "Invalid credentials!";
            }

        } catch (error) {
            document.getElementById("content").innerText = "Something went wrong. Please try again.";
        }
    });
});