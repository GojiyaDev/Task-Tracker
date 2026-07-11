(function () {
  const STORAGE_KEY = 'taskTracker_tasks';

  const emptyState     = document.getElementById('emptyState');
  const noResultsState = document.getElementById('noResultsState');
  const taskGrid       = document.getElementById('taskGrid');
  const taskList       = document.getElementById('taskList');
  const tableInfo      = document.getElementById('tableInfo');
  const toastContainer = document.getElementById('toastContainer');
  const filterBar      = document.getElementById('filterBar');
  const searchInput    = document.getElementById('searchInput');
  const filterStatus   = document.getElementById('filterStatus');
  const filterPriority = document.getElementById('filterPriority');
  const sortBy         = document.getElementById('sortBy');
  const clearBtn       = document.getElementById('clearFilters');
  const modalTask      = document.getElementById('taskModal');
  const form           = document.getElementById('taskForm');
  const saveBtn        = document.getElementById('saveTaskBtn');
  const modalTitle     = document.getElementById('modalTitle');
  const fieldName      = document.getElementById('taskName');
  const fieldDesc      = document.getElementById('taskDesc');
  const fieldPriority  = document.getElementById('taskPriority');
  const fieldStatus    = document.getElementById('taskStatus');
  const fieldDueDate   = document.getElementById('taskDueDate');
  const confirmModalEl = document.getElementById('confirmModal');
  const confirmTitle   = document.getElementById('confirmTitle');
  const confirmBody    = document.getElementById('confirmBody');
  const confirmBtn     = document.getElementById('confirmActionBtn');
  const confirmBtnText = document.getElementById('confirmBtnText');
  const confirmSpinner = document.getElementById('confirmBtnSpinner');
  const confirmIcon    = document.getElementById('confirmIcon');
  const excelFileInput = document.getElementById('excelFileInput');
  const exportBtn      = document.getElementById('exportExcelBtn');
  const importBtn      = document.getElementById('importExcelBtn');
  const excelModalEl   = document.getElementById('excelInstructionModal');
  const proceedUpload  = document.getElementById('proceedUploadBtn');
  const clearFiltersFromEmpty = document.getElementById('clearFiltersFromEmpty');
  const paginationList = document.getElementById('paginationList');
  const loadingOverlay = document.getElementById('loadingOverlay');

  const priorityClass = {
    Low: 'bg-success',
    Medium: 'bg-warning text-dark',
    High: 'bg-danger'
  };

  const statusClass = {
    Pending: 'bg-secondary',
    'In Progress': 'bg-primary',
    Completed: 'bg-success'
  };

  const toastIcons = {
    success: '<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>',
    danger: '<path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 5zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>',
    info: '<path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>',
    warning: '<path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>'
  };

  const confirmIcons = {
    danger: '<svg width="24" height="24" fill="currentColor" viewBox="0 0 16 16"><path d="M8 1a2 2 0 0 0-2 2v2H3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3V3a2 2 0 0 0-2-2z"/></svg>',
    info: '<svg width="24" height="24" fill="currentColor" viewBox="0 0 16 16"><path d="M4 4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1h-2V4H6v1H4V4zm-1 3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"/></svg>',
    warning: '<svg width="24" height="24" fill="currentColor" viewBox="0 0 16 16"><path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/></svg>'
  };

  function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    return str.replace(/[&<>"']/g, function (m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;' }[m];
    });
  }

  let editId = null;
  const PAGE_SIZE = 10;
  let currentPage = 1;

  function isValidTask(obj) {
    return obj && typeof obj === 'object' && typeof obj.id === 'string' && typeof obj.name === 'string';
  }

  function loadTasks() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw === null) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(isValidTask);
    } catch (e) {
      return [];
    }
  }

  function saveTasks(tasks) {
    if (!Array.isArray(tasks)) return false;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      return true;
    } catch (e) {
      return false;
    }
  }

  function generateID() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function addTask(data) {
    if (!data || !data.name) return null;
    const tasks = loadTasks();
    const nameKey = data.name.trim().toLowerCase();
    if (tasks.some(function (t) { return t.name.trim().toLowerCase() === nameKey; })) {
      return null;
    }
    const task = {
      id: generateID(),
      name: data.name,
      description: data.description || '',
      priority: data.priority || 'Medium',
      status: data.status || 'Pending',
      dueDate: data.dueDate || '',
      createdAt: new Date().toISOString()
    };
    tasks.push(task);
    return saveTasks(tasks) ? task : null;
  }

  function updateTask(id, data) {
    if (!id || !data) return null;
    const tasks = loadTasks();
    const idx = tasks.findIndex(function (t) { return t.id === id; });
    if (idx === -1) return null;
    tasks[idx] = { ...tasks[idx], ...data, id: id };
    return saveTasks(tasks) ? tasks[idx] : null;
  }

  function deleteTask(id) {
    if (!id) return false;
    const tasks = loadTasks().filter(function (t) { return t.id !== id; });
    return saveTasks(tasks);
  }

  function duplicateTask(id) {
    if (!id) return null;
    const tasks = loadTasks();
    const source = tasks.find(function (t) { return t.id === id; });
    if (!source) return null;
    const task = {
      ...source,
      id: generateID(),
      name: source.name + ' (Copy)',
      createdAt: new Date().toISOString()
    };
    tasks.push(task);
    return saveTasks(tasks) ? task : null;
  }

  function getFilterState() {
    return {
      search: searchInput.value.trim().toLowerCase(),
      status: filterStatus.value,
      priority: filterPriority.value,
      sort: sortBy.value
    };
  }

  function applyFilters(tasks) {
    const state = getFilterState();
    let result = tasks;

    if (state.search) {
      result = result.filter(function (t) {
        return t.name.toLowerCase().includes(state.search) ||
               (t.description && t.description.toLowerCase().includes(state.search));
      });
    }

    if (state.status) {
      result = result.filter(function (t) { return t.status === state.status; });
    }

    if (state.priority) {
      result = result.filter(function (t) { return t.priority === state.priority; });
    }

    if (state.sort) {
      result = result.slice().sort(function (a, b) {
        let valA, valB;
        if (state.sort === 'name') {
          valA = a.name.toLowerCase();
          valB = b.name.toLowerCase();
        } else if (state.sort === 'dueDate') {
          valA = a.dueDate || '';
          valB = b.dueDate || '';
        } else if (state.sort === 'status') {
          valA = a.status;
          valB = b.status;
        }
        if (valA < valB) return -1;
        if (valA > valB) return 1;
        return 0;
      });
    }

    return result;
  }

  function resetFilters() {
    searchInput.value = '';
    filterStatus.value = '';
    filterPriority.value = '';
    sortBy.value = '';
  }

  function exportToExcel() {
    const tasks = loadTasks();
    if (tasks.length === 0) {
      showToast('No tasks to export.', 'warning');
      return;
    }
    const today = new Date().toISOString().slice(0, 10);
    const fileName = 'tasks_export_' + today + '.xlsx';

    function safeStr(val) {
      let s = String(val || '');
      return /^[=+\-@]/.test(s) ? "'" + s : s;
    }

    loadingOverlay.classList.remove('d-none');

    setTimeout(function () {
      const data = [
        ['Sr No', 'Task Name', 'Description', 'Priority', 'Status', 'Assign Date']
      ];
      for (let i = 0; i < tasks.length; i++) {
        const t = tasks[i];
        data.push([
          i + 1,
          safeStr(t.name),
          safeStr(t.description),
          t.priority || '',
          t.status || '',
          t.dueDate || ''
        ]);
      }

      const ws = XLSX.utils.aoa_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Tasks');
      const wbOut = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

      const blob = new Blob([wbOut], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      loadingOverlay.classList.add('d-none');
      showToast('Exported ' + tasks.length + ' tasks!', 'success');
    }, 50);
  }

  function importFromExcel(file) {
    if (!file) return;
    const allowedExt = /\.(xlsx|xls)$/i;
    if (!allowedExt.test(file.name)) {
      showToast('Please select an .xlsx or .xls file.', 'warning');
      return;
    }
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });

        if (rows.length === 0) {
          showToast('Excel file is empty.', 'warning');
          return;
        }

        const keys = Object.keys(rows[0]).reduce(function (acc, k) {
          acc[k.toLowerCase().trim()] = k;
          return acc;
        }, {});

        const colMap = {
          'task name': 'name',
          'taskname': 'name',
          'description': 'description',
          'priority': 'priority',
          'status': 'status',
          'due date': 'dueDate',
          'duedate': 'dueDate',
          'assign date': 'dueDate',
          'assigndate': 'dueDate'
        };

        const validPriorities = { low: true, medium: true, high: true };
        const validStatuses   = { pending: true, 'in progress': true, completed: true };
        const existing = loadTasks();
        const existingNames = new Set(existing.map(function (t) { return t.name.trim().toLowerCase(); }));
        const fileNames = new Set();
        const toAdd = [];
        let imported = 0;
        let skippedFileDup = 0;
        let skippedExistDup = 0;

        for (let r = 0; r < rows.length; r++) {
          const row = rows[r];
          let name = '';
          let description = '';
          let priority = 'Medium';
          let status = 'Pending';
          let dueDate = '';

          for (const colKey in colMap) {
            const srcKey = keys[colKey];
            if (!srcKey) continue;
            const val = String(row[srcKey] || '').trim();
            const field = colMap[colKey];
            if (field === 'name') name = val;
            else if (field === 'description') description = val;
            else if (field === 'priority') priority = val;
            else if (field === 'status') status = val;
            else if (field === 'dueDate') dueDate = val;
          }

          if (!name) continue;

          const nameKey = name.trim().toLowerCase();

          if (fileNames.has(nameKey)) { skippedFileDup++; continue; }
          fileNames.add(nameKey);

          if (existingNames.has(nameKey)) { skippedExistDup++; continue; }

          if (!validPriorities[priority.toLowerCase()]) priority = 'Medium';
          if (!validStatuses[status.toLowerCase()]) status = 'Pending';

          toAdd.push({
            id: generateID(),
            name: name,
            description: description,
            priority: priority,
            status: status,
            dueDate: dueDate,
            createdAt: new Date().toISOString()
          });
          imported++;
        }

        const totalSkipped = skippedFileDup + skippedExistDup;

        if (imported === 0 && totalSkipped === 0) {
          showToast('No valid tasks found in the file.', 'warning');
          return;
        }

        if (imported === 0 && totalSkipped > 0) {
          showToast('No new tasks \u2014 all rows are duplicates.', 'warning');
          return;
        }

        saveTasks(existing.concat(toAdd));

        let msg = 'Imported ' + imported + ' task' + (imported > 1 ? 's' : '');
        if (totalSkipped > 0) {
          const parts = [];
          if (skippedFileDup > 0) parts.push(skippedFileDup + ' file duplicate' + (skippedFileDup > 1 ? 's' : ''));
          if (skippedExistDup > 0) parts.push(skippedExistDup + ' already exist' + (skippedExistDup > 1 ? 's' : ''));
          msg += '. Skipped ' + totalSkipped + ' (' + parts.join(', ') + ')';
        }
        showToast(msg, 'success');
        refresh();
      } catch (err) {
        showToast('Failed to read Excel file. Check the format.', 'danger');
      }
    };
    reader.readAsArrayBuffer(file);
  }

  function renderRow(task, i) {
    return '<tr>' +
      '<td><div class="task-name fw-medium">' + escapeHtml(task.name) + '</div></td>' +
      '<td><span class="badge ' + (priorityClass[task.priority] || 'bg-secondary') + '">' + escapeHtml(task.priority) + '</span></td>' +
      '<td><span class="badge ' + (statusClass[task.status] || 'bg-secondary') + '">' + escapeHtml(task.status) + '</span></td>' +
      '<td class="text-nowrap">' + escapeHtml(task.dueDate || '\u2014') + '</td>' +
      '<td class="text-nowrap text-center" style="white-space:nowrap">' +
        '<button class="btn btn-sm btn-icon action-edit" data-id="' + escapeHtml(task.id) + '" title="Edit">' +
          '<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10z"/></svg>' +
        '</button>' +
        '<button class="btn btn-sm btn-icon action-copy" data-id="' + escapeHtml(task.id) + '" title="Copy">' +
          '<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H6zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1H2z"/></svg>' +
        '</button>' +
        '<button class="btn btn-sm btn-icon action-delete" data-id="' + escapeHtml(task.id) + '" title="Delete">' +
          '<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>' +
        '</button>' +
      '</td>' +
    '</tr>';
  }

  function updateStats(tasks) {
    const total = tasks.length;
    let inProgress = 0;
    let completed = 0;
    let pending = 0;

    for (let i = 0; i < tasks.length; i++) {
      const t = tasks[i];
      if (t.status === 'In Progress') inProgress++;
      if (t.status === 'Completed') completed++;
      if (t.status === 'Pending') pending++;
    }

    const cards = document.querySelectorAll('.stat-card h3');
    if (cards.length >= 4) {
      cards[0].textContent = total;
      cards[1].textContent = inProgress;
      cards[2].textContent = completed;
      cards[3].textContent = pending;
    }
  }

  function getPage(tasks) {
    let start = (currentPage - 1) * PAGE_SIZE;
    return tasks.slice(start, start + PAGE_SIZE);
  }

  function renderPagination(total) {
    let totalPages = Math.ceil(total / PAGE_SIZE) || 1;
    if (currentPage > totalPages) currentPage = totalPages;
    let html = '';

    html += '<li class="page-item' + (currentPage === 1 ? ' disabled' : '') + '"><a class="page-link" href="#" data-page="prev">Previous</a></li>';
    for (let p = 1; p <= totalPages; p++) {
      html += '<li class="page-item' + (p === currentPage ? ' active' : '') + '"><a class="page-link" href="#" data-page="' + p + '">' + p + '</a></li>';
    }
    html += '<li class="page-item' + (currentPage === totalPages ? ' disabled' : '') + '"><a class="page-link" href="#" data-page="next">Next</a></li>';

    paginationList.innerHTML = html;
  }

  function render(allTasks, filteredTasks) {
    let hasTasks = allTasks.length > 0;
    let hasResults = filteredTasks.length > 0;

    if (!hasTasks) {
      emptyState.classList.remove('d-none');
      noResultsState.classList.add('d-none');
      taskGrid.classList.add('d-none');
      filterBar.classList.add('d-none');
    } else if (!hasResults) {
      emptyState.classList.add('d-none');
      noResultsState.classList.remove('d-none');
      taskGrid.classList.add('d-none');
      filterBar.classList.remove('d-none');
    } else {
      emptyState.classList.add('d-none');
      noResultsState.classList.add('d-none');
      taskGrid.classList.remove('d-none');
      filterBar.classList.remove('d-none');

      let page = getPage(filteredTasks);
      taskList.innerHTML = '';
      for (let i = 0; i < page.length; i++) {
        taskList.insertAdjacentHTML('beforeend', renderRow(page[i], i));
      }

      let start = (currentPage - 1) * PAGE_SIZE + 1;
      let end = Math.min(currentPage * PAGE_SIZE, filteredTasks.length);
      tableInfo.textContent = 'Showing ' + start + '\u2013' + end + ' of ' + filteredTasks.length + ' tasks';
      renderPagination(filteredTasks.length);
    }

    updateStats(allTasks);
  }

  function showToast(message, type) {
    type = type || 'success';
    const icon = toastIcons[type] || toastIcons.success;
    const el = document.createElement('div');
    el.className = 'toast align-items-center border-0 text-bg-' + type;
    el.setAttribute('role', 'alert');
    el.setAttribute('aria-live', 'assertive');
    el.setAttribute('aria-atomic', 'true');

    const flexDiv = document.createElement('div');
    flexDiv.className = 'd-flex align-items-center p-2';

    const iconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    iconSvg.setAttribute('width', '20');
    iconSvg.setAttribute('height', '20');
    iconSvg.setAttribute('fill', 'currentColor');
    iconSvg.setAttribute('class', 'me-2 flex-shrink-0');
    iconSvg.setAttribute('viewBox', '0 0 16 16');
    iconSvg.innerHTML = icon;
    flexDiv.appendChild(iconSvg);

    const bodyDiv = document.createElement('div');
    bodyDiv.className = 'toast-body';
    bodyDiv.textContent = message;
    flexDiv.appendChild(bodyDiv);

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'btn-close btn-close-white me-2 m-auto';
    closeBtn.setAttribute('data-bs-dismiss', 'toast');
    flexDiv.appendChild(closeBtn);

    el.appendChild(flexDiv);

    const progress = document.createElement('div');
    progress.className = 'toast-progress';
    el.appendChild(progress);

    toastContainer.appendChild(el);
    const toast = new bootstrap.Toast(el, { autohide: true, delay: 3000 });
    toast.show();
    el.addEventListener('hidden.bs.toast', function () { el.remove(); });
  }

  function setFormLoading(loading) {
    saveBtn.disabled = loading;
    saveBtn.innerHTML = loading
      ? '<span class="spinner-border spinner-border-sm me-1"></span> Saving...'
      : (editId ? 'Update Task' : 'Save Task');
  }

  function resetForm() {
    form.reset();
    form.classList.remove('was-validated');
    fieldName.classList.remove('is-invalid');
    editId = null;
    modalTitle.textContent = 'Add New Task';
    setFormLoading(false);
  }

  function getFormData() {
    return {
      id: editId,
      name: fieldName.value.trim(),
      description: fieldDesc.value.trim(),
      priority: fieldPriority.value,
      status: fieldStatus.value,
      dueDate: fieldDueDate.value
    };
  }

  function setFormData(task) {
    fieldName.value = task.name || '';
    fieldDesc.value = task.description || '';
    fieldPriority.value = task.priority || 'Medium';
    fieldStatus.value = task.status || 'Pending';
    fieldDueDate.value = task.dueDate || '';
  }

  function validateForm() {
    if (!fieldName.value.trim()) {
      fieldName.classList.add('is-invalid');
      fieldName.classList.add('shake');
      setTimeout(function () { fieldName.classList.remove('shake'); }, 400);
      return false;
    }
    fieldName.classList.remove('is-invalid');
    return true;
  }

  function openForm(taskData) {
    if (taskData) {
      editId = taskData.id;
      setFormData(taskData);
      modalTitle.textContent = 'Edit Task';
      setFormLoading(false);
    } else {
      resetForm();
    }
    taskModal.show();
  }

  function closeForm() {
    taskModal.hide();
  }

  function handleSave(data) {
    if (data.id) {
      const tasks = loadTasks();
      const nameKey = data.name.trim().toLowerCase();
      if (tasks.some(function (t) { return t.id !== data.id && t.name.trim().toLowerCase() === nameKey; })) {
        showToast('A task with this name already exists.', 'warning');
        setFormLoading(false);
        return;
      }
      if (!updateTask(data.id, data)) {
        showToast('Failed to update task.', 'danger');
        setFormLoading(false);
        return;
      }
      showToast('Task updated!', 'success');
    } else {
      if (!addTask(data)) {
        showToast('A task with this name already exists.', 'warning');
        setFormLoading(false);
        return;
      }
      showToast('Task added!', 'success');
    }
    closeForm();
    currentPage = 1;
    refresh();
  }

  saveBtn.addEventListener('click', function () {
    if (!validateForm()) return;
    setFormLoading(true);
    handleSave(getFormData());
  });

  taskList.addEventListener('click', function (e) {
    const item = e.target.closest('[class*="action-"]');
    if (!item) return;
    const id = item.dataset.id;
    if (item.classList.contains('action-edit')) {
      const task = loadTasks().find(function (t) { return t.id === id; });
      if (task) openForm(task);
    }
    if (item.classList.contains('action-delete')) {
      confirmThen('Delete Task', 'Are you sure you want to delete this task?', function () {
        deleteTask(id);
        confirmModal.hide();
        showToast('Task deleted!', 'danger');
        currentPage = 1;
        refresh();
      }, 'danger');
    }
    if (item.classList.contains('action-copy')) {
      confirmThen('Duplicate Task', 'Create a copy of this task?', function () {
        duplicateTask(id);
        confirmModal.hide();
        showToast('Task duplicated!', 'info');
        currentPage = 1;
        refresh();
      }, 'info');
    }
  });

  function confirmThen(title, body, action, iconType) {
    iconType = iconType || 'danger';
    confirmTitle.textContent = title;
    confirmBody.textContent = body;
    confirmIcon.innerHTML = confirmIcons[iconType] || confirmIcons.danger;
    confirmIcon.className = 'confirm-icon confirm-icon-' + iconType + ' mx-auto d-flex';
    confirmBtn.className = 'btn btn-sm btn-' + (iconType === 'info' ? 'primary' : (iconType === 'warning' ? 'warning text-dark' : 'danger'));
    confirmSpinner.classList.add('d-none');
    confirmBtnText.textContent = 'Confirm';
    confirmBtn.disabled = false;
    confirmBtn.onclick = function () {
      confirmBtn.disabled = true;
      confirmSpinner.classList.remove('d-none');
      action();
    };
    confirmModal.show();
  }

  confirmModalEl.addEventListener('hidden.bs.modal', function () {
    confirmBtn.disabled = false;
    confirmSpinner.classList.add('d-none');
    confirmBtnText.textContent = 'Confirm';
  });

  function refresh() {
    let all = loadTasks();
    let filtered = applyFilters(all);
    render(all, filtered);
  }

  paginationList.addEventListener('click', function (e) {
    let link = e.target.closest('a.page-link');
    if (!link) return;
    e.preventDefault();
    let page = link.dataset.page;
    if (page === 'prev') { if (currentPage > 1) currentPage--; }
    else if (page === 'next') { currentPage++; }
    else { currentPage = parseInt(page, 10); }
    let all = loadTasks();
    let filtered = applyFilters(all);
    render(all, filtered);
  });

  let searchTimer;
  searchInput.addEventListener('input', function () { clearTimeout(searchTimer); searchTimer = setTimeout(refresh, 200); });
  filterStatus.addEventListener('change', refresh);
  filterPriority.addEventListener('change', refresh);
  sortBy.addEventListener('change', refresh);
  clearBtn.addEventListener('click', function () { resetFilters(); currentPage = 1; refresh(); });

  if (clearFiltersFromEmpty) {
    clearFiltersFromEmpty.addEventListener('click', function () { resetFilters(); currentPage = 1; refresh(); });
  }

  const taskModal    = new bootstrap.Modal(modalTask);
  const confirmModal = new bootstrap.Modal(confirmModalEl);
  const instrModal   = new bootstrap.Modal(excelModalEl);

  exportBtn.addEventListener('click', exportToExcel);

  importBtn.addEventListener('click', function () {
    instrModal.show();
  });

  proceedUpload.addEventListener('click', function () {
    instrModal.hide();
    excelFileInput.value = '';
    excelFileInput.click();
  });

  excelFileInput.addEventListener('change', function () {
    if (this.files && this.files[0]) {
      importFromExcel(this.files[0]);
    }
  });

  modalTask.addEventListener('hidden.bs.modal', resetForm);

  modalTask.addEventListener('shown.bs.modal', function () {
    fieldName.focus();
  });

  refresh();
})();
