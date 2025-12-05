// Dummy Announcement Data
const announcements = [
    {
        title: "New HR leave policy introduced",
        department: "HR",
        description: "The revised leave policy will be effective from January 10."
    },
    {
        title: "Server maintenance",
        department: "IT",
        description: "Scheduled server downtime on Sunday from 2 AM to 6 AM."
    },
    {
        title: "Office renovation",
        department: "Admin",
        description: "Ground floor reception area will be renovated next week."
    },
    {
        title: "Salary revision update",
        department: "Finance",
        description: "Salary revision details to be announced on February 1."
    },
    {
        title: "Password reset advisory",
        department: "IT",
        description: "All employees must reset their passwords by today 5 PM."
    }
];

// ──────────────────────────────────────────────
// RENDER FUNCTION
function renderAnnouncements(filterDept = "all", search = "") {
    const list = document.getElementById("announcementList");
    list.innerHTML = "";

    announcements
        .filter(a => 
            (filterDept === "all" || a.department === filterDept) &&
            a.title.toLowerCase().includes(search.toLowerCase())
        )
        .forEach(item => {
            list.innerHTML += `
                <li class="announcement-item">
                    <div class="announcement-title">${item.title}</div>
                    <div class="announcement-dept">${item.department}</div>
                    <div class="announcement-desc">${item.description}</div>
                </li>
            `;
        });
}


// ──────────────────────────────────────────────
// FILTER & SEARCH EVENTS
document.getElementById("deptFilter").addEventListener("change", function() {
    renderAnnouncements(this.value, document.getElementById("searchInput").value);
});

document.getElementById("searchInput").addEventListener("keyup", function() {
    renderAnnouncements(document.getElementById("deptFilter").value, this.value);
});


// ──────────────────────────────────────────────
// INITIAL LOAD
renderAnnouncements();
