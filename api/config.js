module.exports = (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({
    supabaseUrl: process.env.SUPABASE_URL || 'https://bvewsblubmivxbtaybaq.supabase.co',
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2ZXdzYmx1Ym1pdnhidGF5YmFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ1MzM4MjcsImV4cCI6MjExMDEwOTgyN30.9A85UHN0_GVMuodTF1NOILoM1RrO95vz___ppma1dM4',
    supabasePublishableKey: process.env.SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_gOHK06m4HiJrDIAHxtKajw_YpPEjhnR',
    projectName: process.env.SUPABASE_PROJECT_NAME || 'HRMS',
    projectRef: process.env.SUPABASE_PROJECT_ID || 'bvewsblubmivxbtaybaq',
    storageBucket: process.env.SUPABASE_STORAGE_BUCKET || 'assam-live-assets'
  });
};

