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
            const response = await fetch("/userRegistration", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(userData)
            });
            const responseText = await response.text();
          
            let data;
            if (responseText) {
                try {
                    data = JSON.parse(responseText);
                } catch (jsonError) {
                    console.error("Registration: Failed to parse JSON:", jsonError);
                    document.getElementById("content").innerText = "Server returned invalid response.";
                    return;
                }
            } else {
                console.error("Registration: Empty response from server");
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
                
                let loginData;
                if (loginText) {
                    try {
                        loginData = JSON.parse(loginText);
                    } catch (jsonError) {
                        console.error("Registration: Failed to parse login JSON:", jsonError);
                        document.getElementById("content").innerText = "Login failed after registration.";
                        return;
                    }
                } else {
                    console.error("Registration: Empty login response");
                    loginData = {};
                }
                
                if (loginResponse.ok && loginData.token) {
                    localStorage.setItem("jwtToken", loginData.token);
                    localStorage.setItem("username", loginData.username);
                    window.location.href = "/";
                } else {
                    console.error("Registration: Auto-login failed");
                    document.getElementById("content").innerText = loginData.error || "Login failed after registration.";
                }
            } else {
                console.error("Registration: Registration failed with status:", response.status);
                document.getElementById("content").innerText = data.error || "Registration failed. Please try again.";
            }

        } catch (error) {
            console.error("Registration: Network error:", error);
            document.getElementById("content").innerText = "Network error. Please try again.";
        }
    });
});
