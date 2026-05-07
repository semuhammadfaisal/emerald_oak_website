// Supabase Configuration
// Replace these with your actual Supabase credentials

window.SUPABASE_CONFIG = {
  url: 'https://aaujteknprpqzcfitlxc.supabase.co',
  anonKey: 'sb_publishable_Jd9hOdTUZRM7lPpMUG9s6A_qc6vuSxb'
};

// Initialize Supabase client
window.getSupabaseClient = function() {
  if (!window.supabaseClient) {
    window.supabaseClient = window.supabase.createClient(
      window.SUPABASE_CONFIG.url,
      window.SUPABASE_CONFIG.anonKey
    );
  }
  return window.supabaseClient;
};
