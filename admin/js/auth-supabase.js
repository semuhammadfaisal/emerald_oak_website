// Supabase Authentication Management
(function() {
  let supabaseClient;

  // Initialize Supabase
  function initAuth() {
    supabaseClient = window.getSupabaseClient();
    checkAuth();
  }

  // Check if user is authenticated
  async function checkAuth() {
    const { data: { session } } = await supabaseClient.auth.getSession();
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
      
      // Clear previous errors
      errorMsg.textContent = '';
      
      // Disable button during login
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
      
      try {
        console.log('Attempting login with email:', email);
        
        const { data, error } = await supabaseClient.auth.signInWithPassword({
          email: email,
          password: password
        });
        
        if (error) {
          console.error('Login error:', error);
          throw error;
        }
        
        console.log('Login successful:', data);
        
        // Success - redirect to dashboard
        window.location.href = 'dashboard.html';
        
      } catch (error) {
        console.error('Login failed:', error);
        
        // Show user-friendly error messages
        if (error.message.includes('Invalid login credentials')) {
          errorMsg.textContent = 'Invalid email or password. Please check your credentials.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMsg.textContent = 'Please confirm your email address first.';
        } else {
          errorMsg.textContent = error.message || 'Login failed. Please try again.';
        }
        
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Login</span><i class="fas fa-arrow-right"></i>';
      }
    });
  }

  // Logout function
  window.logout = async function() {
    if (confirm('Are you sure you want to logout?')) {
      try {
        await supabaseClient.auth.signOut();
        window.location.href = 'login.html';
      } catch (error) {
        console.error('Logout error:', error);
        alert('Error logging out. Please try again.');
      }
    }
  };

  // Initialize on page load
  if (typeof window.getSupabaseClient !== 'undefined') {
    initAuth();
  } else {
    console.error('Supabase not initialized. Check config/supabase.js');
  }

  // Listen for auth state changes
  if (supabaseClient) {
    supabaseClient.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        window.location.href = 'login.html';
      }
    });
  }
})();
