// Typing Effect for Home Section
const typed = new Typed('.multiple-text', {
  strings: ['Bodybuilding', 'Fitness', 'Crossfit', 'Cardio'],
  typeSpeed: 100,
  backSpeed: 100,
  backDelay: 1000,
  loop: true
});

// Active Navigation Link on Scroll
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (scrollY >= (sectionTop - 200)) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 70,
        behavior: 'smooth'
      });
      
      // Close mobile menu if open
      const navbarCollapse = document.querySelector('.navbar-collapse');
      if (navbarCollapse.classList.contains('show')) {
        const toggleButton = document.querySelector('.navbar-toggler');
        toggleButton.click();
      }
    }
  });
});

// Form Submission for Join Now Buttons
document.querySelectorAll('.btn, .box a').forEach(button => {
  if (button.textContent.includes('Join') || button.textContent.includes('Book')) {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const planType = this.closest('.box') ? 
        this.closest('.box').querySelector('h3').textContent : 
        'Free Class';
      
      alert(`Thank you for your interest in our ${planType} plan! We'll contact you shortly.`);
      
      // In a real application, you would submit a form here
      // Example: document.querySelector('#membershipForm').submit();
    });
  }
});

// Star Rating Interaction
document.querySelectorAll('.rating').forEach(ratingContainer => {
  const stars = ratingContainer.querySelectorAll('i');
  stars.forEach(star => {
    star.addEventListener('click', function() {
      const ratingValue = this.getAttribute('data-value') || 
                         Array.from(stars).indexOf(this) + 1;
      alert(`Thank you for your ${ratingValue} star rating!`);
    });
  });
});

// Social Media Links
document.querySelectorAll('.social a').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const platform = this.querySelector('i').className.split(' ')[1];
    const platformNames = {
      'bxl-instagram-alt': 'Instagram',
      'bxl-facebook-square': 'Facebook',
      'bxl-linkedin-square': 'LinkedIn'
    };
    alert(`Redirecting to our ${platformNames[platform]} page...`);
    // In real implementation, you would use: window.open(this.href, '_blank');
  });
});

// Navbar Background on Scroll
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.style.background = 'rgba(0, 0, 0, 0.95)';
    navbar.style.backdropFilter = 'blur(15px)';
  } else {
    navbar.style.background = 'rgba(0, 0, 0, 0.6)';
    navbar.style.backdropFilter = 'blur(10px)';
  }
});

// AOS Animation Initialization (if you add AOS library)
// You can optionally add AOS library for animations:
// <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
// <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>

if (typeof AOS !== 'undefined') {
  AOS.init({
    duration: 1000,
    once: true,
    offset: 100
  });
}


// Counter Animation for Statistics (Optional - if you add stats section)

const counters = document.querySelectorAll('.counter');
counters.forEach(counter => {
  const updateCount = () => {
    const target = +counter.getAttribute('data-target');
    const count = +counter.innerText;
    const increment = target / 200;
    
    if (count < target) {
      counter.innerText = Math.ceil(count + increment);
      setTimeout(updateCount, 10);
    } else {
      counter.innerText = target;
    }
  };
  updateCount();
});


// Current Year in Footer
const currentYear = new Date().getFullYear();
const copyrightElement = document.querySelector('.copyright');
if (copyrightElement) {
  copyrightElement.innerHTML = copyrightElement.innerHTML.replace('2024', currentYear);
}

// Mobile Menu Toggle Enhancement
document.querySelector('.navbar-toggler').addEventListener('click', function() {
  const navbarCollapse = document.querySelector('.navbar-collapse');
  this.classList.toggle('collapsed');
  navbarCollapse.classList.toggle('show');
});

// Service Cards Hover Effect Enhancement
document.querySelectorAll('.row').forEach(card => {
  card.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-10px) scale(1.05)';
    this.style.boxShadow = '0 15px 30px rgba(255, 77, 0, 0.3)';
  });
  
  card.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(-5px) scale(1.03)';
    this.style.boxShadow = '0 0 5px var(--main-color)';
  });
});

// Page Load Animation
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 100);
});

