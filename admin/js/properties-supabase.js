// Properties Management with Supabase
(function() {
  let supabaseClient;
  let editingId = null;
  let uploadedImages = [];

  async function initProperties() {
    supabaseClient = window.getSupabaseClient();
    setupImageUpload();
    await loadProperties();
  }

  function setupImageUpload() {
    const imageUpload = document.getElementById('imageUpload');
    if (!imageUpload) return;

    imageUpload.addEventListener('change', async function(e) {
      const files = Array.from(e.target.files);
      const preview = document.getElementById('imagePreview');
      
      for (const file of files) {
        if (file.size > 5 * 1024 * 1024) {
          alert(`${file.name} is too large. Max size is 5MB.`);
          continue;
        }

        if (!file.type.startsWith('image/')) {
          alert(`${file.name} is not an image file.`);
          continue;
        }

        const loadingDiv = document.createElement('div');
        loadingDiv.style.cssText = 'width: 100px; height: 100px; border: 2px dashed #ccc; display: flex; align-items: center; justify-content: center; border-radius: 8px;';
        loadingDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        preview.appendChild(loadingDiv);

        try {
          const fileName = `property_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
          const { data, error } = await supabaseClient.storage
            .from('property-images')
            .upload(fileName, file, {
              cacheControl: '3600',
              upsert: false
            });

          if (error) throw error;

          const { data: { publicUrl } } = supabaseClient.storage
            .from('property-images')
            .getPublicUrl(fileName);

          uploadedImages.push(publicUrl);
          document.getElementById('image').value = publicUrl;

          preview.removeChild(loadingDiv);
          
          const imgContainer = document.createElement('div');
          imgContainer.style.cssText = 'position: relative; width: 100px; height: 100px;';
          imgContainer.innerHTML = `
            <img src="${publicUrl}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px; border: 2px solid #134d37;">
            <button type="button" onclick="removePropertyImage('${publicUrl}', this.parentElement)" style="position: absolute; top: -8px; right: -8px; background: #ef4444; color: white; border: none; border-radius: 50%; width: 24px; height: 24px; cursor: pointer; display: flex; align-items: center; justify-content: center;">
              <i class="fas fa-times"></i>
            </button>
          `;
          preview.appendChild(imgContainer);

        } catch (error) {
          console.error('Upload error:', error);
          preview.removeChild(loadingDiv);
          alert(`Failed to upload ${file.name}: ${error.message}`);
        }
      }

      e.target.value = '';
    });
  }

  window.removePropertyImage = function(url, element) {
    uploadedImages = uploadedImages.filter(img => img !== url);
    element.remove();
    if (uploadedImages.length > 0) {
      document.getElementById('image').value = uploadedImages[0];
    } else {
      document.getElementById('image').value = '';
    }
  };

  async function loadProperties() {
    try {
      let query = supabaseClient
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });
      
      const search = document.getElementById('searchInput')?.value.toLowerCase();
      const status = document.getElementById('statusFilter')?.value;
      
      if (status) {
        query = query.eq('status', status);
      }
      
      const { data: properties, error } = await query;
      
      if (error) throw error;
      
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

  window.openAddModal = function() {
    editingId = null;
    uploadedImages = [];
    document.getElementById('modalTitle').textContent = 'Add Property';
    document.getElementById('propertyForm').reset();
    document.getElementById('propertyId').value = '';
    document.getElementById('imagePreview').innerHTML = '';
    document.getElementById('propertyModal').classList.add('active');
  };

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
      uploadedImages = property.image_url ? [property.image_url] : [];
      
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
      
      const preview = document.getElementById('imagePreview');
      if (property.image_url) {
        preview.innerHTML = `
          <div style="position: relative; width: 100px; height: 100px;">
            <img src="${property.image_url}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px; border: 2px solid #134d37;">
            <button type="button" onclick="removePropertyImage('${property.image_url}', this.parentElement)" style="position: absolute; top: -8px; right: -8px; background: #ef4444; color: white; border: none; border-radius: 50%; width: 24px; height: 24px; cursor: pointer;">
              <i class="fas fa-times"></i>
            </button>
          </div>
        `;
      }
      
      document.getElementById('propertyModal').classList.add('active');
      
    } catch (error) {
      console.error('Error loading property:', error);
      alert('Error loading property details.');
    }
  };

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

  window.closeModal = function() {
    document.getElementById('propertyModal').classList.remove('active');
    uploadedImages = [];
  };

  document.getElementById('propertyForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving...';
    
    try {
      const imageUrl = document.getElementById('image').value;
      
      const propertyData = {
        title: document.getElementById('title').value,
        location: document.getElementById('location').value,
        type: document.getElementById('type').value,
        size: document.getElementById('size').value,
        price: document.getElementById('price').value,
        status: document.getElementById('status').value,
        description: document.getElementById('description').value,
        features: document.getElementById('features').value,
        image_url: imageUrl
      };
      
      let error;
      
      if (editingId) {
        ({ error } = await supabaseClient
          .from('properties')
          .update(propertyData)
          .eq('id', editingId));
      } else {
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

  document.getElementById('searchInput')?.addEventListener('input', loadProperties);
  document.getElementById('statusFilter')?.addEventListener('change', loadProperties);

  document.getElementById('propertyModal')?.addEventListener('click', function(e) {
    if (e.target === this) window.closeModal();
  });

  if (typeof window.getSupabaseClient !== 'undefined') {
    initProperties();
  }
})();
