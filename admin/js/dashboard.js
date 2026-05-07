// Dashboard Management
const PROPERTIES_KEY = 'emeraldOakProperties';
const PROJECTS_KEY = 'emeraldOakProjects';
const INQUIRIES_KEY = 'emeraldOakInquiries';

// Load dashboard stats
function loadDashboardStats() {
  const properties = JSON.parse(localStorage.getItem(PROPERTIES_KEY)) || [];
  const projects = JSON.parse(localStorage.getItem(PROJECTS_KEY)) || [];
  const inquiries = JSON.parse(localStorage.getItem(INQUIRIES_KEY)) || [];
  
  const soldProperties = properties.filter(p => p.status === 'sold').length;
  const newInquiries = inquiries.filter(i => i.status === 'new').length;
  
  document.getElementById('totalProperties').textContent = properties.length;
  document.getElementById('totalProjects').textContent = projects.length;
  document.getElementById('totalInquiries').textContent = newInquiries;
  document.getElementById('soldProperties').textContent = soldProperties;
  
  loadRecentProperties(properties);
}

// Load recent properties
function loadRecentProperties(properties) {
  const tbody = document.getElementById('recentProperties');
  
  if (properties.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="no-data">No properties yet</td></tr>';
    return;
  }
  
  const recent = properties.slice(-5).reverse();
  tbody.innerHTML = recent.map(property => `
    <tr>
      <td>${property.title}</td>
      <td>${property.location}</td>
      <td>${property.type}</td>
      <td><span class="status-badge status-${property.status}">${property.status}</span></td>
      <td>
        <button onclick="window.location.href='properties.html'" class="action-btn view-btn">View All</button>
      </td>
    </tr>
  `).join('');
}

// Initialize dashboard
loadDashboardStats();
