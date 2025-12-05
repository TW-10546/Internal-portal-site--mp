// Notification Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const notificationsList = document.getElementById('notificationsList');
    const noNotifications = document.getElementById('noNotifications');
    const markAllReadBtn = document.getElementById('markAllReadBtn');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Sample notification data
    let notifications = [
        {
            id: 1,
            title: "New Announcement from HR",
            message: "New HR policy update regarding remote work has been published. All employees must review by Friday.",
            type: "announcement",
            urgent: false,
            read: false,
            time: "10:30 AM",
            timestamp: "Today"
        },
        {
            id: 2,
            title: "Event Starts Tomorrow",
            message: "Annual Tech Meet 2024 starts tomorrow at 10:00 AM in the Main Conference Hall.",
            type: "event",
            urgent: false,
            read: false,
            time: "09:45 AM",
            timestamp: "Today"
        },
        {
            id: 3,
            title: "Urgent News Published",
            message: "Critical security update required. Please update your system password immediately.",
            type: "urgent",
            urgent: true,
            read: false,
            time: "Yesterday",
            timestamp: "9:15 PM"
        },
        {
            id: 4,
            title: "Server Maintenance Scheduled",
            message: "System maintenance scheduled for this Saturday from 2:00 AM to 6:00 AM.",
            type: "announcement",
            urgent: false,
            read: true,
            time: "Dec 8",
            timestamp: "2:30 PM"
        },
        {
            id: 5,
            title: "Team Building Workshop",
            message: "Registration for the team building workshop is now open. Limited seats available.",
            type: "event",
            urgent: false,
            read: true,
            time: "Dec 7",
            timestamp: "11:00 AM"
        },
        {
            id: 6,
            title: "New Project Launch",
            message: "New client project 'Project Phoenix' kickoff meeting scheduled for next Monday.",
            type: "announcement",
            urgent: false,
            read: true,
            time: "Dec 6",
            timestamp: "4:45 PM"
        },
        {
            id: 7,
            title: "System Downtime Alert",
            message: "Urgent: System will be down for emergency maintenance in 30 minutes.",
            type: "urgent",
            urgent: true,
            read: true,
            time: "Dec 5",
            timestamp: "3:00 PM"
        }
    ];
    
    // Initialize Admin Panel
    initAdminPanel();
    
    // Initialize notifications
    loadNotifications('all');
    
    // Filter Buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get filter type
            const filter = this.getAttribute('data-filter');
            
            // Load notifications with filter
            loadNotifications(filter);
        });
    });
    
    // Mark All as Read Button
    markAllReadBtn.addEventListener('click', function() {
        notifications.forEach(notification => {
            notification.read = true;
        });
        
        loadNotifications(document.querySelector('.filter-btn.active').getAttribute('data-filter'));
        
        // Show success notification
        showToast('All notifications marked as read', 'success');
    });
    
    // Clear All Button
    clearAllBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to clear all notifications?')) {
            notifications = [];
            loadNotifications('all');
            showToast('All notifications cleared', 'success');
        }
    });
    
    // Load Notifications Function
    function loadNotifications(filter) {
        // Clear current list
        notificationsList.innerHTML = '';
        
        // Filter notifications
        let filteredNotifications = [...notifications];
        
        if (filter === 'unread') {
            filteredNotifications = notifications.filter(n => !n.read);
        } else if (filter === 'urgent') {
            filteredNotifications = notifications.filter(n => n.urgent);
        } else if (filter === 'announcements') {
            filteredNotifications = notifications.filter(n => n.type === 'announcement');
        } else if (filter === 'events') {
            filteredNotifications = notifications.filter(n => n.type === 'event');
        }
        
        // Show/hide no notifications message
        if (filteredNotifications.length === 0) {
            noNotifications.classList.add('show');
        } else {
            noNotifications.classList.remove('show');
            
            // Render notifications
            filteredNotifications.forEach(notification => {
                renderNotification(notification);
            });
        }
    }
    
    // Render Notification Function
    function renderNotification(notification) {
        const notificationItem = document.createElement('div');
        notificationItem.className = `notification-item ${notification.type} ${notification.read ? '' : 'unread'}`;
        
        // Get icon class based on type
        let iconClass = 'default';
        let icon = '🔔';
        
        if (notification.urgent) {
            iconClass = 'urgent';
            icon = '⚠️';
        } else if (notification.type === 'announcement') {
            iconClass = 'announcement';
            icon = '📢';
        } else if (notification.type === 'event') {
            iconClass = 'event';
            icon = '📅';
        }
        
        // Get badge if needed
        let badge = '';
        if (notification.urgent) {
            badge = '<span class="badge badge-urgent">URGENT</span>';
        } else if (!notification.read) {
            badge = '<span class="badge badge-new">NEW</span>';
        }
        
        notificationItem.innerHTML = `
            <div class="notification-icon ${iconClass}">
                ${icon}
            </div>
            
            <div class="notification-content">
                <div class="notification-title">
                    ${notification.title}
                    ${badge}
                </div>
                <p class="notification-message">
                    ${notification.message}
                </p>
                <div class="notification-time">
                    <i class="far fa-clock"></i>
                    ${notification.time} • ${notification.timestamp}
                </div>
            </div>
            
            <div class="notification-actions">
                ${!notification.read ? `
                    <button class="btn-notification btn-mark-read" onclick="markAsRead(${notification.id})" title="Mark as read">
                        <i class="far fa-check-circle"></i>
                    </button>
                ` : ''}
                <button class="btn-notification btn-delete-notification" onclick="deleteNotification(${notification.id})" title="Delete">
                    <i class="far fa-trash-alt"></i>
                </button>
            </div>
            
            ${!notification.read ? '<div class="unread-indicator"></div>' : ''}
        `;
        
        notificationsList.appendChild(notificationItem);
    }
    
    // Mark as Read Function (global access)
    window.markAsRead = function(id) {
        const notification = notifications.find(n => n.id === id);
        if (notification) {
            notification.read = true;
            
            // Get current filter
            const currentFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
            loadNotifications(currentFilter);
            
            showToast('Notification marked as read', 'success');
        }
    };
    
    // Delete Notification Function (global access)
    window.deleteNotification = function(id) {
        if (confirm('Delete this notification?')) {
            notifications = notifications.filter(n => n.id !== id);
            
            // Get current filter
            const currentFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
            loadNotifications(currentFilter);
            
            showToast('Notification deleted', 'success');
        }
    };
    
    // Show Toast Function
    function showToast(message, type) {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add to body
        document.body.appendChild(toast);
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
    
    console.log('Notifications page loaded successfully');
});

