// Inquiries Management
const INQUIRIES_KEY = 'emeraldOakInquiries';
let inquiries = JSON.parse(localStorage.getItem(INQUIRIES_KEY)) || [];
let currentInquiryId = null;

// Load inquiries
function loadInquiries() {
  const tbody = document.getElementById('inquiriesTable');
  const filtered = filterInquiries();
  
  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="no-data">No inquiries found</td></tr>';
    return;
  }
  
  tbody.innerHTML = filtered.map(inquiry => `
    <tr>
      <td>${new Date(inquiry.date).toLocaleDateString()}</td>
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
}

// Filter inquiries
function filterInquiries() {
  const status = document.getElementById('statusFilter').value;
  
  if (!status) return inquiries;
  return inquiries.filter(inquiry => inquiry.status === status);
}

// View inquiry
function viewInquiry(id) {
  const inquiry = inquiries.find(i => i.id === id);
  if (!inquiry) return;
  
  currentInquiryId = id;
  document.getElementById('detailName').textContent = inquiry.name;
  document.getElementById('detailEmail').textContent = inquiry.email;
  document.getElementById('detailPhone').textContent = inquiry.phone;
  document.getElementById('detailDate').textContent = new Date(inquiry.date).toLocaleString();
  document.getElementById('detailMessage').textContent = inquiry.message;
  document.getElementById('detailStatus').value = inquiry.status;
  
  document.getElementById('inquiryModal').classList.add('active');
}

// Update inquiry status
function updateInquiryStatus() {
  if (!currentInquiryId) return;
  
  const newStatus = document.getElementById('detailStatus').value;
  const index = inquiries.findIndex(i => i.id === currentInquiryId);
  
  if (index !== -1) {
    inquiries[index].status = newStatus;
    localStorage.setItem(INQUIRIES_KEY, JSON.stringify(inquiries));
    loadInquiries();
  }
}

// Delete inquiry
function deleteInquiry(id) {
  if (confirm('Are you sure you want to delete this inquiry?')) {
    inquiries = inquiries.filter(i => i.id !== id);
    localStorage.setItem(INQUIRIES_KEY, JSON.stringify(inquiries));
    loadInquiries();
  }
}

// Close modal
function closeModal() {
  document.getElementById('inquiryModal').classList.remove('active');
  currentInquiryId = null;
}

// Close modal on outside click
document.getElementById('inquiryModal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

// Initialize
loadInquiries();
