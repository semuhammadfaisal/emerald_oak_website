// Authentication Management
const AUTH_KEY = 'emeraldOakAuth';
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'emeraldoak2024'
};

// Check if user is authenticated
function checkAuth() {
  const isAuthenticated = localStorage.getItem(AUTH_KEY);
  const currentPage = window.location.pathname;
  
  if (!isAuthenticated && !currentPage.includes('login.html')) {
    window.location.href = 'login.html';
  } else if (isAuthenticated && currentPage.includes('login.html')) {
    window.location.href = 'dashboard.html';
  }
}

// Login form handler
if (document.getElementById('loginForm')) {
  document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('errorMsg');
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      localStorage.setItem(AUTH_KEY, 'true');
      localStorage.setItem('adminName', username);
      window.location.href = 'dashboard.html';
    } else {
      errorMsg.textContent = 'Invalid username or password';
    }
  });
}

// Logout function
function logout() {
  if (confirm('Are you sure you want to logout?')) {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem('adminName');
    window.location.href = 'login.html';
  }
}

// Set admin name
if (document.getElementById('adminName')) {
  const adminName = localStorage.getItem('adminName') || 'Admin';
  document.getElementById('adminName').textContent = adminName;
}

// Check auth on page load
checkAuth();
