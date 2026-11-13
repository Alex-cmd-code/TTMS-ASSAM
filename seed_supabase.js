const https = require('https');

const token = 'sbp_oauth_642a5804e97c0ce5454f0384a5faa002bf9dd4f1';
const ref = 'bvewsblubmivxbtaybaq';

function runSql(sql) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.supabase.com',
      path: '/v1/projects/' + ref + '/database/query',
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });
    req.on('error', reject);
    req.write(JSON.stringify({ query: sql }));
    req.end();
  });
}

const seedSql = `
-- 1. Seed Officer Info
INSERT INTO public.officer_info (id, name, designation, department, role_tag)
VALUES (
  'default',
  'Dr. S. K. Sarma, ACS',
  'Director of Elementary Education',
  'Government of Assam, Kahilipara, Guwahati-19',
  'State Approving Authority (Directorate Level)'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  designation = EXCLUDED.designation,
  department = EXCLUDED.department,
  role_tag = EXCLUDED.role_tag,
  updated_at = NOW();

-- 2. Seed Admin User
INSERT INTO public.admin_users (id, username, password, name, role)
VALUES (
  'admin_default',
  'admin',
  'admin123',
  'State Nodal Officer',
  'admin'
)
ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  password = EXCLUDED.password,
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  updated_at = NOW();

-- 3. Seed Teachers
INSERT INTO public.teachers (
  id, username, password, name, role, department, teacher_category, designation,
  school, udise, district, block, app_number, app_type, status,
  submitted_on, last_action_on, latest_remark, alert_title, alert_desc,
  emp_code, gender, category, date_of_joining, service_length, destination_school,
  preferences, transfer_reason
) VALUES 
(
  'usr_manjit',
  '9706189883',
  'password123',
  'MANJIT PATGIRI',
  'teacher',
  'DEE',
  'Regular (SRD)',
  'Assistant Teacher of LPS (SRD)',
  'PACHIM BARTARY LPS',
  '18050214801',
  'Barpeta',
  'Chenga',
  'Intra/EE-001-0013351',
  'Intra-district transfer',
  'Pending',
  '19-02-2026',
  '19-02-2026',
  'Direct Forward to AA',
  'Verification is in progress',
  'The request has been forwarded to the concerned authority for further verification.',
  'TET-2014-99812',
  'Male',
  'General',
  '15-09-2014',
  '11 Years 5 Months',
  'Dakshin Bartary Milan LPS (Chenga Block)',
  '[]'::jsonb,
  ''
),
(
  'usr_bijoy',
  '9864012345',
  'password123',
  'BIJOY KR. BARMAN',
  'teacher',
  'DEE',
  'Regular',
  'Assistant Teacher of LPS',
  'RANGIA MODEL LPS',
  '18060104802',
  'Kamrup (Rural)',
  'Rangia',
  'Inter/EE-002-0044129',
  'Inter-district transfer',
  'Approved',
  '15-02-2026',
  '20-02-2026',
  'Transfer Order Issued by DEE',
  'Transfer Application Approved',
  'The competent authority has approved your transfer order. Please download the signed order below.',
  'TET-2017-48210',
  'Male',
  'OBC',
  '02-03-2017',
  '9 Years',
  'Hajo Primary School (Kamrup)',
  '[]'::jsonb,
  ''
),
(
  'usr_anupama',
  '9435012345',
  'password123',
  'ANUPAMA KALITA',
  'teacher',
  'SSA',
  'Contractual',
  'Contractual Assistant Teacher of UPS (SSA)',
  'CHENGA MODEL UPPER PRIMARY SCHOOL',
  '18050215902',
  'Barpeta',
  'Chenga',
  'Intra/EE-003-0091823',
  'Intra-district transfer',
  'Pending',
  '18-02-2026',
  '20-02-2026',
  'Forwarded to SSA Sanction Committee',
  'Verification is in progress',
  'Application is being reviewed by the SSA Sanction Committee under Samagra Shiksha Assam.',
  'SSA-CON-2018-4091',
  'Female',
  'General',
  '12-08-2018',
  '7 Years 6 Months',
  'Sarthebari Girls UPS (Chenga)',
  '["Sarthebari Girls UPS (Chenga)", "Bhella MV School (Barpeta)", "Barpeta Town High School"]'::jsonb,
  'Distance from domicile & spouse working nearby'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  department = EXCLUDED.department,
  teacher_category = EXCLUDED.teacher_category,
  designation = EXCLUDED.designation,
  status = EXCLUDED.status,
  updated_at = NOW();

-- 4. Seed Documents
INSERT INTO public.documents (
  id, user_id, title, category, ref_number, uploaded_by, uploaded_at, file_size, file_name, file_data, remarks
) VALUES
(
  'doc_manjit_1',
  'usr_manjit',
  'Official General Transfer Order & Relieving Note',
  'Transfer Order',
  'No. E-28841/TTMS/2026/013351',
  'Directorate of Elementary Education, Govt of Assam',
  '19-02-2026 14:30 IST',
  '342 KB',
  'Transfer_Order_Intra_EE_001_0013351.pdf',
  NULL,
  'Transferred to Dakshin Bartary Milan LPS on administrative review.'
),
(
  'doc_bijoy_1',
  'usr_bijoy',
  'Final Approved Inter-District Transfer Notification',
  'Transfer Order',
  'No. E-29104/TTMS/2026/0044129',
  'Directorate of Elementary Education, Govt of Assam',
  '20-02-2026 11:15 IST',
  '390 KB',
  'Approved_Order_Inter_EE_002_0044129.pdf',
  NULL,
  'Report to the District Elementary Education Officer within 7 days.'
)
ON CONFLICT (id) DO NOTHING;
`;

async function main() {
  console.log('Seeding Supabase HRMS tables...');
  const res = await runSql(seedSql);
  console.log('Seed response:', res);
}

main().catch(console.error);
