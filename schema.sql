-- ==============================================================================
-- Teacher Transfer Management System (TTMS) / HRMS Assam - Supabase Schema
-- Project: HRMS (Ref: bvewsblubmivxbtaybaq)
-- ==============================================================================

-- 1. Teachers Table
CREATE TABLE IF NOT EXISTS public.teachers (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
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

-- 4. Admin Credentials Table
CREATE TABLE IF NOT EXISTS public.admin_users (
    id TEXT PRIMARY KEY DEFAULT 'admin_default',
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Row Level Security (RLS) Policies
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.officer_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all on teachers" ON public.teachers;
CREATE POLICY "Allow all on teachers" ON public.teachers FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all on documents" ON public.documents;
CREATE POLICY "Allow all on documents" ON public.documents FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all on officer_info" ON public.officer_info;
CREATE POLICY "Allow all on officer_info" ON public.officer_info FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all on admin_users" ON public.admin_users;
CREATE POLICY "Allow all on admin_users" ON public.admin_users FOR ALL USING (true) WITH CHECK (true);

-- 6. Supabase Storage Bucket for PDF & Asset Uploads
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

