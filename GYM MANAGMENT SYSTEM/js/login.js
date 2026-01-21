document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Simple validation
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    // For demo purposes - in real app, you would send this to a server
    if (password === 'demo123') {
        // Extract name from email or use default
        const nameParts = email.split('@')[0].split('.');
        const firstName = nameParts[0] ? nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1) : 'John';
        const lastName = nameParts[1] ? nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1) : 'Doe';
        
        // Check if signup data exists to get role, otherwise default to member
        const signupData = JSON.parse(localStorage.getItem('fitflexSignup')) || {};
        const userRole = signupData.role || 'member';
        
        // Store user data
        const userData = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            plan: signupData.plan || 'pro',
            role: userRole,
            joinDate: new Date().toISOString().split('T')[0]
        };
        
        localStorage.setItem('fitflexUser', JSON.stringify(userData));
        
        alert('Login successful! Redirecting to your dashboard...');
        
        // Redirect based on role
        if (userRole === 'manager') {
            window.location.href = 'manager-dashboard.html';
        } else {
            window.location.href = 'member-dashboard-simple.html';
        }
    } else {
        alert('Invalid credentials. For demo use: password = "demo123"');
    }
});
