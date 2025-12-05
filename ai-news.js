// ---------------------------------------------------------
// AI NEWS CREATION – CLEAN & OPTIMIZED VERSION
// ---------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {

    // Initialize Admin Panel
    initAdminPanel();

    // Collect DOM Elements
    const titleInput = document.getElementById('newsTopic');
    const contentInput = document.getElementById('newsContent');
    const categoryInput = document.getElementById('newsCategory');

    const generateBtn = document.getElementById('generateBtn');
    const regenerateBtn = document.getElementById('regenerateBtn');
    const clearBtn = document.getElementById('clearBtn');
    const editBtn = document.getElementById('editBtn');
    const saveDraftBtn = document.getElementById('saveDraftBtn');
    const previewBtn = document.getElementById('previewBtn');
    const publishBtn = document.getElementById('publishBtn');

    const attachBtn = document.getElementById('attachBtn');
    const fileInput = document.getElementById('fileInput');
    const fileName = document.getElementById('fileName');
    const fileList = document.getElementById('fileList');
    const previewContent = document.getElementById('previewContent');

    let attachedFiles = [];
    let lastGeneratedContent = null;

    // Disable regenerate initially
    regenerateBtn.disabled = true;

    // ---------------------------------------------------------
    // FILE ATTACHMENT SYSTEM
    // ---------------------------------------------------------
    attachBtn.addEventListener("click", () => fileInput.click());

    fileInput.addEventListener("change", () => {
        [...fileInput.files].forEach(file => addFile(file));
        fileInput.value = "";
    });

    function addFile(file) {
        const id = Date.now() + Math.random();
        attachedFiles.push({ id, file });
        updateFileList();
        updateFileName();
    }

    function removeFile(id) {
        attachedFiles = attachedFiles.filter(f => f.id !== id);
        updateFileList();
        updateFileName();
    }

    function updateFileList() {
        fileList.innerHTML = "";

        attachedFiles.forEach(({ id, file }) => {
            const item = document.createElement("div");
            item.className = "file-item";
            item.innerHTML = `
                <div class="file-info">
                    <i class="fas fa-file file-icon"></i>
                    <span>${file.name}</span>
                </div>
                <button class="btn-remove" data-id="${id}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            fileList.appendChild(item);
        });

        document.querySelectorAll(".btn-remove").forEach(btn => {
            btn.addEventListener("click", () => {
                removeFile(btn.dataset.id);
            });
        });
    }

    function updateFileName() {
        if (attachedFiles.length === 0) {
            fileName.textContent = "No file chosen";
        } else if (attachedFiles.length === 1) {
            fileName.textContent = attachedFiles[0].file.name;
        } else {
            fileName.textContent = `${attachedFiles.length} files chosen`;
        }
    }

    // ---------------------------------------------------------
    // AI CONTENT GENERATOR
    // ---------------------------------------------------------
    const templates = [
        "We are excited to announce a new initiative that enhances our workplace environment.",
        "A system upgrade was performed to improve security and performance across departments.",
        "New workflow improvements have been rolled out to streamline daily operations.",
        "Quarterly objectives show excellent progress thanks to team collaboration.",
        "Maintenance activities are scheduled to prevent disruptions and improve reliability."
    ];

    generateBtn.addEventListener("click", () => {
        const title = titleInput.value.trim();

        if (!title) {
            alert("Please enter a news title.");
            return;
        }

        lastGeneratedContent = {
            title,
            category: categoryInput.value
        };

        let content = contentInput.value.trim();
        if (!content) {
            content = templates[Math.floor(Math.random() * templates.length)];
            contentInput.value = content;
        }

        renderPreview(title, content);
        regenerateBtn.disabled = false;
    });

    regenerateBtn.addEventListener("click", () => {
        if (!lastGeneratedContent) return;

        if (contentInput.value.trim()) {
            alert("Clear the content before regenerating.");
            return;
        }

        let newContent;
        do {
            newContent = templates[Math.floor(Math.random() * templates.length)];
        } while (newContent === contentInput.value);

        contentInput.value = newContent;
        renderPreview(lastGeneratedContent.title, newContent);

        regenerateBtn.innerHTML = `<i class="fas fa-check"></i> Regenerated!`;
        setTimeout(() => regenerateBtn.innerHTML = `<i class="fas fa-redo"></i> Regenerate`, 900);
    });

    // ---------------------------------------------------------
    // CLEAR FORM
    // ---------------------------------------------------------
    clearBtn.addEventListener("click", () => {
        titleInput.value = "";
        contentInput.value = "";
        categoryInput.value = "";
        fileInput.value = "";
        attachedFiles = [];
        fileList.innerHTML = "";
        updateFileName();

        lastGeneratedContent = null;
        regenerateBtn.disabled = true;

        previewContent.innerHTML = `
            <div class="empty-preview">
                <i class="fas fa-newspaper"></i>
                <p>News preview will appear here</p>
            </div>
        `;
    });

    // ---------------------------------------------------------
    // PREVIEW SYSTEM
    // ---------------------------------------------------------
    function renderPreview(title, content) {
        let attachmentsHTML = attachedFiles.length
            ? `
                <div class="attachment-preview">
                    <h4><i class="fas fa-paperclip"></i> Files (${attachedFiles.length})</h4>
                    ${attachedFiles.map(f => `<div class="attachment-item">${f.file.name}</div>`).join("")}
                </div>
            `
            : "";

        previewContent.innerHTML = `
            <h2 class="news-preview-title">${title}</h2>
            <p class="news-preview-body">${content.replace(/\n/g, "<br>")}</p>
            ${attachmentsHTML}
        `;
    }

    previewBtn.addEventListener("click", () => {
        const title = titleInput.value.trim();
        if (!title) {
            alert("Enter title to preview.");
            return;
        }
        renderPreview(title, contentInput.value);
    });

    editBtn.addEventListener("click", () => {
        const title = previewContent.querySelector(".news-preview-title");
        const body = previewContent.querySelector(".news-preview-body");

        if (title) titleInput.value = title.textContent;
        if (body) contentInput.value = body.textContent.replace(/<br>/g, "\n");
    });

    saveDraftBtn.addEventListener("click", () => {
        if (!titleInput.value.trim()) {
            alert("Enter a title before saving.");
            return;
        }
        alert("Draft saved successfully!");
    });

    publishBtn.addEventListener("click", () => {
        if (!titleInput.value.trim()) {
            alert("Enter a title before publishing.");
            return;
        }

        if (confirm("Are you sure you want to publish this news?")) {
            publishBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Publishing...`;
            publishBtn.disabled = true;

            setTimeout(() => {
                alert("News published successfully!");
                publishBtn.innerHTML = `<i class="fas fa-paper-plane"></i> Publish`;
                publishBtn.disabled = false;
                clearBtn.click();
            }, 1200);
        }
    });

    console.log("AI News Page Loaded Successfully.");
});

