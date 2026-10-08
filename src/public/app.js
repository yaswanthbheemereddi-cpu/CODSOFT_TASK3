const API_TASKS = '/api/tasks';
const API_AUTH = '/api/auth';

let currentToken = localStorage.getItem('token') || '';
let currentUser = JSON.parse(localStorage.getItem('user') || 'null');

function getHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  if (currentToken) {
    headers['Authorization'] = `Bearer ${currentToken}`;
  }
  return headers;
}

async function loadTasks() {
  const search = document.getElementById('task-search').value;
  const is_completed = document.getElementById('status-filter').value;
  const priority = document.getElementById('priority-filter').value;
  const category = document.getElementById('category-filter').value;

  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (is_completed !== '') params.append('is_completed', is_completed);
  if (priority) params.append('priority', priority);
  if (category) params.append('category', category);

  const res = await fetch(`${API_TASKS}?${params.toString()}`, { headers: getHeaders() });
  const data = await res.json();
  const container = document.getElementById('task-container');

  if (data.summary) {
    document.getElementById('stat-total').innerText = data.summary.total;
    document.getElementById('stat-pending').innerText = data.summary.pending;
    document.getElementById('stat-completed').innerText = data.summary.completed;
    document.getElementById('stat-urgent').innerText = data.summary.urgent;
  }

  if (!data.data || data.data.length === 0) {
    container.innerHTML = '<div style="text-align: center; color: #94a3b8; padding: 40px;">No tasks matching criteria. Click "+ Add New Task" to create one!</div>';
    return;
  }

  container.innerHTML = data.data.map(t => `
    <div class="task-card ${t.is_completed ? 'completed' : ''}">
      <div class="task-left">
        <input type="checkbox" class="checkbox-round" ${t.is_completed ? 'checked' : ''} onchange="toggleTask(${t.id})">
        <div>
          <div class="task-title">${escapeHtml(t.title)}</div>
          ${t.description ? `<div class="task-desc">${escapeHtml(t.description)}</div>` : ''}
          <div class="task-tags">
            <span class="tag priority-${t.priority}">${t.priority}</span>
            <span class="tag cat-tag">${t.category}</span>
            ${t.due_date ? `<span class="due-tag">📅 Due: ${t.due_date}</span>` : ''}
          </div>
        </div>
      </div>
      <div class="task-actions">
        <button class="btn btn-sm btn-secondary" onclick='editTask(${JSON.stringify(t)})'>Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteTask(${t.id})">Delete</button>
      </div>
    </div>
  `).join('');
}

async function toggleTask(id) {
  await fetch(`${API_TASKS}/${id}/toggle`, {
    method: 'PATCH',
    headers: getHeaders()
  });
  loadTasks();
}

function openTaskModal() {
  document.getElementById('task-modal-title').innerText = 'Add New Task';
  document.getElementById('t-id').value = '';
  document.getElementById('task-form').reset();
  document.getElementById('task-modal').classList.remove('hidden');
}

function editTask(t) {
  document.getElementById('task-modal-title').innerText = 'Edit Task';
  document.getElementById('t-id').value = t.id;
  document.getElementById('t-title').value = t.title;
  document.getElementById('t-desc').value = t.description || '';
  document.getElementById('t-priority').value = t.priority || 'medium';
  document.getElementById('t-category').value = t.category || 'personal';
  document.getElementById('t-duedate').value = t.due_date || '';
  document.getElementById('task-modal').classList.remove('hidden');
}

async function saveTask(e) {
  e.preventDefault();
  const id = document.getElementById('t-id').value;
  const payload = {
    title: document.getElementById('t-title').value,
    description: document.getElementById('t-desc').value,
    priority: document.getElementById('t-priority').value,
    category: document.getElementById('t-category').value,
    due_date: document.getElementById('t-duedate').value || null
  };

  const isEdit = Boolean(id);
  const url = isEdit ? `${API_TASKS}/${id}` : API_TASKS;
  const method = isEdit ? 'PUT' : 'POST';

  const res = await fetch(url, {
    method,
    headers: getHeaders(),
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (data.success) {
    closeModals();
    loadTasks();
  } else {
    alert(data.message || 'Error saving task');
  }
}

async function deleteTask(id) {
  if (!confirm('Are you sure you want to delete this task?')) return;
  const res = await fetch(`${API_TASKS}/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  const data = await res.json();
  if (data.success) {
    loadTasks();
  } else {
    alert(data.message);
  }
}

// AUTH
function openAuthModal() {
  document.getElementById('auth-modal').classList.remove('hidden');
}

let authMode = 'login';
function switchAuthTab(mode) {
  authMode = mode;
  document.getElementById('btn-login-tab').classList.toggle('active', mode === 'login');
  document.getElementById('btn-reg-tab').classList.toggle('active', mode === 'register');
  document.getElementById('group-reg-name').style.display = mode === 'register' ? 'flex' : 'none';
  document.getElementById('auth-submit-btn').innerText = mode === 'register' ? 'Register Account' : 'Login';
}

async function submitAuth(e) {
  e.preventDefault();
  const email = document.getElementById('auth-email').value;
  const password = document.getElementById('auth-password').value;
  const name = document.getElementById('auth-name').value;

  const url = authMode === 'register' ? `${API_AUTH}/register` : `${API_AUTH}/login`;
  const body = authMode === 'register' ? { name, email, password } : { email, password };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  const data = await res.json();
  if (data.success) {
    currentToken = data.data.token;
    currentUser = data.data.user;
    localStorage.setItem('token', currentToken);
    localStorage.setItem('user', JSON.stringify(currentUser));
    document.getElementById('user-info').innerHTML = `Logged in as: <strong>${escapeHtml(currentUser.name)} (${escapeHtml(currentUser.email)})</strong>`;
    alert(authMode === 'register' ? 'Registration complete & logged in!' : 'Login successful!');
    closeModals();
    loadTasks();
  } else {
    alert(data.message || 'Auth failed');
  }
}

function closeModals() {
  document.getElementById('task-modal').classList.add('hidden');
  document.getElementById('auth-modal').classList.add('hidden');
}

function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[m]);
}

document.addEventListener('DOMContentLoaded', () => {
  if (currentUser) {
    document.getElementById('user-info').innerHTML = `Logged in as: <strong>${escapeHtml(currentUser.name)} (${escapeHtml(currentUser.email)})</strong>`;
  }
  loadTasks();
});
