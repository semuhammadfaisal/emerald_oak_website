// Projects Management with Supabase
(function() {
  let supabaseClient;
  let editingId = null;
  let uploadedImages = [];

  async function initProjects() {
    supabaseClient = window.getSupabaseClient();
    setupImageUpload();
    await loadProjects();
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
          const fileName = `project_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
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
            <button type="button" onclick="removeProjectImage('${publicUrl}', this.parentElement)" style="position: absolute; top: -8px; right: -8px; background: #ef4444; color: white; border: none; border-radius: 50%; width: 24px; height: 24px; cursor: pointer; display: flex; align-items: center; justify-content: center;">
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

  window.removeProjectImage = function(url, element) {
    uploadedImages = uploadedImages.filter(img => img !== url);
    element.remove();
    if (uploadedImages.length > 0) {
      document.getElementById('image').value = uploadedImages[0];
    } else {
      document.getElementById('image').value = '';
    }
  };

  async function loadProjects() {
    try {
      const { data: projects, error } = await supabaseClient
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

  window.openAddModal = function() {
    editingId = null;
    uploadedImages = [];
    document.getElementById('modalTitle').textContent = 'Add Project';
    document.getElementById('projectForm').reset();
    document.getElementById('projectId').value = '';
    document.getElementById('imagePreview').innerHTML = '';
    document.getElementById('projectModal').classList.add('active');
  };

  window.editProject = async function(id) {
    try {
      const { data: project, error } = await supabaseClient
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      if (!project) return;
      
      editingId = id;
      uploadedImages = project.image_url ? [project.image_url] : [];
      
      document.getElementById('modalTitle').textContent = 'Edit Project';
      document.getElementById('projectId').value = project.id;
      document.getElementById('title').value = project.title;
      document.getElementById('location').value = project.location;
      document.getElementById('status').value = project.status;
      document.getElementById('completion').value = project.completion;
      document.getElementById('description').value = project.description || '';
      document.getElementById('image').value = project.image_url || '';
      
      const preview = document.getElementById('imagePreview');
      if (project.image_url) {
        preview.innerHTML = `
          <div style="position: relative; width: 100px; height: 100px;">
            <img src="${project.image_url}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px; border: 2px solid #134d37;">
            <button type="button" onclick="removeProjectImage('${project.image_url}', this.parentElement)" style="position: absolute; top: -8px; right: -8px; background: #ef4444; color: white; border: none; border-radius: 50%; width: 24px; height: 24px; cursor: pointer;">
              <i class="fas fa-times"></i>
            </button>
          </div>
        `;
      }
      
      document.getElementById('projectModal').classList.add('active');
      
    } catch (error) {
      console.error('Error loading project:', error);
      alert('Error loading project details.');
    }
  };

  window.deleteProject = async function(id) {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    try {
      const { error } = await supabaseClient
        .from('projects')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      await loadProjects();
      
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Error deleting project. Please try again.');
    }
  };

  window.closeModal = function() {
    document.getElementById('projectModal').classList.remove('active');
    uploadedImages = [];
  };

  document.getElementById('projectForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving...';
    
    try {
      const imageUrl = document.getElementById('image').value;
      
      const projectData = {
        title: document.getElementById('title').value,
        location: document.getElementById('location').value,
        status: document.getElementById('status').value,
        completion: parseInt(document.getElementById('completion').value),
        description: document.getElementById('description').value,
        image_url: imageUrl
      };
      
      let error;
      
      if (editingId) {
        ({ error } = await supabaseClient
          .from('projects')
          .update(projectData)
          .eq('id', editingId));
      } else {
        ({ error } = await supabaseClient
          .from('projects')
          .insert([projectData]));
      }
      
      if (error) throw error;
      
      window.closeModal();
      await loadProjects();
      
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Error saving project: ' + error.message);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Save Project';
    }
  });

  document.getElementById('projectModal')?.addEventListener('click', function(e) {
    if (e.target === this) window.closeModal();
  });

  if (typeof window.getSupabaseClient !== 'undefined') {
    initProjects();
  }
})();
