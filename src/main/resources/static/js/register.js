document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("registerButton").addEventListener("click", async () => {
        const userData = {
            username: document.getElementById("username").value,
            password: document.getElementById("password").value
        };

        try {
            console.log("Attempting registration with:", userData);
            
            const response = await fetch("/userRegistration", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(userData)
            });

            console.log("Registration response status:", response.status);
            console.log("Response headers:", response.headers);

            // Handle the case where response might be empty
            let data;
            try {
                const responseText = await response.text();
                console.log("Response text:", responseText);
                
                if (responseText) {
                    data = JSON.parse(responseText);
                } else {
                    data = { message: "Registration successful" };
                }
            } catch (parseError) {
                console.error("Failed to parse response:", parseError);
                data = { error: "Invalid response from server" };
            }

            if (response.ok) {
                console.log("Registration successful, attempting auto-login");
                
                // Auto login after registration
                const loginResponse = await fetch("/api/login", {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify(userData)
                });

                console.log("Login response status:", loginResponse.status);
                
                const loginData = await loginResponse.json();
                console.log("Login response data:", loginData);
                
                if (loginResponse.ok && loginData.token) {
                    localStorage.setItem("jwtToken", loginData.token);
                    localStorage.setItem("username", loginData.username);
                    console.log("Auto-login successful, redirecting to home");
                    window.location.href = "/";
                } else {
                    document.getElementById("content").innerText = "Registration successful, but auto-login failed. Please login manually.";
                }
            } else {
                // Check if it's a username exists error
                if (data.error && data.error.includes("exists")) {
                    document.getElementById("content").innerText = "Username already exists. Please choose a different username.";
                } else {
                    document.getElementById("content").innerText = data.error || "Registration failed. Please try again.";
                }
            }
        } catch (error) {
            console.error("Registration error:", error);
            document.getElementById("content").innerText = "Network error. Please try again.";
        }
    });
});
