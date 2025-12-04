// 🚀 Dummy Data (Later replace with DB / API)
const recentNewsData = [
    "New HR policy has been released.",
    "Internal portal UI update scheduled next week.",
    "Infrastructure team upgraded servers."
];

const urgentNewsData = [
    "Power shutdown in 3rd floor today 2PM",
    "Security alert: Change passwords immediately",
];

const upcomingEventsData = [
    "Annual Tech Meet - Jan 16",
    "CSR Community Event - Feb 04",
    "Hackathon - Feb 20"
];

// Insert data in UI
function loadData() {
    const recent = document.getElementById("recentNews");
    const urgent = document.getElementById("urgentNews");
    const events = document.getElementById("upcomingEvents");
    
    recentNewsData.forEach(item => recent.innerHTML += `<li>${item}</li>`);
    urgentNewsData.forEach(item => urgent.innerHTML += `<li>${item}</li>`);
    upcomingEventsData.forEach(item => events.innerHTML += `<li>${item}</li>`);
}

// Admin Panel Functionality
function initAdminPanel() {
    const adminBtn = document.getElementById("adminBtn");
    const adminDropdown = document.getElementById("adminDropdown");
    const adminOverlay = document.getElementById("adminOverlay");
    const aiNewsBtn = document.getElementById("aiNewsBtn");
    const schedulerBtn = document.getElementById("schedulerBtn");
    const aiNewsModal = document.getElementById("aiNewsModal");
    const schedulerModal = document.getElementById("schedulerModal");
    const closeModalButtons = document.querySelectorAll(".close-modal");
    const modalSecondaryButtons = document.querySelectorAll(".modal-btn.secondary");
    
    // Toggle dropdown visibility
    function toggleDropdown() {
        adminDropdown.classList.toggle("show");
        adminBtn.classList.toggle("active");
        adminOverlay.classList.toggle("active");
    }
    
    // Close dropdown
    function closeDropdown() {
        adminDropdown.classList.remove("show");
        adminBtn.classList.remove("active");
        adminOverlay.classList.remove("active");
    }
    
    // Show modal function
    function showModal(modal) {
        modal.classList.add("show");
        closeDropdown(); // Close dropdown when opening modal
    }
    
    // Close modal function
    function closeModal(modal) {
        modal.classList.remove("show");
    }
    
    // Event Listeners
    adminBtn.addEventListener("click", function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleDropdown();
    });
    
    // Close dropdown when clicking overlay
    adminOverlay.addEventListener("click", closeDropdown);
    
    // Close dropdown when clicking outside
    document.addEventListener("click", function(e) {
        if (!adminBtn.contains(e.target) && !adminDropdown.contains(e.target)) {
            closeDropdown();
        }
    });
    
    // Admin dropdown button actions
    aiNewsBtn.addEventListener("click", function() {
        showModal(aiNewsModal);
    });
    
    schedulerBtn.addEventListener("click", function() {
        showModal(schedulerModal);
    });
    
    // Close modal buttons
    closeModalButtons.forEach(button => {
        button.addEventListener("click", function() {
            const modal = this.closest(".modal");
            closeModal(modal);
        });
    });
    
    // Secondary modal buttons (close)
    modalSecondaryButtons.forEach(button => {
        button.addEventListener("click", function() {
            const modal = this.closest(".modal");
            closeModal(modal);
        });
    });
    
    // Close modals when clicking outside
    window.addEventListener("click", function(e) {
        if (aiNewsModal.classList.contains("show") && e.target === aiNewsModal) {
            closeModal(aiNewsModal);
        }
        if (schedulerModal.classList.contains("show") && e.target === schedulerModal) {
            closeModal(schedulerModal);
        }
    });
    
    // Prevent dropdown buttons from closing dropdown when clicked
    adminDropdown.addEventListener("click", function(e) {
        e.stopPropagation();
    });
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
    loadData();
    initAdminPanel();
    
    // Add some sample interaction
    console.log("Admin Panel loaded successfully!");
    console.log("Click the Admin Panel button in the sidebar to open the dropdown menu.");
});
