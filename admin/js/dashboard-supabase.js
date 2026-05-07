// Dashboard Management with Supabase
let supabase;

// Initialize
async function initDashboard() {
  supabase = initSupabase();
  await loadDashboardStats();
}

// Load dashboard stats
async function loadDashboardStats() {
  try {
    // Get counts
    const { count: propertiesCount } = await supabase
      .from('properties')
      .select('*', { count: 'exact', head: true });
    
    const { count: projectsCount } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true });
    
    const { data: inquiries } = await supabase
      .from('inquiries')
      .select('status');
    
    const { data: properties } = await supabase
      .from('properties')
      .select('status');
    
    const newInquiries = inquiries?.filter(i => i.status === 'new').length || 0;
    const soldProperties = properties?.filter(p => p.status === 'sold').length || 0;
    
    // Update UI
    document.getElementById('totalProperties').textContent = propertiesCount || 0;
    document.getElementById('totalProjects').textContent = projectsCount || 0;
    document.getElementById('totalInquiries').textContent = newInquiries;
    document.getElementById('soldProperties').textContent = soldProperties;
    
    // Load recent properties
    await loadRecentProperties();
    
  } catch (error) {
    console.error('Error loading stats:', error);
  }
}

// Load recent properties
async function loadRecentProperties() {
  try {
    const { data: properties, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (error) throw error;
    
    const tbody = document.getElementById('recentProperties');
    
    if (!properties || properties.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="no-data">No properties yet</td></tr>';
      return;
    }
    
    tbody.innerHTML = properties.map(property => `
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
    
  } catch (error) {
    console.error('Error loading recent properties:', error);
  }
}

// Initialize dashboard
if (typeof initSupabase !== 'undefined') {
  initDashboard();
}
