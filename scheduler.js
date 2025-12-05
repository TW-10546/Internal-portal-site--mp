// Scheduler Functionality
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const addScheduleBtn = document.getElementById('addScheduleBtn');
    const scheduleTimeBtn = document.getElementById('scheduleTimeBtn');
    const scheduleTableBody = document.getElementById('scheduleTableBody');
    const scheduleTimeModal = document.getElementById('scheduleTimeModal');
    const closeModalBtn = document.querySelector('.close-modal');
    const applyTimeBtn = document.getElementById('applyTimeBtn');
    const cancelTimeBtn = document.getElementById('cancelTimeBtn');
    const quickTimeButtons = document.querySelectorAll('.btn-quick-time');
    
    // Sample data for scheduled announcements
    let scheduledItems = [
        {
            id: 1,
            title: "Safety Alert",
            date: "2024-12-10",
            time: "09:00",
            repeat: "daily",
            status: "active"
        },
        {
            id: 2,
            title: "HR Update",
            date: "2024-12-12",
            time: "14:00",
            repeat: "none",
            status: "pending"
        },
        {
            id: 3,
            title: "Monthly Report",
            date: "2024-12-15",
            time: "10:00",
            repeat: "monthly",
            status: "active"
        }
    ];
    
    // Initialize Admin Panel
    initAdminPanel();
    
    // Initialize schedule list
    updateScheduleList();
    
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('scheduleDate').value = today;
    document.getElementById('customDate').value = today;
    
    // Set default time to next hour
    const nextHour = new Date();
    nextHour.setHours(nextHour.getHours() + 1);
    const defaultTime = nextHour.getHours().toString().padStart(2, '0') + ':00';
    document.getElementById('scheduleTime').value = defaultTime;
    document.getElementById('customTime').value = defaultTime;
    
    // Add Schedule Button
    addScheduleBtn.addEventListener('click', function() {
        const title = document.getElementById('scheduleTitle').value.trim();
        const date = document.getElementById('scheduleDate').value;
        const time = document.getElementById('scheduleTime').value;
        const repeat = document.getElementById('repeatOption').value; 
        // Validation
        if (!title) {
            alert('Please enter a title');
            return;
        }
        
        if (!date) {
            alert('Please select a date');
            return;
        }
        
        if (!time) {
            alert('Please select a time');
            return;
        }
        
        // Create new schedule item
        const newItem = {
            id: Date.now(), // Use timestamp as unique ID
            title: title,
            date: date,
            time: time,
            repeat: repeat,
            status: "pending"
        };
        
        // Add to array
        scheduledItems.unshift(newItem);
        
        // Update table
        updateScheduleList();
        
        // Reset form
        document.getElementById('scheduleTitle').value = '';
        document.getElementById('scheduleDate').value = today;
        document.getElementById('scheduleTime').value = defaultTime;
        document.getElementById('repeatOption').value = 'none'; // Reset dropdown
        
        // Show success message
        showNotification('Schedule added successfully!', 'success');
    });
    
    // Schedule Time Button
    scheduleTimeBtn.addEventListener('click', function() {
        scheduleTimeModal.classList.add('show');
    });
    
    // Close Modal
    closeModalBtn.addEventListener('click', function() {
        scheduleTimeModal.classList.remove('show');
    });
    
    cancelTimeBtn.addEventListener('click', function() {
        scheduleTimeModal.classList.remove('show');
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === scheduleTimeModal) {
            scheduleTimeModal.classList.remove('show');
        }
    });
    
    // Quick Time Buttons
    quickTimeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            quickTimeButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Set the time
            const time = this.getAttribute('data-time');
            document.getElementById('customTime').value = time;
        });
    });
    
    // Apply Time Button
    applyTimeBtn.addEventListener('click', function() {
        const customDate = document.getElementById('customDate').value;
        const customTime = document.getElementById('customTime').value;
        const activeQuickTime = document.querySelector('.btn-quick-time.active');
        
        // Apply to main form
        document.getElementById('scheduleDate').value = customDate;
        document.getElementById('scheduleTime').value = customTime;
        
        // Close modal
        scheduleTimeModal.classList.remove('show');
        
        // Show notification
        let message = 'Time scheduled: ';
        if (activeQuickTime) {
            message += activeQuickTime.textContent;
        } else {
            message += customTime;
        }
        showNotification(message, 'info');
    });
    
    // Edit Schedule Function
    window.editSchedule = function(id) {
        const item = scheduledItems.find(item => item.id === id);
        if (!item) return;
        
        // Fill form with item data
        document.getElementById('scheduleTitle').value = item.title;
        document.getElementById('scheduleDate').value = item.date;
        document.getElementById('scheduleTime').value = item.time;
        document.getElementById('repeatOption').value = item.repeat; // Set dropdown value
        // Remove item from list
        scheduledItems = scheduledItems.filter(item => item.id !== id);
        updateScheduleList();
        
        showNotification('Schedule loaded for editing', 'info');
    };
    
    // Delete Schedule Function
    window.deleteSchedule = function(id) {
        if (confirm('Are you sure you want to delete this schedule?')) {
            scheduledItems = scheduledItems.filter(item => item.id !== id);
            updateScheduleList();
            showNotification('Schedule deleted successfully', 'success');
        }
    };
    
    // Update Schedule Status Function
    window.toggleStatus = function(id) {
        const item = scheduledItems.find(item => item.id === id);
        if (!item) return;
        
        item.status = item.status === 'active' ? 'inactive' : 'active';
        updateScheduleList();
        
        const statusText = item.status === 'active' ? 'activated' : 'deactivated';
        showNotification(`Schedule ${statusText}`, 'success');
    };
    
    // Update schedule list in table
    function updateScheduleList() {
        if (scheduledItems.length === 0) {
            scheduleTableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="no-data">
                        <i class="fas fa-calendar-times"></i>
                        <p>No scheduled announcements found</p>
                        <small>Create a new schedule to get started</small>
                    </td>
                </tr>
            `;
            return;
        }
        
        let tableHTML = '';
        
        scheduledItems.forEach(item => {
            // Format date for display
            const dateObj = new Date(item.date);
            const formattedDate = dateObj.toLocaleDateString('en-US', {
                month: '2-digit',
                day: '2-digit'
            });
            
            // Format repeat text
            const repeatText = item.repeat === 'none' ? 'None' : 
                              item.repeat.charAt(0).toUpperCase() + item.repeat.slice(1);
            
            // Status badge class
            const statusClass = `status-${item.status}`;
            const statusText = item.status.charAt(0).toUpperCase() + item.status.slice(1);
            
            tableHTML += `
                <tr>
                    <td><strong>${item.title}</strong></td>
                    <td>${formattedDate} ${item.time}</td>
                    <td>${repeatText}</td>
                    <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn-action btn-edit" onclick="editSchedule(${item.id})">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="btn-action btn-delete" onclick="deleteSchedule(${item.id})">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });
        
        scheduleTableBody.innerHTML = tableHTML;
    }
    
    // Show notification function
    function showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add to body
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    console.log('Scheduler page loaded successfully');
});

// Admin Panel Functionality
function initAdminPanel() {
    const adminBtn = document.getElementById("adminBtn");
    const adminDropdown = document.getElementById("adminDropdown");
    const adminOverlay = document.getElementById("adminOverlay");
    const aiNewsBtn = document.getElementById("aiNewsBtn");
    
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
    
    // AI News button redirect
    if (aiNewsBtn) {
        aiNewsBtn.addEventListener("click", function() {
            window.location.href = "ai-news.html";
        });
    }
}

// Add notification styles to CSS
const notificationStyles = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
        padding: 15px 20px;
        display: flex;
        align-items: center;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        border-left: 4px solid #28a745;
    }
    
    .notification-success {
        border-left-color: #28a745;
    }
    
    .notification-info {
        border-left-color: #17a2b8;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .notification i {
        font-size: 18px;
    }
    
    .notification-success i {
        color: #28a745;
    }
    
    .notification-info i {
        color: #17a2b8;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .fade-out {
        animation: fadeOut 0.3s ease forwards;
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;

// Add notification styles to document
const styleSheet = document.createElement("style");
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);