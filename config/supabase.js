// Supabase Configuration
// Replace these with your actual Supabase credentials

const SUPABASE_CONFIG = {
  url: 'https://aaujteknprpqzcfitlxc.supabase.co',
  anonKey: 'sb_publishable_Jd9hOdTUZRM7lPpMUG9s6A_qc6vuSxb'
};

// Initialize Supabase client
let supabase = null;

function initSupabase() {
  if (typeof supabase === 'undefined' || !supabase) {
    supabase = window.supabase.createClient(
      SUPABASE_CONFIG.url,
      SUPABASE_CONFIG.anonKey
    );
  }
  return supabase;
}

// Export for use in other files
window.SUPABASE_CONFIG = SUPABASE_CONFIG;
window.initSupabase = initSupabase;
