const base = 'http://localhost:5000';

const request = async (method, path, body, token) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${base}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = text;
  }

  return { status: res.status, data: json };
};

const assert = (condition, message) => {
  if (!condition) {
    throw new Error(message);
  }
};

(async () => {
  const userEmail = `api_verify_${Date.now()}@example.com`;
  const userPayload = { name: 'API Verify User', email: userEmail, password: 'Pass123!' };

  const results = [];

  const add = async (name, fn) => {
    const res = await fn();
    results.push({ name, status: res.status, data: res.data });
    return res;
  };

  const dbCheck = await add('GET /api/test-db', () => request('GET', '/api/test-db'));
  assert(dbCheck.status === 200, 'Database check failed');

  const userCreate = await add('POST /api/users', () => request('POST', '/api/users', userPayload));
  assert(userCreate.status === 201, 'User creation failed');

  const login = await add('POST /api/users/login', () => request('POST', '/api/users/login', {
    email: userEmail,
    password: 'Pass123!',
  }));
  assert(login.status === 200, 'Login failed');
  const token = login.data.token;
  assert(token, 'JWT token missing');

  const me = await add('GET /api/users/me', () => request('GET', '/api/users/me', null, token));
  assert(me.status === 200, 'GET /api/users/me failed');

  const users = await add('GET /api/users', () => request('GET', '/api/users', null, token));
  assert(users.status === 200, 'GET /api/users failed');

  const resumeCreate = await add('POST /api/resumes', () => request('POST', '/api/resumes', {
    title: 'Verify Resume',
    type: 'resume',
  }, token));
  assert(resumeCreate.status === 201, 'Resume creation failed');
  const resumeId = resumeCreate.data.resumeId;
  assert(resumeId, 'resumeId missing');

  const resumes = await add('GET /api/resumes', () => request('GET', '/api/resumes', null, token));
  assert(resumes.status === 200, 'GET /api/resumes failed');

  const resumeUpdate = await add('PUT /api/resumes/:id', () => request('PUT', `/api/resumes/${resumeId}`, {
    title: 'Updated Resume',
  }, token));
  assert(resumeUpdate.status === 200, 'Resume update failed');

  const sectionCreate = await add('POST /api/sections/resume/:resumeId', () => request('POST', `/api/sections/resume/${resumeId}`, {
    heading: 'Experience',
    position: 1,
  }, token));
  assert(sectionCreate.status === 201, 'Section creation failed');
  const sectionId = sectionCreate.data.sectionId;
  assert(sectionId, 'sectionId missing');

  const sections = await add('GET /api/sections/resume/:resumeId', () => request('GET', `/api/sections/resume/${resumeId}`, null, token));
  assert(sections.status === 200, 'GET /api/sections/resume/:resumeId failed');

  const sectionUpdate = await add('PUT /api/sections/:id', () => request('PUT', `/api/sections/${sectionId}`, {
    heading: 'Updated Experience',
  }, token));
  assert(sectionUpdate.status === 200, 'Section update failed');

  const itemCreate = await add('POST /api/items/section/:sectionId', () => request('POST', `/api/items/section/${sectionId}`, {
    content: { text: 'hello from API verify' },
    position: 1,
  }, token));
  assert(itemCreate.status === 201, 'Item creation failed');
  const itemId = itemCreate.data.itemId;
  assert(itemId, 'itemId missing');

  const items = await add('GET /api/items/section/:sectionId', () => request('GET', `/api/items/section/${sectionId}`, null, token));
  assert(items.status === 200, 'GET /api/items/section/:sectionId failed');
  assert(items.data.data[0].content && typeof items.data.data[0].content === 'object' && items.data.data[0].content.text === 'hello from API verify', 'Item JSON serialization failed');

  const itemUpdate = await add('PUT /api/items/:id', () => request('PUT', `/api/items/${itemId}`, {
    content: { text: 'updated item content' },
  }, token));
  assert(itemUpdate.status === 200, 'Item update failed');

  const templateCreate = await add('POST /api/templates', () => request('POST', '/api/templates', {
    name: 'API Verify Template',
    config: { theme: 'dark', accent: 'purple' },
  }, token));
  assert(templateCreate.status === 201, 'Template creation failed');
  const templateId = templateCreate.data.templateId;
  assert(templateId, 'templateId missing');

  const templates = await add('GET /api/templates', () => request('GET', '/api/templates', null, token));
  assert(templates.status === 200, 'GET /api/templates failed');
  const newTemplate = templates.data.data.find((t) => t.name === 'API Verify Template');
  assert(newTemplate && typeof newTemplate.config === 'object' && newTemplate.config.theme === 'dark', 'Template JSON serialization failed');

  const templateUpdate = await add('PUT /api/templates/:id', () => request('PUT', `/api/templates/${templateId}`, {
    config: { theme: 'light', accent: 'blue' },
  }, token));
  assert(templateUpdate.status === 200, 'Template update failed');

  const versionCreate = await add('POST /api/versions', () => request('POST', '/api/versions', {
    snapshot: { title: 'v1', summary: 'Initial snapshot' },
    label: 'Initial',
    documentId: resumeId,
  }, token));
  assert(versionCreate.status === 201, 'Version creation failed');
  const versionId = versionCreate.data.versionId;
  assert(versionId, 'versionId missing');

  const versions = await add('GET /api/versions/document/:documentId', () => request('GET', `/api/versions/document/${resumeId}`, null, token));
  assert(versions.status === 200, 'GET /api/versions/document/:documentId failed');
  assert(versions.data.data[0].snapshot && typeof versions.data.data[0].snapshot === 'object' && versions.data.data[0].snapshot.title === 'v1', 'Version JSON serialization failed');

  const versionUpdate = await add('PUT /api/versions/:id', () => request('PUT', `/api/versions/${versionId}`, {
    label: 'Updated',
  }, token));
  assert(versionUpdate.status === 200, 'Version update failed');

  const shareCreate = await add('POST /api/shares/document/:documentId', () => request('POST', `/api/shares/document/${resumeId}`, {}, token));
  assert(shareCreate.status === 201, 'Share creation failed');
  const shareSlug = shareCreate.data.slug;
  assert(shareSlug, 'share slug missing');

  const sharedResume = await add('GET /api/shares/:slug', () => request('GET', `/api/shares/${shareSlug}`));
  assert(sharedResume.status === 200, 'GET /api/shares/:slug failed');

  const exportCreate = await add('POST /api/exports', () => request('POST', '/api/exports', {
    format: 'pdf',
    fileUrl: 'https://example.com/resume.pdf',
    documentId: resumeId,
    userId: me.data.data.id,
  }, token));
  assert(exportCreate.status === 201, 'Export creation failed');

  const exportsList = await add('GET /api/exports', () => request('GET', '/api/exports', null, token));
  assert(exportsList.status === 200, 'GET /api/exports failed');

  const appCreate = await add('POST /api/applications', () => request('POST', '/api/applications', {
    company: 'Contoso',
    role: 'Engineer',
    status: 'applied',
    userId: me.data.data.id,
    documentId: resumeId,
  }, token));
  assert(appCreate.status === 201, 'Application creation failed');
  const appId = appCreate.data.applicationId;
  assert(appId, 'applicationId missing');

  const userApps = await add('GET /api/applications/user/:userId', () => request('GET', `/api/applications/user/${me.data.data.id}`, null, token));
  assert(userApps.status === 200, 'GET /api/applications/user/:userId failed');

  const exportDelete = await add('DELETE /api/exports/:id', () => request('DELETE', `/api/exports/${exportCreate.data.exportId}`, null, token));
  assert(exportDelete.status === 200, 'Export delete failed');

  const applicationDelete = await add('DELETE /api/applications/:id', () => request('DELETE', `/api/applications/${appId}`, null, token));
  assert(applicationDelete.status === 200, 'Application delete failed');

  const resumeDelete = await add('DELETE /api/resumes/:id', () => request('DELETE', `/api/resumes/${resumeId}`, null, token));
  assert(resumeDelete.status === 200, 'Resume delete failed');

  const sectionDelete = await add('DELETE /api/sections/:id', () => request('DELETE', `/api/sections/${sectionId}`, null, token));
  assert(sectionDelete.status === 200, 'Section delete failed');

  const itemDelete = await add('DELETE /api/items/:id', () => request('DELETE', `/api/items/${itemId}`, null, token));
  assert(itemDelete.status === 200, 'Item delete failed');

  const templateDelete = await add('DELETE /api/templates/:id', () => request('DELETE', `/api/templates/${templateId}`, null, token));
  assert(templateDelete.status === 200, 'Template delete failed');

  const versionDelete = await add('DELETE /api/versions/:id', () => request('DELETE', `/api/versions/${versionId}`, null, token));
  assert(versionDelete.status === 200, 'Version delete failed');

  const failures = results.filter((r) => r.status >= 400 || (typeof r.data === 'string' && r.data.includes('Error')));
  if (failures.length) {
    console.error('API failures:', JSON.stringify(failures, null, 2));
    process.exit(1);
  }

  console.log('ALL_API_CHECKS_PASSED');
  console.log(JSON.stringify(results.map((r) => ({ name: r.name, status: r.status })), null, 2));
})();
