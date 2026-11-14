-- ==============================================================================
-- Teacher Transfer Management System (TTMS) / HRMS Assam - Supabase Schema
-- Project: HRMS (Ref: bvewsblubmivxbtaybaq)
-- ==============================================================================

-- 1. Teachers Table
CREATE TABLE IF NOT EXISTS public.teachers (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    mobile TEXT,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'teacher',
    department TEXT DEFAULT 'DEE',
    teacher_category TEXT DEFAULT 'Regular',
    designation TEXT,
    school TEXT,
    udise TEXT,
    district TEXT,
    block TEXT,
    app_number TEXT,
    app_type TEXT,
    status TEXT DEFAULT 'Pending',
    submitted_on TEXT,
    last_action_on TEXT,
    latest_remark TEXT,
    alert_title TEXT,
    alert_desc TEXT,
    emp_code TEXT,
    gender TEXT,
    category TEXT,
    date_of_joining TEXT,
    service_length TEXT,
    destination_school TEXT,
    preferences JSONB DEFAULT '[]'::jsonb,
    transfer_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Documents Table
CREATE TABLE IF NOT EXISTS public.documents (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES public.teachers(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category TEXT,
    ref_number TEXT,
    uploaded_by TEXT,
    uploaded_at TEXT,
    file_size TEXT,
    file_name TEXT,
    file_data TEXT,
    storage_url TEXT,
    file_type TEXT,
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Officer Info Table
CREATE TABLE IF NOT EXISTS public.officer_info (
    id TEXT PRIMARY KEY DEFAULT 'default',
    name TEXT NOT NULL,
    designation TEXT NOT NULL,
    department TEXT NOT NULL,
    role_tag TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Initial seed for state officers (DEE & SSA)
INSERT INTO public.officer_info (id, name, designation, department, role_tag)
VALUES 
  ('dee', 'Dr. S. K. Sarma, ACS', 'Director of Elementary Education', 'Directorate of Elementary Education, Kahilipara, Guwahati-19', 'State Approving Authority (DEE - Regular & Provincialised)'),
  ('ssa', 'Dr. Om Prakash, IAS', 'Mission Director, Samagra Shiksha Assam', 'Axom Sarba Siksha Abhiyan Mission, Kahilipara, Guwahati-19', 'State Approving Authority (SSA - Contractual)'),
  ('default', 'Dr. S. K. Sarma, ACS', 'Director of Elementary Education', 'Directorate of Elementary Education, Kahilipara, Guwahati-19', 'State Approving Authority (DEE - Regular & Provincialised)')
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, designation = EXCLUDED.designation, department = EXCLUDED.department, role_tag = EXCLUDED.role_tag, updated_at = NOW();

-- 4. Admin Credentials Table
CREATE TABLE IF NOT EXISTS public.admin_users (
    id TEXT PRIMARY KEY DEFAULT 'admin_default',
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    email TEXT,
    last_login TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Initial seed for admin credentials
INSERT INTO public.admin_users (id, username, password, name, role, email)
VALUES 
  ('admin_default', 'stateadmin', 'Alex#2027', 'State Administrator', 'super_admin', 'stateadmin.hrms@assam.gov.in'),
  ('admin_alias', 'admin', 'Alex#2027', 'Directorate Administrator', 'admin', 'admin.hrms@assam.gov.in')
ON CONFLICT (id) DO UPDATE 
SET username = EXCLUDED.username, password = EXCLUDED.password, updated_at = NOW();

-- 5. Activity / Audit Logs Table
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id TEXT,
    actor_name TEXT,
    actor_role TEXT,
    action_type TEXT NOT NULL,
    description TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. System Settings Table
CREATE TABLE IF NOT EXISTS public.system_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Initial seed data for system settings
INSERT INTO public.system_settings (key, value, description)
VALUES 
  ('portal_info', '{"title": "Teacher Transfer Management System (TTMS)", "state": "Assam", "portal_version": "2.4.0", "academic_year": "2026-2027", "helpline": "1800-345-3570", "email": "support.ttms@assam.gov.in"}'::jsonb, 'General portal configuration and metadata'),
  ('transfer_window', '{"is_open": true, "phase": "Phase 2 - Scrutiny & Order Generation", "start_date": "2026-02-01", "end_date": "2026-03-31"}'::jsonb, 'Current transfer application window status')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();

-- 7. Row Level Security (RLS) Policies
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.officer_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all on teachers" ON public.teachers;
CREATE POLICY "Allow all on teachers" ON public.teachers FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all on documents" ON public.documents;
CREATE POLICY "Allow all on documents" ON public.documents FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all on officer_info" ON public.officer_info;
CREATE POLICY "Allow all on officer_info" ON public.officer_info FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all on admin_users" ON public.admin_users;
CREATE POLICY "Allow all on admin_users" ON public.admin_users FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all on activity_logs" ON public.activity_logs;
CREATE POLICY "Allow all on activity_logs" ON public.activity_logs FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all on system_settings" ON public.system_settings;
CREATE POLICY "Allow all on system_settings" ON public.system_settings FOR ALL USING (true) WITH CHECK (true);

-- 8. High-Performance Indexes
CREATE INDEX IF NOT EXISTS idx_teachers_username ON public.teachers(username);
CREATE INDEX IF NOT EXISTS idx_teachers_status ON public.teachers(status);
CREATE INDEX IF NOT EXISTS idx_teachers_district ON public.teachers(district);
CREATE INDEX IF NOT EXISTS idx_teachers_dept ON public.teachers(department);
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON public.documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_category ON public.documents(category);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON public.activity_logs(created_at DESC);

-- 9. Supabase Storage Bucket for PDF & Asset Uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'assam-live-assets', 
  'assam-live-assets', 
  true, 
  52428800, -- 50MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf']::text[]
)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Policies
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload" ON storage.objects;
DROP POLICY IF EXISTS "Public Update" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete" ON storage.objects;

CREATE POLICY "Public Access" ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'assam-live-assets');

CREATE POLICY "Public Upload" ON storage.objects 
  FOR INSERT 
  WITH CHECK (bucket_id = 'assam-live-assets');

CREATE POLICY "Public Update" ON storage.objects 
  FOR UPDATE 
  USING (bucket_id = 'assam-live-assets');

CREATE POLICY "Public Delete" ON storage.objects 
  FOR DELETE 
  USING (bucket_id = 'assam-live-assets');

-- 10. Enable Supabase Realtime
DO $$
BEGIN
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.teachers;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.documents;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.officer_info;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.admin_users;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_logs;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.system_settings;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
END $$;
