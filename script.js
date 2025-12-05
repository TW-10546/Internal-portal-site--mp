document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const submitBtn = document.querySelector('.btn-login');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');

    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    try {
        const response = await fetch("http://localhost:5000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        // Remove loading state
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;

        if (response.ok && data.success) {
            // Store user data
            localStorage.setItem('user', JSON.stringify(data.user || data));
            localStorage.setItem('userId', data.user.user_id);
            localStorage.setItem('authToken', data.token || 'dummy-token');
            
            // Success animation on button
            submitBtn.style.background = 'linear-gradient(135deg, #34a853 0%, #0f9d58 100%)';
            
            Swal.fire({
                title: "Welcome to Twaveconnect!",
                text: data.message || "Login successful!",
                icon: "success",
                confirmButtonText: "Continue",
                showClass: {
                    popup: 'animate__animated animate__fadeInDown'
                },
                timer: 2000,
                timerProgressBar: true,
                didClose: () => {
                    // Extract role - handle both response structures
                    const userRole = data.user ? data.user.role : data.role;
                    
                    console.log("Login successful:", {
                        email: email,
                        role: userRole,
                        departments: data.user ? data.user.departments : data.departments
                    });

                    // Redirect based on role
                    if (userRole === "admin") {
                        window.location.href = "admin-home.html";
                    } else {
                        window.location.href = "home.html";
                    }
                }
            });

        } else {
            // Error animation on button
            submitBtn.style.animation = 'shake 0.5s';
            setTimeout(() => {
                submitBtn.style.animation = '';
            }, 500);
            
            Swal.fire({
                title: "Login Failed",
                text: data.message || "Invalid email or password",
                icon: "error",
                confirmButtonText: "Try Again",
                showClass: {
                    popup: 'animate__animated animate__shakeX'
                }
            });
        }

    } catch (err) {
        // Remove loading state
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        
        console.error("Login error:", err);
        Swal.fire({
            title: "Connection Error",
            html: `
                <p>Unable to connect to the server.</p>
                <p><small>Make sure the backend is running on http://localhost:5000</small></p>
            `,
            icon: "error",
            confirmButtonText: "Retry",
            showClass: {
                popup: 'animate__animated animate__wobble'
            }
        });
    }
});

// Add shake animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);