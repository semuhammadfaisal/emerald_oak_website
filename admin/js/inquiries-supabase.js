// Inquiries Management with Supabase
(function() {
  let supabaseClient;
  let currentInquiryId = null;

  // Initialize
  async function initInquiries() {
    supabaseClient = window.getSupabaseClient();
    await loadInquiries();
  }

  // Load inquiries
  async function loadInquiries() {
    try {
      let query = supabaseClient
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Apply status filter
      const status = document.getElementById('statusFilter')?.value;
      if (status) {
        query = query.eq('status', status);
      }
      
      const { data: inquiries, error } = await query;
      
      if (error) throw error;
      
      const tbody = document.getElementById('inquiriesTable');
      
      if (!inquiries || inquiries.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="no-data">No inquiries found</td></tr>';
        return;
      }
      
      tbody.innerHTML = inquiries.map(inquiry => `
        <tr>
          <td>${new Date(inquiry.created_at).toLocaleDateString()}</td>
          <td>${inquiry.name}</td>
          <td>${inquiry.email}</td>
          <td>${inquiry.phone}</td>
          <td>${inquiry.message.substring(0, 50)}...</td>
          <td><span class="status-badge status-${inquiry.status}">${inquiry.status}</span></td>
          <td>
            <button onclick="viewInquiry('${inquiry.id}')" class="action-btn view-btn">View</button>
            <button onclick="deleteInquiry('${inquiry.id}')" class="action-btn delete-btn">Delete</button>
          </td>
        </tr>
      `).join('');
      
    } catch (error) {
      console.error('Error loading inquiries:', error);
      alert('Error loading inquiries. Please refresh the page.');
    }
  }

  // Filter inquiries
  window.filterInquiries = function() {
    loadInquiries();
  };

  // View inquiry
  window.viewInquiry = async function(id) {
    try {
      const { data: inquiry, error } = await supabaseClient
        .from('inquiries')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      if (!inquiry) return;
      
      currentInquiryId = id;
      document.getElementById('detailName').textContent = inquiry.name;
      document.getElementById('detailEmail').textContent = inquiry.email;
      document.getElementById('detailPhone').textContent = inquiry.phone;
      document.getElementById('detailDate').textContent = new Date(inquiry.created_at).toLocaleString();
      document.getElementById('detailMessage').textContent = inquiry.message;
      document.getElementById('detailStatus').value = inquiry.status;
      
      document.getElementById('inquiryModal').classList.add('active');
      
    } catch (error) {
      console.error('Error loading inquiry:', error);
      alert('Error loading inquiry details.');
    }
  };

  // Update inquiry status
  window.updateInquiryStatus = async function() {
    if (!currentInquiryId) return;
    
    try {
      const newStatus = document.getElementById('detailStatus').value;
      
      const { error } = await supabaseClient
        .from('inquiries')
        .update({ status: newStatus })
        .eq('id', currentInquiryId);
      
      if (error) throw error;
      
      await loadInquiries();
      
    } catch (error) {
      console.error('Error updating inquiry:', error);
      alert('Error updating inquiry status.');
    }
  };

  // Delete inquiry
  window.deleteInquiry = async function(id) {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;
    
    try {
      const { error } = await supabaseClient
        .from('inquiries')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      await loadInquiries();
      
    } catch (error) {
      console.error('Error deleting inquiry:', error);
      alert('Error deleting inquiry. Please try again.');
    }
  };

  // Close modal
  window.closeModal = function() {
    document.getElementById('inquiryModal').classList.remove('active');
    currentInquiryId = null;
  };

  // Close modal on outside click
  document.getElementById('inquiryModal')?.addEventListener('click', function(e) {
    if (e.target === this) window.closeModal();
  });

  // Initialize
  if (typeof window.getSupabaseClient !== 'undefined') {
    initInquiries();
  }
})();
