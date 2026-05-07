// Supabase Authentication Management
let supabase;

// Initialize Supabase
function initAuth() {
  supabase = initSupabase();
  checkAuth();
}

// Check if user is authenticated
async function checkAuth() {
  const { data: { session } } = await supabase.auth.getSession();
  const currentPage = window.location.pathname;
  
  if (!session && !currentPage.includes('login.html')) {
    window.location.href = 'login.html';
  } else if (session && currentPage.includes('login.html')) {
    window.location.href = 'dashboard.html';
  }
  
  // Set admin name if logged in
  if (session && document.getElementById('adminName')) {
    document.getElementById('adminName').textContent = session.user.email;
  }
}

// Login form handler
if (document.getElementById('loginForm')) {
  document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('errorMsg');
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    // Disable button during login
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });
      
      if (error) throw error;
      
      // Success - redirect to dashboard
      window.location.href = 'dashboard.html';
      
    } catch (error) {
      errorMsg.textContent = error.message || 'Invalid email or password';
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span>Login</span><i class="fas fa-arrow-right"></i>';
    }
  });
}

// Logout function
async function logout() {
  if (confirm('Are you sure you want to logout?')) {
    try {
      await supabase.auth.signOut();
      window.location.href = 'login.html';
    } catch (error) {
      console.error('Logout error:', error);
      alert('Error logging out. Please try again.');
    }
  }
}

// Initialize on page load
if (typeof initSupabase !== 'undefined') {
  initAuth();
} else {
  console.error('Supabase not initialized. Check config/supabase.js');
}

// Listen for auth state changes
if (supabase) {
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT') {
      window.location.href = 'login.html';
    }
  });
}
