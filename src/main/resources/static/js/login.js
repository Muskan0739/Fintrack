document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("loginButton").addEventListener("click", async function () {
        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!username || !password) {
            document.getElementById("content").innerText = "Please enter username and password.";
            return;
        }

        try {
            console.log("🔍 Login: Attempting login with username:", username);
            
            const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({ username, password })
            });

            console.log("🔍 Login: Response status:", response.status);
            console.log("🔍 Login: Response headers:", response.headers);

            // Handle the case where response might be empty
            let data;
            try {
                const responseText = await response.text();
                console.log("🔍 Login: Raw response text:", responseText);
                
                if (responseText) {
                    data = JSON.parse(responseText);
                    console.log("🔍 Login: Parsed response data:", data);
                } else {
                    console.error("❌ Login: Empty response from server");
                    data = { error: "Empty response from server" };
                }
            } catch (parseError) {
                console.error("❌ Login: Failed to parse response:", parseError);
                console.error("❌ Login: Raw response was:", responseText);
                data = { error: "Invalid response from server" };
            }

            if (response.ok && data.token) {
                console.log("✅ Login: Authentication successful!");
                console.log("✅ Login: JWT token received:", data.token.substring(0, Math.min(20, data.token.length())) + "...");
                
                // Store the token in localStorage
                localStorage.setItem("jwtToken", data.token);
                localStorage.setItem("username", data.username);
                
                console.log("✅ Login: Token and username stored in localStorage");
                console.log("✅ Login: Redirecting to home page");

                // Redirect to home page
                window.location.href = "/";
            } else {
                console.error("❌ Login: Authentication failed");
                console.error("❌ Login: Error message:", data.error);
                document.getElementById("content").innerText = data.error || "Invalid credentials!";
            }

        } catch (error) {
            console.error("❌ Login: Network error:", error);
            document.getElementById("content").innerText = "Something went wrong. Please try again.";
        }
    });
});
