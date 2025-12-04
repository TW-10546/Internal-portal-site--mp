// AI News Creation Functionality
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
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
    
    // Initialize Admin Panel
    initAdminPanel();
    
    // Initialize regenerate button as disabled
    regenerateBtn.disabled = true;
    
    // File Attachment Functionality
    attachBtn.addEventListener('click', function() {
        fileInput.click();
    });
    
    fileInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            for (let file of this.files) {
                addFile(file);
            }
            this.value = ''; // Reset input
        }
    });
    
    function addFile(file) {
        const fileId = Date.now() + Math.random();
        attachedFiles.push({
            id: fileId,
            file: file
        });
        
        updateFileList();
        updateFileName();
    }
    
    function removeFile(fileId) {
        attachedFiles = attachedFiles.filter(f => f.id !== fileId);
        updateFileList();
        updateFileName();
    }
    
    function updateFileList() {
        fileList.innerHTML = '';
        
        if (attachedFiles.length === 0) {
            return;
        }
        
        attachedFiles.forEach(fileData => {
            const file = fileData.file;
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <div class="file-info">
                    <i class="fas fa-file file-icon"></i>
                    <span class="file-name-text">${file.name}</span>
                    <span class="file-size">(${formatFileSize(file.size)})</span>
                </div>
                <button class="btn-remove" data-id="${fileData.id}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            fileList.appendChild(fileItem);
        });
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.btn-remove').forEach(btn => {
            btn.addEventListener('click', function() {
                const fileId = this.getAttribute('data-id');
                removeFile(fileId);
            });
        });
    }
    
    function updateFileName() {
        if (attachedFiles.length === 0) {
            fileName.textContent = 'No file chosen';
        } else if (attachedFiles.length === 1) {
            fileName.textContent = `${attachedFiles[0].file.name}`;
        } else {
            fileName.textContent = `${attachedFiles.length} files chosen`;
        }
    }
    
    function formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' bytes';
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / 1048576).toFixed(1) + ' MB';
    }
    
    // Sample AI-generated content templates
    const contentTemplates = [
        `We are excited to announce a new initiative that will enhance our workplace environment and employee experience. This development comes after extensive research and feedback from team members across all departments.`,
        
        `A significant update has been implemented across our systems to improve efficiency and security. These changes are part of our ongoing commitment to technological excellence and operational reliability.`,
        
        `Effective immediately, new procedures are being introduced to streamline our workflow processes. These updates are designed to reduce administrative overhead while maintaining high quality standards.`,
        
        `We're pleased to share progress on our quarterly objectives and recognize outstanding contributions from team members. Your dedication continues to drive our success forward.`,
        
        `Important maintenance activities have been scheduled to ensure optimal performance of our critical infrastructure. These proactive measures will help prevent disruptions and enhance reliability.`
    ];
    
    // Generate with AI Button
    generateBtn.addEventListener('click', function() {
        const title = document.getElementById('newsTopic').value;
        const content = document.getElementById('newsContent').value;
        const category = document.getElementById('newsCategory').value;
        
        if (!title) {
            alert('Please enter a news title');
            return;
        }
        
        // Store the current title for regeneration
        lastGeneratedContent = {
            title: title,
            category: category,
            hasUserContent: content.trim() !== ''
        };
        
        // Generate content
        let displayContent;
        if (content.trim()) {
            // User has written content, use it
            displayContent = content;
        } else {
            // Generate AI content
            const randomTemplate = contentTemplates[Math.floor(Math.random() * contentTemplates.length)];
            displayContent = randomTemplate;
        }
        
        // Update preview
        updatePreview(title, displayContent);
        
        // Enable regenerate button
        regenerateBtn.disabled = false;
    });
    
    // Regenerate Button
    regenerateBtn.addEventListener('click', function() {
        if (!lastGeneratedContent) return;
        
        const title = document.getElementById('newsTopic').value || lastGeneratedContent.title;
        const userContent = document.getElementById('newsContent').value;
        
        // If user has content, don't regenerate it
        if (userContent.trim()) {
            alert('Cannot regenerate when you have manually written content. Clear the content field first.');
            return;
        }
        
        // Generate new AI content with a different template
        let newContent;
        do {
            newContent = contentTemplates[Math.floor(Math.random() * contentTemplates.length)];
        } while (newContent === document.getElementById('newsContent').value);
        
        // Update the content field and preview
        document.getElementById('newsContent').value = newContent;
        updatePreview(title, newContent);
        
        // Show regeneration feedback
        const originalText = regenerateBtn.innerHTML;
        regenerateBtn.innerHTML = '<i class="fas fa-check"></i> Regenerated!';
        setTimeout(() => {
            regenerateBtn.innerHTML = originalText;
        }, 1000);
    });
    
    // Clear Button
    clearBtn.addEventListener('click', function() {
        document.getElementById('newsTopic').value = '';
        document.getElementById('newsContent').value = '';
        document.getElementById('newsCategory').selectedIndex = 0;
        attachedFiles = [];
        fileList.innerHTML = '';
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
    
    // Edit Button
    editBtn.addEventListener('click', function() {
        const previewTitle = previewContent.querySelector('.news-preview-title');
        const previewBody = previewContent.querySelector('.news-preview-body');
        
        if (previewTitle && previewBody) {
            document.getElementById('newsTopic').value = previewTitle.textContent;
            document.getElementById('newsContent').value = previewBody.textContent;
        }
    });
    
    // Save as Draft Button
    saveDraftBtn.addEventListener('click', function() {
        const title = document.getElementById('newsTopic').value;
        if (!title) {
            alert('Please enter a title before saving as draft');
            return;
        }
        
        alert('News saved as draft successfully!');
    });
    
    // Preview Button
    previewBtn.addEventListener('click', function() {
        const title = document.getElementById('newsTopic').value;
        if (!title) {
            alert('Please enter a title to preview');
            return;
        }
        
        alert('Preview opened in new window');
        // In real implementation: window.open('preview.html', '_blank');
    });
    
    // Publish Button
    publishBtn.addEventListener('click', function() {
        const title = document.getElementById('newsTopic').value;
        if (!title) {
            alert('Please enter a title to publish');
            return;
        }
        
        if (confirm('Are you sure you want to publish this news?')) {
            // Show publishing status
            const originalText = publishBtn.innerHTML;
            publishBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Publishing...';
            publishBtn.disabled = true;
            
            setTimeout(() => {
                alert('News published successfully!');
                publishBtn.innerHTML = originalText;
                publishBtn.disabled = false;
                clearBtn.click(); // Clear the form
            }, 1000);
        }
    });
    
    // Helper function to update preview
    function updatePreview(title, content) {
        let attachmentHTML = '';
        if (attachedFiles.length > 0) {
            attachmentHTML = `
                <div class="attachment-preview">
                    <h4><i class="fas fa-paperclip"></i> Attached Files (${attachedFiles.length})</h4>
                    ${attachedFiles.map(fileData => 
                        `<span class="attachment-item">
                            <i class="fas fa-file"></i> ${fileData.file.name}
                        </span>`
                    ).join('')}
                </div>
            `;
        }
        
        previewContent.innerHTML = `
            <div class="generated-content">
                <h2 class="news-preview-title">${title}</h2>
                <div class="news-preview-body">
                    ${content.replace(/\n/g, '<br>')}
                </div>
                ${attachmentHTML}
            </div>
        `;
    }
    
    console.log('AI News Creation page loaded');
});

// Admin Panel Functionality
function initAdminPanel() {
    const adminBtn = document.getElementById("adminBtn");
    const adminDropdown = document.getElementById("adminDropdown");
    const adminOverlay = document.getElementById("adminOverlay");
    
    if (!adminBtn) return;
    
    function toggleDropdown() {
        adminDropdown.classList.toggle("show");
        adminBtn.classList.toggle("active");
        adminOverlay.classList.toggle("active");
    }
    
    function closeDropdown() {
        adminDropdown.classList.remove("show");
        adminBtn.classList.remove("active");
        adminOverlay.classList.remove("active");
    }
    
    adminBtn.addEventListener("click", function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleDropdown();
    });
    
    adminOverlay.addEventListener("click", closeDropdown);
    
    document.addEventListener("click", function(e) {
        if (!adminBtn.contains(e.target) && !adminDropdown.contains(e.target)) {
            closeDropdown();
        }
    });
}