// Load user data from localStorage
function loadUserData() {
    const userData = JSON.parse(localStorage.getItem('fitflexUser')) || {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+92 300 1234567',
        plan: 'pro',
        role: 'member',
        joinDate: new Date().toISOString().split('T')[0]
    };
    
    // Check if user is authorized to access this dashboard
    if (userData.role && userData.role !== 'member') {
        alert('❌ Access Denied! This dashboard is for members only.\n\nYou are a ' + userData.role.toUpperCase() + '.\nRedirecting to your dashboard...');
        localStorage.removeItem('fitflexUser');
        window.location.href = 'login.html';
        return;
    }
    
    // Check if member's membership is expired
    const memberships = JSON.parse(localStorage.getItem('fitflexMemberships')) || [];
    const memberFullName = userData.firstName + userData.lastName;
    const memberMembership = memberships.find(m => m.memberName === memberFullName);
    
    if (memberMembership) {
        const expiryDate = new Date(memberMembership.expiryDate);
        const today = new Date();
        const daysRemaining = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
        
        if (daysRemaining < 0) {
            alert('❌ Your membership has expired!\n\nExpired on: ' + memberMembership.expiryDate + '\n\nPlease contact the administrator to renew your membership.');
            localStorage.removeItem('fitflexUser');
            window.location.href = 'login.html';
            return;
        }
    }
    
    document.getElementById('userName').textContent = `${userData.firstName} ${userData.lastName}`;
    document.getElementById('greetingName').textContent = userData.firstName;
    document.getElementById('userPlan').textContent = `${userData.plan.toUpperCase()} Member`;
    document.getElementById('membershipPlan').textContent = userData.plan.toUpperCase();
    
    const initials = (userData.firstName[0] + userData.lastName[0]).toUpperCase();
    document.getElementById('userAvatar').textContent = initials;
    
    document.getElementById('settingName').textContent = `${userData.firstName} ${userData.lastName}`;
    document.getElementById('settingEmail').textContent = userData.email;
    document.getElementById('settingPhone').textContent = userData.phone;
    document.getElementById('settingJoinDate').textContent = new Date(userData.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    return userData;
}

// Load schedule
function loadSchedule() {
    const schedules = [
        { day: 'Monday', time: '6:00 AM', workout: 'Chest & Triceps', trainer: 'Coach Alex', duration: '90 min' },
        { day: 'Tuesday', time: '7:00 AM', workout: 'Back & Biceps', trainer: 'Coach Sarah', duration: '75 min' },
        { day: 'Wednesday', time: '6:30 AM', workout: 'Legs & Core', trainer: 'Coach Mike', duration: '90 min' },
        { day: 'Thursday', time: '6:00 AM', workout: 'Shoulders & Arms', trainer: 'Coach Alex', duration: '75 min' },
        { day: 'Friday', time: '5:30 PM', workout: 'Full Body HIIT', trainer: 'Coach Emma', duration: '60 min' },
        { day: 'Saturday', time: '9:00 AM', workout: 'Yoga & Flexibility', trainer: 'Coach Lisa', duration: '60 min' }
    ];
    
    const grid = document.getElementById('scheduleGrid');
    grid.innerHTML = '';
    
    schedules.forEach(schedule => {
        const card = document.createElement('div');
        card.className = 'schedule-day';
        card.innerHTML = `
            <h4>${schedule.day}</h4>
            <div class="schedule-detail"><strong>Time:</strong> ${schedule.time}</div>
            <div class="schedule-detail"><strong>Workout:</strong> ${schedule.workout}</div>
            <div class="schedule-detail"><strong>Trainer:</strong> ${schedule.trainer}</div>
            <div class="schedule-detail"><strong>Duration:</strong> ${schedule.duration}</div>
        `;
        grid.appendChild(card);
    });
}

// Load membership details
function loadMembership() {
    const memberships = JSON.parse(localStorage.getItem('fitflexMemberships')) || [];
    const userData = JSON.parse(localStorage.getItem('fitflexUser')) || {};
    
    const grid = document.getElementById('membershipGrid');
    grid.innerHTML = '';
    
    // Find membership for current user
    let userMembership = memberships.find(m => m.memberName === `${userData.firstName} ${userData.lastName}`);
    
    if (!userMembership && memberships.length > 0) {
        userMembership = memberships[0];
    }
    
    if (userMembership) {
        const joinDate = new Date(userMembership.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        const expiryDate = new Date(userMembership.expiryDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        
        const today = new Date();
        const expiry = new Date(userMembership.expiryDate);
        const daysRemaining = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
        
        let statusClass = 'active';
        let statusText = 'ACTIVE';
        
        if (daysRemaining < 0) {
            statusClass = 'expired';
            statusText = 'EXPIRED';
        } else if (daysRemaining <= 30) {
            statusClass = 'expiring-soon';
            statusText = 'EXPIRING SOON';
        }
        
        document.getElementById('membershipStatus').textContent = statusText;
        document.getElementById('daysLeft').textContent = daysRemaining < 0 ? 'Expired' : daysRemaining;
        
        const card = document.createElement('div');
        card.className = 'membership-card';
        card.innerHTML = `
            <h3>${userMembership.plan} Membership</h3>
            <div class="membership-detail-row">
                <label>Monthly Fee:</label>
                <value>Rs. ${userMembership.monthlyFee}</value>
            </div>
            <div class="membership-detail-row">
                <label>Join Date:</label>
                <value>${joinDate}</value>
            </div>
            <div class="membership-detail-row">
                <label>Expiry Date:</label>
                <value>${expiryDate}</value>
            </div>
            <div class="membership-detail-row">
                <label>Days Remaining:</label>
                <value style="color: ${daysRemaining < 0 ? '#ff0000' : daysRemaining <= 30 ? '#ffa500' : '#00ff00'}">${daysRemaining < 0 ? 'Expired' : daysRemaining} days</value>
            </div>
            <div class="membership-detail-row">
                <label>Status:</label>
                <span class="status-tag ${statusClass}">${statusText}</span>
            </div>
        `;
        grid.appendChild(card);
    } else {
        grid.innerHTML = '<p style="color: #ccc; grid-column: 1/-1; text-align: center;">No membership found. Please contact admin.</p>';
    }
}

// Toggle sidebar on mobile
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('fitflexUser');
        window.location.href = 'login.html';
    }
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    loadUserData();
    loadSchedule();
    loadMembership();
    
    // Set active menu item
    const menuItems = document.querySelectorAll('.sidebar-menu a');
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            menuItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            const targetId = this.getAttribute('href');
            if (targetId === '#dashboard') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        const sidebar = document.getElementById('sidebar');
        const menuToggle = document.querySelector('.menu-toggle');
        
        if (window.innerWidth <= 992 && 
            !sidebar.contains(e.target) && 
            !menuToggle.contains(e.target) &&
            sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
        }
    });
});
