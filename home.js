// ------------------------------------------------------
// 1. Dummy Data
// ------------------------------------------------------
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

// Insert News Data
function loadData() {
    document.getElementById("recentNews").innerHTML =
        recentNewsData.map(item => `<li>${item}</li>`).join("");
        
    document.getElementById("urgentNews").innerHTML =
        urgentNewsData.map(item => `<li>${item}</li>`).join("");
        
    document.getElementById("upcomingEvents").innerHTML =
        upcomingEventsData.map(item => `<li>${item}</li>`).join("");
}

// ------------------------------------------------------
// 2. Admin Panel Logic
// ------------------------------------------------------
function initAdminPanel() {
    const adminBtn = document.getElementById("adminBtn");
    const adminDropdown = document.getElementById("adminDropdown");
    const adminOverlay = document.getElementById("adminOverlay");

    const aiNewsBtn = document.getElementById("aiNewsBtn");
    const schedulerBtn = document.getElementById("schedulerBtn");

    const aiNewsModal = document.getElementById("aiNewsModal");
    const schedulerModal = document.getElementById("schedulerModal");

    const closeModalButtons = document.querySelectorAll(".close-modal");
    const secondaryButtons = document.querySelectorAll(".modal-btn.secondary");

    // Dropdown show/hide
    function toggleDropdown() {
        adminDropdown.classList.toggle("show");
        adminOverlay.classList.toggle("active");
    }

    function closeDropdown() {
        adminDropdown.classList.remove("show");
        adminOverlay.classList.remove("active");
    }

    adminBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleDropdown();
    });

    adminOverlay.addEventListener("click", closeDropdown);

    document.addEventListener("click", (e) => {
        if (!adminBtn.contains(e.target) && !adminDropdown.contains(e.target)) {
            closeDropdown();
        }
    });

    // -------------------------------
    // Open Modals from Dropdown
    // -------------------------------
    aiNewsBtn.addEventListener("click", () => {
        closeDropdown();
        aiNewsModal.classList.add("show");
    });

    schedulerBtn.addEventListener("click", () => {
        closeDropdown();
        schedulerModal.classList.add("show");
    });

    // -------------------------------
    // Modal Primary Buttons → NAVIGATE
    // -------------------------------
    document.querySelector("#aiNewsModal .primary").addEventListener("click", () => {
        window.location.href = "ai-news.html";
    });

    document.querySelector("#schedulerModal .primary").addEventListener("click", () => {
        window.location.href = "scheduler.html";
    });

    // Close modal buttons
    closeModalButtons.forEach(btn => {
        btn.addEventListener("click", function () {
            this.closest(".modal").classList.remove("show");
        });
    });

    secondaryButtons.forEach(btn => {
        btn.addEventListener("click", function () {
            this.closest(".modal").classList.remove("show");
        });
    });

    // Click outside modal closes it
    window.addEventListener("click", (e) => {
        if (e.target === aiNewsModal) aiNewsModal.classList.remove("show");
        if (e.target === schedulerModal) schedulerModal.classList.remove("show");
    });
}

// Init on load
document.addEventListener("DOMContentLoaded", () => {
    loadData();
    initAdminPanel();
});
