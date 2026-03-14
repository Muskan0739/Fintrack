document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("loginButton").addEventListener("click", async function () {
        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!username || !password) {
            document.getElementById("content").innerText = "Please enter username and password.";
            return;
        }

        try {
            console.log("Attempting login with:", { username, password: "****" });
            
            const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({ username, password })
            });

            console.log("Login response status:", response.status);
            console.log("Response headers:", response.headers);

            // Handle the case where response might be empty
            let data;
            try {
                const responseText = await response.text();
                console.log("Response text:", responseText);
                
                if (responseText) {
                    data = JSON.parse(responseText);
                } else {
                    data = { error: "Empty response from server" };
                }
            } catch (parseError) {
                console.error("Failed to parse response:", parseError);
                data = { error: "Invalid response from server" };
            }

            if (response.ok && data.token) {
                // Store the token in localStorage
                localStorage.setItem("jwtToken", data.token);
                localStorage.setItem("username", data.username);
                console.log("Login successful, redirecting to home");

                // Redirect to home page
                window.location.href = "/";
            } else {
                document.getElementById("content").innerText = data.error || "Invalid credentials!";
            }

        } catch (error) {
            console.error("Login error:", error);
            document.getElementById("content").innerText = "Something went wrong. Please try again.";
        }
    });
});