// Back to Top Button (Optional Addition)
const backToTopButton = document.createElement('button');
backToTopButton.innerHTML = '<i class="bx bx-chevron-up"></i>';
backToTopButton.className = 'back-to-top';
backToTopButton.style.cssText = `
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  background: #ff4d00;
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  display: none;
  z-index: 999;
  transition: all 0.3s ease;
`;
document.body.appendChild(backToTopButton);

window.addEventListener('scroll', () => {
  if (window.scrollY > 500) {
    backToTopButton.style.display = 'flex';
    backToTopButton.style.alignItems = 'center';
    backToTopButton.style.justifyContent = 'center';
  } else {
    backToTopButton.style.display = 'none';
  }
});

backToTopButton.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});



// Add to existing script.js

// Authentication functions
function checkAuth() {
    const user = localStorage.getItem('fitflexUser');
    const currentPath = window.location.pathname;
    
    // If user is logged in and tries to access login/signup pages
    if (user && (currentPath.includes('login.html') || currentPath.includes('signup.html'))) {
        window.location.href = 'member-dashboard.html';
    }
    
    // If user is not logged in and tries to access member pages
    if (!user && currentPath.includes('member-dashboard.html')) {
        window.location.href = 'login.html';
    }
}

// Initialize auth check on page load
document.addEventListener('DOMContentLoaded', checkAuth);

// Member session management
function startMemberSession(userData) {
    localStorage.setItem('fitflexUser', JSON.stringify(userData));
    localStorage.setItem('lastLogin', new Date().toISOString());
    
    // Update user stats
    const today = new Date().toISOString().split('T')[0];
    let stats = JSON.parse(localStorage.getItem('memberStats')) || {};
    
    if (!stats[today]) {
        stats[today] = {
            loginCount: 0,
            lastLogin: new Date().toISOString()
        };
    }
    
    stats[today].loginCount++;
    stats[today].lastLogin = new Date().toISOString();
    localStorage.setItem('memberStats', JSON.stringify(stats));
}

// Check for existing session
function checkExistingSession() {
    const user = localStorage.getItem('fitflexUser');
    const lastLogin = localStorage.getItem('lastLogin');
    
    if (user && lastLogin) {
        const hoursSinceLastLogin = (new Date() - new Date(lastLogin)) / (1000 * 60 * 60);
        
        // Auto-logout after 24 hours
        if (hoursSinceLastLogin > 24) {
            localStorage.removeItem('fitflexUser');
            localStorage.removeItem('lastLogin');
            return false;
        }
        return true;
    }
    return false;
}

// Enhanced workout tracking
class WorkoutTracker {
    constructor() {
        this.workouts = JSON.parse(localStorage.getItem('workoutHistory')) || [];
    }
    
    addWorkout(workout) {
        const today = new Date().toISOString().split('T')[0];
        workout.date = today;
        workout.id = Date.now();
        this.workouts.push(workout);
        this.save();
    }
    
    getTodayWorkouts() {
        const today = new Date().toISOString().split('T')[0];
        return this.workouts.filter(w => w.date === today);
    }
    
    getMonthlyStats() {
        const month = new Date().getMonth();
        const year = new Date().getFullYear();
        
        return this.workouts.filter(w => {
            const workoutDate = new Date(w.date);
            return workoutDate.getMonth() === month && workoutDate.getFullYear() === year;
        });
    }
    
    save() {
        localStorage.setItem('workoutHistory', JSON.stringify(this.workouts));
    }
}

// Initialize workout tracker
const workoutTracker = new WorkoutTracker();

// Sample workout data for demo
if (!localStorage.getItem('workoutHistory')) {
    const sampleWorkouts = [
        {
            date: '2024-01-15',
            type: 'Strength',
            duration: 60,
            exercises: ['Squats', 'Bench Press', 'Deadlifts'],
            calories: 450
        },
        {
            date: '2024-01-16',
            type: 'Cardio',
            duration: 45,
            exercises: ['Running', 'Cycling'],
            calories: 350
        }
    ];
    localStorage.setItem('workoutHistory', JSON.stringify(sampleWorkouts));
}