// Admin Panel Functionality
function initAdminPanel() {
    const adminBtn = document.getElementById("adminBtn");
    const adminDropdown = document.getElementById("adminDropdown");
    const adminOverlay = document.getElementById("adminOverlay");
    const aiNewsBtn = document.getElementById("aiNewsBtn");
    const schedulerBtn = document.getElementById("schedulerBtn");
    
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
    
    // Admin panel button redirects
    if (aiNewsBtn) {
        aiNewsBtn.addEventListener("click", function() {
            window.location.href = "ai-news-creation.html";
        });
    }
    
    if (schedulerBtn) {
        schedulerBtn.addEventListener("click", function() {
            window.location.href = "scheduler.html";
        });
    }
}

// Add toast styles
const toastStyles = `
    .toast {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
        padding: 15px 20px;
        display: flex;
        align-items: center;
        z-index: 1000;
        animation: slideInRight 0.3s ease;
        border-left: 4px solid #28a745;
    }
    
    .toast-success {
        border-left-color: #28a745;
    }
    
    .toast-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .toast i {
        font-size: 18px;
        color: #28a745;
    }
    
    @keyframes slideInRight {
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

// Add toast styles to document
if (!document.querySelector('style[data-toast]')) {
    const styleSheet = document.createElement("style");
    styleSheet.setAttribute("data-toast", "true");
    styleSheet.textContent = toastStyles;
    document.head.appendChild(styleSheet);
}