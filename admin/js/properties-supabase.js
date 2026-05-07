// Properties Management with Supabase
(function() {
  let supabaseClient;
  let editingId = null;

  // Initialize
  async function initProperties() {
    supabaseClient = window.getSupabaseClient();
    await loadProperties();
  }

  // Load properties
  async function loadProperties() {
    try {
      let query = supabaseClient
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Apply filters
      const search = document.getElementById('searchInput')?.value.toLowerCase();
      const status = document.getElementById('statusFilter')?.value;
      
      if (status) {
        query = query.eq('status', status);
      }
      
      const { data: properties, error } = await query;
      
      if (error) throw error;
      
      // Client-side search filter
      let filtered = properties || [];
      if (search) {
        filtered = filtered.filter(p => 
          p.title.toLowerCase().includes(search) || 
          p.location.toLowerCase().includes(search)
        );
      }
      
      const tbody = document.getElementById('propertiesTable');
      
      if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="no-data">No properties found</td></tr>';
        return;
      }
      
      tbody.innerHTML = filtered.map(property => `
        <tr>
          <td><img src="${property.image_url || 'https://via.placeholder.com/60'}" alt="${property.title}" class="property-img"></td>
          <td>${property.title}</td>
          <td>${property.location}</td>
          <td>${property.type}</td>
          <td>${property.size}</td>
          <td>${property.price}</td>
          <td><span class="status-badge status-${property.status}">${property.status}</span></td>
          <td>
            <button onclick="editProperty('${property.id}')" class="action-btn edit-btn">Edit</button>
            <button onclick="deleteProperty('${property.id}')" class="action-btn delete-btn">Delete</button>
          </td>
        </tr>
      `).join('');
      
    } catch (error) {
      console.error('Error loading properties:', error);
      alert('Error loading properties. Please refresh the page.');
    }
  }

  // Open add modal
  window.openAddModal = function() {
    editingId = null;
    document.getElementById('modalTitle').textContent = 'Add Property';
    document.getElementById('propertyForm').reset();
    document.getElementById('propertyId').value = '';
    document.getElementById('propertyModal').classList.add('active');
  };

  // Edit property
  window.editProperty = async function(id) {
    try {
      const { data: property, error } = await supabaseClient
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      if (!property) return;
      
      editingId = id;
      document.getElementById('modalTitle').textContent = 'Edit Property';
      document.getElementById('propertyId').value = property.id;
      document.getElementById('title').value = property.title;
      document.getElementById('location').value = property.location;
      document.getElementById('type').value = property.type;
      document.getElementById('size').value = property.size;
      document.getElementById('price').value = property.price;
      document.getElementById('status').value = property.status;
      document.getElementById('description').value = property.description || '';
      document.getElementById('features').value = property.features || '';
      document.getElementById('image').value = property.image_url || '';
      
      document.getElementById('propertyModal').classList.add('active');
      
    } catch (error) {
      console.error('Error loading property:', error);
      alert('Error loading property details.');
    }
  };

  // Delete property
  window.deleteProperty = async function(id) {
    if (!confirm('Are you sure you want to delete this property?')) return;
    
    try {
      const { error } = await supabaseClient
        .from('properties')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      await loadProperties();
      
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('Error deleting property. Please try again.');
    }
  };

  // Close modal
  window.closeModal = function() {
    document.getElementById('propertyModal').classList.remove('active');
  };

  // Form submit
  document.getElementById('propertyForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving...';
    
    try {
      const propertyData = {
        title: document.getElementById('title').value,
        location: document.getElementById('location').value,
        type: document.getElementById('type').value,
        size: document.getElementById('size').value,
        price: document.getElementById('price').value,
        status: document.getElementById('status').value,
        description: document.getElementById('description').value,
        features: document.getElementById('features').value,
        image_url: document.getElementById('image').value
      };
      
      let error;
      
      if (editingId) {
        // Update existing
        ({ error } = await supabaseClient
          .from('properties')
          .update(propertyData)
          .eq('id', editingId));
      } else {
        // Insert new
        ({ error } = await supabaseClient
          .from('properties')
          .insert([propertyData]));
      }
      
      if (error) throw error;
      
      window.closeModal();
      await loadProperties();
      
    } catch (error) {
      console.error('Error saving property:', error);
      alert('Error saving property: ' + error.message);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Save Property';
    }
  });

  // Search and filter
  document.getElementById('searchInput')?.addEventListener('input', loadProperties);
  document.getElementById('statusFilter')?.addEventListener('change', loadProperties);

  // Close modal on outside click
  document.getElementById('propertyModal')?.addEventListener('click', function(e) {
    if (e.target === this) window.closeModal();
  });

  // Initialize
  if (typeof window.getSupabaseClient !== 'undefined') {
    initProperties();
  }
})();
