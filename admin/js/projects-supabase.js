// Projects Management with Supabase
let supabase;
let editingId = null;

// Initialize
async function initProjects() {
  supabase = initSupabase();
  await loadProjects();
}

// Load projects
async function loadProjects() {
  try {
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    const tbody = document.getElementById('projectsTable');
    
    if (!projects || projects.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="no-data">No projects found</td></tr>';
      return;
    }
    
    tbody.innerHTML = projects.map(project => `
      <tr>
        <td><img src="${project.image_url || 'https://via.placeholder.com/60'}" alt="${project.title}" class="property-img"></td>
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
    
  } catch (error) {
    console.error('Error loading projects:', error);
    alert('Error loading projects. Please refresh the page.');
  }
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
async function editProject(id) {
  try {
    const { data: project, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    if (!project) return;
    
    editingId = id;
    document.getElementById('modalTitle').textContent = 'Edit Project';
    document.getElementById('projectId').value = project.id;
    document.getElementById('title').value = project.title;
    document.getElementById('location').value = project.location;
    document.getElementById('status').value = project.status;
    document.getElementById('completion').value = project.completion;
    document.getElementById('description').value = project.description || '';
    document.getElementById('image').value = project.image_url || '';
    
    document.getElementById('projectModal').classList.add('active');
    
  } catch (error) {
    console.error('Error loading project:', error);
    alert('Error loading project details.');
  }
}

// Delete project
async function deleteProject(id) {
  if (!confirm('Are you sure you want to delete this project?')) return;
  
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    await loadProjects();
    
  } catch (error) {
    console.error('Error deleting project:', error);
    alert('Error deleting project. Please try again.');
  }
}

// Close modal
function closeModal() {
  document.getElementById('projectModal').classList.remove('active');
}

// Form submit
document.getElementById('projectForm')?.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const submitBtn = e.target.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Saving...';
  
  try {
    const projectData = {
      title: document.getElementById('title').value,
      location: document.getElementById('location').value,
      status: document.getElementById('status').value,
      completion: parseInt(document.getElementById('completion').value),
      description: document.getElementById('description').value,
      image_url: document.getElementById('image').value
    };
    
    let error;
    
    if (editingId) {
      // Update existing
      ({ error } = await supabase
        .from('projects')
        .update(projectData)
        .eq('id', editingId));
    } else {
      // Insert new
      ({ error } = await supabase
        .from('projects')
        .insert([projectData]));
    }
    
    if (error) throw error;
    
    closeModal();
    await loadProjects();
    
  } catch (error) {
    console.error('Error saving project:', error);
    alert('Error saving project: ' + error.message);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Save Project';
  }
});

// Close modal on outside click
document.getElementById('projectModal')?.addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

// Initialize
if (typeof initSupabase !== 'undefined') {
  initProjects();
}
