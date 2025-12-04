document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    if (!user || !pass) {
        alert("Please enter username and password");
        return;
    }

    // Simulating login logic
    alert("Login successful!\nRole: " + role);
    
    // Redirect example (you can change page later)
    if (role === "admin") {
        window.location.href = "admin.html";
    } else {
        window.location.href = "home.html";
    }
});
