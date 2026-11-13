const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

// Auto-load environment variables from .env if present
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split(/\r?\n/).forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const idx = trimmed.indexOf('=');
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
        if (key && process.env[key] === undefined) {
          process.env[key] = val;
        }
      }
    });
  } catch (e) {
    console.warn('Could not read .env file:', e);
  }
}

// Security Middleware: Prevent access to .env files
app.use((req, res, next) => {
  const parsedPath = req.path.toLowerCase();
  if (parsedPath.includes('.env') || parsedPath.includes('vercel recovery-codes')) {
    return res.status(403).send('Access Denied');
  }
  next();
});

// Step 3: Serve static files from workspace root
app.use(express.static(__dirname));

// Home route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// API Config Endpoint to safely expose Supabase public settings
app.get('/api/config', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.json({
    supabaseUrl: process.env.SUPABASE_URL || 'https://bvewsblubmivxbtaybaq.supabase.co',
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2ZXdzYmx1Ym1pdnhidGF5YmFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ1MzM4MjcsImV4cCI6MjExMDEwOTgyN30.9A85UHN0_GVMuodTF1NOILoM1RrO95vz___ppma1dM4',
    supabasePublishableKey: process.env.SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_gOHK06m4HiJrDIAHxtKajw_YpPEjhnR',
    projectName: process.env.SUPABASE_PROJECT_NAME || 'HRMS',
    projectRef: process.env.SUPABASE_PROJECT_ID || 'bvewsblubmivxbtaybaq',
    storageBucket: process.env.SUPABASE_STORAGE_BUCKET || 'assam-live-assets'
  });
});

// Fallback for single-page application navigation (Express v4 & v5 compatible)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Step 1: Export the app for Vercel serverless runtime and listen locally
module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Running locally on http://localhost:${PORT}`));
}
