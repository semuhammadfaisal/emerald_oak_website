// Projects Management
const PROJECTS_KEY = 'emeraldOakProjects';
let projects = JSON.parse(localStorage.getItem(PROJECTS_KEY)) || [];
let editingId = null;

// Load projects
function loadProjects() {
  const tbody = document.getElementById('projectsTable');
  
  if (projects.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="no-data">No projects found</td></tr>';
    return;
  }
  
  tbody.innerHTML = projects.map(project => `
    <tr>
      <td><img src="${project.image || 'https://via.placeholder.com/60'}" alt="${project.title}" class="property-img"></td>
      <td>${project.title}</td>
      <td>${project.location}</td>
      <td><span class="status-badge status-${project.status}">${project.status}</span></td>
      <td>${project.completion}%</td>
      <td>
        <button onclick="editProject('${project.id}')" class="action-btn edit-btn">Edit</button>
        <button onclick="deleteProject('${project.id}')" class="action-btn delete-btn">Delete</button>
      </td>
    </tr>
  `).join('');
}

// Open add modal
function openAddModal() {
  editingId = null;
  document.getElementById('modalTitle').textContent = 'Add Project';
  document.getElementById('projectForm').reset();
  document.getElementById('projectId').value = '';
  document.getElementById('projectModal').classList.add('active');
}

// Edit project
function editProject(id) {
  const project = projects.find(p => p.id === id);
  if (!project) return;
  
  editingId = id;
  document.getElementById('modalTitle').textContent = 'Edit Project';
  document.getElementById('projectId').value = project.id;
  document.getElementById('title').value = project.title;
  document.getElementById('location').value = project.location;
  document.getElementById('status').value = project.status;
  document.getElementById('completion').value = project.completion;
  document.getElementById('description').value = project.description || '';
  document.getElementById('image').value = project.image || '';
  
  document.getElementById('projectModal').classList.add('active');
}

// Delete project
function deleteProject(id) {
  if (confirm('Are you sure you want to delete this project?')) {
    projects = projects.filter(p => p.id !== id);
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
    loadProjects();
  }
}

// Close modal
function closeModal() {
  document.getElementById('projectModal').classList.remove('active');
}

// Form submit
document.getElementById('projectForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const project = {
    id: editingId || Date.now().toString(),
    title: document.getElementById('title').value,
    location: document.getElementById('location').value,
    status: document.getElementById('status').value,
    completion: document.getElementById('completion').value,
    description: document.getElementById('description').value,
    image: document.getElementById('image').value,
    createdAt: editingId ? projects.find(p => p.id === editingId).createdAt : new Date().toISOString()
  };
  
  if (editingId) {
    const index = projects.findIndex(p => p.id === editingId);
    projects[index] = project;
  } else {
    projects.push(project);
  }
  
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  closeModal();
  loadProjects();
});

// Close modal on outside click
document.getElementById('projectModal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

// Initialize
loadProjects();
