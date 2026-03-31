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
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({ username, password })
            });
            // Handle the case where response might be empty
            let data;
            try {
                const responseText = await response.text();

                if (responseText) {
                    data = JSON.parse(responseText);
                } else {
                    console.error("Login: Empty response from server");
                    data = { error: "Empty response from server" };
                }
            } catch (parseError) {
                console.error("Login: Failed to parse response:", parseError);
                data = { error: "Invalid response from server" };
            }

            if (response.ok && data.token) {
                // Store the token in localStorage
                localStorage.setItem("jwtToken", data.token);
                localStorage.setItem("username", data.username);
				
                window.location.href = "/";
            } else {
                console.error("Login: Authentication failed");
                console.error("Login: Error message:", data.error);
                document.getElementById("content").innerText = data.error || "Invalid credentials!";
            }

        } catch (error) {
            console.error("Login: Network error:", error);
            document.getElementById("content").innerText = "Something went wrong. Please try again.";
        }
    });
});
