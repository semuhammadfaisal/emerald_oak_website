// Properties Management
const PROPERTIES_KEY = 'emeraldOakProperties';
let properties = JSON.parse(localStorage.getItem(PROPERTIES_KEY)) || [];
let editingId = null;

// Load properties
function loadProperties() {
  const tbody = document.getElementById('propertiesTable');
  const filtered = filterProperties();
  
  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" class="no-data">No properties found</td></tr>';
    return;
  }
  
  tbody.innerHTML = filtered.map(property => `
    <tr>
      <td><img src="${property.image || 'https://via.placeholder.com/60'}" alt="${property.title}" class="property-img"></td>
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
}

// Filter properties
function filterProperties() {
  const search = document.getElementById('searchInput').value.toLowerCase();
  const status = document.getElementById('statusFilter').value;
  
  return properties.filter(property => {
    const matchSearch = property.title.toLowerCase().includes(search) || 
                       property.location.toLowerCase().includes(search);
    const matchStatus = !status || property.status === status;
    return matchSearch && matchStatus;
  });
}

// Open add modal
function openAddModal() {
  editingId = null;
  document.getElementById('modalTitle').textContent = 'Add Property';
  document.getElementById('propertyForm').reset();
  document.getElementById('propertyId').value = '';
  document.getElementById('propertyModal').classList.add('active');
}

// Edit property
function editProperty(id) {
  const property = properties.find(p => p.id === id);
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
  document.getElementById('image').value = property.image || '';
  
  document.getElementById('propertyModal').classList.add('active');
}

// Delete property
function deleteProperty(id) {
  if (confirm('Are you sure you want to delete this property?')) {
    properties = properties.filter(p => p.id !== id);
    localStorage.setItem(PROPERTIES_KEY, JSON.stringify(properties));
    loadProperties();
  }
}

// Close modal
function closeModal() {
  document.getElementById('propertyModal').classList.remove('active');
}

// Form submit
document.getElementById('propertyForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const property = {
    id: editingId || Date.now().toString(),
    title: document.getElementById('title').value,
    location: document.getElementById('location').value,
    type: document.getElementById('type').value,
    size: document.getElementById('size').value,
    price: document.getElementById('price').value,
    status: document.getElementById('status').value,
    description: document.getElementById('description').value,
    features: document.getElementById('features').value,
    image: document.getElementById('image').value,
    createdAt: editingId ? properties.find(p => p.id === editingId).createdAt : new Date().toISOString()
  };
  
  if (editingId) {
    const index = properties.findIndex(p => p.id === editingId);
    properties[index] = property;
  } else {
    properties.push(property);
  }
  
  localStorage.setItem(PROPERTIES_KEY, JSON.stringify(properties));
  closeModal();
  loadProperties();
});

// Search and filter
document.getElementById('searchInput').addEventListener('input', loadProperties);
document.getElementById('statusFilter').addEventListener('change', loadProperties);

// Close modal on outside click
document.getElementById('propertyModal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

// Initialize
loadProperties();
