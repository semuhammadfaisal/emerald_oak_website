// Contact Form Handler for Supabase
(function() {
  // Initialize Supabase for contact form
  function initContactForm() {
    // Check if Supabase config exists
    if (typeof window.SUPABASE_CONFIG === 'undefined') {
      console.warn('Supabase not configured. Contact form will use localStorage fallback.');
      return null;
    }
    
    try {
      return window.getSupabaseClient();
    } catch (error) {
      console.error('Error initializing Supabase:', error);
      return null;
    }
  }

  // Handle contact form submission
  async function handleContactFormSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const message = document.getElementById('message').value;
    
    // Validation
    if (!name || !email || !phone || !message) {
      alert('Please fill in all fields.');
      return;
    }
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    
    try {
      const supabaseClient = initContactForm();
      
      if (supabaseClient) {
        // Save to Supabase
        const { error } = await supabaseClient
          .from('inquiries')
          .insert([{
            name: name,
            email: email,
            phone: phone,
            message: message,
            status: 'new'
          }]);
        
        if (error) throw error;
        
        alert('Thank you for contacting us! We will get back to you soon.');
        e.target.reset();
        
      } else {
        // Fallback to localStorage
        const inquiry = {
          id: Date.now().toString(),
          name: name,
          email: email,
          phone: phone,
          message: message,
          date: new Date().toISOString(),
          status: 'new'
        };
        
        const inquiries = JSON.parse(localStorage.getItem('emeraldOakInquiries')) || [];
        inquiries.push(inquiry);
        localStorage.setItem('emeraldOakInquiries', JSON.stringify(inquiries));
        
        alert('Thank you for contacting us! We will get back to you soon.');
        e.target.reset();
      }
      
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your message. Please try again or contact us directly.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  }

  // Attach to contact form when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', handleContactFormSubmit);
    }
  });
})();
