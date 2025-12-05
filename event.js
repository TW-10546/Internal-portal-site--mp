// Dummy Event Data
const events = [
    {
        title: "Internal Hackathon",
        type: "upcoming",
        date: "2025-01-25",
        description: "A 12-hour hackathon for all developers and designers."
    },
    {
        title: "New Year Celebration",
        type: "past",
        date: "2025-01-01",
        description: "Annual cultural event with performances and awards."
    },
    {
        title: "Security Awareness Workshop",
        type: "upcoming",
        date: "2025-02-10",
        description: "IT security training for all employees."
    },
    {
        title: "Monthly Town Hall Meeting",
        type: "past",
        date: "2024-12-14",
        description: "Company-wide meeting to discuss updates and goals."
    },
    {
        title: "Marketing Strategy Seminar",
        type: "upcoming",
        date: "2025-03-05",
        description: "Workshop on digital marketing and brand awareness."
    }
];

// RENDER FUNCTION
function renderEvents(filterType = "all", search = "") {
    const list = document.getElementById("eventList");
    list.innerHTML = "";

    events
        .filter(event =>
            (filterType === "all" || event.type === filterType) &&
            event.title.toLowerCase().includes(search.toLowerCase())
        )
        .forEach(event => {
            list.innerHTML += `
                <li class="event-item">
                    <div class="event-title">${event.title}</div>
                    <div class="event-type">${event.type.toUpperCase()}</div>
                    <div class="event-date">📅 ${event.date}</div>
                    <div class="event-description">${event.description}</div>
                </li>
            `;
        });
}


// EVENT LISTENERS
document.getElementById("eventType").addEventListener("change", function () {
    renderEvents(this.value, document.getElementById("searchEvent").value);
});

document.getElementById("searchEvent").addEventListener("keyup", function () {
    renderEvents(document.getElementById("eventType").value, this.value);
});


// INITIAL LOAD
renderEvents();