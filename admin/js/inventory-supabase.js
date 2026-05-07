// Office Inventory Management with Supabase
(function() {
  let supabaseClient;
  let editingId = null;

  // Initialize
  async function initInventory() {
    supabaseClient = window.getSupabaseClient();
    await loadInventory();
  }

  // Load inventory
  async function loadInventory() {
    try {
      let query = supabaseClient
        .from('office_inventory')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Apply filters
      const search = document.getElementById('searchInput')?.value.toLowerCase();
      const type = document.getElementById('typeFilter')?.value;
      const status = document.getElementById('statusFilter')?.value;
      
      if (type) {
        query = query.eq('property_type', type);
      }
      
      if (status) {
        query = query.eq('status', status);
      }
      
      const { data: inventory, error } = await query;
      
      if (error) throw error;
      
      // Client-side search filter
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
        tbody.innerHTML = '<tr><td colspan="9" class="no-data">No inventory items found</td></tr>';
        return;
      }
      
      tbody.innerHTML = filtered.map(item => `
        <tr>
          <td><span class="status-badge" style="background: ${item.property_type === 'plot' ? '#dbeafe' : '#fef3c7'}; color: ${item.property_type === 'plot' ? '#1e40af' : '#92400e'};">${item.property_type}</span></td>
          <td><strong>${item.plot_number}</strong></td>
          <td>${item.block}</td>
          <td>${item.society}</td>
          <td>${item.size}</td>
          <td>${item.purchase_price}</td>
          <td><strong style="color: #134d37;">${item.selling_price}</strong></td>
          <td><span class="status-badge status-${item.status}">${item.status}</span></td>
          <td>
            <button onclick="viewItem('${item.id}')" class="action-btn view-btn" title="View Details">
              <i class="fas fa-eye"></i>
            </button>
            <button onclick="editItem('${item.id}')" class="action-btn edit-btn" title="Edit">
              <i class="fas fa-edit"></i>
            </button>
            <button onclick="deleteItem('${item.id}')" class="action-btn delete-btn" title="Delete">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      `).join('');
      
    } catch (error) {
      console.error('Error loading inventory:', error);
      alert('Error loading inventory. Please refresh the page.');
    }
  }

  // Toggle sold fields
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

  // Open add modal
  window.openAddModal = function() {
    editingId = null;
    document.getElementById('modalTitle').textContent = 'Add to Inventory';
    document.getElementById('inventoryForm').reset();
    document.getElementById('inventoryId').value = '';
    toggleSoldFields();
    document.getElementById('inventoryModal').classList.add('active');
  };

  // View item details
  window.viewItem = async function(id) {
    try {
      const { data: item, error } = await supabaseClient
        .from('office_inventory')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      if (!item) return;
      
      let details = `
        <div style="padding: 20px;">
          <h3 style="color: #134d37; margin-bottom: 20px;">Inventory Details</h3>
          
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
          
          <h4 style="color: #134d37; margin: 20px 0 10px;">Owner Details</h4>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
            <div><strong>Owner Name:</strong> ${item.owner_name || 'N/A'}</div>
            <div><strong>Owner Contact:</strong> ${item.owner_contact || 'N/A'}</div>
          </div>
          
          <h4 style="color: #134d37; margin: 20px 0 10px;">Status</h4>
          <div style="margin-bottom: 20px;">
            <span class="status-badge status-${item.status}">${item.status}</span>
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
          
          ${item.notes ? `
            <h4 style="color: #134d37; margin: 20px 0 10px;">Notes</h4>
            <p style="color: #666;">${item.notes}</p>
          ` : ''}
          
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <small style="color: #999;">Added: ${new Date(item.created_at).toLocaleString()}</small>
          </div>
        </div>
      `;
      
      // Create temporary modal for viewing
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

  // Edit item
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
      document.getElementById('modalTitle').textContent = 'Edit Inventory Item';
      document.getElementById('inventoryId').value = item.id;
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
      
      toggleSoldFields();
      document.getElementById('inventoryModal').classList.add('active');
      
    } catch (error) {
      console.error('Error loading item:', error);
      alert('Error loading item details.');
    }
  };

  // Delete item
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

  // Close modal
  window.closeModal = function() {
    document.getElementById('inventoryModal').classList.remove('active');
  };

  // Form submit
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
        documents: document.getElementById('documents').value || null
      };
      
      let error;
      
      if (editingId) {
        // Update existing
        ({ error } = await supabaseClient
          .from('office_inventory')
          .update(itemData)
          .eq('id', editingId));
      } else {
        // Insert new
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

  // Search and filter
  document.getElementById('searchInput')?.addEventListener('input', loadInventory);
  document.getElementById('typeFilter')?.addEventListener('change', loadInventory);
  document.getElementById('statusFilter')?.addEventListener('change', loadInventory);

  // Close modal on outside click
  document.getElementById('inventoryModal')?.addEventListener('click', function(e) {
    if (e.target === this) window.closeModal();
  });

  // Initialize
  if (typeof window.getSupabaseClient !== 'undefined') {
    initInventory();
  }
})();
