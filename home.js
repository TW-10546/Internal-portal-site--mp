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

loadData();
