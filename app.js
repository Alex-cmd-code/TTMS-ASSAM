/**
 * Teacher Transfer Management System (TTMS) - Government of Assam
 * Complete Application Logic, State Management, PDF Generation & Persistence
 */

(function () {
  'use strict';

  // ==========================================
  // 1. INITIAL STATE & SEED DATA
  // ==========================================
  const STORAGE_KEY_USERS = 'ttms_assam_users_v2';
  const STORAGE_KEY_SESSION = 'ttms_assam_session_v2';

  const DEFAULT_USERS = [
    {
      id: 'usr_manjit',
      username: '9706189883',
      password: 'password123',
      name: 'MANJIT PATGIRI',
      role: 'teacher',
      department: 'DEE',
      teacherCategory: 'Regular (SRD)',
      designation: 'Assistant Teacher of LPS (SRD)',
      school: 'PACHIM BARTARY LPS',
      udise: '18050214801',
      district: 'Barpeta',
      block: 'Chenga',
      appNumber: 'Intra/EE-001-0013351',
      appType: 'Intra-district transfer',
      status: 'Pending',
      submittedOn: '19-02-2026',
      lastActionOn: '19-02-2026',
      latestRemark: 'Direct Forward to AA',
      alertTitle: 'Verification is in progress',
      alertDesc: 'The request has been forwarded to the concerned authority for further verification.',
      empCode: 'TET-2014-99812',
      gender: 'Male',
      category: 'General',
      dateOfJoining: '15-09-2014',
      serviceLength: '11 Years 5 Months',
      destinationSchool: 'Dakshin Bartary Milan LPS (Chenga Block)',
      documents: [
        {
          id: 'doc_manjit_1',
          title: 'Official General Transfer Order & Relieving Note',
          category: 'Transfer Order',
          refNumber: 'No. E-28841/TTMS/2026/013351',
          uploadedBy: 'Directorate of Elementary Education, Govt of Assam',
          uploadedAt: '19-02-2026 14:30 IST',
          fileSize: '342 KB',
          fileName: 'Transfer_Order_Intra_EE_001_0013351.pdf',
          fileData: null,
          remarks: 'Transferred to Dakshin Bartary Milan LPS on administrative review.'
        }
      ]
    },
    {
      id: 'usr_bijoy',
      username: '9864012345',
      password: 'password123',
      name: 'BIJOY KR. BARMAN',
      role: 'teacher',
      department: 'DEE',
      teacherCategory: 'Regular',
      designation: 'Assistant Teacher of LPS',
      school: 'RANGIA MODEL LPS',
      udise: '18060104802',
      district: 'Kamrup (Rural)',
      block: 'Rangia',
      appNumber: 'Inter/EE-002-0044129',
      appType: 'Inter-district transfer',
      status: 'Approved',
      submittedOn: '15-02-2026',
      lastActionOn: '20-02-2026',
      latestRemark: 'Transfer Order Issued by DEE',
      alertTitle: 'Transfer Application Approved',
      alertDesc: 'The competent authority has approved your transfer order. Please download the signed order below.',
      empCode: 'TET-2017-48210',
      gender: 'Male',
      category: 'OBC',
      dateOfJoining: '02-03-2017',
      serviceLength: '9 Years',
      destinationSchool: 'Hajo Primary School (Kamrup)',
      documents: [
        {
          id: 'doc_bijoy_1',
          title: 'Final Approved Inter-District Transfer Notification',
          category: 'Transfer Order',
          refNumber: 'No. E-29104/TTMS/2026/0044129',
          uploadedBy: 'Directorate of Elementary Education, Govt of Assam',
          uploadedAt: '20-02-2026 11:15 IST',
          fileSize: '390 KB',
          fileName: 'Approved_Order_Inter_EE_002_0044129.pdf',
          fileData: null,
          remarks: 'Report to the District Elementary Education Officer within 7 days.'
        }
      ]
    },
    {
      id: 'usr_anupama',
      username: '9435012345',
      password: 'password123',
      name: 'ANUPAMA KALITA',
      role: 'teacher',
      department: 'SSA',
      teacherCategory: 'Contractual',
      designation: 'Contractual Assistant Teacher of UPS (SSA)',
      school: 'CHENGA MODEL UPPER PRIMARY SCHOOL',
      udise: '18050215902',
      district: 'Barpeta',
      block: 'Chenga',
      appNumber: 'Intra/EE-003-0091823',
      appType: 'Intra-district transfer',
      status: 'Pending',
      submittedOn: '18-02-2026',
      lastActionOn: '20-02-2026',
      latestRemark: 'Forwarded to SSA Sanction Committee',
      alertTitle: 'Verification is in progress',
      alertDesc: 'Application is being reviewed by the SSA Sanction Committee under Samagra Shiksha Assam.',
      empCode: 'SSA-CON-2018-4091',
      gender: 'Female',
      category: 'General',
      dateOfJoining: '12-08-2018',
      serviceLength: '7 Years 6 Months',
      destinationSchool: 'Sarthebari Girls UPS (Chenga)',
      preferences: [
        'Sarthebari Girls UPS (Chenga)',
        'Bhella MV School (Barpeta)',
        'Barpeta Town High School'
      ],
      transferReason: 'Distance from domicile & spouse working nearby',
      documents: []
    }
  ];

  const ADMIN_CREDENTIALS = {
    username: 'stateadmin',
    password: 'Alex#2027',
    name: 'State Nodal Officer',
    role: 'admin'
  };

  const STORAGE_KEY_ADMIN_SESSION = 'ttms_assam_admin_session_v2';
  const STORAGE_KEY_OFFICER = 'ttms_assam_officer_info_v2';
  const STORAGE_KEY_OFFICERS_DUAL = 'ttms_assam_officers_dual_v2';

  const DEFAULT_OFFICERS = {
    dee: {
      id: 'dee',
      departmentKey: 'DEE',
      name: 'Dr. S. K. Sarma, ACS',
      designation: 'Director of Elementary Education',
      department: 'Directorate of Elementary Education, Kahilipara, Guwahati-19',
      roleTag: 'State Approving Authority (DEE - Regular & Provincialised)'
    },
    ssa: {
      id: 'ssa',
      departmentKey: 'SSA',
      name: 'Dr. Om Prakash, IAS',
      designation: 'Mission Director, Samagra Shiksha Assam',
      department: 'Axom Sarba Siksha Abhiyan Mission, Kahilipara, Guwahati-19',
      roleTag: 'State Approving Authority (SSA - Contractual)'
    }
  };

  const DEFAULT_OFFICER = DEFAULT_OFFICERS.dee;

  // State in memory
  let usersList = [];
  let currentSession = null;
  let activeCaptchaCode = '';
  let pendingUploadedFile = null;
  let isAdminPreview = false;
  let previewingTeacherId = null;
  let currentWorkflowFilter = 'all';
  let stateOfficers = {
    dee: { ...DEFAULT_OFFICERS.dee },
    ssa: { ...DEFAULT_OFFICERS.ssa }
  };
  let officerInfo = stateOfficers.dee;

  // ==========================================
  // 2. STORAGE & STRING UTILITIES
  // ==========================================
  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * Helper: Determine Teacher Department (DEE or SSA)
   * Rule: Contractual teachers belong to SSA. Rest others belong to DEE.
   */
  function getTeacherDepartment(user) {
    if (!user) return 'DEE';
    if (user.department === 'SSA') return 'SSA';
    if (user.department === 'DEE') return 'DEE';
    const cat = (user.teacherCategory || '').toLowerCase();
    const des = (user.designation || '').toLowerCase();
    if (cat.includes('contract') || cat.includes('ssa') || des.includes('contract') || des.includes('ssa')) {
      return 'SSA';
    }
    return 'DEE';
  }

  /**
   * Helper: Get formatted Teacher Category / Cadre Label
   */
  function getTeacherCategoryLabel(user) {
    if (!user) return 'Regular Teacher (DEE)';
    const dept = getTeacherDepartment(user);
    if (dept === 'SSA') return 'Contractual Teacher (SSA)';
    if (user.teacherCategory) {
      if (user.teacherCategory.toLowerCase().includes('contract')) return 'Contractual Teacher (SSA)';
      if (user.teacherCategory.toLowerCase().includes('srd')) return 'Regular / SRD (DEE)';
      return `${user.teacherCategory} (DEE)`;
    }
    const des = (user.designation || '').toLowerCase();
    if (des.includes('srd')) return 'Regular / SRD (DEE)';
    if (des.includes('provincial')) return 'Provincialised (DEE)';
    return 'Regular Teacher (DEE)';
  }

  /**
   * Helper: Get State Officer by Department ('DEE' or 'SSA')
   */
  function getOfficerByDept(dept) {
    if (!stateOfficers || !stateOfficers.dee) loadOfficerInfo();
    if (String(dept).toUpperCase() === 'SSA') return stateOfficers.ssa;
    return stateOfficers.dee;
  }

  /**
   * Helper: Get State Officer applicable for a specific Teacher
   */
  function getOfficerForTeacher(user) {
    const dept = getTeacherDepartment(user);
    return getOfficerByDept(dept);
  }

  function getStatusMeta(status) {
    const s = (status || 'Pending').trim();
    if (s === 'Approved') {
      return { cls: 'status-approved', icon: '✓', label: 'Approved' };
    }
    if (s === 'Rejected') {
      return { cls: 'status-rejected', icon: '✕', label: 'Rejected' };
    }
    if (s.includes('Forward') || s.includes('AA')) {
      return { cls: 'status-forwarded', icon: '➔', label: s };
    }
    if (s === 'Under Scrutiny') {
      return { cls: 'status-scrutiny', icon: '🔍', label: 'Under Scrutiny' };
    }
    if (s.includes('Correction')) {
      return { cls: 'status-correction', icon: '⚠️', label: 'Correction Required' };
    }
    return { cls: 'status-pending', icon: '⏳', label: s || 'Pending' };
  }

  // ==========================================
  // SUPABASE CONFIGURATION (Project: HRMS)
  // Ref: bvewsblubmivxbtaybaq
  // Tables: teachers, documents, officer_info, admin_users
  // Storage: assam-live-assets
  // ==========================================
  const SUPABASE_CONFIG = {
    url: 'https://bvewsblubmivxbtaybaq.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2ZXdzYmx1Ym1pdnhidGF5YmFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ1MzM4MjcsImV4cCI6MjExMDEwOTgyN30.9A85UHN0_GVMuodTF1NOILoM1RrO95vz___ppma1dM4',
    projectName: 'HRMS',
    projectRef: 'bvewsblubmivxbtaybaq',
    storageBucket: 'assam-live-assets'
  };

  let supabaseClient = null;
  function getSupabase() {
    if (!supabaseClient && window.supabase && typeof window.supabase.createClient === 'function') {
      try {
        supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
        console.log(`[Supabase] Active connection to project: ${SUPABASE_CONFIG.projectName} (${SUPABASE_CONFIG.projectRef})`);
      } catch (err) {
        console.warn('[Supabase] Failed to initialize client:', err);
      }
    }
    return supabaseClient;
  }

  function mapDocFromSupabase(d) {
    return {
      id: d.id,
      title: d.title || 'Document',
      category: d.category || 'General',
      refNumber: d.ref_number || '',
      uploadedBy: d.uploaded_by || 'Government of Assam',
      uploadedAt: d.uploaded_at || '',
      fileSize: d.file_size || '340 KB',
      fileName: d.file_name || 'Document.pdf',
      fileData: d.file_data || null,
      storageUrl: d.storage_url || (d.file_data && d.file_data.startsWith('http') ? d.file_data : null),
      remarks: d.remarks || ''
    };
  }

  function mapTeacherFromSupabase(row) {
    let docs = [];
    if (Array.isArray(row.documents)) {
      docs = row.documents.map(mapDocFromSupabase);
    }
    return {
      id: row.id,
      username: row.username,
      mobile: row.mobile || row.username,
      password: row.password,
      name: row.name,
      role: row.role || 'teacher',
      department: row.department || 'DEE',
      teacherCategory: row.teacher_category || 'Regular',
      designation: row.designation || '',
      school: row.school || '',
      udise: row.udise || '',
      district: row.district || '',
      block: row.block || '',
      appNumber: row.app_number || '',
      appType: row.app_type || 'Intra-district transfer',
      status: row.status || 'Pending',
      submittedOn: row.submitted_on || '',
      lastActionOn: row.last_action_on || '',
      latestRemark: row.latest_remark || '',
      alertTitle: row.alert_title || '',
      alertDesc: row.alert_desc || '',
      empCode: row.emp_code || '',
      gender: row.gender || 'Male',
      category: row.category || 'General',
      dateOfJoining: row.date_of_joining || '',
      serviceLength: row.service_length || '',
      destinationSchool: row.destination_school || '',
      preferences: Array.isArray(row.preferences) ? row.preferences : [],
      transferReason: row.transfer_reason || '',
      documents: docs
    };
  }

  function mapTeacherToSupabase(u) {
    return {
      id: u.id,
      username: u.username,
      mobile: u.mobile || u.username,
      password: u.password,
      name: u.name,
      role: u.role || 'teacher',
      department: getTeacherDepartment(u),
      teacher_category: u.teacherCategory || 'Regular',
      designation: u.designation || '',
      school: u.school || '',
      udise: u.udise || '',
      district: u.district || '',
      block: u.block || '',
      app_number: u.appNumber || '',
      app_type: u.appType || 'Intra-district transfer',
      status: u.status || 'Pending',
      submitted_on: u.submittedOn || '',
      last_action_on: u.lastActionOn || '',
      latest_remark: u.latestRemark || '',
      alert_title: u.alertTitle || '',
      alert_desc: u.alertDesc || '',
      emp_code: u.empCode || '',
      gender: u.gender || '',
      category: u.category || '',
      date_of_joining: u.dateOfJoining || '',
      service_length: u.serviceLength || '',
      destination_school: u.destinationSchool || '',
      preferences: Array.isArray(u.preferences) ? u.preferences : [],
      transfer_reason: u.transferReason || '',
      updated_at: new Date().toISOString()
    };
  }

  function mapDocToSupabase(doc, userId) {
    return {
      id: doc.id,
      user_id: userId,
      title: doc.title,
      category: doc.category || 'General',
      ref_number: doc.refNumber || '',
      uploaded_by: doc.uploadedBy || 'Government of Assam',
      uploaded_at: doc.uploadedAt || '',
      file_size: doc.fileSize || '340 KB',
      file_name: doc.fileName || 'Document.pdf',
      file_data: doc.fileData || null,
      storage_url: doc.storageUrl || (doc.fileData && doc.fileData.startsWith('http') ? doc.fileData : null),
      file_type: 'application/pdf',
      remarks: doc.remarks || ''
    };
  }

  function updateSupabaseStatusPill(isConnected, isSyncing = false) {
    const pill = document.getElementById('supabaseStatusPill');
    if (!pill) return;
    if (isSyncing) {
      pill.className = 'supabase-status-pill syncing';
      pill.innerHTML = '<span class="status-dot"></span> Supabase: Syncing...';
    } else if (isConnected) {
      pill.className = 'supabase-status-pill';
      pill.innerHTML = '<span class="status-dot"></span> Supabase: HRMS (Live)';
    } else {
      pill.className = 'supabase-status-pill';
      pill.innerHTML = '<span class="status-dot"></span> Supabase: HRMS';
    }
  }

  let isFetchingSupabase = false;
  async function syncUsersFromSupabase() {
    const client = getSupabase();
    if (!client || isFetchingSupabase) return;
    try {
      isFetchingSupabase = true;
      updateSupabaseStatusPill(true, true);
      const { data, error } = await client
        .from('teachers')
        .select('*, documents(*)');

      if (!error && Array.isArray(data) && data.length > 0) {
        usersList = data.map(mapTeacherFromSupabase);
        localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(usersList));
        updateSupabaseStatusPill(true, false);

        // Refresh views if rendered
        const adminView = document.getElementById('viewAdminDashboard');
        const teacherView = document.getElementById('viewTeacherDashboard');
        if (adminView && adminView.classList.contains('active-view')) {
          renderAdminDashboard();
        } else if (teacherView && teacherView.classList.contains('active-view')) {
          renderTeacherDashboard();
        }
      } else {
        updateSupabaseStatusPill(true, false);
      }
    } catch (e) {
      console.warn('[Supabase] Failed to sync users from Supabase:', e);
      updateSupabaseStatusPill(false, false);
    } finally {
      isFetchingSupabase = false;
    }
  }

  let syncDebounceTimer = null;
  function syncUsersToSupabase() {
    const client = getSupabase();
    if (!client) return;

    if (syncDebounceTimer) clearTimeout(syncDebounceTimer);
    syncDebounceTimer = setTimeout(async () => {
      try {
        updateSupabaseStatusPill(true, true);
        for (const user of usersList) {
          const teacherPayload = mapTeacherToSupabase(user);
          await client.from('teachers').upsert(teacherPayload, { onConflict: 'id' });
          if (Array.isArray(user.documents)) {
            for (const doc of user.documents) {
              const docPayload = mapDocToSupabase(doc, user.id);
              await client.from('documents').upsert(docPayload, { onConflict: 'id' });
            }
          }
        }
        updateSupabaseStatusPill(true, false);
      } catch (err) {
        console.warn('[Supabase] Error syncing to Supabase:', err);
        updateSupabaseStatusPill(true, false);
      }
    }, 400);
  }

  // Sync Officer Info from Supabase HRMS (Both DEE & SSA)
  async function syncOfficerFromSupabase() {
    const client = getSupabase();
    if (!client) return;
    try {
      const { data, error } = await client
        .from('officer_info')
        .select('*');

      if (!error && Array.isArray(data) && data.length > 0) {
        const deeRow = data.find(r => r.id === 'dee') || data.find(r => r.id === 'default');
        const ssaRow = data.find(r => r.id === 'ssa');

        if (deeRow) {
          stateOfficers.dee = {
            id: 'dee',
            departmentKey: 'DEE',
            name: deeRow.name || DEFAULT_OFFICERS.dee.name,
            designation: deeRow.designation || DEFAULT_OFFICERS.dee.designation,
            department: deeRow.department || DEFAULT_OFFICERS.dee.department,
            roleTag: deeRow.role_tag || DEFAULT_OFFICERS.dee.roleTag
          };
        }

        if (ssaRow) {
          stateOfficers.ssa = {
            id: 'ssa',
            departmentKey: 'SSA',
            name: ssaRow.name || DEFAULT_OFFICERS.ssa.name,
            designation: ssaRow.designation || DEFAULT_OFFICERS.ssa.designation,
            department: ssaRow.department || DEFAULT_OFFICERS.ssa.department,
            roleTag: ssaRow.role_tag || DEFAULT_OFFICERS.ssa.roleTag
          };
        }

        officerInfo = stateOfficers.dee;
        try {
          localStorage.setItem(STORAGE_KEY_OFFICERS_DUAL, JSON.stringify(stateOfficers));
          localStorage.setItem(STORAGE_KEY_OFFICER, JSON.stringify(officerInfo));
        } catch (e) { }

        ADMIN_CREDENTIALS.name = stateOfficers.dee.name;
        updateOfficerDisplays();
      }
    } catch (e) {
      console.warn('[Supabase] Failed to sync officer info:', e);
    }
  }

  // Sync Officer Info to Supabase HRMS (Both DEE & SSA)
  async function syncOfficerToSupabase() {
    const client = getSupabase();
    if (!client || !stateOfficers) return;
    try {
      await client.from('officer_info').upsert([
        {
          id: 'dee',
          name: stateOfficers.dee.name,
          designation: stateOfficers.dee.designation,
          department: stateOfficers.dee.department,
          role_tag: stateOfficers.dee.roleTag,
          updated_at: new Date().toISOString()
        },
        {
          id: 'ssa',
          name: stateOfficers.ssa.name,
          designation: stateOfficers.ssa.designation,
          department: stateOfficers.ssa.department,
          role_tag: stateOfficers.ssa.roleTag,
          updated_at: new Date().toISOString()
        },
        {
          id: 'default',
          name: stateOfficers.dee.name,
          designation: stateOfficers.dee.designation,
          department: stateOfficers.dee.department,
          role_tag: stateOfficers.dee.roleTag,
          updated_at: new Date().toISOString()
        }
      ], { onConflict: 'id' });
      console.log('[Supabase] Both DEE & SSA State Officers synced to cloud.');
    } catch (err) {
      console.warn('[Supabase] Error syncing officer info:', err);
    }
  }

  // System & Activity Audit Logging in Supabase HRMS
  async function logActivity(actionType, description, metadata = {}, targetUserId = null) {
    const client = getSupabase();
    if (!client) return;
    try {
      const actorName = (currentSession && currentSession.name) ? currentSession.name : (officerInfo ? officerInfo.name : 'State Nodal Officer');
      const actorRole = (currentSession && currentSession.role) ? currentSession.role : 'admin';
      await client.from('activity_logs').insert({
        user_id: targetUserId || (currentSession ? currentSession.id : null),
        actor_name: actorName,
        actor_role: actorRole,
        action_type: actionType,
        description: description,
        metadata: metadata,
        created_at: new Date().toISOString()
      });
    } catch (err) {
      console.warn('[Supabase] Activity log error:', err);
    }
  }

  // Supabase Realtime Channel
  let supabaseRealtimeChannel = null;
  function initSupabaseRealtime() {
    const client = getSupabase();
    if (!client || supabaseRealtimeChannel) return;
    try {
      supabaseRealtimeChannel = client
        .channel('hrms-live-sync')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'teachers' }, (payload) => {
          console.log('[Supabase Realtime] Teachers table updated:', payload.eventType);
          syncUsersFromSupabase();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'documents' }, (payload) => {
          console.log('[Supabase Realtime] Documents table updated:', payload.eventType);
          syncUsersFromSupabase();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'officer_info' }, (payload) => {
          console.log('[Supabase Realtime] Officer info updated:', payload.eventType);
          syncOfficerFromSupabase();
        })
        .subscribe((status) => {
          console.log(`[Supabase Realtime] Channel subscription status: ${status}`);
          if (status === 'SUBSCRIBED') {
            updateSupabaseStatusPill(true, false);
          }
        });
    } catch (err) {
      console.warn('[Supabase Realtime] Init error:', err);
    }
  }

  function loadUsers() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_USERS);
      if (data) {
        usersList = JSON.parse(data);
        // Automatic category / department synchronization for all loaded records
        let updated = false;
        usersList.forEach(u => {
          const dept = getTeacherDepartment(u);
          if (u.department !== dept) {
            u.department = dept;
            updated = true;
          }
          if (!u.teacherCategory) {
            u.teacherCategory = dept === 'SSA' ? 'Contractual' : 'Regular';
            updated = true;
          }
        });
        // Ensure SSA contractual sample exists if not present
        if (!usersList.some(u => getTeacherDepartment(u) === 'SSA')) {
          const ssaSeed = DEFAULT_USERS.find(u => u.department === 'SSA');
          if (ssaSeed) {
            usersList.push(JSON.parse(JSON.stringify(ssaSeed)));
            updated = true;
          }
        }
        if (updated) {
          saveUsers();
        }
      } else {
        usersList = JSON.parse(JSON.stringify(DEFAULT_USERS));
        saveUsers();
      }
    } catch (e) {
      console.error('Error loading users:', e);
      usersList = JSON.parse(JSON.stringify(DEFAULT_USERS));
    }

    // Seamless asynchronous sync from Supabase HRMS
    syncUsersFromSupabase();
  }

  function saveUsers() {
    try {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(usersList));
    } catch (e) {
      console.error('Error saving users to localStorage:', e);
    }

    // Cloud sync to Supabase HRMS database
    syncUsersToSupabase();
  }

  function isTeacherLoggedIn() {
    if (isAdminPreview) return false;
    return !!(currentSession && currentSession.role === 'teacher');
  }

  function loadSession() {
    try {
      const sess = sessionStorage.getItem(STORAGE_KEY_SESSION) || localStorage.getItem(STORAGE_KEY_SESSION);
      if (sess) {
        currentSession = JSON.parse(sess);
      }
    } catch (e) {
      currentSession = null;
    }
  }

  function saveSession(user) {
    currentSession = user;
    try {
      sessionStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(user));
    } catch (e) { }
  }

  function clearSession() {
    currentSession = null;
    if (countdownTimerInterval) {
      clearInterval(countdownTimerInterval);
      countdownTimerInterval = null;
    }
    try {
      sessionStorage.removeItem(STORAGE_KEY_SESSION);
      localStorage.removeItem(STORAGE_KEY_SESSION);
    } catch (e) { }
  }

  function isAdminLoggedIn() {
    if (currentSession && currentSession.role === 'teacher') return false;
    if (currentSession && currentSession.role === 'admin') return true;
    try {
      const savedAdmin = sessionStorage.getItem(STORAGE_KEY_ADMIN_SESSION) || localStorage.getItem(STORAGE_KEY_ADMIN_SESSION);
      if (savedAdmin) return true;
    } catch (e) { }
    return false;
  }

  function saveAdminSession() {
    try {
      sessionStorage.setItem(STORAGE_KEY_ADMIN_SESSION, JSON.stringify(ADMIN_CREDENTIALS));
      localStorage.setItem(STORAGE_KEY_ADMIN_SESSION, JSON.stringify(ADMIN_CREDENTIALS));
    } catch (e) { }
  }

  function clearAdminSession() {
    try {
      sessionStorage.removeItem(STORAGE_KEY_ADMIN_SESSION);
      localStorage.removeItem(STORAGE_KEY_ADMIN_SESSION);
    } catch (e) { }
  }

  function loadOfficerInfo() {
    try {
      const dualData = localStorage.getItem(STORAGE_KEY_OFFICERS_DUAL);
      if (dualData) {
        stateOfficers = JSON.parse(dualData);
        if (!stateOfficers.dee) stateOfficers.dee = { ...DEFAULT_OFFICERS.dee };
        if (!stateOfficers.ssa) stateOfficers.ssa = { ...DEFAULT_OFFICERS.ssa };
      } else {
        const legacyData = localStorage.getItem(STORAGE_KEY_OFFICER);
        if (legacyData) {
          const parsed = JSON.parse(legacyData);
          stateOfficers = {
            dee: { ...DEFAULT_OFFICERS.dee, ...parsed },
            ssa: { ...DEFAULT_OFFICERS.ssa }
          };
        } else {
          stateOfficers = {
            dee: { ...DEFAULT_OFFICERS.dee },
            ssa: { ...DEFAULT_OFFICERS.ssa }
          };
        }
        saveOfficerInfo();
      }
    } catch (e) {
      stateOfficers = {
        dee: { ...DEFAULT_OFFICERS.dee },
        ssa: { ...DEFAULT_OFFICERS.ssa }
      };
    }
    officerInfo = stateOfficers.dee;
    if (officerInfo && officerInfo.name) {
      ADMIN_CREDENTIALS.name = officerInfo.name;
    }

    // Cloud sync from Supabase HRMS
    syncOfficerFromSupabase();
  }

  function saveOfficerInfo() {
    try {
      localStorage.setItem(STORAGE_KEY_OFFICERS_DUAL, JSON.stringify(stateOfficers));
      localStorage.setItem(STORAGE_KEY_OFFICER, JSON.stringify(stateOfficers.dee));
    } catch (e) { }
    officerInfo = stateOfficers.dee;
    if (officerInfo && officerInfo.name) {
      ADMIN_CREDENTIALS.name = officerInfo.name;
    }

    // Cloud sync to Supabase HRMS
    syncOfficerToSupabase();
  }

  function updateOfficerDisplays(targetUser = null) {
    if (!stateOfficers || !stateOfficers.dee) loadOfficerInfo();

    // 1. Admin Header Pills (Both DEE & SSA)
    const elDEE = document.getElementById('adminOfficerDEEDisplay');
    if (elDEE) {
      elDEE.textContent = `${stateOfficers.dee.name} (Director)`;
    }
    const elSSA = document.getElementById('adminOfficerSSADisplay');
    if (elSSA) {
      elSSA.textContent = `${stateOfficers.ssa.name} (Mission Director)`;
    }
    const legacyHeader = document.getElementById('adminOfficerNameDisplay');
    if (legacyHeader) {
      legacyHeader.textContent = `DEE: ${stateOfficers.dee.name} | SSA: ${stateOfficers.ssa.name}`;
    }

    // 2. Admin Home Banner Chips (Both DEE & SSA)
    const chipDEE = document.getElementById('bannerOfficerNameDEE');
    if (chipDEE) {
      chipDEE.textContent = stateOfficers.dee.name;
    }
    const chipSSA = document.getElementById('bannerOfficerNameSSA');
    if (chipSSA) {
      chipSSA.textContent = stateOfficers.ssa.name;
    }
    const bannerOfficerChip = document.getElementById('bannerOfficerName');
    if (bannerOfficerChip) {
      bannerOfficerChip.textContent = `${stateOfficers.dee.name} & ${stateOfficers.ssa.name}`;
    }

    // 3. Quick Hub Button Subtitles (Both DEE & SSA)
    const hubDEE = document.getElementById('hubOfficerDEEPreview');
    if (hubDEE) {
      hubDEE.textContent = `${stateOfficers.dee.name} (Director)`;
    }
    const hubSSA = document.getElementById('hubOfficerSSAPreview');
    if (hubSSA) {
      hubSSA.textContent = `${stateOfficers.ssa.name} (Mission Director)`;
    }
    const legacyHub = document.getElementById('hubOfficerNamePreview');
    if (legacyHub) {
      legacyHub.textContent = `DEE: ${stateOfficers.dee.name} • SSA: ${stateOfficers.ssa.name}`;
    }

    // 4. Modal Paper Preview Signatory (Department specific for teacher)
    const activeTeacher = targetUser || activePreviewUser;
    const teacherDept = getTeacherDepartment(activeTeacher);
    const applicableOfficer = (teacherDept === 'SSA') ? stateOfficers.ssa : stateOfficers.dee;

    const previewStamp = document.getElementById('previewStampBy');
    if (previewStamp) {
      previewStamp.textContent = applicableOfficer.designation;
    }
    const previewSignatory = document.getElementById('previewSignatoryName');
    if (previewSignatory) {
      previewSignatory.textContent = `(${applicableOfficer.name})`;
    }
    const previewPost = document.getElementById('previewSignatoryPost');
    if (previewPost) {
      previewPost.textContent = applicableOfficer.designation;
    }
    const previewOffice = document.getElementById('previewSignatoryOffice');
    if (previewOffice) {
      previewOffice.textContent = applicableOfficer.department;
    }
  }

  let activeOfficerModalDept = 'dee';

  function openChangeOfficerModal(targetDept = 'dee') {
    if (!stateOfficers || !stateOfficers.dee) loadOfficerInfo();
    const modal = document.getElementById('changeOfficerModal');
    if (!modal) return;

    activeOfficerModalDept = (targetDept === 'ssa') ? 'ssa' : 'dee';

    // Populate DEE fields
    const nameDEE = document.getElementById('inputOfficerNameDEE');
    if (nameDEE) nameDEE.value = stateOfficers.dee.name || '';
    const desDEE = document.getElementById('inputOfficerDesignationDEE');
    if (desDEE) desDEE.value = stateOfficers.dee.designation || '';
    const deptDEE = document.getElementById('inputOfficerDepartmentDEE');
    if (deptDEE) deptDEE.value = stateOfficers.dee.department || '';
    const roleDEE = document.getElementById('inputOfficerRoleTagDEE');
    if (roleDEE) roleDEE.value = stateOfficers.dee.roleTag || '';

    // Populate SSA fields
    const nameSSA = document.getElementById('inputOfficerNameSSA');
    if (nameSSA) nameSSA.value = stateOfficers.ssa.name || '';
    const desSSA = document.getElementById('inputOfficerDesignationSSA');
    if (desSSA) desSSA.value = stateOfficers.ssa.designation || '';
    const deptSSA = document.getElementById('inputOfficerDepartmentSSA');
    if (deptSSA) deptSSA.value = stateOfficers.ssa.department || '';
    const roleSSA = document.getElementById('inputOfficerRoleTagSSA');
    if (roleSSA) roleSSA.value = stateOfficers.ssa.roleTag || '';

    // Switch to target tab
    switchOfficerModalTab(activeOfficerModalDept);

    modal.classList.add('show');
  }

  function switchOfficerModalTab(dept) {
    activeOfficerModalDept = dept;
    const tabDEE = document.getElementById('modalTabDEE');
    const tabSSA = document.getElementById('modalTabSSA');
    const panelDEE = document.getElementById('panelOfficerDEE');
    const panelSSA = document.getElementById('panelOfficerSSA');

    if (dept === 'ssa') {
      if (tabDEE) tabDEE.classList.remove('active');
      if (tabSSA) tabSSA.classList.add('active');
      if (panelDEE) { panelDEE.classList.remove('active'); panelDEE.style.display = 'none'; }
      if (panelSSA) { panelSSA.classList.add('active'); panelSSA.style.display = 'block'; }
    } else {
      if (tabSSA) tabSSA.classList.remove('active');
      if (tabDEE) tabDEE.classList.add('active');
      if (panelSSA) { panelSSA.classList.remove('active'); panelSSA.style.display = 'none'; }
      if (panelDEE) { panelDEE.classList.add('active'); panelDEE.style.display = 'block'; }
    }
  }

  function setupOfficerEvents() {
    // Header button
    const btnHeader = document.getElementById('btnChangeOfficerName');
    if (btnHeader) btnHeader.addEventListener('click', () => openChangeOfficerModal('dee'));

    // Header pills (Both DEE & SSA)
    const pillDEE = document.getElementById('adminOfficerPillDEE');
    if (pillDEE) pillDEE.addEventListener('click', () => openChangeOfficerModal('dee'));

    const pillSSA = document.getElementById('adminOfficerPillSSA');
    if (pillSSA) pillSSA.addEventListener('click', () => openChangeOfficerModal('ssa'));

    // Legacy pill fallback
    const pillLegacy = document.getElementById('adminOfficerPill');
    if (pillLegacy) pillLegacy.addEventListener('click', () => openChangeOfficerModal('dee'));

    // Quick Hub buttons in Admin Home
    const hubDEE = document.getElementById('hubChangeOfficerDEEBtn');
    if (hubDEE) hubDEE.addEventListener('click', () => openChangeOfficerModal('dee'));

    const hubSSA = document.getElementById('hubChangeOfficerSSABtn');
    if (hubSSA) hubSSA.addEventListener('click', () => openChangeOfficerModal('ssa'));

    const hubLegacy = document.getElementById('hubChangeOfficerBtn');
    if (hubLegacy) hubLegacy.addEventListener('click', () => openChangeOfficerModal('dee'));

    // Modal internal tab switcher buttons
    const tabBtnDEE = document.getElementById('modalTabDEE');
    if (tabBtnDEE) tabBtnDEE.addEventListener('click', () => switchOfficerModalTab('dee'));

    const tabBtnSSA = document.getElementById('modalTabSSA');
    if (tabBtnSSA) tabBtnSSA.addEventListener('click', () => switchOfficerModalTab('ssa'));

    // Modal close & cancel
    const closeBtn = document.getElementById('closeChangeOfficerModalBtn');
    if (closeBtn) closeBtn.addEventListener('click', () => {
      document.getElementById('changeOfficerModal').classList.remove('show');
    });
    const cancelBtn = document.getElementById('cancelChangeOfficerBtn');
    if (cancelBtn) cancelBtn.addEventListener('click', () => {
      document.getElementById('changeOfficerModal').classList.remove('show');
    });

    // Form submit
    const form = document.getElementById('changeOfficerForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Read DEE
        const nameDEE = (document.getElementById('inputOfficerNameDEE')?.value || '').trim();
        const desDEE = (document.getElementById('inputOfficerDesignationDEE')?.value || '').trim();
        const deptDEE = (document.getElementById('inputOfficerDepartmentDEE')?.value || '').trim();
        const roleDEE = (document.getElementById('inputOfficerRoleTagDEE')?.value || '').trim();

        // Read SSA
        const nameSSA = (document.getElementById('inputOfficerNameSSA')?.value || '').trim();
        const desSSA = (document.getElementById('inputOfficerDesignationSSA')?.value || '').trim();
        const deptSSA = (document.getElementById('inputOfficerDepartmentSSA')?.value || '').trim();
        const roleSSA = (document.getElementById('inputOfficerRoleTagSSA')?.value || '').trim();

        if (!nameDEE && !nameSSA) {
          showToast('Please enter the officer name.', 'error');
          return;
        }

        if (nameDEE) {
          stateOfficers.dee.name = nameDEE;
          stateOfficers.dee.designation = desDEE || 'Director of Elementary Education';
          stateOfficers.dee.department = deptDEE || 'Directorate of Elementary Education, Kahilipara, Guwahati-19';
          stateOfficers.dee.roleTag = roleDEE || 'State Approving Authority (DEE - Regular & Provincialised)';
        }

        if (nameSSA) {
          stateOfficers.ssa.name = nameSSA;
          stateOfficers.ssa.designation = desSSA || 'Mission Director, Samagra Shiksha Assam';
          stateOfficers.ssa.department = deptSSA || 'Axom Sarba Siksha Abhiyan Mission, Kahilipara, Guwahati-19';
          stateOfficers.ssa.roleTag = roleSSA || 'State Approving Authority (SSA - Contractual)';
        }

        officerInfo = stateOfficers.dee;
        saveOfficerInfo();
        updateOfficerDisplays();

        logActivity('OFFICERS_UPDATED', `State Approving Authorities updated - DEE: "${stateOfficers.dee.name}", SSA: "${stateOfficers.ssa.name}"`);

        document.getElementById('changeOfficerModal').classList.remove('show');
        showToast(`State Officers updated: DEE (${stateOfficers.dee.name}) & SSA (${stateOfficers.ssa.name})`, 'success');
      });
    }
  }

  // ==========================================
  // 3. TOAST NOTIFICATIONS
  // ==========================================
  function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = '<svg class="icon-sm" viewBox="0 0 24 24" fill="#22c55e"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>';
    } else if (type === 'error') {
      iconSvg = '<svg class="icon-sm" viewBox="0 0 24 24" fill="#ef4444"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>';
    } else {
      iconSvg = '<svg class="icon-sm" viewBox="0 0 24 24" fill="#38bdf8"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>';
    }

    toast.innerHTML = `${iconSvg} <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // ==========================================
  // 4. LIVE CLOCK (Assam IST)
  // ==========================================
  function updateLiveClock() {
    const clockEl = document.getElementById('liveClockDisplay');
    if (!clockEl) return;

    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    clockEl.textContent = `Date: ${day}-${month}-${year}, Time: ${hours}:${minutes}:${seconds} IST`;
  }

  // ==========================================
  // 5. CAPTCHA GENERATOR (Matching Screenshot 2)
  // ==========================================
  function generateCaptcha() {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    activeCaptchaCode = code;
    const displayEl = document.getElementById('captchaDisplay');
    if (displayEl) {
      displayEl.textContent = code;
    }
    const inputEl = document.getElementById('enteredCaptcha');
    if (inputEl) {
      inputEl.value = '';
    }
  }

  // ==========================================
  // 6. ROUTING & VIEW NAVIGATION
  // ==========================================
  function updatePublicHomeAdminStatus() {
    const isAdm = isAdminLoggedIn();
    const topNavAdminBtn = document.getElementById('topNavAdminBtn');
    const navAdminDirectBtn = document.getElementById('navAdminDirectBtn');

    if (topNavAdminBtn) {
      topNavAdminBtn.textContent = isAdm ? 'Admin Console (Active)' : 'Admin Portal';
    }
    if (navAdminDirectBtn) {
      navAdminDirectBtn.innerHTML = isAdm
        ? `<svg class="icon-sm" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg> Admin Console (Active)`
        : `<svg class="icon-sm" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg> Admin Portal`;
    }
  }

  function updatePublicHomeTeacherStatus() {
    const isTeacher = isTeacherLoggedIn();
    let banner = document.getElementById('teacherHomeSessionBanner');
    const openLoginBtn = document.getElementById('openLoginModalBtn');

    if (isTeacher) {
      const teacher = getActiveTeacher();
      if (!banner) {
        banner = document.createElement('div');
        banner.id = 'teacherHomeSessionBanner';
        banner.className = 'teacher-active-session-banner';
        const publicHeader = document.querySelector('.public-header');
        if (publicHeader && publicHeader.parentNode) {
          publicHeader.parentNode.insertBefore(banner, publicHeader);
        }
      }
      banner.innerHTML = `
        <div class="session-info">
          <span class="session-pill">Teacher Active Session</span>
          <span>Logged in as: <strong>${escapeHtml(teacher.name)}</strong> (${escapeHtml(teacher.empCode || teacher.mobile)})</span>
        </div>
        <div class="session-banner-btns">
          <button type="button" class="btn btn-sm btn-gold" id="btnReturnToTeacherDash">
            ← Return to My Teacher Dashboard
          </button>
          <button type="button" class="btn btn-sm btn-outline-white" id="homeTeacherLogoutBtn">
            Sign Out
          </button>
        </div>
      `;
      banner.style.display = 'flex';

      const returnBtn = document.getElementById('btnReturnToTeacherDash');
      if (returnBtn) {
        returnBtn.onclick = () => showView('viewTeacherDashboard');
      }
      const homeLogout = document.getElementById('homeTeacherLogoutBtn');
      if (homeLogout) {
        homeLogout.onclick = () => {
          clearSession();
          showToast('Signed out successfully.', 'info');
          if (banner) banner.style.display = 'none';
          updatePublicHomeTeacherStatus();
        };
      }

      if (openLoginBtn) {
        openLoginBtn.innerHTML = `
          <svg class="icon-sm" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
          My Dashboard
        `;
        openLoginBtn.onclick = () => showView('viewTeacherDashboard');
      }
    } else {
      if (banner) banner.style.display = 'none';
      if (openLoginBtn) {
        openLoginBtn.innerHTML = `
          <svg class="icon-sm" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 17l5-5-5-5v10zM19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
          </svg>
          Login
        `;
        openLoginBtn.onclick = () => {
          const modal = document.getElementById('loginModal');
          if (modal) modal.classList.add('show');
        };
      }
    }
  }

  function showView(viewId, pushHistory = true) {
    if (pushHistory) {
      try {
        history.pushState({ view: viewId, isAdminPreview, previewingTeacherId }, '', '#' + viewId);
      } catch (e) { }
    }

    document.querySelectorAll('.app-view').forEach(view => {
      view.classList.remove('active-view');
    });

    const target = document.getElementById(viewId);
    if (target) {
      target.classList.add('active-view');
      window.scrollTo(0, 0);
    }

    updatePublicHomeAdminStatus();
    updatePublicHomeTeacherStatus();

    // Refresh UI according to view
    if (viewId === 'viewTeacherDashboard') {
      const banner = document.getElementById('adminPreviewBanner');
      const backBtn = document.getElementById('topBackBtn');
      if (isAdminPreview) {
        if (banner) banner.style.display = 'flex';
        if (backBtn) {
          backBtn.innerHTML = '<svg class="icon-sm" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg> Return to Admin Home';
          backBtn.title = 'Return to Administrative Control Console';
        }
      } else {
        if (banner) banner.style.display = 'none';
        if (backBtn) {
          backBtn.innerHTML = '<svg class="icon-sm" viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg> Back';
          backBtn.title = 'Back to Dashboard Overview';
        }
      }
      renderTeacherDashboard();
    } else if (viewId === 'viewAdminDashboard') {
      isAdminPreview = false;
      previewingTeacherId = null;
      const banner = document.getElementById('adminPreviewBanner');
      if (banner) banner.style.display = 'none';
      renderAdminDashboard();
    }
  }

  // ==========================================
  // 7. AUTHENTICATION & LOGIN
  // ==========================================
  let loginRole = 'teacher'; // 'teacher' or 'admin'

  function setupAuthEvents() {
    // Open Login Modal Buttons
    const openLoginModalBtn = document.getElementById('openLoginModalBtn');
    const heroTeacherLoginBtn = document.getElementById('heroTeacherLoginBtn');
    const heroAdminLoginBtn = document.getElementById('heroAdminLoginBtn');
    const navAdminDirectBtn = document.getElementById('navAdminDirectBtn');
    const topNavAdminBtn = document.getElementById('topNavAdminBtn');
    const sideNavAdminAccess = document.getElementById('sideNavAdminAccess');

    const openModal = (role = 'teacher') => {
      // If user is already logged in as admin, return directly to Admin Home without modal
      if (role === 'admin' && isAdminLoggedIn()) {
        showToast('Returning to Admin Home Console...', 'info');
        showView('viewAdminDashboard');
        switchAdminTab('tabAdminHome');
        return;
      }

      loginRole = role;
      updateRoleTabs();
      generateCaptcha();
      const modal = document.getElementById('loginModal');
      if (modal) modal.classList.add('show');
    };

    if (openLoginModalBtn) openLoginModalBtn.addEventListener('click', () => openModal('teacher'));
    if (heroTeacherLoginBtn) heroTeacherLoginBtn.addEventListener('click', () => openModal('teacher'));
    if (heroAdminLoginBtn) heroAdminLoginBtn.addEventListener('click', () => openModal('admin'));
    if (navAdminDirectBtn) navAdminDirectBtn.addEventListener('click', () => openModal('admin'));
    if (topNavAdminBtn) topNavAdminBtn.addEventListener('click', () => openModal('admin'));
    if (sideNavAdminAccess) sideNavAdminAccess.addEventListener('click', () => openModal('admin'));

    // Close Modal Button
    const closeLoginModalBtn = document.getElementById('closeLoginModalBtn');
    if (closeLoginModalBtn) {
      closeLoginModalBtn.addEventListener('click', () => {
        document.getElementById('loginModal').classList.remove('show');
      });
    }

    // Refresh Captcha
    const refreshCaptchaBtn = document.getElementById('refreshCaptchaBtn');
    if (refreshCaptchaBtn) {
      refreshCaptchaBtn.addEventListener('click', generateCaptcha);
    }

    // Toggle Password Visibility
    const togglePasswordVisibilityBtn = document.getElementById('togglePasswordVisibilityBtn');
    const loginPassword = document.getElementById('loginPassword');
    if (togglePasswordVisibilityBtn && loginPassword) {
      togglePasswordVisibilityBtn.addEventListener('click', () => {
        if (loginPassword.type === 'password') {
          loginPassword.type = 'text';
          togglePasswordVisibilityBtn.style.color = '#0e4c64';
        } else {
          loginPassword.type = 'password';
          togglePasswordVisibilityBtn.style.color = '#94a3b8';
        }
      });
    }

    // Role Tabs (Teacher vs Admin)
    const tabTeacherRole = document.getElementById('tabTeacherRole');
    const tabAdminRole = document.getElementById('tabAdminRole');

    function updateRoleTabs() {
      if (loginRole === 'teacher') {
        tabTeacherRole.classList.add('active');
        tabAdminRole.classList.remove('active');
      } else {
        tabAdminRole.classList.add('active');
        tabTeacherRole.classList.remove('active');
      }
      const usernameInput = document.getElementById('loginUsername');
      const passwordInput = document.getElementById('loginPassword');
      if (usernameInput) usernameInput.placeholder = 'Enter username';
      if (passwordInput) passwordInput.placeholder = 'Enter password';
    }

    if (tabTeacherRole) {
      tabTeacherRole.addEventListener('click', () => {
        loginRole = 'teacher';
        updateRoleTabs();
      });
    }

    if (tabAdminRole) {
      tabAdminRole.addEventListener('click', () => {
        loginRole = 'admin';
        updateRoleTabs();
      });
    }

    // Login Form Submit
    const mainLoginForm = document.getElementById('mainLoginForm');
    if (mainLoginForm) {
      mainLoginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = document.getElementById('loginUsername').value.trim();
        const password = document.getElementById('loginPassword').value.trim();
        const enteredCaptcha = document.getElementById('enteredCaptcha').value.trim();

        // Validate Captcha (case-insensitive for convenience)
        if (enteredCaptcha.toLowerCase() !== activeCaptchaCode.toLowerCase()) {
          showToast('Invalid Security Captcha. Please enter the characters shown.', 'error');
          generateCaptcha();
          return;
        }

        if (loginRole === 'admin') {
          // Admin Check with Supabase admin_users table & local fallback
          (async () => {
            let adminFound = null;
            const client = getSupabase();
            if (client) {
              try {
                const { data, error } = await client
                  .from('admin_users')
                  .select('*')
                  .eq('username', username)
                  .eq('password', password)
                  .maybeSingle();

                if (!error && data) {
                  adminFound = {
                    id: data.id,
                    username: data.username,
                    name: data.name || (officerInfo ? officerInfo.name : 'State Nodal Officer'),
                    role: data.role || 'admin',
                    email: data.email || 'admin.ttms@assam.gov.in'
                  };
                  client.from('admin_users').update({ last_login: new Date().toISOString() }).eq('id', data.id);
                }
              } catch (e) {
                console.warn('[Supabase] Admin login lookup:', e);
              }
            }

            if (!adminFound && (username === ADMIN_CREDENTIALS.username || username === 'admin') && (password === ADMIN_CREDENTIALS.password || password === 'Alex#2027')) {
              adminFound = { ...ADMIN_CREDENTIALS, username: username };
            }

            if (adminFound) {
              ADMIN_CREDENTIALS.name = adminFound.name;
              saveSession(adminFound);
              saveAdminSession();
              logActivity('ADMIN_LOGIN', `Admin "${adminFound.name}" (${adminFound.username}) logged in.`);
              document.getElementById('loginModal').classList.remove('show');
              showToast('Welcome, Administrator! Control console loaded.', 'success');
              showView('viewAdminDashboard');
              switchAdminTab('tabAdminHome');
            } else {
              showToast('Invalid Admin credentials. Please check your username and password.', 'error');
              generateCaptcha();
            }
          })();
        } else {
          // Teacher Check (with Supabase direct verification & document sync)
          (async () => {
            loadUsers();
            const cleanUser = username.trim();
            let teacher = usersList.find(u =>
              (u.username === cleanUser || (u.mobile && u.mobile === cleanUser) || (u.empCode && u.empCode === cleanUser)) &&
              u.password === password
            );

            // Directly query Supabase for fresh teacher record and all uploaded documents
            const client = getSupabase();
            if (client) {
              try {
                const { data: dbTeachers, error: dbErr } = await client
                  .from('teachers')
                  .select('*, documents(*)')
                  .or(`username.eq.${cleanUser},mobile.eq.${cleanUser},emp_code.eq.${cleanUser}`)
                  .eq('password', password);

                if (!dbErr && Array.isArray(dbTeachers) && dbTeachers.length > 0) {
                  const mapped = mapTeacherFromSupabase(dbTeachers[0]);
                  teacher = mapped;
                  const idx = usersList.findIndex(u => u.id === mapped.id || u.username === mapped.username);
                  if (idx !== -1) {
                    usersList[idx] = mapped;
                  } else {
                    usersList.unshift(mapped);
                  }
                  try {
                    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(usersList));
                  } catch (e) { }
                }
              } catch (e) {
                console.warn('[Supabase] Teacher login direct sync error:', e);
              }
            }

            if (teacher) {
              clearAdminSession();
              isAdminPreview = false;
              previewingTeacherId = null;
              saveSession(teacher);
              logActivity('TEACHER_LOGIN', `Teacher "${teacher.name}" logged into portal.`, { teacherId: teacher.id }, teacher.id);
              document.getElementById('loginModal').classList.remove('show');
              showToast(`Welcome back, ${teacher.name}!`, 'success');
              showView('viewTeacherDashboard');
            } else {
              showToast('Invalid Teacher Username or Password. Please check your credentials.', 'error');
              generateCaptcha();
            }
          })();
        }
      });
    }

    // Teacher Logout
    const teacherLogoutBtn = document.getElementById('teacherLogoutBtn');
    if (teacherLogoutBtn) {
      teacherLogoutBtn.addEventListener('click', () => {
        if (isAdminPreview) {
          isAdminPreview = false;
          previewingTeacherId = null;
          showToast('Exited preview mode. Returned to Admin Home.', 'info');
          showView('viewAdminDashboard');
          switchAdminTab('tabAdminHome');
          return;
        }
        clearSession();
        document.getElementById('userDropdownMenu').classList.remove('show');
        showToast('Logged out successfully.', 'info');
        showView('viewHome');
      });
    }

    // Admin Logout
    const adminLogoutBtn = document.getElementById('adminLogoutBtn');
    if (adminLogoutBtn) {
      adminLogoutBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to sign out from the Administrative Console?')) {
          clearSession();
          clearAdminSession();
          isAdminPreview = false;
          previewingTeacherId = null;
          showToast('Administrator signed out.', 'info');
          showView('viewHome');
        }
      });
    }

    // Admin switch to public portal (Keeps session so clicking back or Admin Portal returns)
    const adminSwitchToPortalBtn = document.getElementById('adminSwitchToPortalBtn');
    if (adminSwitchToPortalBtn) {
      adminSwitchToPortalBtn.addEventListener('click', () => {
        showView('viewHome');
        showToast('Viewing Public Portal. Click "Admin Console" in the top bar to return anytime without logging out.', 'info');
      });
    }

    // Admin Home navigation button in admin top header
    const adminHeaderHomeBtn = document.getElementById('adminHeaderHomeBtn');
    if (adminHeaderHomeBtn) {
      adminHeaderHomeBtn.addEventListener('click', () => {
        switchAdminTab('tabAdminHome');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // Admin breadcrumb link
    const crumbAdminHome = document.getElementById('crumbAdminHome');
    if (crumbAdminHome) {
      crumbAdminHome.addEventListener('click', (e) => {
        e.preventDefault();
        switchAdminTab('tabAdminHome');
      });
    }

    // Admin Return Home from Teacher Preview Banner
    const btnAdminReturnHome = document.getElementById('btnAdminReturnHome');
    if (btnAdminReturnHome) {
      btnAdminReturnHome.addEventListener('click', () => {
        isAdminPreview = false;
        previewingTeacherId = null;
        showToast('Returned to Admin Home.', 'info');
        showView('viewAdminDashboard');
        switchAdminTab('tabAdminHome');
      });
    }

    // Admin Edit Current Teacher from Teacher Preview Banner
    const btnAdminEditCurrentTeacher = document.getElementById('btnAdminEditCurrentTeacher');
    if (btnAdminEditCurrentTeacher) {
      btnAdminEditCurrentTeacher.addEventListener('click', () => {
        if (previewingTeacherId) {
          openEditUserModal(previewingTeacherId);
        }
      });
    }

    // User Profile Dropdown in Teacher Dash
    const userMenuDropdownBtn = document.getElementById('userMenuDropdownBtn');
    const userDropdownMenu = document.getElementById('userDropdownMenu');
    if (userMenuDropdownBtn && userDropdownMenu) {
      userMenuDropdownBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        userDropdownMenu.classList.toggle('show');
      });

      document.addEventListener('click', () => {
        userDropdownMenu.classList.remove('show');
      });
    }

    // Top action bar Back Button (Never unintentionally logs out)
    const topBackBtn = document.getElementById('topBackBtn');
    if (topBackBtn) {
      topBackBtn.addEventListener('click', (e) => {
        if (e) e.preventDefault();
        if (isAdminPreview || isAdminLoggedIn()) {
          isAdminPreview = false;
          previewingTeacherId = null;
          showToast('Returned to Admin Home Console.', 'info');
          showView('viewAdminDashboard');
          switchAdminTab('tabAdminHome');
          return;
        }

        if (isTeacherLoggedIn()) {
          // If viewing profile details, preferred locations, or documents, scroll smoothly back to overview
          const secOverview = document.getElementById('sectionOverview');
          if (secOverview) {
            secOverview.scrollIntoView({ behavior: 'smooth', block: 'start' });
            document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active-link'));
            const generalLink = document.getElementById('sideNavGeneralStatus');
            if (generalLink) generalLink.classList.add('active-link');
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
          showToast('You are on your Teacher Transfer Portal.', 'info');
          return;
        }

        showView('viewHome');
      });
    }

    // Browser Popstate Event Listener (Prevents accidental logout on browser back)
    window.addEventListener('popstate', (e) => {
      if (isAdminPreview) {
        isAdminPreview = false;
        previewingTeacherId = null;
        showToast('Returned to Admin Console.', 'info');
        showView('viewAdminDashboard', false);
        switchAdminTab('tabAdminHome');
        return;
      }

      if (e.state && e.state.view) {
        // Prevent accidental logout: if teacher is logged in and state says viewHome, keep on teacher dashboard
        if (isTeacherLoggedIn() && e.state.view === 'viewHome') {
          showView('viewTeacherDashboard', false);
          return;
        }
        showView(e.state.view, false);
        if (e.state.section) {
          const el = document.getElementById(e.state.section);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        if (isAdminLoggedIn()) {
          showView('viewAdminDashboard', false);
          switchAdminTab('tabAdminHome');
        } else if (isTeacherLoggedIn()) {
          // Keep teacher safely in their Teacher Dashboard!
          showView('viewTeacherDashboard', false);
        } else {
          showView('viewHome', false);
        }
      }
    });

    // Sidebar Navigation within Teacher Dashboard
    const sideNavProfile = document.getElementById('sideNavProfile');
    const sideNavDashboard = document.getElementById('sideNavDashboard');
    const sideNavMutual = document.getElementById('sideNavMutual');
    const sideNavGeneralStatus = document.getElementById('sideNavGeneralStatus');
    const menuMyProfileBtn = document.getElementById('menuMyProfileBtn');

    function scrollToTeacherProfile(e) {
      if (e) e.preventDefault();
      const secTeacher = document.getElementById('sectionTeacher');
      if (secTeacher) {
        secTeacher.scrollIntoView({ behavior: 'smooth', block: 'start' });
        document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active-link'));
        if (sideNavProfile) sideNavProfile.classList.add('active-link');
        try {
          history.pushState({ view: 'viewTeacherDashboard', section: 'sectionTeacher' }, '', '#profile');
        } catch (err) { }
      }
      const menu = document.getElementById('userDropdownMenu');
      if (menu) menu.classList.remove('show');
    }

    function scrollToTeacherOverview(e) {
      if (e) e.preventDefault();
      const secOverview = document.getElementById('sectionOverview');
      if (secOverview) {
        secOverview.scrollIntoView({ behavior: 'smooth', block: 'start' });
        document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active-link'));
        if (sideNavGeneralStatus) sideNavGeneralStatus.classList.add('active-link');
        try {
          history.pushState({ view: 'viewTeacherDashboard', section: 'sectionOverview' }, '', '#dashboard');
        } catch (err) { }
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }

    // Locked Tabs Handler (Restricted for Teachers)
    function handleLockedTabClick(e, tabName) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      // If admin is previewing this portal, allow navigation
      if (isAdminPreview) {
        if (tabName === 'Profile' || tabName === 'Teacher Profile') scrollToTeacherProfile(e);
        else if (tabName === 'Dashboard') scrollToTeacherOverview(e);
        else showToast('Mutual Transfer module is in offline review by the State Directorate.', 'info');
        return;
      }
      showToast(`Access Restricted: "${tabName}" is currently locked by the State Directorate during active transfer scrutiny.`, 'warning');
    }

    if (sideNavDashboard) sideNavDashboard.addEventListener('click', (e) => handleLockedTabClick(e, 'Dashboard'));
    if (sideNavProfile) sideNavProfile.addEventListener('click', (e) => handleLockedTabClick(e, 'Profile'));
    if (sideNavMutual) sideNavMutual.addEventListener('click', (e) => handleLockedTabClick(e, 'Mutual Transfer Request'));
    if (menuMyProfileBtn) menuMyProfileBtn.addEventListener('click', (e) => handleLockedTabClick(e, 'Teacher Profile'));
    if (sideNavGeneralStatus) sideNavGeneralStatus.addEventListener('click', scrollToTeacherOverview);

    // Jump-to pills smooth scroll
    document.querySelectorAll('.jump-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.jump-pill').forEach(b => b.classList.remove('active-jump'));
        btn.classList.add('active-jump');
        const targetId = btn.getAttribute('data-target');
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // Print Button
    const topPrintPageBtn = document.getElementById('topPrintPageBtn');
    if (topPrintPageBtn) {
      topPrintPageBtn.addEventListener('click', () => {
        window.print();
      });
    }

    const menuPrintStatusBtn = document.getElementById('menuPrintStatusBtn');
    if (menuPrintStatusBtn) {
      menuPrintStatusBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.print();
      });
    }

    // Top Action Bar Download Button
    const topDownloadDocsBtn = document.getElementById('topDownloadDocsBtn');
    if (topDownloadDocsBtn) {
      topDownloadDocsBtn.addEventListener('click', () => {
        const user = getActiveTeacher();
        if (!user) return;
        const docs = user.documents || [];
        if (docs.length === 1) {
          downloadDocument(docs[0], user);
        } else if (docs.length > 1) {
          const sec = document.getElementById('sectionDocuments');
          if (sec) sec.scrollIntoView({ behavior: 'smooth' });
          showToast(`All ${docs.length} uploaded documents are available for download in the Documents section below.`, 'info');
        } else {
          showToast('No official documents have been uploaded for download yet.', 'info');
        }
      });
    }
  }

  function getActiveTeacher() {
    loadUsers();
    if (isAdminPreview && previewingTeacherId) {
      const found = usersList.find(u => u.id === previewingTeacherId);
      if (found) return found;
    }
    if (!currentSession) return usersList[0];
    const found = usersList.find(u =>
      u.id === currentSession.id ||
      u.username === currentSession.username ||
      (currentSession.empCode && u.empCode === currentSession.empCode)
    );
    if (found) {
      currentSession = found; // Keep active session synchronized
      return found;
    }
    return usersList[0];
  }

  // ==========================================
  // TRANSFER ORDER COUNTDOWN TIMELINE TIMER
  // ==========================================
  let countdownTimerInterval = null;

  function initTransferOrderCountdown(user) {
    if (countdownTimerInterval) {
      clearInterval(countdownTimerInterval);
      countdownTimerInterval = null;
    }

    const countdownCard = document.getElementById('transferOrderCountdownCard');
    if (!countdownCard) return;

    // Strict Requirement: Show ONLY for Approved Teachers
    const statusClean = (user && user.status ? String(user.status) : '').trim().toLowerCase();
    const isApproved = statusClean === 'approved';

    if (!isApproved) {
      countdownCard.style.display = 'none';
      if (countdownTimerInterval) {
        clearInterval(countdownTimerInterval);
        countdownTimerInterval = null;
      }
      return;
    }

    countdownCard.style.display = 'flex';

    const daysEl = document.getElementById('countdownDays');
    const hoursEl = document.getElementById('countdownHours');
    const minutesEl = document.getElementById('countdownMinutes');
    const secondsEl = document.getElementById('countdownSeconds');

    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    // 10 Days, 2 Hours, 19 Minutes, 10 Seconds window matching Government TTMS Portal
    const storageKey = `ttms_countdown_deadline_${user ? user.id : 'default'}`;
    let deadline = parseInt(localStorage.getItem(storageKey), 10);

    const INITIAL_DURATION_MS = (10 * 24 * 3600 * 1000) + (2 * 3600 * 1000) + (19 * 60 * 1000) + (10 * 1000);

    if (!deadline || isNaN(deadline) || deadline <= Date.now()) {
      deadline = Date.now() + INITIAL_DURATION_MS;
      try {
        localStorage.setItem(storageKey, deadline.toString());
      } catch (e) { }
    }

    function tick() {
      const now = Date.now();
      const diff = deadline - now;

      if (diff <= 0) {
        daysEl.textContent = '0';
        hoursEl.textContent = '0';
        minutesEl.textContent = '0';
        secondsEl.textContent = '0';
        if (countdownTimerInterval) {
          clearInterval(countdownTimerInterval);
          countdownTimerInterval = null;
        }
        return;
      }

      const totalSec = Math.floor(diff / 1000);
      const days = Math.floor(totalSec / 86400);
      const hours = Math.floor((totalSec % 86400) / 3600);
      const minutes = Math.floor((totalSec % 3600) / 60);
      const seconds = totalSec % 60;

      daysEl.textContent = days;
      hoursEl.textContent = hours;
      minutesEl.textContent = minutes;
      secondsEl.textContent = seconds;
    }

    tick();
    countdownTimerInterval = setInterval(tick, 1000);
  }

  // ==========================================
  // 8. RENDER TEACHER DASHBOARD (Screenshot 1)
  // ==========================================
  function renderTeacherDashboard() {
    const user = getActiveTeacher();
    if (!user) return;

    // Header info
    const headerName = document.getElementById('currentTeacherNameDisplay');
    if (headerName) headerName.textContent = user.name;
    const dropName = document.getElementById('dropdownTeacherName');
    if (dropName) dropName.textContent = user.name;
    const dropMob = document.getElementById('dropdownTeacherMobile');
    if (dropMob) dropMob.textContent = user.username;

    // Hero Deep Blue Banner
    const bannerName = document.getElementById('bannerTeacherName');
    if (bannerName) bannerName.textContent = user.name;
    const dept = getTeacherDepartment(user);
    const bannerAppTag = document.getElementById('bannerAppTag');
    if (bannerAppTag) {
      bannerAppTag.textContent = `GENERAL TRANSFER APPLICATION • ${dept === 'SSA' ? 'SAMAGRA SHIKSHA ASSAM (SSA)' : 'DIRECTORATE OF ELEMENTARY EDUCATION (DEE)'}`;
    }
    const bannerSubline = document.getElementById('bannerTeacherSubline');
    if (bannerSubline) {
      bannerSubline.textContent = `${user.appType || 'Intra-district transfer'} • ${user.designation} • ${user.school}`;
    }
    const bannerApp = document.getElementById('bannerAppNumber');
    if (bannerApp) bannerApp.textContent = user.appNumber;

    // Status badges (Banner & Overview)
    const statusMeta = getStatusMeta(user.status);
    const bannerBadge = document.getElementById('bannerStatusBadge');
    const overviewBadge = document.getElementById('overviewStatusPill');

    [bannerBadge, overviewBadge].forEach(badge => {
      if (!badge) return;
      badge.className = `status-pill ${statusMeta.cls}`;
      badge.innerHTML = `<span class="status-icon">${statusMeta.icon}</span> <span class="status-label">${escapeHtml(statusMeta.label)}</span>`;
    });

    const bannerStatusText = document.getElementById('bannerStatusText');
    if (bannerStatusText) bannerStatusText.textContent = statusMeta.label;
    const overviewStatusText = document.getElementById('overviewStatusText');
    if (overviewStatusText) overviewStatusText.textContent = statusMeta.label;

    // Initialize live transfer order countdown timeline
    initTransferOrderCountdown(user);

    // 3 Metric Cards (Submitted On, Last Action On, Latest Remark)
    const metricSub = document.getElementById('metricSubmittedOn');
    if (metricSub) metricSub.textContent = user.submittedOn || '19-02-2026';
    const metricAct = document.getElementById('metricLastActionOn');
    if (metricAct) metricAct.textContent = user.lastActionOn || getTodayDateString();
    const metricRem = document.getElementById('metricLatestRemark');
    if (metricRem) metricRem.textContent = user.latestRemark || 'Direct Forward to AA';

    // Application Lifecycle Pipeline Stepper
    renderTeacherWorkflowStepper(user);

    // Alert Callout Box
    const alertBox = document.getElementById('statusAlertBox') || document.querySelector('.status-alert-box');
    const alertIconWrap = document.getElementById('alertIconWrap') || (alertBox ? alertBox.querySelector('.alert-icon-wrap') : null);
    const alertTitle = document.getElementById('alertTitleText');
    const alertDesc = document.getElementById('alertDescText');

    if (alertTitle) alertTitle.textContent = user.alertTitle || 'Verification is in progress';
    if (alertDesc) alertDesc.textContent = user.alertDesc || 'The request has been forwarded to the concerned authority for further verification.';

    if (alertBox && alertIconWrap) {
      alertBox.className = 'status-alert-box';
      const s = (user.status || '').trim();
      if (s === 'Approved') {
        alertBox.classList.add('alert-success');
        alertIconWrap.innerHTML = '<svg viewBox="0 0 24 24" fill="#15803d"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>';
      } else if (s === 'Rejected') {
        alertBox.classList.add('alert-danger');
        alertIconWrap.innerHTML = '<svg viewBox="0 0 24 24" fill="#b91c1c"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>';
      } else if (s.includes('Correction')) {
        alertBox.classList.add('alert-warning');
        alertIconWrap.innerHTML = '<svg viewBox="0 0 24 24" fill="#b45309"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>';
      } else {
        alertBox.classList.add('alert-info');
        alertIconWrap.innerHTML = '<svg viewBox="0 0 24 24" fill="#0E4C64"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>';
      }
    }

    // Teacher Details Section
    const detName = document.getElementById('detailTeacherName');
    if (detName) detName.textContent = user.name;
    const detDept = document.getElementById('detailDepartment');
    if (detDept) {
      if (dept === 'SSA') {
        detDept.innerHTML = `<span class="dept-badge dept-badge-ssa"><span class="badge-dot"></span> SSA (Samagra Shiksha Assam)</span>`;
      } else {
        detDept.innerHTML = `<span class="dept-badge dept-badge-dee"><span class="badge-dot"></span> DEE (Elementary Education)</span>`;
      }
    }
    const detCat = document.getElementById('detailTeacherCategory');
    if (detCat) {
      detCat.textContent = getTeacherCategoryLabel(user);
    }
    const detEmp = document.getElementById('detailEmpCode');
    if (detEmp) detEmp.textContent = user.empCode || 'TET-2014-99812';
    const detDes = document.getElementById('detailDesignation');
    if (detDes) detDes.textContent = user.designation;
    const detSch = document.getElementById('detailSchool');
    if (detSch) detSch.textContent = user.school;
    const detUd = document.getElementById('detailUdise');
    if (detUd) detUd.textContent = user.udise || '18050214801';
    const detDist = document.getElementById('detailDistrictBlock');
    if (detDist) detDist.textContent = `${user.district} • ${user.block || 'Main'} Block`;
    const detMob = document.getElementById('detailMobile');
    if (detMob) detMob.textContent = user.username;

    const detailGenderCategory = document.getElementById('detailGenderCategory');
    if (detailGenderCategory) {
      detailGenderCategory.textContent = `${user.gender || 'Male'} • ${user.category || 'General'}`;
    }

    const detailJoiningService = document.getElementById('detailJoiningService');
    if (detailJoiningService) {
      detailJoiningService.textContent = `${user.dateOfJoining || '15-09-2014'} (${user.serviceLength || '11 Yrs 5 Mos Service'})`;
    }

    // Preferred Locations Section
    const prefList = document.getElementById('teacherPreferencesList');
    if (prefList) {
      const p1 = (user.preferences && user.preferences[0]) || user.destinationSchool || 'Dakshin Bartary Milan LPS (U-DISE: 18050214804)';
      const p2 = (user.preferences && user.preferences[1]) || 'Chenga Majalia School (U-DISE: 18050212001)';
      const p3 = (user.preferences && user.preferences[2]) || 'Tarabari MV School (U-DISE: 18050105202)';
      const reason = user.transferReason || 'Near residence / Medical grounds';

      prefList.innerHTML = `
        <div class="pref-item">
          <span class="pref-badge">Choice 1</span>
          <div class="pref-content">
            <strong>${escapeHtml(p1)}</strong>
            <small>${escapeHtml(user.block || 'Chenga')} Block, ${escapeHtml(user.district || 'Barpeta')} District • Reason: ${escapeHtml(reason)}</small>
          </div>
        </div>
        <div class="pref-item">
          <span class="pref-badge">Choice 2</span>
          <div class="pref-content">
            <strong>${escapeHtml(p2)}</strong>
            <small>${escapeHtml(user.block || 'Chenga')} Block, ${escapeHtml(user.district || 'Barpeta')} District • Spouse / Block choice</small>
          </div>
        </div>
        <div class="pref-item">
          <span class="pref-badge">Choice 3</span>
          <div class="pref-content">
            <strong>${escapeHtml(p3)}</strong>
            <small>${escapeHtml(user.district || 'Barpeta')} District</small>
          </div>
        </div>
      `;
    }

    // Admin preview banner update
    if (isAdminPreview) {
      const banner = document.getElementById('adminPreviewBanner');
      if (banner) {
        banner.style.display = 'flex';
        const pName = document.getElementById('adminPreviewTeacherName');
        if (pName) pName.textContent = user.name;
        const pApp = document.getElementById('adminPreviewTeacherApp');
        if (pApp) pApp.textContent = user.appNumber;
        const pStat = document.getElementById('adminPreviewTeacherStatus');
        if (pStat) pStat.textContent = user.status;
      }
    }

    // Documents Section (The key requirement!)
    renderTeacherDocumentsSection(user);
  }

  function renderTeacherWorkflowStepper(user) {
    const stepperContainer = document.getElementById('teacherWorkflowStepper');
    const stageBadge = document.getElementById('stepperStageBadge');
    if (!stepperContainer) return;

    const dept = getTeacherDepartment(user);
    // Automatic committee title as per teacher category & department:
    // For SSA contractual teachers: SSA Sanction Committee
    // For DEE (regular and rest others): DEE Sanction Committee
    const sanctionCommittee = dept === 'SSA' ? 'SSA Sanction Committee' : 'DEE Sanction Committee';

    const s = (user.status || 'Pending').trim();
    let currentStage = 1;
    let badgeText = 'Stage 1 of 5';

    let stepStates = [
      { num: 1, title: 'Submitted', subtitle: user.submittedOn || 'Application Logged', state: 'completed' },
      { num: 2, title: 'District Scrutiny', subtitle: 'BEEO / DEEO Verification', state: 'active' },
      { num: 3, title: 'Forwarded to AA', subtitle: 'Appointing Authority', state: 'upcoming' },
      { num: 4, title: 'Directorate Approval', subtitle: sanctionCommittee, state: 'upcoming' },
      { num: 5, title: 'Order Issued', subtitle: 'Official Order Signed', state: 'upcoming' }
    ];

    if (s === 'Pending') {
      currentStage = 2;
      badgeText = 'Stage 2: District Verification';
      stepStates[0].state = 'completed';
      stepStates[1].state = 'active';
      stepStates[1].subtitle = 'Verification In Progress';
    } else if (s === 'Under Scrutiny') {
      currentStage = 2;
      badgeText = 'Stage 2: Under Detailed Scrutiny';
      stepStates[0].state = 'completed';
      stepStates[1].state = 'warning';
      stepStates[1].subtitle = 'Scrutiny Committee Review';
    } else if (s.includes('Correction')) {
      currentStage = 2;
      badgeText = 'Stage 2: Document Correction Req.';
      stepStates[0].state = 'completed';
      stepStates[1].state = 'warning';
      stepStates[1].subtitle = 'Action Required';
    } else if (s.includes('Forward') || s.includes('AA')) {
      currentStage = 3;
      badgeText = 'Stage 3: Forwarded to AA';
      stepStates[0].state = 'completed';
      stepStates[1].state = 'completed';
      stepStates[2].state = 'active';
      stepStates[2].subtitle = user.latestRemark || 'Direct Forward to AA';
      stepStates[3].subtitle = sanctionCommittee;
    } else if (s.includes('Directorate') || s.includes('Sanction')) {
      currentStage = 4;
      badgeText = `Stage 4: ${dept === 'SSA' ? 'SSA' : 'DEE'} Approval`;
      stepStates[0].state = 'completed';
      stepStates[1].state = 'completed';
      stepStates[2].state = 'completed';
      stepStates[3].state = 'active';
      stepStates[3].subtitle = `${sanctionCommittee} Review`;
    } else if (s === 'Approved') {
      currentStage = 5;
      badgeText = 'Stage 5 of 5: Order Issued & Signed';
      stepStates[0].state = 'completed';
      stepStates[1].state = 'completed';
      stepStates[2].state = 'completed';
      stepStates[3].state = 'completed';
      stepStates[3].subtitle = `${sanctionCommittee} (Approved)`;
      stepStates[4].state = 'completed';
      stepStates[4].subtitle = 'Signed & Ready for Download';
    } else if (s === 'Rejected') {
      currentStage = 3;
      badgeText = 'Application Disallowed';
      stepStates[0].state = 'completed';
      stepStates[1].state = 'completed';
      stepStates[2].state = 'rejected';
      stepStates[2].subtitle = user.latestRemark || 'Request Rejected';
    }

    if (stageBadge) stageBadge.textContent = badgeText;

    stepperContainer.innerHTML = stepStates.map(step => {
      let icon = step.num;
      if (step.state === 'completed') icon = '✓';
      else if (step.state === 'warning') icon = '⚠️';
      else if (step.state === 'rejected') icon = '✕';

      return `
        <div class="stepper-step ${step.state}">
          <div class="step-node">${icon}</div>
          <div class="step-connector"></div>
          <span class="step-title">${escapeHtml(step.title)}</span>
          <small class="step-subtitle">${escapeHtml(step.subtitle)}</small>
        </div>
      `;
    }).join('');
  }

  function renderTeacherDocumentsSection(user) {
    const docsListContainer = document.getElementById('teacherDocsList');
    const emptyDocsMessage = document.getElementById('emptyDocsMessage');
    const docsCountBadge = document.getElementById('teacherDocsCountBadge');

    if (!docsListContainer) return;
    if (!user) return;
    if (!user.documents) user.documents = [];

    function renderCards(docs) {
      if (docsCountBadge) {
        docsCountBadge.textContent = `${docs.length} Document${docs.length === 1 ? '' : 's'}`;
      }

      if (docs.length === 0) {
        docsListContainer.innerHTML = '';
        if (emptyDocsMessage) {
          emptyDocsMessage.style.display = 'block';
          emptyDocsMessage.innerHTML = `
            <svg class="empty-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
            </svg>
            <h4>No Documents Uploaded Yet</h4>
            <p>Your application is currently <strong>${escapeHtml(user.status || 'Pending')}</strong> (${escapeHtml(user.latestRemark || 'Under Review')}). Once approved and signed by the Directorate, the official Transfer Order PDF will be available here for download.</p>
          `;
        }
        return;
      }

      if (emptyDocsMessage) emptyDocsMessage.style.display = 'none';
      docsListContainer.innerHTML = '';

      docs.forEach(doc => {
        const card = document.createElement('div');
        card.className = 'doc-download-card';

        card.innerHTML = `
          <div class="doc-meta-left">
            <div class="pdf-icon-badge">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
              PDF
            </div>
            <div class="doc-info-block">
              <div class="doc-title-row">
                <strong>${escapeHtml(doc.title)}</strong>
                <span class="doc-category-tag">${escapeHtml(doc.category || 'Official Order')}</span>
              </div>
              <div class="doc-details-subline">
                <span>Ref: <strong>${escapeHtml(doc.refNumber || user.appNumber)}</strong></span> • 
                <span>Uploaded: ${escapeHtml(doc.uploadedAt)}</span> • 
                <span>Size: ${escapeHtml(doc.fileSize || '340 KB')}</span>
              </div>
              ${doc.remarks ? `<small class="text-primary mt-2" style="display:block;"><strong>Admin Note:</strong> ${escapeHtml(doc.remarks)}</small>` : ''}
            </div>
          </div>

          <div class="doc-action-cluster">
            <button class="btn btn-secondary btn-sm btn-preview-doc" data-doc-id="${escapeHtml(doc.id)}">
              <svg class="icon-sm" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
              Preview
            </button>
            <button class="btn btn-navy btn-sm btn-download-doc" data-doc-id="${escapeHtml(doc.id)}">
              <svg class="icon-sm" viewBox="0 0 24 24" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
              Download PDF
            </button>
          </div>
        `;

        docsListContainer.appendChild(card);
      });

      // Attach click events for Preview and Download
      docsListContainer.querySelectorAll('.btn-preview-doc').forEach(btn => {
        btn.addEventListener('click', () => {
          const docId = btn.getAttribute('data-doc-id');
          const doc = docs.find(d => d.id === docId);
          if (doc) previewDocument(doc, user);
        });
      });

      docsListContainer.querySelectorAll('.btn-download-doc').forEach(btn => {
        btn.addEventListener('click', () => {
          const docId = btn.getAttribute('data-doc-id');
          const doc = docs.find(d => d.id === docId);
          if (doc) downloadDocument(doc, user);
        });
      });
    }

    // 1. Initial render from currently available in-memory data
    renderCards(user.documents || []);

    // 2. Direct query to Supabase HRMS to ensure 100% of all uploaded documents are loaded live
    const client = getSupabase();
    if (client && user.id) {
      client
        .from('documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (!error && Array.isArray(data)) {
            const freshDocs = data.map(mapDocFromSupabase);
            user.documents = freshDocs;
            const target = usersList.find(u => u.id === user.id);
            if (target) target.documents = freshDocs;
            if (currentSession && (currentSession.id === user.id || currentSession.username === user.username)) {
              currentSession.documents = freshDocs;
            }
            renderCards(freshDocs);
          }
        })
        .catch(err => console.warn('[Supabase] Live teacher doc sync error:', err));
    }
  }

  // ==========================================
  // 9. ADMIN DASHBOARD & USER MANAGEMENT
  // ==========================================
  // ==========================================
  // 9. ADMIN DASHBOARD, HOME & USER MANAGEMENT
  // ==========================================
  function switchAdminTab(tabId) {
    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
      btn.classList.toggle('active-tab', btn.getAttribute('data-tab') === tabId);
    });
    document.querySelectorAll('.admin-tab-content').forEach(content => {
      content.classList.toggle('active-content', content.id === tabId);
    });

    const labelEl = document.getElementById('adminCurrentTabLabel');
    if (labelEl) {
      if (tabId === 'tabAdminHome') labelEl.textContent = 'Admin Home Overview';
      else if (tabId === 'tabUsers') labelEl.textContent = 'Teacher Directory & User Management';
      else if (tabId === 'tabApprovals') labelEl.textContent = 'Status & Approvals Pipeline';
      else if (tabId === 'tabDocs') labelEl.textContent = 'Upload PDF Documents per User';
    }

    if (tabId === 'tabAdminHome') renderAdminHome();
    else if (tabId === 'tabUsers') renderAdminUserTable();
    else if (tabId === 'tabApprovals') renderAdminApprovalsTable();
    else if (tabId === 'tabDocs') {
      populateTeacherSelectDropdown();
      renderAdminAllDocsTable();
    }
  }

  function setupAdminEvents() {
    // Admin tab switching
    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('data-tab');
        switchAdminTab(tabId);
      });
    });

    // Admin Home KPI Card Quick Navigation
    const kpiCardTotalTeachers = document.getElementById('kpiCardTotalTeachers');
    if (kpiCardTotalTeachers) {
      kpiCardTotalTeachers.addEventListener('click', () => switchAdminTab('tabUsers'));
    }

    const kpiCardPending = document.getElementById('kpiCardPending');
    if (kpiCardPending) {
      kpiCardPending.addEventListener('click', () => {
        currentWorkflowFilter = 'Pending';
        switchAdminTab('tabApprovals');
      });
    }

    const kpiCardForwarded = document.getElementById('kpiCardForwarded');
    if (kpiCardForwarded) {
      kpiCardForwarded.addEventListener('click', () => {
        currentWorkflowFilter = 'Direct Forward to AA';
        switchAdminTab('tabApprovals');
      });
    }

    const kpiCardApproved = document.getElementById('kpiCardApproved');
    if (kpiCardApproved) {
      kpiCardApproved.addEventListener('click', () => {
        currentWorkflowFilter = 'Approved';
        switchAdminTab('tabApprovals');
      });
    }

    const kpiCardDocs = document.getElementById('kpiCardDocs');
    if (kpiCardDocs) {
      kpiCardDocs.addEventListener('click', () => switchAdminTab('tabDocs'));
    }

    const kpiCardRejected = document.getElementById('kpiCardRejected');
    if (kpiCardRejected) {
      kpiCardRejected.addEventListener('click', () => {
        currentWorkflowFilter = 'Rejected';
        switchAdminTab('tabApprovals');
      });
    }

    // Quick Action Hub Buttons
    const hubAddUserBtn = document.getElementById('hubAddUserBtn');
    if (hubAddUserBtn) {
      hubAddUserBtn.addEventListener('click', () => {
        const btn = document.getElementById('openAddUserModalBtn');
        if (btn) btn.click();
      });
    }

    const hubEditUserBtn = document.getElementById('hubEditUserBtn');
    if (hubEditUserBtn) {
      hubEditUserBtn.addEventListener('click', () => {
        if (usersList.length > 0) {
          openEditUserModal(usersList[0].id);
        } else {
          showToast('No registered teachers found to edit. Please add a teacher first.', 'info');
        }
      });
    }

    const hubUploadOrderBtn = document.getElementById('hubUploadOrderBtn');
    if (hubUploadOrderBtn) {
      hubUploadOrderBtn.addEventListener('click', () => switchAdminTab('tabDocs'));
    }

    const hubViewPendingBtn = document.getElementById('hubViewPendingBtn');
    if (hubViewPendingBtn) {
      hubViewPendingBtn.addEventListener('click', () => {
        currentWorkflowFilter = 'Pending';
        switchAdminTab('tabApprovals');
      });
    }

    const homeViewAllTeachersBtn = document.getElementById('homeViewAllTeachersBtn');
    if (homeViewAllTeachersBtn) {
      homeViewAllTeachersBtn.addEventListener('click', () => switchAdminTab('tabUsers'));
    }

    // Approvals Pipeline Filter Pills
    document.querySelectorAll('.workflow-filter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        currentWorkflowFilter = pill.getAttribute('data-filter') || 'all';
        renderAdminApprovalsTable();
      });
    });

    const refreshApprovalsBtn = document.getElementById('refreshApprovalsBtn');
    if (refreshApprovalsBtn) {
      refreshApprovalsBtn.addEventListener('click', () => {
        renderAdminApprovalsTable();
        showToast('Transfer approval pipeline refreshed.', 'info');
      });
    }

    // Open Add User Modal
    const openAddUserModalBtn = document.getElementById('openAddUserModalBtn');
    const addUserModal = document.getElementById('addUserModal');
    const closeAddUserModalBtn = document.getElementById('closeAddUserModalBtn');
    const cancelAddUserBtn = document.getElementById('cancelAddUserBtn');

    if (openAddUserModalBtn && addUserModal) {
      openAddUserModalBtn.addEventListener('click', () => {
        document.getElementById('newTeacherPassword').value = generateRandomPassword();
        document.getElementById('newTeacherAppNumber').value = `Intra/EE-001-${Math.floor(100000 + Math.random() * 900000)}`;
        addUserModal.classList.add('show');
      });
    }

    if (closeAddUserModalBtn) {
      closeAddUserModalBtn.addEventListener('click', () => addUserModal.classList.remove('show'));
    }
    if (cancelAddUserBtn) {
      cancelAddUserBtn.addEventListener('click', () => addUserModal.classList.remove('show'));
    }

    // Generate random password button in Add User modal
    const btnGenRandomPwd = document.getElementById('btnGenRandomPwd');
    if (btnGenRandomPwd) {
      btnGenRandomPwd.addEventListener('click', () => {
        document.getElementById('newTeacherPassword').value = generateRandomPassword();
      });
    }

    // Add User Form Submit
    const addUserForm = document.getElementById('addUserForm');
    if (addUserForm) {
      addUserForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('newTeacherName').value.trim();
        const mobile = document.getElementById('newTeacherMobile').value.trim();
        const password = document.getElementById('newTeacherPassword').value.trim();
        const empCode = document.getElementById('newTeacherEmpCode').value.trim() || `TET-${Math.floor(2010 + Math.random() * 14)}-${Math.floor(10000 + Math.random() * 90000)}`;
        const designation = document.getElementById('newTeacherDesignation').value.trim() || 'Assistant Teacher of LPS';
        const catType = document.getElementById('newTeacherCategoryType') ? document.getElementById('newTeacherCategoryType').value : 'Regular';
        const dept = (catType === 'Contractual') ? 'SSA' : 'DEE';
        const school = document.getElementById('newTeacherSchool').value.trim();
        const district = document.getElementById('newTeacherDistrict').value.trim() || 'Barpeta';
        let appNumber = document.getElementById('newTeacherAppNumber').value.trim();
        if (!appNumber) {
          appNumber = `Intra/EE-001-${Math.floor(100000 + Math.random() * 900000)}`;
        }
        const status = document.getElementById('newTeacherStatus').value;
        const remark = document.getElementById('newTeacherRemark').value.trim();

        // Check if username already exists
        if (usersList.some(u => u.username === mobile)) {
          showToast(`User with mobile ${mobile} already exists!`, 'error');
          return;
        }

        const newUser = {
          id: `usr_${Date.now()}`,
          username: mobile,
          password: password,
          name: name.toUpperCase(),
          role: 'teacher',
          department: dept,
          teacherCategory: catType,
          designation: designation,
          school: school.toUpperCase(),
          udise: `18${Math.floor(100000000 + Math.random() * 900000000)}`,
          district: district,
          block: 'Chenga Block',
          appNumber: appNumber,
          appType: 'Intra-district transfer',
          status: status,
          submittedOn: getTodayDateString(),
          lastActionOn: getTodayDateString(),
          latestRemark: remark || (dept === 'SSA' ? 'Forwarded to SSA Sanction Committee' : 'Direct Forward to AA'),
          alertTitle: status === 'Approved' ? 'Transfer Application Approved' : 'Verification is in progress',
          alertDesc: status === 'Approved' ? 'The competent authority has approved your transfer.' : 'The request has been forwarded to the concerned authority for further verification.',
          empCode: empCode,
          gender: 'Male',
          category: 'General',
          dateOfJoining: '10-08-2016',
          serviceLength: '9 Years 6 Months',
          destinationSchool: 'Selected Transfer School',
          preferences: [
            'Dakshin Bartary Milan LPS (U-DISE: 18050214804)',
            'Chenga Majalia School (U-DISE: 18050212001)',
            'Tarabari MV School (U-DISE: 18050105202)'
          ],
          transferReason: 'Near residence / Medical grounds',
          documents: []
        };

        usersList.push(newUser);
        saveUsers();
        logActivity('TEACHER_REGISTERED', `New teacher "${newUser.name}" (${dept} - ${catType}) registered in portal.`, { teacherId: newUser.id, appNumber: newUser.appNumber }, newUser.id);
        addUserModal.classList.remove('show');
        addUserForm.reset();
        showToast(`Teacher "${newUser.name}" (${dept} - ${catType}) added successfully!`, 'success');
        renderAdminDashboard();
      });
    }

    // ========================================================
    // EDIT USER MODAL EVENTS (Admin Full Control Over All Data)
    // ========================================================
    const editUserModal = document.getElementById('editUserModal');
    const closeEditUserModalBtn = document.getElementById('closeEditUserModalBtn');
    const cancelEditUserBtn = document.getElementById('cancelEditUserBtn');
    const editUserForm = document.getElementById('editUserForm');
    const btnGenEditUserPwd = document.getElementById('btnGenEditUserPwd');

    if (closeEditUserModalBtn && editUserModal) {
      closeEditUserModalBtn.addEventListener('click', () => editUserModal.classList.remove('show'));
    }
    if (cancelEditUserBtn && editUserModal) {
      cancelEditUserBtn.addEventListener('click', () => editUserModal.classList.remove('show'));
    }
    if (btnGenEditUserPwd) {
      btnGenEditUserPwd.addEventListener('click', () => {
        document.getElementById('editTeacherPassword').value = generateRandomPassword();
      });
    }

    if (editUserForm) {
      editUserForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const userId = document.getElementById('editUserId').value;
        const user = usersList.find(u => u.id === userId);
        if (!user) {
          showToast('Teacher record not found!', 'error');
          return;
        }

        const name = document.getElementById('editTeacherName').value.trim();
        const mobile = document.getElementById('editTeacherMobile').value.trim();
        const empCode = document.getElementById('editTeacherEmpCode').value.trim();
        const password = document.getElementById('editTeacherPassword').value.trim();
        const gender = document.getElementById('editTeacherGender').value;
        const category = document.getElementById('editTeacherCategory').value;

        const designation = document.getElementById('editTeacherDesignation').value.trim();
        const catType = document.getElementById('editTeacherCategoryType') ? document.getElementById('editTeacherCategoryType').value : 'Regular';
        const dept = (catType === 'Contractual') ? 'SSA' : 'DEE';
        const school = document.getElementById('editTeacherSchool').value.trim();
        const udise = document.getElementById('editTeacherUdise').value.trim();
        const district = document.getElementById('editTeacherDistrict').value;
        const block = document.getElementById('editTeacherBlock').value.trim();
        const dateOfJoining = document.getElementById('editTeacherDateOfJoining').value.trim();
        const serviceLength = document.getElementById('editTeacherServiceLength').value.trim();

        const appNumber = document.getElementById('editTeacherAppNumber').value.trim();
        const appType = document.getElementById('editTeacherAppType').value;
        const destinationSchool = document.getElementById('editTeacherDestinationSchool').value.trim();
        const choice1 = document.getElementById('editTeacherChoice1').value.trim();
        const choice2 = document.getElementById('editTeacherChoice2').value.trim();
        const choice3 = document.getElementById('editTeacherChoice3').value.trim();
        const reason = document.getElementById('editTeacherReason').value.trim();

        const status = document.getElementById('editTeacherStatus').value;
        const lastActionOn = document.getElementById('editTeacherLastActionOn').value.trim() || getTodayDateString();
        const remark = document.getElementById('editTeacherRemark').value.trim();
        const alertTitle = document.getElementById('editTeacherAlertTitle').value.trim();
        const alertDesc = document.getElementById('editTeacherAlertDesc').value.trim();

        // Check if new mobile conflicts with another teacher
        const existingWithMobile = usersList.find(u => u.username === mobile && u.id !== userId);
        if (existingWithMobile) {
          showToast(`Mobile number / username ${mobile} is already registered by another teacher!`, 'error');
          return;
        }

        // Apply all modifications
        user.name = name.toUpperCase();
        user.username = mobile;
        user.empCode = empCode;
        user.password = password;
        user.gender = gender;
        user.category = category;

        user.department = dept;
        user.teacherCategory = catType;
        user.designation = designation;
        user.school = school.toUpperCase();
        user.udise = udise;
        user.district = district;
        user.block = block;
        user.dateOfJoining = dateOfJoining;
        user.serviceLength = serviceLength;

        user.appNumber = appNumber;
        user.appType = appType;
        user.destinationSchool = destinationSchool;
        user.preferences = [choice1, choice2, choice3];
        user.transferReason = reason;

        user.status = status;
        user.lastActionOn = lastActionOn;
        user.latestRemark = remark;
        user.alertTitle = alertTitle || (status === 'Approved' ? 'Transfer Application Approved' : 'Verification is in progress');
        user.alertDesc = alertDesc || (status === 'Approved' ? 'The competent authority has approved your transfer order.' : 'The request has been forwarded to the concerned authority for further verification.');

        saveUsers();
        logActivity('TEACHER_UPDATED', `Teacher record for "${user.name}" updated. Status: ${user.status}.`, { teacherId: user.id, status: user.status }, user.id);
        editUserModal.classList.remove('show');
        showToast(`Updated record for "${user.name}" (${dept} - ${catType})!`, 'success');

        renderAdminDashboard();

        // If currently previewing or logged in as this teacher, refresh their view immediately
        if ((isAdminPreview && previewingTeacherId === user.id) || (currentSession && (currentSession.id === user.id || currentSession.username === user.username))) {
          renderTeacherDashboard();
        }
      });
    }

    // ========================================================
    // QUICK STATUS MODAL EVENTS
    // ========================================================
    const quickStatusModal = document.getElementById('quickStatusModal');
    const closeQuickStatusModalBtn = document.getElementById('closeQuickStatusModalBtn');
    const cancelQuickStatusBtn = document.getElementById('cancelQuickStatusBtn');
    const quickStatusForm = document.getElementById('quickStatusForm');

    if (closeQuickStatusModalBtn && quickStatusModal) {
      closeQuickStatusModalBtn.addEventListener('click', () => quickStatusModal.classList.remove('show'));
    }
    if (cancelQuickStatusBtn && quickStatusModal) {
      cancelQuickStatusBtn.addEventListener('click', () => quickStatusModal.classList.remove('show'));
    }

    if (quickStatusForm) {
      quickStatusForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const userId = document.getElementById('quickStatusUserId').value;
        const user = usersList.find(u => u.id === userId);
        if (user) {
          const status = document.getElementById('quickStatusSelect').value;
          const remark = document.getElementById('quickStatusRemark').value.trim();

          user.status = status;
          user.latestRemark = remark;
          user.lastActionOn = getTodayDateString();

          if (status === 'Approved') {
            user.alertTitle = 'Transfer Application Approved';
            user.alertDesc = 'The Directorate has approved your transfer request.';
          } else if (status === 'Rejected') {
            user.alertTitle = 'Transfer Request Rejected';
            user.alertDesc = 'Please contact your District Elementary Education Officer for details.';
          } else if (status === 'Under Scrutiny') {
            user.alertTitle = 'Application Under Scrutiny';
            user.alertDesc = 'Application is currently under detailed scrutiny by the District Scrutiny Committee.';
          } else if (status === 'Document Correction Required') {
            user.alertTitle = 'Document Discrepancy Found';
            user.alertDesc = 'Please re-upload requested verification certificates.';
          } else {
            user.alertTitle = 'Verification is in progress';
            user.alertDesc = 'The request has been forwarded to the concerned authority for further verification.';
          }

          saveUsers();
          logActivity('STATUS_CHANGED', `Application status for teacher "${user.name}" updated to "${status}".`, { teacherId: user.id, status: status }, user.id);
          quickStatusModal.classList.remove('show');
          showToast(`Status updated to "${status}" for ${user.name}!`, 'success');
          renderAdminDashboard();

          if ((isAdminPreview && previewingTeacherId === user.id) || (currentSession && (currentSession.id === user.id || currentSession.username === user.username))) {
            renderTeacherDashboard();
          }
        }
      });
    }

    // Reset Password Modal
    const resetPwdModal = document.getElementById('resetPwdModal');
    const closeResetPwdModalBtn = document.getElementById('closeResetPwdModalBtn');
    const cancelResetPwdBtn = document.getElementById('cancelResetPwdBtn');
    const resetPwdForm = document.getElementById('resetPwdForm');
    const btnGenResetPwd = document.getElementById('btnGenResetPwd');

    if (closeResetPwdModalBtn) {
      closeResetPwdModalBtn.addEventListener('click', () => resetPwdModal.classList.remove('show'));
    }
    if (cancelResetPwdBtn) {
      cancelResetPwdBtn.addEventListener('click', () => resetPwdModal.classList.remove('show'));
    }
    if (btnGenResetPwd) {
      btnGenResetPwd.addEventListener('click', () => {
        document.getElementById('newPasswordInput').value = generateRandomPassword();
      });
    }

    if (resetPwdForm) {
      resetPwdForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const userId = document.getElementById('resetPwdUserId').value;
        const newPassword = document.getElementById('newPasswordInput').value.trim();

        const user = usersList.find(u => u.id === userId);
        if (user) {
          user.password = newPassword;
          saveUsers();
          logActivity('PASSWORD_RESET', `Password reset for teacher "${user.name}".`, { teacherId: user.id }, user.id);
          resetPwdModal.classList.remove('show');
          showToast(`Password updated for ${user.name} to "${newPassword}"!`, 'success');
          renderAdminDashboard();
        }
      });
    }

    // File Drag & Drop for Document Upload
    const fileDropArea = document.getElementById('fileDropArea');
    const realPdfFileInput = document.getElementById('realPdfFileInput');
    const selectedFileName = document.getElementById('selectedFileName');

    if (fileDropArea && realPdfFileInput) {
      fileDropArea.addEventListener('click', () => realPdfFileInput.click());

      realPdfFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          handleSelectedFile(file);
        }
      });

      fileDropArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileDropArea.style.borderColor = '#11526d';
        fileDropArea.style.backgroundColor = '#e6f0f5';
      });

      fileDropArea.addEventListener('dragleave', () => {
        fileDropArea.style.borderColor = '#94a3b8';
        fileDropArea.style.backgroundColor = '#f8fafc';
      });

      fileDropArea.addEventListener('drop', (e) => {
        e.preventDefault();
        fileDropArea.style.borderColor = '#94a3b8';
        fileDropArea.style.backgroundColor = '#f8fafc';
        const file = e.dataTransfer.files[0];
        if (file) {
          handleSelectedFile(file);
        }
      });
    }

    function handleSelectedFile(file) {
      const reader = new FileReader();
      reader.onload = function (evt) {
        pendingUploadedFile = {
          name: file.name,
          size: `${Math.round(file.size / 1024)} KB`,
          data: evt.target.result,
          type: file.type
        };
        selectedFileName.innerHTML = `<strong>Selected:</strong> ${file.name} (${pendingUploadedFile.size})`;

        // Auto-match target teacher by application number or name in filename
        const cleanName = file.name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        const matched = usersList.find(u => {
          const appClean = (u.appNumber || '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
          const nameClean = (u.name || '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
          return (appClean && (cleanName.includes(appClean) || appClean.includes(cleanName))) ||
                 (nameClean && cleanName.includes(nameClean));
        });

        if (matched) {
          const select = document.getElementById('docTargetUserSelect');
          if (select) {
            select.value = matched.id;
            updateTargetTeacherPreviewBadge();
          }
          showToast(`Attached "${file.name}" • Auto-matched to: ${matched.name} (${matched.appNumber})`, 'success');
        } else {
          showToast(`Attached file: ${file.name}`, 'info');
        }

        // Auto-populate Title if empty
        const titleInput = document.getElementById('docTitleInput');
        if (titleInput && !titleInput.value.trim()) {
          const autoTitle = file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ');
          titleInput.value = autoTitle;
        }
      };
      reader.readAsDataURL(file);
    }

    // Target Teacher dropdown selection preview
    const docTargetUserSelect = document.getElementById('docTargetUserSelect');
    if (docTargetUserSelect) {
      docTargetUserSelect.addEventListener('change', updateTargetTeacherPreviewBadge);
    }

    // Admin Upload Document Form Submit
    const adminUploadDocForm = document.getElementById('adminUploadDocForm');
    if (adminUploadDocForm) {
      adminUploadDocForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const targetUserId = document.getElementById('docTargetUserSelect').value;
        const targetUser = usersList.find(u => u.id === targetUserId);
        if (!targetUser) {
          showToast('Please select a valid teacher!', 'error');
          return;
        }

        if (!pendingUploadedFile || !pendingUploadedFile.data) {
          showToast('Please select or drop a valid document file to upload.', 'error');
          return;
        }

        const title = document.getElementById('docTitleInput').value.trim();
        const category = document.getElementById('docCategorySelect').value;
        const refNumber = document.getElementById('docReferenceNumber').value.trim() || `No. E-28841/TTMS/2026/${targetUser.appNumber.split('-')[1] || '01'}`;
        const remarks = document.getElementById('docRemarksInput').value.trim();

        if (!targetUser.documents) {
          targetUser.documents = [];
        }

        const newDoc = {
          id: `doc_${Date.now()}`,
          title: title,
          category: category,
          refNumber: refNumber,
          uploadedBy: getTeacherDepartment(targetUser) === 'SSA'
            ? 'Samagra Shiksha Assam (SSA), Govt of Assam'
            : 'Directorate of Elementary Education (DEE), Govt of Assam',
          uploadedAt: `${getTodayDateString()} 15:45 IST`,
          fileSize: pendingUploadedFile ? pendingUploadedFile.size : '345 KB',
          fileName: pendingUploadedFile ? pendingUploadedFile.name : `${title.replace(/\s+/g, '_')}.pdf`,
          fileData: pendingUploadedFile ? pendingUploadedFile.data : null,
          remarks: remarks
        };

        targetUser.documents.unshift(newDoc);

        // Upload physical file to Supabase Storage bucket (assam-live-assets) if available
        if (pendingUploadedFile && pendingUploadedFile.data) {
          const client = getSupabase();
          if (client && client.storage) {
            try {
              const byteCharacters = atob(pendingUploadedFile.data.split(',')[1]);
              const byteNumbers = new Array(byteCharacters.length);
              for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
              }
              const byteArray = new Uint8Array(byteNumbers);
              const blob = new Blob([byteArray], { type: pendingUploadedFile.type || 'application/pdf' });
              const cleanFileName = (pendingUploadedFile.name || 'doc.pdf').replace(/[^a-zA-Z0-9._-]/g, '_');
              const storagePath = `documents/${targetUser.id}/${Date.now()}_${cleanFileName}`;

              client.storage
                .from('assam-live-assets')
                .upload(storagePath, blob, { contentType: blob.type, upsert: true })
                .then(({ data, error }) => {
                  if (!error && data) {
                    const { data: pubData } = client.storage.from('assam-live-assets').getPublicUrl(storagePath);
                    if (pubData && pubData.publicUrl) {
                      newDoc.storageUrl = pubData.publicUrl;
                      client.from('documents').update({ file_data: pubData.publicUrl }).eq('id', newDoc.id);
                      console.log('[Supabase Storage] Uploaded to cloud storage:', pubData.publicUrl);
                    }
                  }
                })
                .catch(err => console.warn('[Supabase Storage Upload Error]', err));
            } catch (e) {
              console.warn('[Supabase Storage Data Conversion]', e);
            }
          }
        }

        // Also optionally update teacher status if it's a transfer order
        if (category === 'Transfer Order' && targetUser.status === 'Pending') {
          targetUser.status = 'Approved';
          targetUser.latestRemark = 'Official Transfer Order Issued';
          targetUser.lastActionOn = getTodayDateString();
          targetUser.alertTitle = 'Transfer Order Issued';
          targetUser.alertDesc = 'Your transfer order has been digitally authenticated and uploaded for download.';
        }

        saveUsers();
        logActivity('DOCUMENT_ISSUED', `Document "${title}" (${category}) issued for teacher "${targetUser.name}". Ref: ${refNumber}`, { teacherId: targetUser.id, docId: newDoc.id, category: category }, targetUser.id);
        adminUploadDocForm.reset();
        pendingUploadedFile = null;
        selectedFileName.textContent = 'Click or Drag & Drop a PDF file here';

        showToast(`Document successfully uploaded for ${targetUser.name}! Download is now active on teacher's dashboard.`, 'success');
        renderAdminDashboard();

        if ((isAdminPreview && previewingTeacherId === targetUser.id) || (currentSession && (currentSession.id === targetUser.id || currentSession.username === targetUser.username))) {
          renderTeacherDashboard();
        }
      });
    }

    // Admin Search filter
    const adminUserSearchInput = document.getElementById('adminUserSearchInput');
    if (adminUserSearchInput) {
      adminUserSearchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        renderAdminUserTable(query);
      });
    }

    // Document Preview Modal close
    const closeDocPreviewModalBtn = document.getElementById('closeDocPreviewModalBtn');
    const closePreviewBtn = document.getElementById('closePreviewBtn');
    const docPreviewModal = document.getElementById('docPreviewModal');

    if (closeDocPreviewModalBtn) {
      closeDocPreviewModalBtn.addEventListener('click', () => docPreviewModal.classList.remove('show'));
    }
    if (closePreviewBtn) {
      closePreviewBtn.addEventListener('click', () => docPreviewModal.classList.remove('show'));
    }
  }

  function openEditUserModal(userId) {
    const user = usersList.find(u => u.id === userId);
    if (!user) {
      showToast('Teacher not found!', 'error');
      return;
    }

    document.getElementById('editUserId').value = user.id;
    document.getElementById('editUserModalSubtitle').textContent = `Editing profile & transfer status for ${user.name} (${user.username})`;

    // Personal Details
    document.getElementById('editTeacherName').value = user.name || '';
    document.getElementById('editTeacherMobile').value = user.username || '';
    document.getElementById('editTeacherEmpCode').value = user.empCode || '';
    document.getElementById('editTeacherPassword').value = user.password || '';
    document.getElementById('editTeacherGender').value = user.gender || 'Male';
    document.getElementById('editTeacherCategory').value = user.category || 'General';

    // School & Service
    document.getElementById('editTeacherDesignation').value = user.designation || 'Assistant Teacher of LPS';

    // Category & Department (SSA for Contractual, DEE for all rest)
    const editCatSelect = document.getElementById('editTeacherCategoryType');
    const deptNoteText = document.getElementById('editCategoryDeptNoteText');
    const deptBadge = document.getElementById('editCategoryDeptBadge');
    const noteBox = document.getElementById('editCategoryDeptNoteBox');

    const updateEditDeptNote = (selectedVal) => {
      const isSSA = selectedVal === 'Contractual';
      if (deptNoteText) {
        deptNoteText.textContent = isSSA
          ? 'SSA (Samagra Shiksha Assam) • Directorate Approval: SSA Sanction Committee'
          : 'DEE (Directorate of Elementary Education) • Directorate Approval: DEE Sanction Committee';
      }
      if (deptBadge) {
        deptBadge.className = `dept-badge ${isSSA ? 'dept-badge-ssa' : 'dept-badge-dee'}`;
        deptBadge.textContent = isSSA ? 'SSA' : 'DEE';
      }
      if (noteBox) {
        noteBox.style.background = isSSA ? '#fef3c7' : '#e0f2fe';
        noteBox.style.borderLeftColor = isSSA ? '#d97706' : '#0284c7';
        noteBox.style.color = isSSA ? '#92400e' : '#0369a1';
      }
    };

    if (editCatSelect) {
      const dept = getTeacherDepartment(user);
      let catVal = 'Regular';
      if (dept === 'SSA' || (user.teacherCategory && user.teacherCategory.toLowerCase().includes('contract'))) {
        catVal = 'Contractual';
      } else if (user.teacherCategory && user.teacherCategory.includes('SRD')) {
        catVal = 'SRD';
      } else if (user.teacherCategory && user.teacherCategory.includes('Provincial')) {
        catVal = 'Provincialised';
      }
      editCatSelect.value = catVal;
      updateEditDeptNote(catVal);
      editCatSelect.onchange = () => updateEditDeptNote(editCatSelect.value);
    }

    document.getElementById('editTeacherSchool').value = user.school || '';
    document.getElementById('editTeacherUdise').value = user.udise || '18050214801';
    document.getElementById('editTeacherDistrict').value = user.district || 'Barpeta';
    document.getElementById('editTeacherBlock').value = user.block || 'Chenga Block';
    document.getElementById('editTeacherDateOfJoining').value = user.dateOfJoining || '15-09-2014';
    document.getElementById('editTeacherServiceLength').value = user.serviceLength || '11 Years 5 Months';

    // Application & Preferences
    document.getElementById('editTeacherAppNumber').value = user.appNumber || '';
    document.getElementById('editTeacherAppType').value = user.appType || 'Intra-district transfer';
    document.getElementById('editTeacherDestinationSchool').value = user.destinationSchool || '';
    document.getElementById('editTeacherChoice1').value = (user.preferences && user.preferences[0]) || 'Dakshin Bartary Milan LPS (U-DISE: 18050214804)';
    document.getElementById('editTeacherChoice2').value = (user.preferences && user.preferences[1]) || 'Chenga Majalia School (U-DISE: 18050212001)';
    document.getElementById('editTeacherChoice3').value = (user.preferences && user.preferences[2]) || 'Tarabari MV School (U-DISE: 18050105202)';
    document.getElementById('editTeacherReason').value = user.transferReason || 'Near residence / Medical grounds';

    // Status & Administrative Workflow
    document.getElementById('editTeacherStatus').value = user.status || 'Pending';
    document.getElementById('editTeacherLastActionOn').value = user.lastActionOn || getTodayDateString();
    document.getElementById('editTeacherRemark').value = user.latestRemark || 'Direct Forward to AA';
    document.getElementById('editTeacherAlertTitle').value = user.alertTitle || (user.status === 'Approved' ? 'Transfer Application Approved' : 'Verification is in progress');
    document.getElementById('editTeacherAlertDesc').value = user.alertDesc || (user.status === 'Approved' ? 'The competent authority has approved your transfer.' : 'The request has been forwarded to the concerned authority for further verification.');

    document.getElementById('editUserModal').classList.add('show');
  }

  function openQuickStatusModal(userId) {
    const user = usersList.find(u => u.id === userId);
    if (!user) return;

    document.getElementById('quickStatusUserId').value = user.id;
    document.getElementById('quickStatusModalSubtitle').textContent = `Update status for ${user.name} (${user.appNumber})`;
    document.getElementById('quickStatusSelect').value = user.status || 'Pending';
    document.getElementById('quickStatusRemark').value = user.latestRemark || 'Direct Forward to AA';

    document.getElementById('quickStatusModal').classList.add('show');
  }

  function renderAdminDashboard() {
    renderAdminStats();
    renderAdminHome();
    renderAdminUserTable();
    renderAdminApprovalsTable();
    populateTeacherSelectDropdown();
    renderAdminAllDocsTable();
    updateOfficerDisplays();
  }

  function renderAdminStats() {
    const totalTeachers = usersList.length;
    let totalDocs = 0;
    let pendingCount = 0;
    let forwardedCount = 0;
    let approvedCount = 0;
    let rejectedCount = 0;

    usersList.forEach(u => {
      totalDocs += (u.documents ? u.documents.length : 0);
      if (u.status === 'Approved') {
        approvedCount++;
      } else if (u.status === 'Rejected' || u.status === 'Under Scrutiny' || u.status === 'Document Correction Required') {
        rejectedCount++;
      } else if (u.status === 'Direct Forward to AA' || (u.status && u.status.includes('Forward'))) {
        forwardedCount++;
      } else {
        pendingCount++;
      }
    });

    const setEl = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };

    setEl('adminTotalTeachersCount', totalTeachers);
    setEl('adminTotalDocsCount', totalDocs);
    setEl('adminPendingCount', pendingCount);
    setEl('adminForwardedCount', forwardedCount);
    setEl('adminApprovedCount', approvedCount);
    setEl('adminRejectedCount', rejectedCount);

    const syncEl = document.getElementById('adminHomeLastSync');
    if (syncEl) {
      const now = new Date();
      syncEl.textContent = `Live Synced: ${now.toLocaleTimeString()}`;
    }

    // Also update public stats
    const statTeachers = document.getElementById('statTeachersCount');
    if (statTeachers) statTeachers.textContent = `${totalTeachers + 148920}`;
  }

  function renderAdminHome() {
    renderAdminStats();
    renderHomeApplicantCards();
    renderHomeDistrictDistribution();
  }

  function renderHomeApplicantCards() {
    const container = document.getElementById('homeApplicantCardsList');
    if (!container) return;

    container.innerHTML = '';
    if (usersList.length === 0) {
      container.innerHTML = '<p style="color:#64748b; padding:20px;">No registered teachers found.</p>';
      return;
    }

    usersList.forEach(user => {
      const card = document.createElement('div');
      card.className = 'home-applicant-card';

      const dept = getTeacherDepartment(user);
      const sm = getStatusMeta(user.status);

      card.innerHTML = `
        <div class="applicant-card-header">
          <div class="applicant-info-row">
            <div class="applicant-avatar">${user.name.charAt(0)}</div>
            <div class="applicant-names">
              <div style="display:flex; align-items:center; gap:6px;">
                <strong>${escapeHtml(user.name)}</strong>
                <span class="dept-badge dept-badge-sm ${dept === 'SSA' ? 'dept-badge-ssa' : 'dept-badge-dee'}">${dept}</span>
              </div>
              <small>${escapeHtml(user.designation)} • ${escapeHtml(user.username)}</small>
            </div>
          </div>
          <span class="status-pill ${sm.cls}"><span class="status-icon">${sm.icon}</span> ${escapeHtml(sm.label)}</span>
        </div>

        <div class="applicant-detail-grid">
          <div class="detail-item-pair">
            <span>Current School</span>
            <strong title="${user.school}">${user.school}</strong>
          </div>
          <div class="detail-item-pair">
            <span>District & Block</span>
            <strong>${user.district} (${user.block || 'Chenga'})</strong>
          </div>
          <div class="detail-item-pair">
            <span>Application No</span>
            <strong>${user.appNumber}</strong>
          </div>
          <div class="detail-item-pair">
            <span>Destination School</span>
            <strong title="${user.destinationSchool || 'Dakshin Bartary LPS'}">${user.destinationSchool || 'Dakshin Bartary LPS'}</strong>
          </div>
        </div>

        <div class="applicant-remark-box">
          <strong>Latest Remark:</strong> ${user.latestRemark || 'Direct Forward to AA'}
        </div>

        <div class="applicant-card-actions">
          <button class="btn btn-primary btn-sm btn-home-edit-user" data-user-id="${user.id}" title="Edit complete teacher record and status">
            ✏️ Edit All Data
          </button>
          <button class="btn btn-secondary btn-sm btn-home-view-portal" data-user-id="${user.id}" title="Inspect teacher portal as administrator">
            👁️ Preview Portal
          </button>
          <button class="btn btn-outline btn-sm btn-home-upload-doc" data-user-id="${user.id}" title="Issue or upload PDF transfer order">
            📄 Upload Order
          </button>
        </div>
      `;

      container.appendChild(card);
    });

    // Wire action buttons
    container.querySelectorAll('.btn-home-edit-user').forEach(btn => {
      btn.addEventListener('click', () => {
        const userId = btn.getAttribute('data-user-id');
        openEditUserModal(userId);
      });
    });

    container.querySelectorAll('.btn-home-view-portal').forEach(btn => {
      btn.addEventListener('click', () => {
        const userId = btn.getAttribute('data-user-id');
        const user = usersList.find(u => u.id === userId);
        if (user) {
          isAdminPreview = true;
          previewingTeacherId = user.id;
          showToast(`Inspecting Portal for ${user.name}... Click 'Return to Admin Home' or 'Back' anytime to return.`, 'info');
          showView('viewTeacherDashboard');
        }
      });
    });

    container.querySelectorAll('.btn-home-upload-doc').forEach(btn => {
      btn.addEventListener('click', () => {
        const userId = btn.getAttribute('data-user-id');
        switchAdminTab('tabDocs');
        const select = document.getElementById('docTargetUserSelect');
        if (select) {
          select.value = userId;
          updateTargetTeacherPreviewBadge();
        }
        document.getElementById('docTitleInput').focus();
      });
    });
  }

  function renderHomeDistrictDistribution() {
    const tbody = document.getElementById('homeDistrictTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    const assamDistricts = [
      'Barpeta', 'Kamrup (Rural)', 'Kamrup (Metro)', 'Nagaon', 'Dhubri',
      'Cachar', 'Sonitpur', 'Jorhat', 'Dibrugarh', 'Lakhimpur', 'Darrang', 'Bongaigaon'
    ];

    assamDistricts.forEach(district => {
      const teachersInDistrict = usersList.filter(u => u.district && u.district.toLowerCase() === district.toLowerCase());
      const totalInDist = teachersInDistrict.length;
      const pendingInDist = teachersInDistrict.filter(u => u.status === 'Pending').length;
      const forwardedInDist = teachersInDistrict.filter(u => u.status === 'Direct Forward to AA').length;
      const approvedInDist = teachersInDistrict.filter(u => u.status === 'Approved').length;

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${district}</strong></td>
        <td><span class="admin-badge-count">${totalInDist} Teacher${totalInDist === 1 ? '' : 's'}</span></td>
        <td><span class="text-amber font-weight-bold">${pendingInDist}</span></td>
        <td><span class="text-blue font-weight-bold">${forwardedInDist}</span></td>
        <td><span class="text-green font-weight-bold">${approvedInDist}</span></td>
        <td>
          <button class="table-btn btn-filter-district" data-district="${district}" title="Filter users from ${district}">
            Manage District Teachers →
          </button>
        </td>
      `;

      tbody.appendChild(tr);
    });

    tbody.querySelectorAll('.btn-filter-district').forEach(btn => {
      btn.addEventListener('click', () => {
        const dist = btn.getAttribute('data-district');
        switchAdminTab('tabUsers');
        const searchInput = document.getElementById('adminUserSearchInput');
        if (searchInput) {
          searchInput.value = dist;
          renderAdminUserTable(dist.toLowerCase());
        }
      });
    });
  }

  function renderAdminApprovalsTable() {
    const tbody = document.getElementById('adminApprovalsTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    // Update filter pills active state
    document.querySelectorAll('.workflow-filter-pill').forEach(pill => {
      pill.classList.toggle('active', pill.getAttribute('data-filter') === currentWorkflowFilter);
    });

    // Update counts
    const countAll = usersList.length;
    const countPending = usersList.filter(u => u.status === 'Pending').length;
    const countForwarded = usersList.filter(u => u.status === 'Direct Forward to AA' || (u.status && u.status.includes('Forward'))).length;
    const countApproved = usersList.filter(u => u.status === 'Approved').length;
    const countRejected = usersList.filter(u => u.status === 'Rejected' || u.status === 'Under Scrutiny' || u.status === 'Document Correction Required').length;

    const setCt = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };
    setCt('wfCountAll', countAll);
    setCt('wfCountPending', countPending);
    setCt('wfCountForwarded', countForwarded);
    setCt('wfCountApproved', countApproved);
    setCt('wfCountRejected', countRejected);

    const filtered = usersList.filter(user => {
      if (currentWorkflowFilter === 'all') return true;
      if (currentWorkflowFilter === 'Direct Forward to AA') {
        return user.status === 'Direct Forward to AA' || (user.status && user.status.includes('Forward'));
      }
      if (currentWorkflowFilter === 'Rejected') {
        return user.status === 'Rejected' || user.status === 'Under Scrutiny' || user.status === 'Document Correction Required';
      }
      return user.status === currentWorkflowFilter;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding: 24px; color: #64748b;">No applications currently in this status pipeline.</td></tr>`;
      return;
    }

    filtered.forEach(user => {
      const tr = document.createElement('tr');
      const dept = getTeacherDepartment(user);
      const sm = getStatusMeta(user.status);

      tr.innerHTML = `
        <td>
          <div class="table-user-cell">
            <div class="table-user-avatar">${user.name.charAt(0)}</div>
            <div>
              <div style="display:flex; align-items:center; gap:6px;">
                <strong>${escapeHtml(user.name)}</strong>
                <span class="dept-badge dept-badge-sm ${dept === 'SSA' ? 'dept-badge-ssa' : 'dept-badge-dee'}">${dept}</span>
              </div>
              <small style="display:block; color:#64748b;">${escapeHtml(user.empCode || user.username)} • ${escapeHtml(user.designation || '')}</small>
            </div>
          </div>
        </td>
        <td>
          <strong>${escapeHtml(user.appNumber)}</strong>
          <small style="display:block; color:#64748b;">${escapeHtml(user.appType || 'Intra-district')}</small>
        </td>
        <td>
          <span>${escapeHtml(user.school)}</span>
          <small style="display:block; color:#64748b;">${escapeHtml(user.district)} (${escapeHtml(user.block || 'Chenga')})</small>
        </td>
        <td>
          <span>${escapeHtml(user.destinationSchool || (user.preferences && user.preferences[0]) || 'Dakshin Bartary LPS')}</span>
        </td>
        <td>
          <span class="status-pill ${sm.cls}"><span class="status-icon">${sm.icon}</span> ${escapeHtml(sm.label)}</span>
        </td>
        <td>
          <span style="font-size:0.78rem; color:#1e293b;">${user.latestRemark || 'Under Review'}</span>
        </td>
        <td>
          <small>${user.lastActionOn || user.submittedOn || '19-02-2026'}</small>
        </td>
        <td>
          <div class="table-actions-cluster">
            <button class="table-btn primary btn-wf-edit-user" data-user-id="${user.id}" title="Edit all profile & status fields">
              ✏️ Edit All
            </button>
            <button class="table-btn btn-wf-change-status" data-user-id="${user.id}" title="Change status and remark">
              ⚡ Status
            </button>
            <button class="table-btn btn-wf-view-portal" data-user-id="${user.id}" title="Preview teacher portal">
              👁 View
            </button>
          </div>
        </td>
      `;

      tbody.appendChild(tr);
    });

    tbody.querySelectorAll('.btn-wf-edit-user').forEach(btn => {
      btn.addEventListener('click', () => {
        const userId = btn.getAttribute('data-user-id');
        openEditUserModal(userId);
      });
    });

    tbody.querySelectorAll('.btn-wf-change-status').forEach(btn => {
      btn.addEventListener('click', () => {
        const userId = btn.getAttribute('data-user-id');
        openQuickStatusModal(userId);
      });
    });

    tbody.querySelectorAll('.btn-wf-view-portal').forEach(btn => {
      btn.addEventListener('click', () => {
        const userId = btn.getAttribute('data-user-id');
        const user = usersList.find(u => u.id === userId);
        if (user) {
          isAdminPreview = true;
          previewingTeacherId = user.id;
          showToast(`Inspecting Dashboard for ${user.name}... Click 'Return to Admin Home' or 'Back' anytime to return.`, 'info');
          showView('viewTeacherDashboard');
        }
      });
    });
  }

  function renderAdminUserTable(filterQuery = '') {
    const tbody = document.getElementById('adminUsersTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    const filtered = usersList.filter(u => {
      if (!filterQuery) return true;
      return (
        u.name.toLowerCase().includes(filterQuery) ||
        u.username.toLowerCase().includes(filterQuery) ||
        (u.appNumber && u.appNumber.toLowerCase().includes(filterQuery)) ||
        (u.school && u.school.toLowerCase().includes(filterQuery)) ||
        (u.district && u.district.toLowerCase().includes(filterQuery))
      );
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding: 24px; color: #64748b;">No matching teachers found.</td></tr>`;
      return;
    }

    filtered.forEach(user => {
      const tr = document.createElement('tr');
      const dept = getTeacherDepartment(user);
      const docsCount = user.documents ? user.documents.length : 0;

      const sm = getStatusMeta(user.status);

      tr.innerHTML = `
        <td>
          <div class="table-user-cell">
            <div class="table-user-avatar">${user.name.charAt(0)}</div>
            <div>
              <div style="display:flex; align-items:center; gap:6px;">
                <strong>${escapeHtml(user.name)}</strong>
                <span class="dept-badge dept-badge-sm ${dept === 'SSA' ? 'dept-badge-ssa' : 'dept-badge-dee'}">${dept}</span>
              </div>
              <small style="display:block; color:#64748b;">${escapeHtml(user.designation)}</small>
            </div>
          </div>
        </td>
        <td><strong>${escapeHtml(user.username)}</strong></td>
        <td>
          <span style="font-family: monospace; background:#f1f5f9; padding:2px 6px; border-radius:4px;">${escapeHtml(user.password)}</span>
        </td>
        <td><small>${escapeHtml(user.appNumber)}</small></td>
        <td>
          <span>${escapeHtml(user.school)}</span>
          <small style="display:block; color:#64748b;">${escapeHtml(user.district)}</small>
        </td>
        <td>
          <span class="status-pill ${sm.cls}"><span class="status-icon">${sm.icon}</span> ${escapeHtml(sm.label)}</span>
        </td>
        <td>
          <span class="docs-count-badge">${docsCount} Doc${docsCount === 1 ? '' : 's'}</span>
        </td>
        <td>
          <div class="table-actions-cluster">
            <button class="table-btn primary btn-edit-user-all" data-user-id="${user.id}" title="Edit ALL data and status of this teacher">
              ✏️ Edit
            </button>
            <button class="table-btn btn-change-status" data-user-id="${user.id}" title="Quick change status & remark">
              ⚡ Status
            </button>
            <button class="table-btn btn-upload-for-user" data-user-id="${user.id}" title="Upload Document for this teacher">
              📄 Upload
            </button>
            <button class="table-btn btn-reset-user-pwd" data-user-id="${user.id}" title="Set or reset password">
              🔑 Password
            </button>
            <button class="table-btn btn-login-as-teacher" data-user-id="${user.id}" title="View dashboard as this teacher (Preview Mode)">
              👁 View
            </button>
            <button class="table-btn btn-delete-user text-danger" data-user-id="${user.id}" title="Delete User">
              ✕
            </button>
          </div>
        </td>
      `;

      tbody.appendChild(tr);
    });

    // Attach actions
    tbody.querySelectorAll('.btn-edit-user-all').forEach(btn => {
      btn.addEventListener('click', () => {
        const userId = btn.getAttribute('data-user-id');
        openEditUserModal(userId);
      });
    });

    tbody.querySelectorAll('.btn-upload-for-user').forEach(btn => {
      btn.addEventListener('click', () => {
        const userId = btn.getAttribute('data-user-id');
        switchAdminTab('tabDocs');
        const select = document.getElementById('docTargetUserSelect');
        if (select) {
          select.value = userId;
          updateTargetTeacherPreviewBadge();
        }
        document.getElementById('docTitleInput').focus();
      });
    });

    tbody.querySelectorAll('.btn-reset-user-pwd').forEach(btn => {
      btn.addEventListener('click', () => {
        const userId = btn.getAttribute('data-user-id');
        const user = usersList.find(u => u.id === userId);
        if (user) {
          document.getElementById('resetPwdUserId').value = user.id;
          document.getElementById('resetPwdSubtitle').textContent = `Set new password for ${user.name} (${user.username})`;
          document.getElementById('newPasswordInput').value = generateRandomPassword();
          document.getElementById('resetPwdModal').classList.add('show');
        }
      });
    });

    tbody.querySelectorAll('.btn-change-status').forEach(btn => {
      btn.addEventListener('click', () => {
        const userId = btn.getAttribute('data-user-id');
        openQuickStatusModal(userId);
      });
    });

    tbody.querySelectorAll('.btn-login-as-teacher').forEach(btn => {
      btn.addEventListener('click', () => {
        const userId = btn.getAttribute('data-user-id');
        const user = usersList.find(u => u.id === userId);
        if (user) {
          isAdminPreview = true;
          previewingTeacherId = user.id;
          showToast(`Inspecting Dashboard for ${user.name}... You can return to Admin Home anytime by clicking Back.`, 'info');
          showView('viewTeacherDashboard');
        }
      });
    });

    tbody.querySelectorAll('.btn-delete-user').forEach(btn => {
      btn.addEventListener('click', () => {
        const userId = btn.getAttribute('data-user-id');
        const user = usersList.find(u => u.id === userId);
        if (user && confirm(`Are you sure you want to delete teacher ${user.name} (${user.username})?`)) {
          usersList = usersList.filter(u => u.id !== userId);
          saveUsers();
          logActivity('TEACHER_DELETED', `Teacher "${user.name}" (${user.username}) removed from system.`, { teacherId: userId });
          const client = getSupabase();
          if (client) {
            client.from('teachers').delete().eq('id', userId).then(() => {
              console.log(`[Supabase] Teacher ${userId} deleted from cloud.`);
            }).catch(console.warn);
          }
          showToast(`Teacher ${user.name} removed.`, 'info');
          renderAdminDashboard();
        }
      });
    });
  }

  function updateTargetTeacherPreviewBadge() {
    const select = document.getElementById('docTargetUserSelect');
    const badge = document.getElementById('targetTeacherPreviewBadge');
    const textSpan = document.getElementById('targetTeacherPreviewText');
    if (!select || !badge || !textSpan) return;

    const teacher = usersList.find(u => u.id === select.value);
    if (teacher) {
      const docCount = (teacher.documents && teacher.documents.length) || 0;
      textSpan.innerHTML = `<strong>${escapeHtml(teacher.name)}</strong> (${escapeHtml(teacher.appNumber || teacher.username)}) &bull; ${escapeHtml(teacher.school || 'School')} &bull; Existing Uploaded Docs: <span style="font-weight:700; color:#0369a1;">${docCount}</span>`;
      badge.style.display = 'block';
    } else {
      badge.style.display = 'none';
    }
  }

  function populateTeacherSelectDropdown() {
    const select = document.getElementById('docTargetUserSelect');
    if (!select) return;

    const currentVal = select.value;
    select.innerHTML = '';
    usersList.forEach(user => {
      const option = document.createElement('option');
      option.value = user.id;
      const count = (user.documents && user.documents.length) || 0;
      option.textContent = `${user.name} - ${user.username} (${user.appNumber}) [${count} doc${count === 1 ? '' : 's'}]`;
      select.appendChild(option);
    });

    if (currentVal && usersList.some(u => u.id === currentVal)) {
      select.value = currentVal;
    } else if (usersList.length > 0) {
      select.value = usersList[0].id;
    }
    updateTargetTeacherPreviewBadge();
  }

  function renderAdminAllDocsTable() {
    const tbody = document.getElementById('allDocsTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    const allDocs = [];

    usersList.forEach(user => {
      (user.documents || []).forEach(doc => {
        allDocs.push({ ...doc, user });
      });
    });

    if (allDocs.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 20px; color: #64748b;">No documents uploaded yet.</td></tr>`;
      return;
    }

    allDocs.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div style="display:flex; align-items:center; gap:8px;">
            <svg class="icon-sm text-danger" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
            <div>
              <strong>${item.title}</strong>
              <small style="display:block; color:#64748b;">${item.fileName || 'document.pdf'} (${item.fileSize || '340 KB'})</small>
            </div>
          </div>
        </td>
        <td>
          <strong>${item.user.name}</strong>
          <small style="display:block; color:#64748b;">${item.user.username}</small>
        </td>
        <td><span class="doc-category-tag">${item.category}</span></td>
        <td><small>${item.uploadedAt}</small></td>
        <td>
          <div class="table-actions-cluster">
            <button class="table-btn btn-admin-view-doc" data-user-id="${item.user.id}" data-doc-id="${item.id}">Preview</button>
            <button class="table-btn primary btn-admin-dl-doc" data-user-id="${item.user.id}" data-doc-id="${item.id}">Download</button>
            <button class="table-btn text-danger btn-admin-del-doc" data-user-id="${item.user.id}" data-doc-id="${item.id}">Delete</button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });

    // Attach Admin doc actions
    tbody.querySelectorAll('.btn-admin-view-doc').forEach(btn => {
      btn.addEventListener('click', () => {
        const uId = btn.getAttribute('data-user-id');
        const dId = btn.getAttribute('data-doc-id');
        const user = usersList.find(u => u.id === uId);
        if (user) {
          const doc = user.documents.find(d => d.id === dId);
          if (doc) previewDocument(doc, user);
        }
      });
    });

    tbody.querySelectorAll('.btn-admin-dl-doc').forEach(btn => {
      btn.addEventListener('click', () => {
        const uId = btn.getAttribute('data-user-id');
        const dId = btn.getAttribute('data-doc-id');
        const user = usersList.find(u => u.id === uId);
        if (user) {
          const doc = user.documents.find(d => d.id === dId);
          if (doc) downloadDocument(doc, user);
        }
      });
    });

    tbody.querySelectorAll('.btn-admin-del-doc').forEach(btn => {
      btn.addEventListener('click', () => {
        const uId = btn.getAttribute('data-user-id');
        const dId = btn.getAttribute('data-doc-id');
        const user = usersList.find(u => u.id === uId);
        if (user && confirm('Delete this uploaded document?')) {
          const docToDelete = user.documents.find(d => d.id === dId);
          user.documents = user.documents.filter(d => d.id !== dId);
          saveUsers();
          logActivity('DOCUMENT_DELETED', `Document "${docToDelete ? docToDelete.title : dId}" deleted.`, { teacherId: uId, docId: dId }, uId);
          const client = getSupabase();
          if (client) {
            client.from('documents').delete().eq('id', dId).then(() => {
              console.log(`[Supabase] Document ${dId} deleted from cloud.`);
            }).catch(console.warn);
          }
          showToast('Document deleted.', 'info');
          renderAdminDashboard();
        }
      });
    });
  }

  // ==========================================
  // 10. PREVIEW & PDF DOWNLOAD SYSTEM
  // ==========================================
  let activePreviewDoc = null;
  let activePreviewUser = null;

  function previewDocument(doc, user) {
    activePreviewDoc = doc;
    activePreviewUser = user;
    updateOfficerDisplays(user);

    const modal = document.getElementById('docPreviewModal');
    document.getElementById('previewDocTitle').textContent = doc.title;
    document.getElementById('previewDocSubtitle').textContent = `Issued for ${user.name} (${user.appNumber})`;
    document.getElementById('previewOrderRef').textContent = doc.refNumber || `No. E-28841/TTMS/2026/${user.appNumber}`;
    document.getElementById('previewOrderDate').textContent = `Dated Kahilipara, the ${doc.uploadedAt ? doc.uploadedAt.split(' ')[0] : '19-02-2026'}`;

    const tableBody = document.getElementById('previewOrderTableBody');
    tableBody.innerHTML = `
      <tr>
        <td>
          <strong>${user.name}</strong><br>
          <small>ID: ${user.empCode || 'TET-2014-99812'}</small><br>
          <small>App No: ${user.appNumber}</small>
        </td>
        <td>
          <strong>${user.school}</strong><br>
          <small>U-DISE: ${user.udise || '18050214801'}</small><br>
          <small>${user.district}</small>
        </td>
        <td>
          <strong>${user.destinationSchool || 'Dakshin Bartary Milan LPS'}</strong><br>
          <small>Post: ${user.designation}</small>
        </td>
        <td>
          <span class="status-pill status-approved">Approved Order</span><br>
          <small>${user.appType}</small>
        </td>
      </tr>
    `;

    const downloadBtn = document.getElementById('downloadFromPreviewBtn');
    if (downloadBtn) {
      downloadBtn.onclick = () => {
        downloadDocument(doc, user);
      };
    }

    modal.classList.add('show');
  }

  function downloadDocument(doc, user) {
    // 1. If uploaded data URI exists, download that exact file
    if (doc.fileData && doc.fileData.startsWith('data:')) {
      const a = document.createElement('a');
      a.href = doc.fileData;
      a.download = doc.fileName || `${doc.title.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showToast(`Downloaded: ${a.download}`, 'success');
      return;
    }

    // 2. If storageUrl or remote URL exists, download/open from cloud storage
    const fileUrl = doc.storageUrl || (doc.fileData && doc.fileData.startsWith('http') ? doc.fileData : null);
    if (fileUrl) {
      const a = document.createElement('a');
      a.href = fileUrl;
      a.target = '_blank';
      a.download = doc.fileName || `${doc.title.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showToast(`Downloading: ${doc.fileName || doc.title}`, 'success');
      return;
    }

    // 3. Otherwise generate professional Assam Government PDF using jsPDF
    generateOfficialAssamGovtPdf(doc, user);
  }

  function generateOfficialAssamGovtPdf(doc, user) {
    if (typeof window.jspdf === 'undefined' || !window.jspdf.jsPDF) {
      // Fallback: create printable text file if jsPDF is loading
      const textContent = `
GOVERNMENT OF ASSAM
DEPARTMENT OF SCHOOL EDUCATION
DIRECTORATE OF ELEMENTARY EDUCATION, KAHILIPARA, GUWAHATI-19
---------------------------------------------------------------
ORDER REF: ${doc.refNumber || 'No. E-28841/TTMS/2026/013351'}
DATED: ${doc.uploadedAt || '19-02-2026'}

OFFICIAL TRANSFER ORDER UNDER TTMS (hrmsassam.in)

In pursuance of the Assam Elementary Education (Transfer of Teachers) Rules and as approved by the Competent Authority, sanction is hereby accorded to the transfer of:

Teacher Name: ${user.name}
Designation: ${user.designation}
Application Number: ${user.appNumber}
Current School: ${user.school} (${user.district})
Transferred School: ${user.destinationSchool || 'Dakshin Bartary Milan LPS'}

Digitally Authenticated: Director of Elementary Education, Assam
      `;
      const blob = new Blob([textContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${user.name.replace(/\s+/g, '_')}_Transfer_Order.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Document downloaded.', 'success');
      return;
    }

    try {
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Background border
      pdf.setDrawColor(14, 76, 100);
      pdf.setLineWidth(0.8);
      pdf.rect(10, 10, 190, 277);

      pdf.setDrawColor(197, 155, 39);
      pdf.setLineWidth(0.4);
      pdf.rect(12, 12, 186, 273);

      // Header
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.setTextColor(14, 76, 100);
      pdf.text('GOVERNMENT OF ASSAM', 105, 24, { align: 'center' });

      pdf.setFontSize(10);
      pdf.setTextColor(180, 83, 9);
      pdf.text('DEPARTMENT OF SCHOOL EDUCATION', 105, 30, { align: 'center' });

      pdf.setFontSize(9);
      pdf.setTextColor(60, 60, 60);
      const dept = getTeacherDepartment(user);
      const deptHeading = dept === 'SSA'
        ? 'SAMAGRA SHIKSHA ASSAM (SSA), STATE MISSION DIRECTORATE, GUWAHATI'
        : 'DIRECTORATE OF ELEMENTARY EDUCATION, KAHILIPARA, GUWAHATI-19';
      pdf.text(deptHeading, 105, 35, { align: 'center' });

      // Horizontal separator line
      pdf.setDrawColor(14, 76, 100);
      pdf.setLineWidth(0.5);
      pdf.line(20, 39, 190, 39);

      // Order Reference & Date
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      pdf.text(`${doc.refNumber || 'No. E-28841/TTMS/2026/013351'}`, 20, 46);
      pdf.text(`Dated Kahilipara, ${doc.uploadedAt ? doc.uploadedAt.split(' ')[0] : '19-02-2026'}`, 190, 46, { align: 'right' });

      // Subject
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(14, 76, 100);
      pdf.text('ORDER: GENERAL TRANSFER & POSTING NOTIFICATION', 105, 56, { align: 'center' });

      // Body text
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9.5);
      pdf.setTextColor(30, 30, 30);
      const introText = `In pursuance of the Assam Elementary Education (Transfer of Teachers) Rules and in the interest of public service, sanction is hereby accorded to the transfer and posting of the following teacher under the online Teacher Transfer Management System (TTMS):`;
      const splitIntro = pdf.splitTextToSize(introText, 170);
      pdf.text(splitIntro, 20, 64);

      // Table Box
      let startY = 78;
      pdf.setFillColor(240, 247, 250);
      pdf.rect(20, startY, 170, 48, 'F');
      pdf.setDrawColor(180, 200, 210);
      pdf.rect(20, startY, 170, 48, 'S');

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9);
      pdf.setTextColor(14, 76, 100);
      pdf.text('PARTICULARS OF TEACHER & POSTING DETAILS', 24, startY + 7);

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8.5);
      pdf.setTextColor(0, 0, 0);

      pdf.text(`Teacher Full Name:`, 24, startY + 15);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${user.name}`, 70, startY + 15);

      pdf.setFont('helvetica', 'normal');
      pdf.text(`Designation:`, 24, startY + 22);
      pdf.text(`${user.designation}`, 70, startY + 22);

      pdf.text(`Application Number:`, 24, startY + 29);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${user.appNumber}`, 70, startY + 29);

      pdf.setFont('helvetica', 'normal');
      pdf.text(`Present School & District:`, 24, startY + 36);
      pdf.text(`${user.school} (${user.district})`, 70, startY + 36);

      pdf.text(`Transferred Destination:`, 24, startY + 43);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(21, 128, 61);
      pdf.text(`${user.destinationSchool || 'Dakshin Bartary Milan LPS'}`, 70, startY + 43);

      // Terms
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8.5);
      pdf.setTextColor(40, 40, 40);
      let termsY = startY + 58;
      pdf.text('Terms and Conditions:', 20, termsY);
      pdf.text('1. The teacher should be relieved immediately by the competent authority to join the new post.', 20, termsY + 6);
      pdf.text('2. No Travelling Allowance (T.A.) or Daily Allowance (D.A.) is admissible under General Transfer rules.', 20, termsY + 12);
      const updateAuthority = (dept === 'SSA') ? 'District Mission Coordinator (DMC) / SSA' : 'District Elementary Education Officer (DEEO)';
      pdf.text(`3. The ${updateAuthority} shall update the Service Book accordingly.`, 20, termsY + 18);
      pdf.text('4. This is an electronically generated and verified order issued through hrmsassam.in.', 20, termsY + 24);

      // Remarks note
      if (doc.remarks) {
        pdf.setFillColor(254, 243, 199);
        pdf.rect(20, termsY + 30, 170, 12, 'F');
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(8);
        pdf.setTextColor(146, 64, 14);
        pdf.text(`ADMINISTRATIVE REMARK: ${doc.remarks}`, 24, termsY + 37);
      }

      // Digital Signature Box (Department Competent State Officer: DEE or SSA)
      let sigY = termsY + 54;
      pdf.setDrawColor(34, 197, 94);
      pdf.setFillColor(240, 253, 244);
      pdf.roundedRect(20, sigY, 68, 24, 2, 2, 'FD');
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8);
      pdf.setTextColor(21, 128, 61);
      pdf.text('✓ DIGITALLY AUTHENTICATED', 24, sigY + 7);
      pdf.setFontSize(7.5);
      pdf.setTextColor(0, 0, 0);

      const signatoryOfficer = getOfficerForTeacher(user);
      pdf.text(signatoryOfficer.designation, 24, sigY + 13);
      pdf.text('Govt of Assam (TTMS Portal)', 24, sigY + 19);

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9);
      pdf.setTextColor(0, 0, 0);
      pdf.text(`(${signatoryOfficer.name})`, 140, sigY + 8);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.text(signatoryOfficer.designation, 140, sigY + 14);
      pdf.text(signatoryOfficer.department, 140, sigY + 19);

      // Footer
      pdf.setFontSize(7.5);
      pdf.setTextColor(120, 120, 120);
      pdf.text('Official Portal: https://hrmsassam.in | Teacher Transfer Management System (TTMS)', 105, 276, { align: 'center' });

      // Trigger Save
      const filename = doc.fileName || `Transfer_Order_${user.appNumber.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      pdf.save(filename);
      showToast(`Successfully downloaded: ${filename}`, 'success');

    } catch (err) {
      console.error('PDF generation error:', err);
      showToast('Downloaded document.', 'success');
    }
  }

  // ==========================================
  // 11. HELPER UTILITIES
  // ==========================================
  function generateRandomPassword() {
    const chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789@#';
    let pwd = '';
    for (let i = 0; i < 8; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pwd;
  }

  function getTodayDateString() {
    const now = new Date();
    const d = String(now.getDate()).padStart(2, '0');
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const y = now.getFullYear();
    return `${d}-${m}-${y}`;
  }

  // ==========================================
  // 12. INITIALIZATION
  // ==========================================
  function init() {
    loadUsers();
    loadSession();
    loadOfficerInfo();
    setupAuthEvents();
    setupAdminEvents();
    setupOfficerEvents();
    updateOfficerDisplays();
    generateCaptcha();
    initSupabaseRealtime();

    // Start live clock
    updateLiveClock();
    setInterval(updateLiveClock, 1000);

    // Initial View
    if (currentSession) {
      if (currentSession.role === 'admin') {
        showView('viewAdminDashboard');
      } else {
        showView('viewTeacherDashboard');
      }
    } else {
      showView('viewHome');
    }

    console.log('TTMS Assam application initialized successfully.');
  }

  // Run on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
