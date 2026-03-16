document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("registerButton").addEventListener("click", async () => {
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        
        // Validate inputs
        if (!username || !password) {
            document.getElementById("content").innerText = "Please fill in all fields.";
            return;
        }

        const userData = {
            username: username,
            password: password
        };

        try {
            console.log("🔍 Registration: Sending registration request:", JSON.stringify(userData));
            
            const response = await fetch("/userRegistration", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(userData)
            });

            console.log("🔍 Registration: Response status:", response.status);
            console.log("🔍 Registration: Response headers:", response.headers);

            // Check if response has content before trying to parse JSON
            const responseText = await response.text();
            console.log("🔍 Registration: Raw response text:", responseText);
            
            let data;
            if (responseText) {
                try {
                    data = JSON.parse(responseText);
                    console.log("🔍 Registration: Parsed response data:", data);
                } catch (jsonError) {
                    console.error("❌ Registration: Failed to parse JSON:", jsonError);
                    document.getElementById("content").innerText = "Server returned invalid response.";
                    return;
                }
            } else {
                console.error("❌ Registration: Empty response from server");
                data = {};
            }

            if (response.ok) {
                console.log("✅ Registration: Registration successful!");
                
                // Auto login after registration
                console.log("🔍 Registration: Attempting auto-login...");
                const loginResponse = await fetch("/api/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(userData)
                });

                const loginText = await loginResponse.text();
                console.log("🔍 Registration: Login response text:", loginText);
                
                let loginData;
                if (loginText) {
                    try {
                        loginData = JSON.parse(loginText);
                        console.log("🔍 Registration: Login response data:", loginData);
                    } catch (jsonError) {
                        console.error("❌ Registration: Failed to parse login JSON:", jsonError);
                        document.getElementById("content").innerText = "Login failed after registration.";
                        return;
                    }
                } else {
                    console.error("❌ Registration: Empty login response");
                    loginData = {};
                }
                
                if (loginResponse.ok && loginData.token) {
                    console.log("✅ Registration: Auto-login successful!");
                    localStorage.setItem("jwtToken", loginData.token);
                    localStorage.setItem("username", loginData.username);
                    console.log("✅ Registration: Redirecting to home page");
                    window.location.href = "/";
                } else {
                    console.error("❌ Registration: Auto-login failed");
                    document.getElementById("content").innerText = loginData.error || "Login failed after registration.";
                }
            } else {
                console.error("❌ Registration: Registration failed with status:", response.status);
                document.getElementById("content").innerText = data.error || "Registration failed. Please try again.";
            }

        } catch (error) {
            console.error("❌ Registration: Network error:", error);
            document.getElementById("content").innerText = "Network error. Please try again.";
        }
    });
});
