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
            console.log("Sending registration request:", JSON.stringify(userData));
            
            const response = await fetch("/userRegistration", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(userData)
            });

            console.log("Response status:", response.status);
            console.log("Response headers:", response.headers);

            // Check if response has content before trying to parse JSON
            const responseText = await response.text();
            console.log("Response text:", responseText);
            
            let data;
            if (responseText) {
                try {
                    data = JSON.parse(responseText);
                } catch (jsonError) {
                    console.error("Failed to parse JSON:", jsonError);
                    document.getElementById("content").innerText = "Server returned invalid response.";
                    return;
                }
            } else {
                data = {};
            }

            if (response.ok) {
                // Auto login after registration
                const loginResponse = await fetch("/api/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(userData)
                });

                const loginText = await loginResponse.text();
                console.log("Login response:", loginText);
                
                let loginData;
                if (loginText) {
                    try {
                        loginData = JSON.parse(loginText);
                    } catch (jsonError) {
                        console.error("Failed to parse login JSON:", jsonError);
                        document.getElementById("content").innerText = "Login failed after registration.";
                        return;
                    }
                } else {
                    loginData = {};
                }
                
                if (loginResponse.ok && loginData.token) {
                    localStorage.setItem("jwtToken", loginData.token);
                    localStorage.setItem("username", loginData.username);
                    window.location.href = "/";
                } else {
                    document.getElementById("content").innerText = loginData.error || "Login failed after registration.";
                }
            } else {
                document.getElementById("content").innerText = data.error || "Registration failed. Please try again.";
            }

        } catch (error) {
            console.error("Error:", error);
            document.getElementById("content").innerText = "Network error. Please try again.";
        }
    });
});
