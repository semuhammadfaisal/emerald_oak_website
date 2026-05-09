// Properties Listing for Website
(function() {
  let supabaseClient;

  async function initPropertiesListing() {
    supabaseClient = window.getSupabaseClient();
    await loadProperties();
  }

  window.loadProperties = async function() {
    const grid = document.getElementById('propertiesGrid');
    const noProperties = document.getElementById('noProperties');
    const loading = document.getElementById('loadingProperties');
    
    try {
      loading.style.display = 'block';
      grid.style.display = 'none';
      noProperties.style.display = 'none';

      let query = supabaseClient
        .from('properties')
        .select('*')
        .eq('show_on_website', true)
        .eq('status', 'available')
        .order('created_at', { ascending: false });
      
      const typeFilter = document.getElementById('typeFilter')?.value;
      const searchInput = document.getElementById('searchInput')?.value.toLowerCase();
      
      if (typeFilter) {
        query = query.eq('type', typeFilter);
      }
      
      const { data: properties, error } = await query;
      
      if (error) throw error;
      
      let filtered = properties || [];
      if (searchInput) {
        filtered = filtered.filter(p => 
          p.location.toLowerCase().includes(searchInput) ||
          p.title.toLowerCase().includes(searchInput)
        );
      }
      
      loading.style.display = 'none';
      
      if (filtered.length === 0) {
        noProperties.style.display = 'block';
        return;
      }
      
      grid.style.display = 'grid';
      grid.innerHTML = filtered.map(property => `
        <div class="property-card" style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); transition: transform 0.3s;">
          <div style="position: relative; height: 250px; overflow: hidden;">
            <img src="${property.image_url || 'https://via.placeholder.com/400x300'}" 
                 alt="${property.title}" 
                 style="width: 100%; height: 100%; object-fit: cover;">
            <div style="position: absolute; top: 15px; right: 15px; background: #134d37; color: white; padding: 8px 15px; border-radius: 20px; font-size: 14px; font-weight: 600;">
              ${property.type}
            </div>
          </div>
          <div style="padding: 25px;">
            <h3 style="font-size: 20px; color: #134d37; margin-bottom: 10px; font-weight: 600;">${property.title}</h3>
            <p style="color: #666; margin-bottom: 15px; display: flex; align-items: center; gap: 8px;">
              <i class="fas fa-map-marker-alt" style="color: #e4b04a;"></i>
              ${property.location}
            </p>
            <div style="display: flex; gap: 15px; margin-bottom: 15px; flex-wrap: wrap;">
              <span style="display: flex; align-items: center; gap: 5px; color: #666; font-size: 14px;">
                <i class="fas fa-ruler-combined" style="color: #134d37;"></i>
                ${property.size}
              </span>
            </div>
            ${property.features ? `
              <div style="margin-bottom: 15px;">
                ${property.features.split(',').slice(0, 3).map(feature => `
                  <span style="display: inline-block; background: #f0f9ff; color: #0369a1; padding: 4px 10px; border-radius: 12px; font-size: 12px; margin: 2px;">${feature.trim()}</span>
                `).join('')}
              </div>
            ` : ''}
            <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 15px; border-top: 1px solid #e0e0e0;">
              <div>
                <p style="color: #999; font-size: 12px; margin-bottom: 3px;">Price</p>
                <p style="color: #134d37; font-size: 24px; font-weight: 700;">${property.price}</p>
              </div>
              <a href="contact.html" style="background: #e4b04a; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; transition: all 0.3s;">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      `).join('');
      
      // Add hover effect
      document.querySelectorAll('.property-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
          this.style.transform = 'translateY(-5px)';
        });
        card.addEventListener('mouseleave', function() {
          this.style.transform = 'translateY(0)';
        });
      });
      
    } catch (error) {
      console.error('Error loading properties:', error);
      loading.style.display = 'none';
      noProperties.style.display = 'block';
      document.querySelector('#noProperties h3').textContent = 'Error Loading Properties';
      document.querySelector('#noProperties p').textContent = 'Please try again later';
    }
  };

  if (typeof window.getSupabaseClient !== 'undefined') {
    initPropertiesListing();
  }
})();
