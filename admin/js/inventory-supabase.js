// Office Inventory Management with Supabase
(function() {
  let supabaseClient;
  let editingId = null;
  let uploadedImages = [];

  // Initialize
  async function initInventory() {
    supabaseClient = window.getSupabaseClient();
    setupImageUpload();
    await loadInventory();
  }

  // Setup image upload
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
          const fileName = `inventory_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
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

          preview.removeChild(loadingDiv);
          
          const imgContainer = document.createElement('div');
          imgContainer.style.cssText = 'position: relative; width: 100px; height: 100px;';
          imgContainer.innerHTML = `
            <img src="${publicUrl}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px; border: 2px solid #134d37;">
            <button type="button" onclick="removeImage('${publicUrl}', this.parentElement)" style="position: absolute; top: -8px; right: -8px; background: #ef4444; color: white; border: none; border-radius: 50%; width: 24px; height: 24px; cursor: pointer; display: flex; align-items: center; justify-content: center;">
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

  window.removeImage = function(url, element) {
    uploadedImages = uploadedImages.filter(img => img !== url);
    element.remove();
  };

  async function loadInventory() {
    try {
      let query = supabaseClient
        .from('office_inventory')
        .select('*')
        .order('created_at', { ascending: false });
      
      const search = document.getElementById('searchInput')?.value.toLowerCase();
      const type = document.getElementById('typeFilter')?.value;
      const status = document.getElementById('statusFilter')?.value;
      
      if (type) query = query.eq('property_type', type);
      if (status) query = query.eq('status', status);
      
      const { data: inventory, error } = await query;
      if (error) throw error;
      
      let filtered = inventory || [];
      if (search) {
        filtered = filtered.filter(item => 
          item.plot_number.toLowerCase().includes(search) || 
          item.block.toLowerCase().includes(search) ||
          item.society.toLowerCase().includes(search) ||
          item.location.toLowerCase().includes(search)
        );
      }
      
      const tbody = document.getElementById('inventoryTable');
      
      if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" class="no-data">No inventory items found</td></tr>';
        return;
      }
      
      tbody.innerHTML = filtered.map(item => {
        const images = item.image_urls ? JSON.parse(item.image_urls) : [];
        const imagePreview = images.length > 0 
          ? `<img src="${images[0]}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">` 
          : '<span style="color: #999;">No image</span>';
        
        return `
        <tr>
          <td><span class="status-badge" style="background: ${item.property_type === 'plot' ? '#dbeafe' : '#fef3c7'}; color: ${item.property_type === 'plot' ? '#1e40af' : '#92400e'};">${item.property_type}</span></td>
          <td><strong>${item.plot_number}</strong></td>
          <td>${item.block}</td>
          <td>${item.society}</td>
          <td>${item.size}</td>
          <td>${item.purchase_price}</td>
          <td><strong style="color: #134d37;">${item.selling_price}</strong></td>
          <td>${imagePreview}</td>
          <td><span class="status-badge status-${item.status}">${item.status}</span></td>
          <td>
            <button onclick="viewItem('${item.id}')" class="action-btn view-btn"><i class="fas fa-eye"></i></button>
            <button onclick="editItem('${item.id}')" class="action-btn edit-btn"><i class="fas fa-edit"></i></button>
            <button onclick="deleteItem('${item.id}')" class="action-btn delete-btn"><i class="fas fa-trash"></i></button>
          </td>
        </tr>
      `;
      }).join('');
      
    } catch (error) {
      console.error('Error loading inventory:', error);
      alert('Error loading inventory. Please refresh the page.');
    }
  }

  window.toggleSoldFields = function() {
    const status = document.getElementById('status').value;
    const soldDateGroup = document.getElementById('soldDateGroup');
    const soldDetailsGroup = document.getElementById('soldDetailsGroup');
    
    if (status === 'sold') {
      soldDateGroup.style.display = 'block';
      soldDetailsGroup.style.display = 'block';
    } else {
      soldDateGroup.style.display = 'none';
      soldDetailsGroup.style.display = 'none';
    }
  };

  window.openAddModal = function() {
    editingId = null;
    uploadedImages = [];
    document.getElementById('modalTitle').textContent = 'Add to Inventory';
    document.getElementById('inventoryForm').reset();
    document.getElementById('imagePreview').innerHTML = '';
    toggleSoldFields();
    document.getElementById('inventoryModal').classList.add('active');
  };

  window.viewItem = async function(id) {
    try {
      const { data: item, error } = await supabaseClient
        .from('office_inventory')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      if (!item) return;

      const images = item.image_urls ? JSON.parse(item.image_urls) : [];
      const imageGallery = images.length > 0 
        ? `<div style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 20px;">
            ${images.map(img => `<img src="${img}" style="width: 150px; height: 150px; object-fit: cover; border-radius: 8px;">`).join('')}
           </div>`
        : '';
      
      let details = `
        <div style="padding: 20px;">
          <h3 style="color: #134d37; margin-bottom: 20px;">Inventory Details</h3>
          
          ${imageGallery}
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
            <div><strong>Type:</strong> ${item.property_type}</div>
            <div><strong>Plot/House #:</strong> ${item.plot_number}</div>
            <div><strong>Block:</strong> ${item.block}</div>
            <div><strong>Society:</strong> ${item.society}</div>
            <div><strong>Location:</strong> ${item.location}</div>
            <div><strong>Size:</strong> ${item.size}</div>
          </div>
          
          <h4 style="color: #134d37; margin: 20px 0 10px;">Financial Details</h4>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
            <div><strong>Purchase Price:</strong> ${item.purchase_price}</div>
            <div><strong>Selling Price:</strong> ${item.selling_price}</div>
          </div>
          
          ${item.status === 'sold' ? `
            <h4 style="color: #134d37; margin: 20px 0 10px;">Sale Details</h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
              <div><strong>Sold Date:</strong> ${item.sold_date ? new Date(item.sold_date).toLocaleDateString() : 'N/A'}</div>
              <div><strong>Sold To:</strong> ${item.sold_to || 'N/A'}</div>
              <div><strong>Buyer Contact:</strong> ${item.sold_contact || 'N/A'}</div>
              <div><strong>Profit/Loss:</strong> ${item.profit_loss || 'N/A'}</div>
            </div>
          ` : ''}
        </div>
      `;
      
      const viewModal = document.createElement('div');
      viewModal.className = 'modal active';
      viewModal.innerHTML = `
        <div class="modal-content" style="max-width: 700px;">
          <div class="modal-header">
            <h2>Inventory Details</h2>
            <button onclick="this.closest('.modal').remove()" class="close-btn">&times;</button>
          </div>
          ${details}
          <div style="padding: 0 20px 20px;">
            <button onclick="this.closest('.modal').remove()" class="cancel-btn">Close</button>
          </div>
        </div>
      `;
      document.body.appendChild(viewModal);
      
    } catch (error) {
      console.error('Error loading item:', error);
      alert('Error loading item details.');
    }
  };

  window.editItem = async function(id) {
    try {
      const { data: item, error } = await supabaseClient
        .from('office_inventory')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      if (!item) return;
      
      editingId = id;
      uploadedImages = item.image_urls ? JSON.parse(item.image_urls) : [];
      
      document.getElementById('modalTitle').textContent = 'Edit Inventory Item';
      document.getElementById('propertyType').value = item.property_type;
      document.getElementById('plotNumber').value = item.plot_number;
      document.getElementById('block').value = item.block;
      document.getElementById('society').value = item.society;
      document.getElementById('location').value = item.location;
      document.getElementById('size').value = item.size;
      document.getElementById('purchasePrice').value = item.purchase_price;
      document.getElementById('sellingPrice').value = item.selling_price;
      document.getElementById('ownerName').value = item.owner_name || '';
      document.getElementById('ownerContact').value = item.owner_contact || '';
      document.getElementById('status').value = item.status;
      document.getElementById('soldDate').value = item.sold_date || '';
      document.getElementById('soldTo').value = item.sold_to || '';
      document.getElementById('soldContact').value = item.sold_contact || '';
      document.getElementById('profitLoss').value = item.profit_loss || '';
      document.getElementById('notes').value = item.notes || '';
      document.getElementById('documents').value = item.documents || '';
      
      const preview = document.getElementById('imagePreview');
      preview.innerHTML = uploadedImages.map(url => `
        <div style="position: relative; width: 100px; height: 100px;">
          <img src="${url}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px; border: 2px solid #134d37;">
          <button type="button" onclick="removeImage('${url}', this.parentElement)" style="position: absolute; top: -8px; right: -8px; background: #ef4444; color: white; border: none; border-radius: 50%; width: 24px; height: 24px; cursor: pointer;">
            <i class="fas fa-times"></i>
          </button>
        </div>
      `).join('');
      
      toggleSoldFields();
      document.getElementById('inventoryModal').classList.add('active');
      
    } catch (error) {
      console.error('Error loading item:', error);
      alert('Error loading item details.');
    }
  };

  window.deleteItem = async function(id) {
    if (!confirm('Are you sure you want to delete this inventory item?')) return;
    
    try {
      const { error } = await supabaseClient
        .from('office_inventory')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      await loadInventory();
      
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Error deleting item. Please try again.');
    }
  };

  window.closeModal = function() {
    document.getElementById('inventoryModal').classList.remove('active');
    uploadedImages = [];
  };

  document.getElementById('inventoryForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving...';
    
    try {
      const itemData = {
        property_type: document.getElementById('propertyType').value,
        plot_number: document.getElementById('plotNumber').value,
        block: document.getElementById('block').value,
        society: document.getElementById('society').value,
        location: document.getElementById('location').value,
        size: document.getElementById('size').value,
        purchase_price: document.getElementById('purchasePrice').value,
        selling_price: document.getElementById('sellingPrice').value,
        owner_name: document.getElementById('ownerName').value || null,
        owner_contact: document.getElementById('ownerContact').value || null,
        status: document.getElementById('status').value,
        sold_date: document.getElementById('soldDate').value || null,
        sold_to: document.getElementById('soldTo').value || null,
        sold_contact: document.getElementById('soldContact').value || null,
        profit_loss: document.getElementById('profitLoss').value || null,
        notes: document.getElementById('notes').value || null,
        documents: document.getElementById('documents').value || null,
        image_urls: uploadedImages.length > 0 ? JSON.stringify(uploadedImages) : null
      };
      
      let error;
      
      if (editingId) {
        ({ error } = await supabaseClient
          .from('office_inventory')
          .update(itemData)
          .eq('id', editingId));
      } else {
        ({ error } = await supabaseClient
          .from('office_inventory')
          .insert([itemData]));
      }
      
      if (error) throw error;
      
      window.closeModal();
      await loadInventory();
      
    } catch (error) {
      console.error('Error saving item:', error);
      alert('Error saving item: ' + error.message);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Save to Inventory';
    }
  });

  document.getElementById('searchInput')?.addEventListener('input', loadInventory);
  document.getElementById('typeFilter')?.addEventListener('change', loadInventory);
  document.getElementById('statusFilter')?.addEventListener('change', loadInventory);

  document.getElementById('inventoryModal')?.addEventListener('click', function(e) {
    if (e.target === this) window.closeModal();
  });

  if (typeof window.getSupabaseClient !== 'undefined') {
    initInventory();
  }
})();