// ---------------------------------------------------------
// ADMIN PANEL NAVIGATION (WORKS ON ALL PAGES)
// ---------------------------------------------------------
function initAdminPanel() {
    const adminBtn = document.getElementById("adminBtn");
    const adminDropdown = document.getElementById("adminDropdown");
    const adminOverlay = document.getElementById("adminOverlay");

    const aiNewsBtn = document.getElementById("aiNewsBtn");
    const schedulerBtn = document.getElementById("schedulerBtn");

    if (!adminBtn) return;

    adminBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        adminDropdown.classList.toggle("show");
        adminOverlay.classList.toggle("active");
    });

    adminOverlay.addEventListener("click", () => {
        adminDropdown.classList.remove("show");
        adminOverlay.classList.remove("active");
    });

    document.addEventListener("click", (e) => {
        if (!adminBtn.contains(e.target) && !adminDropdown.contains(e.target)) {
            adminDropdown.classList.remove("show");
            adminOverlay.classList.remove("active");
        }
    });

    // Navigation
    if (aiNewsBtn) {
        aiNewsBtn.addEventListener("click", () => {
            window.location.href = "ai-news.html";
        });
    }

    if (schedulerBtn) {
        schedulerBtn.addEventListener("click", () => {
            window.location.href = "scheduler.html";
        });
    }
}
