// Check user role on page load
function checkUserRole() {
    const userData = JSON.parse(localStorage.getItem('fitflexUser')) || {};
    
    if (!userData.role || userData.role !== 'manager') {
        alert('❌ Access Denied! This dashboard is for managers only.\n\nRedirecting to login...');
        localStorage.removeItem('fitflexUser');
        window.location.href = 'login.html';
        return false;
    }
    
    return true;
}

// ============ MEMBERS MANAGEMENT ============
function initializeMembersData() {
    const existingMembers = JSON.parse(localStorage.getItem('fitflexMembers')) || [];
    
    // Don't add demo data - start empty
    if (existingMembers.length === 0) {
        localStorage.setItem('fitflexMembers', JSON.stringify([]));
    }
}

function loadMembers() {
    const members = JSON.parse(localStorage.getItem('fitflexMembers')) || [];
    const tableBody = document.getElementById('membersTableBody');
    
    tableBody.innerHTML = '';
    
    members.forEach(member => {
        const row = document.createElement('tr');
        const joinDate = new Date(member.joinDate).toLocaleDateString('en-US');
        
        row.innerHTML = `
            <td>${member.firstName} ${member.lastName}</td>
            <td>${member.email}</td>
            <td>${member.phone}</td>
            <td><span style="background: rgba(69, 255, 202, 0.2); color: var(--main-color); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 1.2rem;">${member.plan.toUpperCase()}</span></td>
            <td>${joinDate}</td>
            <td>
                <div class="action-cell">
                    <button class="btn-sm btn-delete" onclick="deleteMember(${member.id})">
                        <i class='bx bx-trash'></i> Delete
                    </button>
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

function addNewMember() {
    const firstName = prompt('First Name:');
    if (!firstName) return;
    
    const lastName = prompt('Last Name:');
    if (!lastName) return;
    
    const email = prompt('Email:');
    if (!email) return;
    
    const phone = prompt('Phone Number:');
    if (!phone) return;
    
    const plan = prompt('Plan (basic/pro/premium):', 'pro') || 'pro';
    
    const members = JSON.parse(localStorage.getItem('fitflexMembers')) || [];
    const memberId = Date.now();
    
    const newMember = {
        id: memberId,
        firstName,
        lastName,
        email,
        phone,
        joinDate: new Date().toISOString().split('T')[0],
        plan: plan.toLowerCase(),
        status: 'active'
    };
    
    members.push(newMember);
    localStorage.setItem('fitflexMembers', JSON.stringify(members));
    
    // AUTO-CREATE MEMBERSHIP FOR THIS MEMBER
    const memberships = JSON.parse(localStorage.getItem('fitflexMemberships')) || [];
    const monthlyFees = { 'basic': 1000, 'pro': 2000, 'premium': 3000 };
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    
    const newMembership = {
        id: memberId,
        memberId: memberId,
        memberName: `${firstName} ${lastName}`,
        plan: plan.toUpperCase(),
        monthlyFee: monthlyFees[plan.toLowerCase()] || 2000,
        joinDate: new Date().toISOString().split('T')[0],
        expiryDate: expiryDate.toISOString().split('T')[0],
        status: 'active',
        assignedTrainer: null // Will be set when trainer is assigned
    };
    
    memberships.push(newMembership);
    localStorage.setItem('fitflexMemberships', JSON.stringify(memberships));
    
    loadMembers();
    loadMemberships();
    alert(`✅ Member "${firstName} ${lastName}" added successfully!\n\nMembership plan "${plan.toUpperCase()}" has been created.`);
}

function deleteMember(memberId) {
    if (confirm('Are you sure you want to delete this member?')) {
        const members = JSON.parse(localStorage.getItem('fitflexMembers')) || [];
        const filteredMembers = members.filter(m => m.id !== memberId);
        
        localStorage.setItem('fitflexMembers', JSON.stringify(filteredMembers));
        loadMembers();
        alert('✅ Member deleted successfully!');
    }
}

function setupMemberSearch() {
    const searchInput = document.getElementById('memberSearch');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const rows = document.querySelectorAll('#membersTableBody tr');
        
        rows.forEach(row => {
            const cells = row.textContent.toLowerCase();
            row.style.display = cells.includes(searchTerm) ? '' : 'none';
        });
    });
}

// ============ TRAINERS MANAGEMENT ============
function initializeTrainersData() {
    const existingTrainers = JSON.parse(localStorage.getItem('fitflexTrainers')) || [];
    
    // Don't add demo data - start empty
    if (existingTrainers.length === 0) {
        localStorage.setItem('fitflexTrainers', JSON.stringify([]));
    }
}

function loadTrainers() {
    const trainers = JSON.parse(localStorage.getItem('fitflexTrainers')) || [];
    const members = JSON.parse(localStorage.getItem('fitflexMembers')) || [];
    const container = document.getElementById('trainersContainer');
    
    container.innerHTML = '';
    
    if (trainers.length === 0) {
        container.innerHTML = '<p style="color: #ccc; text-align: center; padding: 2rem;">No trainers added yet. Click "Add New Trainer" to get started.</p>';
        return;
    }
    
    trainers.forEach(trainer => {
        const card = document.createElement('div');
        card.className = 'trainer-card';
        
        const memberSelectOptions = '<option value="">Assign to a member...</option>' + 
            members.map(m => `<option value="${m.id}" ${trainer.assignedMemberId === m.id ? 'selected' : ''}>${m.firstName} ${m.lastName}</option>`).join('');
        
        card.innerHTML = `
            <h4>${trainer.firstName} ${trainer.lastName}</h4>
            <div class="trainer-info"><strong>Specialty:</strong> ${trainer.specialty}</div>
            <div class="trainer-info"><strong>Experience:</strong> ${trainer.experience}</div>
            <div class="trainer-info"><strong>Rating:</strong> ${trainer.rating}★</div>
            <div class="trainer-info"><strong>Phone:</strong> ${trainer.phone}</div>
            <div class="trainer-info">
                <strong>Assigned To:</strong>
                ${trainer.assignedMemberId ? 
                    `<span style="color: #0f0; margin-left: 1rem;">✅ ${members.find(m => m.id === trainer.assignedMemberId)?.firstName || 'Unknown'} ${members.find(m => m.id === trainer.assignedMemberId)?.lastName || ''}</span>` : 
                    '<span style="color: #ffa500; margin-left: 1rem;">⏳ Not Assigned</span>'}
            </div>
            <div class="trainer-info" style="margin-top: 1rem;">
                <label><strong>Assign Member:</strong></label>
                <select onchange="assignTrainerToMember(${trainer.id}, this.value)" style="width: 100%; padding: 0.5rem; margin-top: 0.5rem; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 6px; color: #fff; font-size: 1.2rem;">
                    ${memberSelectOptions}
                </select>
            </div>
            <div class="trainer-buttons">
                <button class="btn-sm btn-delete" onclick="deleteTrainer(${trainer.id})">
                    <i class='bx bx-trash'></i> Delete
                </button>
            </div>
        `;
        
        container.appendChild(card);
    });
}

function addNewTrainer() {
    const firstName = prompt('First Name:');
    if (!firstName) return;
    
    const lastName = prompt('Last Name:');
    if (!lastName) return;
    
    const specialty = prompt('Specialty (e.g., Strength Training):');
    if (!specialty) return;
    
    const experience = prompt('Experience (e.g., 5+ years):');
    if (!experience) return;
    
    const phone = prompt('Phone Number:');
    if (!phone) return;
    
    const trainers = JSON.parse(localStorage.getItem('fitflexTrainers')) || [];
    const newTrainer = {
        id: Date.now(),
        firstName,
        lastName,
        specialty,
        experience,
        rating: 4.5,
        phone,
        assignedMemberId: null
    };
    
    trainers.push(newTrainer);
    localStorage.setItem('fitflexTrainers', JSON.stringify(trainers));
    
    loadTrainers();
    alert(`✅ Trainer "${firstName} ${lastName}" added successfully!`);
}

function assignTrainerToMember(trainerId, memberId) {
    if (!memberId) {
        alert('❌ Please select a member to assign');
        return;
    }
    
    const trainers = JSON.parse(localStorage.getItem('fitflexTrainers')) || [];
    const members = JSON.parse(localStorage.getItem('fitflexMembers')) || [];
    const memberships = JSON.parse(localStorage.getItem('fitflexMemberships')) || [];
    
    const trainer = trainers.find(t => t.id === trainerId);
    const member = members.find(m => m.id == memberId);
    const membership = memberships.find(mem => mem.memberId == memberId);
    
    if (trainer && member && membership) {
        trainer.assignedMemberId = memberId;
        membership.assignedTrainer = `${trainer.firstName} ${trainer.lastName}`;
        
        localStorage.setItem('fitflexTrainers', JSON.stringify(trainers));
        localStorage.setItem('fitflexMemberships', JSON.stringify(memberships));
        
        loadTrainers();
        loadMemberships();
        alert(`✅ ${trainer.firstName} assigned to ${member.firstName} ${member.lastName}!`);
    }
}

function deleteTrainer(trainerId) {
    if (confirm('Are you sure you want to delete this trainer?')) {
        const trainers = JSON.parse(localStorage.getItem('fitflexTrainers')) || [];
        const filteredTrainers = trainers.filter(t => t.id !== trainerId);
        
        localStorage.setItem('fitflexTrainers', JSON.stringify(filteredTrainers));
        loadTrainers();
        alert('✅ Trainer deleted successfully!');
    }
}

// ============ MEMBERSHIP MANAGEMENT ============
function initializeMembershipData() {
    const existingMemberships = JSON.parse(localStorage.getItem('fitflexMemberships')) || [];
    
    // Don't add demo data - start empty
    if (existingMemberships.length === 0) {
        localStorage.setItem('fitflexMemberships', JSON.stringify([]));
    }
}

function loadMemberships() {
    const memberships = JSON.parse(localStorage.getItem('fitflexMemberships')) || [];
    const tableBody = document.getElementById('membershipTableBody');
    
    tableBody.innerHTML = '';
    
    if (memberships.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="8" style="text-align: center; color: #ccc; padding: 2rem;">No memberships yet. Add members to create memberships.</td>';
        tableBody.appendChild(row);
        return;
    }
    
    memberships.forEach(membership => {
        const row = document.createElement('tr');
        const joinDate = new Date(membership.joinDate).toLocaleDateString('en-US');
        const expiryDate = new Date(membership.expiryDate).toLocaleDateString('en-US');
        
        const today = new Date();
        const expiry = new Date(membership.expiryDate);
        const daysRemaining = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
        
        let statusClass = 'active';
        let statusText = '✅ Active';
        
        if (daysRemaining < 0) {
            statusClass = 'expired';
            statusText = '❌ Expired';
        } else if (daysRemaining <= 30) {
            statusClass = 'expiring';
            statusText = '⚠️ Expiring Soon';
        }
        
        row.innerHTML = `
            <td>${membership.memberName}</td>
            <td>${membership.plan}</td>
            <td>Rs. ${membership.monthlyFee}</td>
            <td>${joinDate}</td>
            <td>${expiryDate}</td>
            <td><span style="color: ${statusClass === 'active' ? '#0f0' : statusClass === 'expired' ? '#f00' : '#ffa500'}">${statusText}</span></td>
            <td>
                <strong style="color: #fff;">Trainer:</strong> ${membership.assignedTrainer ? `<span style="color: var(--main-color);">${membership.assignedTrainer}</span>` : '<span style="color: #ffa500;">Not Assigned</span>'}<br>
                <button class="btn-sm btn-assign" onclick="generateSlip('${membership.id}', '${membership.memberName}', '${membership.plan}', ${membership.monthlyFee}, '${joinDate}', '${expiryDate}')">
                    <i class='bx bx-download'></i> Slip
                </button>
                ${daysRemaining < 0 ? `<button class="btn-sm btn-delete" onclick="deleteExpiredMember('${membership.memberId}', '${membership.memberName}')" style="margin-left: 0.3rem;">
                    <i class='bx bx-trash'></i> Delete
                </button>` : ''}
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

function generateSlip(membershipId, memberName, plan, monthlyFee, joinDate, expiryDate) {
    const slipContent = `
╔════════════════════════════════════════╗
║     FitFlex GYM - MEMBERSHIP SLIP      ║
╚════════════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 MEMBER DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Name           : ${memberName}
Plan           : ${plan}
Monthly Fee    : Rs. ${monthlyFee}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 DATE INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Join Date      : ${joinDate}
Expiry Date    : ${expiryDate}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Generated on: ${new Date().toLocaleDateString('en-US')}
Time: ${new Date().toLocaleTimeString('en-US')}

Thank you for your support!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                FitFlex GYM
        Phone: +92-XXX-XXXXXXX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                `;
    
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(slipContent));
    element.setAttribute('download', `Membership_Slip_${memberName.replace(' ', '_')}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    alert('✅ Membership slip downloaded successfully!');
}

function setupMembershipSearch() {
    const searchInput = document.getElementById('membershipSearch');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const rows = document.querySelectorAll('#membershipTableBody tr');
        
        rows.forEach(row => {
            const cells = row.textContent.toLowerCase();
            row.style.display = cells.includes(searchTerm) ? '' : 'none';
        });
    });
}

function deleteExpiredMember(memberId, memberName) {
    if (confirm(`⚠️ Delete expired member "${memberName}"?\n\nThis will delete:\n✗ Member data\n✗ Membership record\n✗ Trainer assignments\n\nThis action CANNOT be undone.`)) {
        // Delete from members
        const members = JSON.parse(localStorage.getItem('fitflexMembers')) || [];
        const filteredMembers = members.filter(m => m.id != memberId);
        localStorage.setItem('fitflexMembers', JSON.stringify(filteredMembers));
        
        // Delete from memberships
        const memberships = JSON.parse(localStorage.getItem('fitflexMemberships')) || [];
        const filteredMemberships = memberships.filter(m => m.memberId != memberId);
        localStorage.setItem('fitflexMemberships', JSON.stringify(filteredMemberships));
        
        // Remove trainer assignment
        const trainers = JSON.parse(localStorage.getItem('fitflexTrainers')) || [];
        trainers.forEach(trainer => {
            if (trainer.assignedMemberId == memberId) {
                trainer.assignedMemberId = null;
            }
        });
        localStorage.setItem('fitflexTrainers', JSON.stringify(trainers));
        
        loadMembers();
        loadTrainers();
        loadMemberships();
        alert(`✅ Expired member "${memberName}" and all associated data deleted successfully!`);
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
        window.location.href = 'login.html';
    }
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is authorized
    if (!checkUserRole()) return;
    
    initializeMembersData();
    initializeTrainersData();
    initializeMembershipData();
    
    loadMembers();
    loadTrainers();
    loadMemberships();
    
    setupMemberSearch();
    setupMembershipSearch();
    
    // Set active menu item
    const menuItems = document.querySelectorAll('.sidebar-menu a');
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            menuItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
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
