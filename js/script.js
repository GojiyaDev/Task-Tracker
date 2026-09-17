(function () {
  // ===========================================================================
  // Developer Task Tracker — application script (single IIFE, no build step).
  //
  // Code is organized into logical namespaces (references to the function
  // declarations below) for readability:
  //   Utilities      – pure helpers (escaping, formatting, markdown)
  //   StorageUtils   – localStorage read/write + in-memory cache getters
  //   TaskState      – task collection: in-memory cache + CRUD mutations
  //   DOMRenderer    – builds/updates UI from task data
  //   EventHandlers  – wires DOM events and delegates actions
  // See the namespace object definitions near the end of this IIFE.
  // ===========================================================================

  const STORAGE_KEY = 'taskTracker_tasks';
  const THEME_KEY = 'taskTracker_theme';
  const TAGS_KEY = 'taskTracker_tags';

  // DOM Elements - Main Layout & Views
  const emptyState     = document.getElementById('emptyState');
  const noResultsState = document.getElementById('noResultsState');
  const taskGrid       = document.getElementById('taskGrid');
  const taskList       = document.getElementById('taskList');
  const mobileTaskList = document.getElementById('mobileTaskList');
  const tableInfo      = document.getElementById('tableInfo');
  const toastContainer = document.getElementById('toastContainer');
  const filterBar      = document.getElementById('filterBar');
  const searchInput    = document.getElementById('searchInput');
  const filterStatus   = document.getElementById('filterStatus');
  const filterPriority = document.getElementById('filterPriority');
  const filterDueDate  = document.getElementById('filterDueDate');
  const sortBySelect   = document.getElementById('sortBySelect');
  const tagFilter      = document.getElementById('tagFilter');
  const clearBtn       = document.getElementById('clearFilters');
  const clearFiltersFromEmpty = document.getElementById('clearFiltersFromEmpty');
  const paginationList = document.getElementById('paginationList');
  const pageSizeSelect = document.getElementById('pageSizeSelect');
  const prevPageBtn    = document.getElementById('prevPageBtn');
  const nextPageBtn    = document.getElementById('nextPageBtn');
  const pageInfo       = document.getElementById('pageInfo');
  const loadingOverlay = document.getElementById('loadingOverlay');
  const bulkActionBar  = document.getElementById('bulkActionBar');
  const selectedCount  = document.getElementById('selectedCount');
  const bulkDeleteBtn  = document.getElementById('bulkDeleteBtn');
  const bulkCompleteBtn = document.getElementById('bulkCompleteBtn');
  const bulkInProgressBtn = document.getElementById('bulkInProgressBtn');
  const themeToggle    = document.getElementById('themeToggle');
  const themeIcon      = document.getElementById('themeIcon');
  const selectAllCheckbox = document.getElementById('selectAllCheckbox');
  const selectAllCheckboxHeader = document.getElementById('selectAllCheckboxHeader');

  // View Switchers & Page Title
  const viewListBtn      = document.getElementById('viewListBtn');
  const viewBoardBtn     = document.getElementById('viewBoardBtn');
  const viewAnalyticsBtn = document.getElementById('viewAnalyticsBtn');
  const pageTitle        = document.getElementById('pageTitle');
  const pageSubtitle     = document.getElementById('pageSubtitle');
  const sidebarNav       = document.getElementById('sidebarNav');

  // Kanban Elements
  const kanbanBoard          = document.getElementById('kanbanBoard');
  const kanbanCardsPending   = document.getElementById('kanbanCardsPending');
  const kanbanCardsInProgress = document.getElementById('kanbanCardsInProgress');
  const kanbanCardsCompleted = document.getElementById('kanbanCardsCompleted');
  const kanbanCountPending   = document.getElementById('kanbanCountPending');
  const kanbanCountInProgress = document.getElementById('kanbanCountInProgress');
  const kanbanCountCompleted = document.getElementById('kanbanCountCompleted');

  // Analytics Elements & Progress Health Bar
  const analyticsView         = document.getElementById('analyticsView');
  const completionRateBadge   = document.getElementById('completionRateBadge');
  const progressBarCompleted  = document.getElementById('progressBarCompleted');
  const progressBarInProgress = document.getElementById('progressBarInProgress');
  const progressBarPending    = document.getElementById('progressBarPending');
  const overdueCountText      = document.getElementById('overdueCountText');
  const totalTimeLoggedText   = document.getElementById('totalTimeLoggedText');
  const analyticsVelocityVal  = document.getElementById('analyticsVelocityVal');
  const analyticsVelocitySub  = document.getElementById('analyticsVelocitySub');
  const analyticsHighPriorityVal = document.getElementById('analyticsHighPriorityVal');
  const analyticsHighPrioritySub = document.getElementById('analyticsHighPrioritySub');
  const priorityBreakdownChart = document.getElementById('priorityBreakdownChart');
  const tagsDistributionList  = document.getElementById('tagsDistributionList');

  // Add / Edit Task Modal Elements
  const modalTask      = document.getElementById('taskModal');
  const form           = document.getElementById('taskForm');
  const saveBtn        = document.getElementById('saveTaskBtn');
  const modalTitle     = document.getElementById('modalTitle');
  const fieldName      = document.getElementById('taskName');
  const fieldDesc      = document.getElementById('taskDesc');
  const fieldPriority  = document.getElementById('taskPriority');
  const fieldStatus    = document.getElementById('taskStatus');
  const fieldDueDate   = document.getElementById('taskDueDate');
  const taskTagsContainer = document.getElementById('taskTagsContainer');
  const subtaskBuilderList = document.getElementById('subtaskBuilderList');
  const newSubtaskInput = document.getElementById('newSubtaskInput');
  const addSubtaskBtn   = document.getElementById('addSubtaskBtn');

  // Manage Tags Elements
  const tagsModalEl          = document.getElementById('tagsModal');
  const sidebarManageTagsBtn = document.getElementById('sidebarManageTagsBtn');
  const newTagInputGlobal    = document.getElementById('newTagInputGlobal');
  const addTagBtnGlobal      = document.getElementById('addTagBtnGlobal');
  const globalTagsList       = document.getElementById('globalTagsList');

  // Task Detail Modal Elements
  const taskDetailModalEl  = document.getElementById('taskDetailModal');
  const detailTitle        = document.getElementById('detailTitle');
  const detailPriorityPill = document.getElementById('detailPriorityPill');
  const detailStatusPill   = document.getElementById('detailStatusPill');
  const detailDueBadge     = document.getElementById('detailDueBadge');
  const detailDescription  = document.getElementById('detailDescription');
  const detailSubtasksSection = document.getElementById('detailSubtasksSection');
  const detailSubtasksProgressText = document.getElementById('detailSubtasksProgressText');
  const detailSubtasksProgressBar = document.getElementById('detailSubtasksProgressBar');
  const detailSubtasksList = document.getElementById('detailSubtasksList');
  const detailDueDate      = document.getElementById('detailDueDate');
  const detailTimeSpent    = document.getElementById('detailTimeSpent');
  const detailCreatedAt    = document.getElementById('detailCreatedAt');
  const detailBlockedBy    = document.getElementById('detailBlockedBy');
  const detailTags         = document.getElementById('detailTags');
  const copyBranchBtn      = document.getElementById('copyBranchBtn');
  const copyCommitBtn      = document.getElementById('copyCommitBtn');
  const detailHistoryList  = document.getElementById('detailHistoryList');
  const detailEditBtn      = document.getElementById('detailEditBtn');

  // Command Palette Elements
  const commandPaletteModalEl = document.getElementById('commandPaletteModal');
  const cmdPaletteBtn         = document.getElementById('cmdPaletteBtn');
  const cmdPaletteInput       = document.getElementById('cmdPaletteInput');
  const cmdPaletteResults     = document.getElementById('cmdPaletteResults');

  // Daily Standup Elements
  const standupModalEl    = document.getElementById('standupModal');
  const standupTextarea   = document.getElementById('standupTextarea');
  const copyStandupBtn    = document.getElementById('copyStandupBtn');
  const sidebarStandupBtn = document.getElementById('sidebarStandupBtn');

  // Shortcuts Cheat Sheet Elements
  const shortcutsModalEl    = document.getElementById('shortcutsModal');
  const sidebarShortcutsBtn = document.getElementById('sidebarShortcutsBtn');

  // Confirm Modal Elements
  const confirmModalEl = document.getElementById('confirmModal');
  const confirmTitle   = document.getElementById('confirmTitle');
  const confirmBody    = document.getElementById('confirmBody');
  const confirmBtn     = document.getElementById('confirmActionBtn');
  const confirmBtnText = document.getElementById('confirmBtnText');
  const confirmSpinner = document.getElementById('confirmBtnSpinner');
  const confirmIcon    = document.getElementById('confirmIcon');

  // Import / Export / Backup Elements
  const excelFileInput   = document.getElementById('excelFileInput');
  const jsonFileInput    = document.getElementById('jsonFileInput');
  const exportBtn        = document.getElementById('exportExcelBtn');
  const importBtn        = document.getElementById('importExcelBtn');
  const exportJsonBtn    = document.getElementById('exportJsonBtn');
  const importJsonBtn    = document.getElementById('importJsonBtn');
  const exportCsvBtn     = document.getElementById('exportCsvBtn');
  const exportMarkdownBtn = document.getElementById('exportMarkdownBtn');
  const excelModalEl     = document.getElementById('excelInstructionModal');
  const proceedUpload    = document.getElementById('proceedUploadBtn');

  // Application State
  let currentView = 'list'; // 'list', 'kanban', 'analytics'
  let selectedIds = new Set();
  let lastDeleted = null;
  let undoTimeout = null;
  let editId = null;
  let detailTaskId = null;
  let currentPage = 1;
  let pageSize = 10;
  const selectedTags = new Set();
  let tempSubtasks = [];
  let cmdPaletteActiveIndex = 0;
  let cmdPaletteItems = [];

  const priorityClass = {
    Low: 'pill-low',
    Medium: 'pill-medium',
    High: 'pill-high'
  };

  const statusClass = {
    Pending: 'pill-pending',
    'In Progress': 'pill-inprogress',
    Completed: 'pill-completed'
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

  // Utilities
  function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    return str.replace(/[&<>"']/g, function (m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#27;' }[m];
    });
  }

  function slugify(text) {
    return String(text || '')
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'task';
  }

  function localDateStr(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + day;
  }

  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  function formatDate(iso) {
    if (!iso) return '—';
    const parts = String(iso).split('-');
    if (parts.length !== 3) return escapeHtml(iso);
    const m = parseInt(parts[1], 10);
    const d = parseInt(parts[2], 10);
    if (isNaN(m) || isNaN(d)) return escapeHtml(iso);
    const y = parseInt(parts[0], 10);
    return MONTHS[m - 1] + ' ' + d + ', ' + y;
  }

  function formatDateTime(iso) {
    if (!iso) return '—';
    try {
      const d = new Date(iso);
      if (isNaN(d.getTime())) return escapeHtml(iso);
      return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return escapeHtml(iso);
    }
  }

  function priorityWeight(p) {
    if (p === 'High') return 3;
    if (p === 'Medium') return 2;
    return 1;
  }

  function getDueDateInfo(task) {
    if (!task.dueDate || task.status === 'Completed') return { cls: '', label: '' };
    const today = localDateStr(new Date());
    const tomorrow = localDateStr(new Date(Date.now() + 86400000));
    if (task.dueDate < today) return { cls: 'due-overdue', label: 'Overdue' };
    if (task.dueDate === today) return { cls: 'due-today', label: 'Due Today' };
    if (task.dueDate === tomorrow) return { cls: 'due-tomorrow', label: 'Due Tomorrow' };
    return { cls: '', label: '' };
  }

  // Safe Markdown Light Parser.
  // Hardened: escape-first (blocks raw-HTML/XSS), block elements parsed line by
  // line so lists/quotes/code never merge or leave unbalanced tags, and inline
  // code is protected from the emphasis/link passes.
  function parseMarkdown(text) {
    if (!text) return '<p class="text-muted mb-0">No description provided.</p>';

    const escaped = escapeHtml(text);
    const lines = escaped.split('\n');

    const codeStore = [];
    function stash(html) {
      codeStore.push(html);
      return '<<CODE' + (codeStore.length - 1) + '>>';
    }

    const blocks = [];
    let paraBuffer = [];
    let listBuffer = [];

    function flushPara() {
      if (paraBuffer.length) {
        blocks.push('<p class="mb-2">' + paraBuffer.join('<br>') + '</p>');
        paraBuffer = [];
      }
    }
    function flushList() {
      if (listBuffer.length) {
        blocks.push('<ul>' + listBuffer.join('') + '</ul>');
        listBuffer = [];
      }
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Fenced code block ```
      if (/^```/.test(line)) {
        flushPara();
        flushList();
        const codeLines = [];
        i++;
        while (i < lines.length && !/^```/.test(lines[i])) {
          codeLines.push(lines[i]);
          i++;
        }
        blocks.push(stash('<pre><code>' + codeLines.join('\n') + '</code></pre>'));
        continue;
      }

      // Blockquote (escaped as &gt;)
      const bq = line.match(/^&gt;\s+(.*)$/);
      if (bq) {
        flushPara();
        flushList();
        blocks.push('<blockquote>' + bq[1] + '</blockquote>');
        continue;
      }

      // Unordered list item (consecutive items fold into one <ul>)
      const li = line.match(/^-\s+(.*)$/);
      if (li) {
        flushPara();
        listBuffer.push('<li>' + li[1] + '</li>');
        continue;
      }

      if (line.trim() === '') {
        flushPara();
        flushList();
        continue;
      }

      flushList();
      paraBuffer.push(line);
    }
    flushPara();
    flushList();

    let html = blocks.join('\n');

    // Inline code first, then protect it from emphasis/link passes
    html = html.replace(/`([^`]+)`/g, function (m, c) { return stash('<code>' + c + '</code>'); });
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*([^*\n]+)\*/g, '<em>$1</em>');
    html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    html = html.replace(/<<CODE(\d+)>>/g, function (m, n) { return codeStore[+n]; });

    return html;
  }

  // Schema & Task Persistence with Seamless Backward Compatibility
  function isValidTask(obj) {
    return obj && typeof obj === 'object' && typeof obj.id === 'string' && typeof obj.name === 'string';
  }

  // In-memory task cache. Loaded once from localStorage at startup (readRaw);
  // reads are served from here via loadTasks(), and writes persist back. This
  // avoids re-parsing / re-serializing localStorage on every filter, search,
  // or action.
  let taskCache = [];
  let globalTags = [];

  function loadGlobalTags() {
    try {
      const raw = localStorage.getItem(TAGS_KEY);
      if (raw !== null) {
        globalTags = JSON.parse(raw);
        if (!Array.isArray(globalTags)) globalTags = [];
      } else {
        const tasks = readRaw();
        const tagSet = new Set();
        tasks.forEach(function (t) {
          (t.tags || []).forEach(function (tag) {
            if (tag) tagSet.add(tag);
          });
        });
        globalTags = Array.from(tagSet).sort();
        saveGlobalTags();
      }
    } catch (e) {
      globalTags = [];
    }
  }

  function saveGlobalTags() {
    try {
      localStorage.setItem(TAGS_KEY, JSON.stringify(globalTags));
    } catch (e) {
      showToast('Failed to save tags.', 'danger');
    }
  }

  function readRaw() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw === null) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(isValidTask).map(function (t) {
        if (!Array.isArray(t.tags)) t.tags = [];
        if (!Array.isArray(t.subtasks)) t.subtasks = [];
        if (typeof t.timeSpent !== 'number') t.timeSpent = 0;
        if (typeof t.blockedBy !== 'string') t.blockedBy = '';
        if (!Array.isArray(t.history)) {
          t.history = [{ action: 'Created', timestamp: t.createdAt || new Date().toISOString() }];
        }
        if (!t.updatedAt) t.updatedAt = t.createdAt || new Date().toISOString();
        return t;
      });
    } catch (e) {
      showToast('Could not load saved tasks. Stored data may be corrupted.', 'danger');
      return [];
    }
  }

  function writeRaw(tasks) {
    if (!Array.isArray(tasks)) return false;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      return true;
    } catch (e) {
      if (e && e.name === 'QuotaExceededError') {
        showToast('Storage is full — your latest changes were not saved.', 'danger');
      } else {
        showToast('Failed to save tasks to local storage.', 'danger');
      }
      return false;
    }
  }

  // Thin getter over the in-memory cache. All reads should use this.
  function loadTasks() {
    return taskCache;
  }

  function saveTasks(tasks) {
    return writeRaw(tasks);
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
    const now = new Date().toISOString();
    const task = {
      id: generateID(),
      name: data.name.trim(),
      description: data.description || '',
      tags: data.tags || [],
      priority: data.priority || 'Medium',
      status: data.status || 'Pending',
      dueDate: data.dueDate || '',
      blockedBy: data.blockedBy || '',
      timeSpent: parseInt(data.timeSpent, 10) || 0,
      subtasks: Array.isArray(data.subtasks) ? data.subtasks : [],
      createdAt: now,
      updatedAt: now,
      history: [{ action: 'Created', timestamp: now }]
    };
    tasks.unshift(task);
    return saveTasks(tasks) ? task : null;
  }

  function updateTask(id, data) {
    if (!id || !data) return null;
    const tasks = loadTasks();
    const idx = tasks.findIndex(function (t) { return t.id === id; });
    if (idx === -1) return null;

    const existing = tasks[idx];
    const history = Array.isArray(existing.history) ? [...existing.history] : [];
    const now = new Date().toISOString();

    if (data.status && data.status !== existing.status) {
      history.unshift({ action: 'Status changed to ' + data.status, timestamp: now });
    }
    if (data.priority && data.priority !== existing.priority) {
      history.unshift({ action: 'Priority changed to ' + data.priority, timestamp: now });
    }

    tasks[idx] = {
      ...existing,
      ...data,
      id: id,
      updatedAt: now,
      history: history.slice(0, 20) // keep last 20 entries
    };
    return saveTasks(tasks) ? tasks[idx] : null;
  }

  function deleteTask(id) {
    if (!id) return false;
    taskCache = taskCache.filter(function (t) { return t.id !== id; });
    return saveTasks(taskCache);
  }

  function duplicateTask(id) {
    if (!id) return null;
    const tasks = loadTasks();
    const source = tasks.find(function (t) { return t.id === id; });
    if (!source) return null;
    const now = new Date().toISOString();
    const task = {
      ...source,
      id: generateID(),
      name: source.name + ' (Copy)',
      createdAt: now,
      updatedAt: now,
      history: [{ action: 'Duplicated from ' + source.name, timestamp: now }]
    };
    tasks.unshift(task);
    return saveTasks(tasks) ? task : null;
  }

  // Filtering & Sorting
  function getFilterState() {
    return {
      search: searchInput.value.trim().toLowerCase(),
      status: filterStatus.value,
      priority: filterPriority.value,
      dueDateFilter: filterDueDate.value,
      sortBy: sortBySelect.value || 'createdAt-desc'
    };
  }

  function applyFilters(tasks) {
    const state = getFilterState();
    let result = tasks;

    if (state.search) {
      result = result.filter(function (t) {
        const inName = t.name.toLowerCase().includes(state.search);
        const inDesc = t.description && t.description.toLowerCase().includes(state.search);
        const inTags = (t.tags || []).some(function (tag) { return tag.toLowerCase().includes(state.search); });
        const inSubtasks = (t.subtasks || []).some(function (st) { return (st.text || '').toLowerCase().includes(state.search); });
        return inName || inDesc || inTags || inSubtasks;
      });
    }

    if (state.status) {
      result = result.filter(function (t) { return t.status === state.status; });
    }

    if (state.priority) {
      result = result.filter(function (t) { return t.priority === state.priority; });
    }

    if (selectedTags.size > 0) {
      result = result.filter(function (t) {
        return (t.tags || []).some(function (tag) { return selectedTags.has(tag); });
      });
    }

    if (state.dueDateFilter) {
      result = result.filter(function (t) { return t.dueDate === state.dueDateFilter; });
    }

    return applySorting(result, state.sortBy);
  }

  function applySorting(tasks, sortKey) {
    const list = [...tasks];
    switch (sortKey) {
      case 'createdAt-asc':
        return list.sort(function (a, b) { return (a.createdAt || '').localeCompare(b.createdAt || ''); });
      case 'createdAt-desc':
        return list.sort(function (a, b) { return (b.createdAt || '').localeCompare(a.createdAt || ''); });
      case 'name-asc':
        return list.sort(function (a, b) { return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }); });
      case 'name-desc':
        return list.sort(function (a, b) { return b.name.localeCompare(a.name, undefined, { sensitivity: 'base' }); });
      case 'priority-desc':
        return list.sort(function (a, b) { return priorityWeight(b.priority) - priorityWeight(a.priority); });
      case 'priority-asc':
        return list.sort(function (a, b) { return priorityWeight(a.priority) - priorityWeight(b.priority); });
      case 'dueDate-asc':
        return list.sort(function (a, b) {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate.localeCompare(b.dueDate);
        });
      case 'dueDate-desc':
        return list.sort(function (a, b) {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return b.dueDate.localeCompare(a.dueDate);
        });
      case 'status-asc':
        return list.sort(function (a, b) { return a.status.localeCompare(b.status); });
      default:
        return list;
    }
  }

  function resetFilters() {
    searchInput.value = '';
    filterStatus.value = '';
    filterPriority.value = '';
    filterDueDate.value = '';
    selectedTags.clear();
  }

  // Subtask Progress Helper
  function getSubtaskStats(subtasks) {
    const list = Array.isArray(subtasks) ? subtasks : [];
    const total = list.length;
    const completed = list.filter(function (st) { return st.completed; }).length;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total: total, completed: completed, pct: pct };
  }

  function subtaskMiniHtml(subtasks) {
    const stats = getSubtaskStats(subtasks);
    if (stats.total === 0) return '';
    return '<div class="subtask-progress-mini" title="' + stats.completed + ' of ' + stats.total + ' subtasks completed">' +
      '<div class="progress rounded-pill"><div class="progress-bar bg-success" style="width: ' + stats.pct + '%"></div></div>' +
      '<span>' + stats.completed + '/' + stats.total + '</span>' +
    '</div>';
  }

  // HTML Rendering Helpers
  // Builds the per-row action dropdown by cloning the #tmpl-action-menu template
  // and wiring each item's data-id. Returns a DocumentFragment ready to append.
  function buildActionMenu(id) {
    const frag = document.getElementById('tmpl-action-menu').content.cloneNode(true);
    frag.querySelectorAll('[data-action]').forEach(function (btn) {
      btn.dataset.id = id;
    });
    return frag;
  }

  function tagChipsHtml(tags) {
    const list = Array.isArray(tags) ? tags : [];
    if (list.length === 0) return '<span class="text-muted">—</span>';
    return list.map(function (t) {
      return '<span class="task-tag">' + escapeHtml(t) + '</span>';
    }).join('');
  }

  function renderRow(task) {
    const due = getDueDateInfo(task);
    const row = document.getElementById('tmpl-task-row').content.firstElementChild.cloneNode(true);
    row.classList.toggle('is-completed', task.status === 'Completed');

    const checkbox = row.querySelector('.task-checkbox');
    checkbox.dataset.id = task.id;
    if (selectedIds.has(task.id)) checkbox.checked = true;

    const title = row.querySelector('.task-title');
    title.dataset.id = task.id;
    if (due.cls) title.classList.add(due.cls);
    row.querySelector('.task-name').textContent = task.name;
    const overdue = row.querySelector('.overdue-badge');
    if (due.label) { overdue.textContent = due.label; overdue.classList.remove('d-none'); }
    const blocked = row.querySelector('.blocked-badge');
    if (task.blockedBy) blocked.classList.remove('d-none');

    const sub = row.querySelector('.task-sub');
    if (task.description) { sub.textContent = task.description; sub.classList.remove('d-none'); }

    row.querySelector('.subtask-slot').innerHTML = subtaskMiniHtml(task.subtasks);

    const priorityPill = row.querySelector('[data-action="toggle-priority"]');
    priorityPill.dataset.id = task.id;
    priorityPill.className = 'pill ' + (priorityClass[task.priority] || 'pill-low') + ' clickable-pill';
    priorityPill.textContent = task.priority;
    row.querySelector('.priority-cell').classList.add('priority-' + task.priority.toLowerCase());

    const statusPill = row.querySelector('[data-action="toggle-status"]');
    statusPill.dataset.id = task.id;
    statusPill.className = 'pill ' + (statusClass[task.status] || 'pill-pending') + ' clickable-pill';
    statusPill.textContent = task.status;

    row.querySelector('.col-tags').innerHTML = tagChipsHtml(task.tags);
    row.querySelector('.col-date').textContent = task.dueDate ? formatDate(task.dueDate) : '—';

    row.querySelector('.col-actions').appendChild(buildActionMenu(task.id));

    return row;
  }

  function renderMobileCard(task) {
    const due = getDueDateInfo(task);
    const card = document.getElementById('tmpl-mobile-card').content.firstElementChild.cloneNode(true);
    card.classList.toggle('is-completed', task.status === 'Completed');

    const checkbox = card.querySelector('.task-checkbox');
    checkbox.dataset.id = task.id;
    if (selectedIds.has(task.id)) checkbox.checked = true;

    const name = card.querySelector('.mobile-task-card-name');
    name.dataset.id = task.id;
    if (due.cls) name.classList.add(due.cls);
    card.querySelector('.task-name').textContent = task.name;
    const overdue = card.querySelector('.overdue-badge');
    if (due.label) { overdue.textContent = due.label; overdue.classList.remove('d-none'); }
    const blocked = card.querySelector('.blocked-badge');
    if (task.blockedBy) blocked.classList.remove('d-none');

    const descBody = card.querySelector('.desc-body');
    if (task.description) {
      card.querySelector('.task-desc').textContent = task.description;
      descBody.classList.remove('d-none');
    }

    card.querySelector('.subtask-slot').innerHTML = subtaskMiniHtml(task.subtasks);

    const priorityPill = card.querySelector('[data-action="toggle-priority"]');
    priorityPill.dataset.id = task.id;
    priorityPill.className = 'pill ' + (priorityClass[task.priority] || 'pill-low') + ' clickable-pill';
    priorityPill.textContent = task.priority;

    const statusPill = card.querySelector('[data-action="toggle-status"]');
    statusPill.dataset.id = task.id;
    statusPill.className = 'pill ' + (statusClass[task.status] || 'pill-pending') + ' clickable-pill';
    statusPill.textContent = task.status;

    card.querySelector('.tag-cell').innerHTML = tagChipsHtml(task.tags);
    card.querySelector('.due-date').textContent = task.dueDate ? formatDate(task.dueDate) : '—';

    card.querySelector('.mobile-task-card-actions').appendChild(buildActionMenu(task.id));

    return card;
  }

  function renderKanbanCard(task) {
    const due = getDueDateInfo(task);
    const card = document.getElementById('tmpl-kanban-card').content.firstElementChild.cloneNode(true);
    card.classList.add('priority-' + ((task.priority || 'medium').toLowerCase()));
    card.dataset.id = task.id;
    card.setAttribute('draggable', 'true');

    const title = card.querySelector('.kanban-card-title');
    title.dataset.id = task.id;
    if (due.cls) title.classList.add(due.cls);
    card.querySelector('.task-name').textContent = task.name;
    const overdue = card.querySelector('.overdue-badge');
    if (due.label) { overdue.textContent = due.label; overdue.classList.remove('d-none'); }

    const desc = card.querySelector('.kanban-card-desc');
    if (task.description) { desc.textContent = task.description; desc.classList.remove('d-none'); }

    card.querySelector('.subtask-slot').innerHTML = subtaskMiniHtml(task.subtasks);
    card.querySelector('.tag-cell').innerHTML = tagChipsHtml(task.tags);
    card.querySelector('.due-date').textContent = task.dueDate ? formatDate(task.dueDate) : '—';

    card.querySelector('.col-actions').appendChild(buildActionMenu(task.id));

    return card;
  }

  function renderKanban(filteredTasks) {
    const pending = filteredTasks.filter(function (t) { return t.status === 'Pending'; });
    const inProgress = filteredTasks.filter(function (t) { return t.status === 'In Progress'; });
    const completed = filteredTasks.filter(function (t) { return t.status === 'Completed'; });

    kanbanCountPending.textContent = pending.length;
    kanbanCountInProgress.textContent = inProgress.length;
    kanbanCountCompleted.textContent = completed.length;

    kanbanCardsPending.innerHTML = '';
    if (pending.length > 0) {
      pending.forEach(function (t) { kanbanCardsPending.appendChild(renderKanbanCard(t)); });
    } else {
      kanbanCardsPending.innerHTML = '<div class="kanban-empty-col">No pending tasks</div>';
    }

    kanbanCardsInProgress.innerHTML = '';
    if (inProgress.length > 0) {
      inProgress.forEach(function (t) { kanbanCardsInProgress.appendChild(renderKanbanCard(t)); });
    } else {
      kanbanCardsInProgress.innerHTML = '<div class="kanban-empty-col">No tasks in progress</div>';
    }

    kanbanCardsCompleted.innerHTML = '';
    if (completed.length > 0) {
      completed.forEach(function (t) { kanbanCardsCompleted.appendChild(renderKanbanCard(t)); });
    } else {
      kanbanCardsCompleted.innerHTML = '<div class="kanban-empty-col">No completed tasks</div>';
    }
  }

  function renderAnalytics(allTasks) {
    const total = allTasks.length;
    let completed = 0;
    let inProgress = 0;
    let pending = 0;
    let high = 0;
    let medium = 0;
    let low = 0;
    const tagCountMap = {};

    for (let i = 0; i < total; i++) {
      const t = allTasks[i];
      if (t.status === 'Completed') completed++;
      else if (t.status === 'In Progress') inProgress++;
      else pending++;

      if (t.priority === 'High') high++;
      else if (t.priority === 'Medium') medium++;
      else low++;

      (t.tags || []).forEach(function (tag) {
        tagCountMap[tag] = (tagCountMap[tag] || 0) + 1;
      });
    }

    const velocityPct = total > 0 ? Math.round((completed / total) * 100) : 0;

    analyticsVelocityVal.textContent = velocityPct + '%';
    analyticsVelocitySub.textContent = completed + ' of ' + total + ' tasks completed';
    analyticsHighPriorityVal.textContent = high;
    analyticsHighPrioritySub.textContent = high + ' active urgent tasks';

    // Priority breakdown bars
    const highPct = total > 0 ? Math.round((high / total) * 100) : 0;
    const medPct = total > 0 ? Math.round((medium / total) * 100) : 0;
    const lowPct = total > 0 ? Math.round((low / total) * 100) : 0;

    priorityBreakdownChart.innerHTML =
      '<div class="priority-bar-item">' +
        '<div class="priority-bar-meta"><span>High Priority</span><span class="text-danger fw-bold">' + high + ' (' + highPct + '%)</span></div>' +
        '<div class="progress" style="height: 8px;"><div class="progress-bar bg-danger" style="width: ' + highPct + '%"></div></div>' +
      '</div>' +
      '<div class="priority-bar-item mt-2">' +
        '<div class="priority-bar-meta"><span>Medium Priority</span><span class="text-warning fw-bold">' + medium + ' (' + medPct + '%)</span></div>' +
        '<div class="progress" style="height: 8px;"><div class="progress-bar bg-warning" style="width: ' + medPct + '%"></div></div>' +
      '</div>' +
      '<div class="priority-bar-item mt-2">' +
        '<div class="priority-bar-meta"><span>Low Priority</span><span class="text-primary fw-bold">' + low + ' (' + lowPct + '%)</span></div>' +
        '<div class="progress" style="height: 8px;"><div class="progress-bar bg-primary" style="width: ' + lowPct + '%"></div></div>' +
      '</div>';

    // Top tags distribution
    const sortedTags = Object.keys(tagCountMap).sort(function (a, b) {
      return tagCountMap[b] - tagCountMap[a];
    });

    tagsDistributionList.innerHTML = sortedTags.length > 0
      ? sortedTags.slice(0, 10).map(function (tag) {
          return '<span class="tag-dist-item">#' + escapeHtml(tag) + ' <span class="badge bg-secondary rounded-pill">' + tagCountMap[tag] + '</span></span>';
        }).join('')
      : '<span class="text-muted small">No tags used yet</span>';
  }

  function updateDashboardHealth(allTasks) {
    const total = allTasks.length;
    let completed = 0;
    let inProgress = 0;
    let pending = 0;
    let overdue = 0;
    let totalMinutes = 0;
    const today = localDateStr(new Date());

    for (let i = 0; i < total; i++) {
      const t = allTasks[i];
      if (t.status === 'Completed') completed++;
      else if (t.status === 'In Progress') inProgress++;
      else pending++;

      if (t.dueDate && t.dueDate < today && t.status !== 'Completed') {
        overdue++;
      }
      totalMinutes += (parseInt(t.timeSpent, 10) || 0);
    }

    const cards = document.querySelectorAll('.stat-card h3');
    if (cards.length >= 4) {
      cards[0].textContent = total;
      cards[1].textContent = inProgress;
      cards[2].textContent = completed;
      cards[3].textContent = pending;
    }

    const completedPct = total > 0 ? Math.round((completed / total) * 100) : 0;
    const inProgressPct = total > 0 ? Math.round((inProgress / total) * 100) : 0;
    const pendingPct = total > 0 ? (100 - completedPct - inProgressPct) : 0;

    completionRateBadge.textContent = completedPct + '% (' + completed + '/' + total + ')';
    progressBarCompleted.style.width = completedPct + '%';
    progressBarInProgress.style.width = inProgressPct + '%';
    progressBarPending.style.width = pendingPct + '%';

    if (overdue > 0) {
      overdueCountText.classList.remove('d-none');
      overdueCountText.textContent = overdue + ' Overdue';
    } else {
      overdueCountText.classList.add('d-none');
    }

    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    totalTimeLoggedText.textContent = '⏱️ ' + (hours > 0 ? hours + 'h ' : '') + mins + 'm logged';
  }

  function getPage(tasks) {
    let start = (currentPage - 1) * pageSize;
    return tasks.slice(start, start + pageSize);
  }

  function renderPagination(total) {
    let totalPages = Math.ceil(total / pageSize) || 1;
    if (currentPage > totalPages) currentPage = totalPages;
    let html = '';

    html += '<li class="page-item' + (currentPage === 1 ? ' disabled' : '') + '"><a class="page-link" href="#" data-page="prev">Previous</a></li>';
    for (let p = 1; p <= totalPages; p++) {
      html += '<li class="page-item' + (p === currentPage ? ' active' : '') + '"><a class="page-link" href="#" data-page="' + p + '">' + p + '</a></li>';
    }
    html += '<li class="page-item' + (currentPage === totalPages ? ' disabled' : '') + '"><a class="page-link" href="#" data-page="next">Next</a></li>';

    paginationList.innerHTML = html;
  }

  function updateBulkActions() {
    const count = selectedIds.size;
    if (count > 0) {
      bulkActionBar.classList.remove('d-none');
      selectedCount.textContent = count + ' selected';
    } else {
      bulkActionBar.classList.add('d-none');
    }
    const pageBoxes = document.querySelectorAll('#taskList .task-checkbox, #mobileTaskList .task-checkbox');
    const total = pageBoxes.length;
    let checkedCount = 0;
    pageBoxes.forEach(function (cb) { if (cb.checked) checkedCount++; });
    const allChecked = total > 0 && checkedCount === total;
    const someChecked = checkedCount > 0 && checkedCount < total;
    if (selectAllCheckbox) {
      selectAllCheckbox.checked = allChecked;
      selectAllCheckbox.indeterminate = someChecked;
    }
    if (selectAllCheckboxHeader) {
      selectAllCheckboxHeader.checked = allChecked;
      selectAllCheckboxHeader.indeterminate = someChecked;
    }
  }

  function updateSortIndicators() {
    const sortVal = sortBySelect.value || 'createdAt-desc';
    const parts = sortVal.split('-');
    const field = parts[0];
    const dir = parts[1];

    document.querySelectorAll('.sortable-header').forEach(function (th) {
      const target = th.dataset.sort;
      const indicator = th.querySelector('.sort-indicator');
      if (!indicator) return;
      if (target === field) {
        indicator.textContent = dir === 'asc' ? '▲' : '▼';
      } else {
        indicator.textContent = '';
      }
    });
  }

  function switchView(viewName) {
    currentView = viewName;
    viewListBtn.classList.toggle('active', viewName === 'list');
    viewBoardBtn.classList.toggle('active', viewName === 'kanban');
    viewAnalyticsBtn.classList.toggle('active', viewName === 'analytics');

    if (viewName === 'list') {
      pageTitle.textContent = 'Task List';
      pageSubtitle.textContent = 'Manage and organize tasks in detailed table view';
    } else if (viewName === 'kanban') {
      pageTitle.textContent = 'Kanban Board';
      pageSubtitle.textContent = 'Visual workflow with drag-and-drop progress tracking';
    } else if (viewName === 'analytics') {
      pageTitle.textContent = 'Productivity Metrics';
      pageSubtitle.textContent = 'Velocity, time logging, and project distribution analytics';
    } else if (viewName === 'dailyTasks') {
      pageTitle.textContent = 'Daily Tasks';
      pageSubtitle.textContent = 'Track daily activities with a habit spreadsheet';
    }

    if (viewName === 'dailyTasks') {
      statsContainer.classList.add('d-none');
      filterBar.classList.add('d-none');
      activeFiltersEl.classList.add('d-none');
      tagFilter.classList.add('d-none');
      bulkActionBar.classList.add('d-none');
      emptyState.classList.add('d-none');
      noResultsState.classList.add('d-none');
      taskGrid.classList.add('d-none');
      kanbanBoard.classList.add('d-none');
      analyticsView.classList.add('d-none');
      dailyTasksView.classList.remove('d-none');
      viewSwitcher.classList.add('d-none');
      addTaskBtnDesktop.style.display = 'none';
      dtRender();
      updateSidebarNavigation();
    } else {
      dailyTasksView.classList.add('d-none');
      statsContainer.classList.remove('d-none');
      viewSwitcher.classList.remove('d-none');
      addTaskBtnDesktop.style.display = '';
      tagFilter.classList.remove('d-none');
      refresh();
    }
  }

  function setTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.dataset.bsTheme = 'dark';
      document.documentElement.setAttribute('data-theme', 'dark');
      themeIcon.innerHTML = '<path d="M8 1a7 7 0 0 0 0 14 7 7 0 0 0 0-14z"/>';
    } else {
      delete document.documentElement.dataset.bsTheme;
      document.documentElement.removeAttribute('data-theme');
      themeIcon.innerHTML = '<path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"/>';
    }
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
  }

  function toggleTheme() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    setTheme(isDark ? 'light' : 'dark');
  }

  function render(allTasks, filteredTasks) {
    // Daily Tasks has its own rendering; keep the dashboard hidden if a
    // refresh is triggered while it is the active view.
    if (currentView === 'dailyTasks') {
      emptyState.classList.add('d-none');
      noResultsState.classList.add('d-none');
      taskGrid.classList.add('d-none');
      kanbanBoard.classList.add('d-none');
      analyticsView.classList.add('d-none');
      filterBar.classList.add('d-none');
      dailyTasksView.classList.remove('d-none');
      return;
    }
    let hasTasks = allTasks.length > 0;
    let hasResults = filteredTasks.length > 0;

    if (!hasTasks) {
      emptyState.classList.remove('d-none');
      noResultsState.classList.add('d-none');
      taskGrid.classList.add('d-none');
      kanbanBoard.classList.add('d-none');
      analyticsView.classList.add('d-none');
      filterBar.classList.add('d-none');
      mobileTaskList.innerHTML = '';
      selectedIds.clear();
    } else if (!hasResults && currentView === 'list') {
      emptyState.classList.add('d-none');
      noResultsState.classList.remove('d-none');
      taskGrid.classList.add('d-none');
      kanbanBoard.classList.add('d-none');
      analyticsView.classList.add('d-none');
      filterBar.classList.remove('d-none');
      mobileTaskList.innerHTML = '';
      selectedIds.clear();
    } else {
      emptyState.classList.add('d-none');
      noResultsState.classList.add('d-none');
      filterBar.classList.remove('d-none');

      if (currentView === 'list') {
        taskGrid.classList.remove('d-none');
        kanbanBoard.classList.add('d-none');
        analyticsView.classList.add('d-none');

        let page = getPage(filteredTasks);
        taskList.innerHTML = '';
        for (let i = 0; i < page.length; i++) {
          taskList.appendChild(renderRow(page[i]));
        }

        mobileTaskList.innerHTML = '';
        for (let i = 0; i < page.length; i++) {
          mobileTaskList.appendChild(renderMobileCard(page[i]));
        }

        let start = (currentPage - 1) * pageSize + 1;
        let end = Math.min(currentPage * pageSize, filteredTasks.length);
        tableInfo.textContent = 'Showing ' + start + '–' + end + ' of ' + filteredTasks.length + ' tasks';

        let totalPages = Math.ceil(filteredTasks.length / pageSize) || 1;
        pageInfo.textContent = 'Page ' + currentPage + ' of ' + totalPages;
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages;

        renderPagination(filteredTasks.length);
      } else if (currentView === 'kanban') {
        taskGrid.classList.add('d-none');
        kanbanBoard.classList.remove('d-none');
        analyticsView.classList.add('d-none');
        renderKanban(filteredTasks);
      } else if (currentView === 'analytics') {
        taskGrid.classList.add('d-none');
        kanbanBoard.classList.add('d-none');
        analyticsView.classList.remove('d-none');
        renderAnalytics(allTasks);
      }
    }

    updateSortIndicators();
    updateBulkActions();
    updateDashboardHealth(allTasks);
  }

  function createToastShell(type) {
    const el = document.createElement('div');
    el.className = 'toast align-items-center border-0 text-bg-' + type;
    el.setAttribute('role', 'alert');
    el.setAttribute('aria-live', 'assertive');
    el.setAttribute('aria-atomic', 'true');
    const flexDiv = document.createElement('div');
    flexDiv.className = 'd-flex align-items-center p-2';
    el.appendChild(flexDiv);
    return { el: el, flexDiv: flexDiv };
  }

  function mountToast(el, delay) {
    toastContainer.appendChild(el);
    const toast = new bootstrap.Toast(el, { autohide: true, delay: delay });
    toast.show();
    el.addEventListener('hidden.bs.toast', function () { el.remove(); });
    return toast;
  }

  function showToast(message, type) {
    type = type || 'success';
    const shell = createToastShell(type);
    const icon = toastIcons[type] || toastIcons.success;
    const iconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    iconSvg.setAttribute('width', '20');
    iconSvg.setAttribute('height', '20');
    iconSvg.setAttribute('fill', 'currentColor');
    iconSvg.setAttribute('class', 'me-2 flex-shrink-0');
    iconSvg.setAttribute('viewBox', '0 0 16 16');
    iconSvg.innerHTML = icon;
    shell.flexDiv.appendChild(iconSvg);
    const bodyDiv = document.createElement('div');
    bodyDiv.className = 'toast-body';
    bodyDiv.textContent = message;
    shell.flexDiv.appendChild(bodyDiv);
    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'btn-close btn-close-white me-2 m-auto';
    closeBtn.setAttribute('data-bs-dismiss', 'toast');
    shell.flexDiv.appendChild(closeBtn);
    const progress = document.createElement('div');
    progress.className = 'toast-progress';
    shell.el.appendChild(progress);
    mountToast(shell.el, 3000);
  }

  function showUndoDeleteToast(taskName) {
    const shell = createToastShell('danger');
    const bodyDiv = document.createElement('div');
    bodyDiv.className = 'toast-body';
    bodyDiv.textContent = 'Deleted "' + taskName + '"';
    shell.flexDiv.appendChild(bodyDiv);
    const undoBtn = document.createElement('button');
    undoBtn.type = 'button';
    undoBtn.className = 'btn btn-sm btn-light me-2';
    undoBtn.textContent = 'Undo';
    undoBtn.addEventListener('click', function () {
      if (lastDeleted) {
        const tasks = loadTasks();
        tasks.unshift(lastDeleted);
        saveTasks(tasks);
        lastDeleted = null;
        if (undoTimeout) { clearTimeout(undoTimeout); undoTimeout = null; }
        toast.hide();
        currentPage = 1;
        refresh();
        showToast('Task restored!', 'success');
      }
    });
    shell.flexDiv.appendChild(undoBtn);
    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'btn-close btn-close-white me-2 m-auto';
    closeBtn.setAttribute('data-bs-dismiss', 'toast');
    shell.flexDiv.appendChild(closeBtn);
    const toast = mountToast(shell.el, 5000);
  }

  // Subtask Checklist Builder in Form Modal
  function renderSubtaskBuilder() {
    if (!subtaskBuilderList) return;
    if (tempSubtasks.length === 0) {
      subtaskBuilderList.innerHTML = '<span class="text-muted small">No subtasks added yet.</span>';
      return;
    }
    subtaskBuilderList.innerHTML = tempSubtasks.map(function (st, idx) {
      return '<div class="subtask-builder-item">' +
        '<span>' + escapeHtml(st.text) + '</span>' +
        '<button type="button" class="subtask-delete-btn" data-idx="' + idx + '" title="Remove subtask">&times;</button>' +
      '</div>';
    }).join('');
  }

  if (addSubtaskBtn && newSubtaskInput) {
    addSubtaskBtn.addEventListener('click', function () {
      const text = newSubtaskInput.value.trim();
      if (!text) return;
      tempSubtasks.push({ id: generateID(), text: text, completed: false });
      newSubtaskInput.value = '';
      renderSubtaskBuilder();
    });

    newSubtaskInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        addSubtaskBtn.click();
      }
    });
  }

  if (subtaskBuilderList) {
    subtaskBuilderList.addEventListener('click', function (e) {
      const btn = e.target.closest('.subtask-delete-btn');
      if (!btn) return;
      const idx = parseInt(btn.dataset.idx, 10);
      if (!isNaN(idx)) {
        tempSubtasks.splice(idx, 1);
        renderSubtaskBuilder();
      }
    });
  }

  // Form Management
  function setFormLoading(loading) {
    saveBtn.disabled = loading;
    saveBtn.innerHTML = loading
      ? '<span class="spinner-border spinner-border-sm me-1"></span> Saving...'
      : (editId ? 'Update Task' : 'Save Task');
  }

  function resetForm() {
    form.reset();
    fieldDueDate.value = localDateStr(new Date());
    form.classList.remove('was-validated');
    fieldName.classList.remove('is-invalid');
    editId = null;
    tempSubtasks = [];
    renderSubtaskBuilder();
    renderTaskTagsCheckboxList([]);
    modalTitle.textContent = 'Add New Task';
    setFormLoading(false);
  }

  function parseTags(str) {
    if (!str) return [];
    const out = [];
    const seen = new Set();
    String(str).split(/[;,]/).forEach(function (part) {
      const t = part.trim();
      if (t && !seen.has(t.toLowerCase())) {
        seen.add(t.toLowerCase());
        out.push(t);
      }
    });
    return out;
  }

  function renderTaskTagsCheckboxList(selected) {
    if (globalTags.length === 0) {
      taskTagsContainer.innerHTML = '<span class="text-muted small">No tags available. Go to Developer Tools -> Manage Tags.</span>';
      return;
    }
    const selSet = new Set(selected || []);
    taskTagsContainer.innerHTML = globalTags.map(function(tag) {
      const isChecked = selSet.has(tag) ? 'checked' : '';
      return '<div class="form-check form-check-inline">' +
        '<input class="form-check-input task-tag-cb" type="checkbox" id="ttcb_' + escapeHtml(tag) + '" value="' + escapeHtml(tag) + '" ' + isChecked + '>' +
        '<label class="form-check-label" for="ttcb_' + escapeHtml(tag) + '">' + escapeHtml(tag) + '</label>' +
      '</div>';
    }).join('');
  }

  function getFormData() {
    const selectedTags = [];
    if (taskTagsContainer) {
      taskTagsContainer.querySelectorAll('.task-tag-cb:checked').forEach(function(cb) {
        selectedTags.push(cb.value);
      });
    }
    return {
      id: editId,
      name: fieldName.value.trim(),
      description: fieldDesc.value.trim(),
      tags: selectedTags,
      priority: fieldPriority.value,
      status: fieldStatus.value,
      dueDate: fieldDueDate.value,
      subtasks: tempSubtasks
    };
  }

  function setFormData(task) {
    fieldName.value = task.name || '';
    fieldDesc.value = task.description || '';
    renderTaskTagsCheckboxList(task.tags || []);
    fieldPriority.value = task.priority || 'Medium';
    fieldStatus.value = task.status || 'Pending';
    fieldDueDate.value = task.dueDate || '';
    tempSubtasks = Array.isArray(task.subtasks) ? JSON.parse(JSON.stringify(task.subtasks)) : [];
    renderSubtaskBuilder();
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

  function openForm(taskData, defaultStatus) {
    if (taskData) {
      editId = taskData.id;
      setFormData(taskData);
      modalTitle.textContent = 'Edit Task';
      setFormLoading(false);
    } else {
      resetForm();
      if (defaultStatus) {
        fieldStatus.value = defaultStatus;
      }
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

  form.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA' && e.target.id !== 'newSubtaskInput') {
      e.preventDefault();
      if (!validateForm()) return;
      setFormLoading(true);
      handleSave(getFormData());
    }
  });

  // Task Detail Modal Controller
  function openTaskDetail(taskId) {
    const task = loadTasks().find(function (t) { return t.id === taskId; });
    if (!task) return;
    detailTaskId = task.id;

    detailTitle.textContent = task.name;
    detailPriorityPill.className = 'pill ' + (priorityClass[task.priority] || 'pill-low');
    detailPriorityPill.textContent = task.priority;
    detailStatusPill.className = 'pill ' + (statusClass[task.status] || 'pill-pending');
    detailStatusPill.textContent = task.status;

    const due = getDueDateInfo(task);
    if (due.label) {
      detailDueBadge.classList.remove('d-none');
      detailDueBadge.textContent = due.label;
    } else {
      detailDueBadge.classList.add('d-none');
    }

    detailDescription.innerHTML = parseMarkdown(task.description);
    detailDueDate.textContent = task.dueDate ? formatDate(task.dueDate) : '—';
    const hours = Math.floor((task.timeSpent || 0) / 60);
    const mins = (task.timeSpent || 0) % 60;
    detailTimeSpent.textContent = (hours > 0 ? hours + 'h ' : '') + mins + 'm';
    detailCreatedAt.textContent = formatDateTime(task.createdAt);
    detailBlockedBy.textContent = task.blockedBy || 'None';
    detailTags.innerHTML = tagChipsHtml(task.tags);

    // Interactive Subtasks list inside Details
    renderDetailSubtasks(task);

    // History Timeline
    if (Array.isArray(task.history) && task.history.length > 0) {
      detailHistoryList.innerHTML = task.history.map(function (h) {
        return '<div class="history-item">' +
          '<span class="history-dot"></span>' +
          '<span class="fw-semibold">' + escapeHtml(h.action) + '</span>' +
          '<span class="text-muted ms-auto">' + formatDateTime(h.timestamp) + '</span>' +
        '</div>';
      }).join('');
    } else {
      detailHistoryList.innerHTML = '<span class="text-muted small">No history recorded yet.</span>';
    }

    taskDetailModal.show();
  }

  function renderDetailSubtasks(task) {
    const subtasks = Array.isArray(task.subtasks) ? task.subtasks : [];
    if (subtasks.length === 0) {
      detailSubtasksSection.classList.add('d-none');
      return;
    }
    detailSubtasksSection.classList.remove('d-none');
    const stats = getSubtaskStats(subtasks);
    detailSubtasksProgressText.textContent = stats.completed + '/' + stats.total + ' completed';
    detailSubtasksProgressBar.style.width = stats.pct + '%';

    detailSubtasksList.innerHTML = subtasks.map(function (st) {
      return '<div class="detail-subtask-item' + (st.completed ? ' is-completed' : '') + '">' +
        '<input type="checkbox" class="form-check-input detail-st-checkbox" data-task-id="' + escapeHtml(task.id) + '" data-st-id="' + escapeHtml(st.id) + '"' + (st.completed ? ' checked' : '') + '>' +
        '<span>' + escapeHtml(st.text) + '</span>' +
      '</div>';
    }).join('');
  }

  if (detailSubtasksList) {
    detailSubtasksList.addEventListener('change', function (e) {
      if (e.target.classList.contains('detail-st-checkbox')) {
        const taskId = e.target.dataset.taskId;
        const stId = e.target.dataset.stId;
        const checked = e.target.checked;
        const tasks = loadTasks();
        const t = tasks.find(function (task) { return task.id === taskId; });
        if (t && Array.isArray(t.subtasks)) {
          const st = t.subtasks.find(function (sub) { return sub.id === stId; });
          if (st) {
            st.completed = checked;
            saveTasks(tasks);
            renderDetailSubtasks(t);
            refresh();
          }
        }
      }
    });
  }

  if (copyBranchBtn) {
    copyBranchBtn.addEventListener('click', function () {
      if (!detailTaskId) return;
      const task = loadTasks().find(function (t) { return t.id === detailTaskId; });
      if (!task) return;
      const branchName = 'feature/' + slugify(task.name);
      navigator.clipboard.writeText(branchName).then(function () {
        showToast('Copied branch name: ' + branchName, 'info');
      }).catch(function () {
        showToast('Branch name: ' + branchName, 'info');
      });
    });
  }

  if (copyCommitBtn) {
    copyCommitBtn.addEventListener('click', function () {
      if (!detailTaskId) return;
      const task = loadTasks().find(function (t) { return t.id === detailTaskId; });
      if (!task) return;
      const isBug = (task.tags || []).some(function (tag) { return /bug|fix/i.test(tag); });
      const prefix = isBug ? 'fix: ' : 'feat: ';
      const commitMsg = prefix + task.name;
      navigator.clipboard.writeText(commitMsg).then(function () {
        showToast('Copied commit message: ' + commitMsg, 'info');
      }).catch(function () {
        showToast('Commit message: ' + commitMsg, 'info');
      });
    });
  }

  if (detailEditBtn) {
    detailEditBtn.addEventListener('click', function () {
      if (!detailTaskId) return;
      const task = loadTasks().find(function (t) { return t.id === detailTaskId; });
      taskDetailModal.hide();
      if (task) openForm(task);
    });
  }

  // Quick Inline Status & Priority Toggle Handlers
  function cycleStatus(current) {
    if (current === 'Pending') return 'In Progress';
    if (current === 'In Progress') return 'Completed';
    return 'Pending';
  }

  function cyclePriority(current) {
    if (current === 'Low') return 'Medium';
    if (current === 'Medium') return 'High';
    return 'Low';
  }

  // Global Task Actions Handler (Table, Cards, Kanban)
  function handleTaskAction(e) {
    const item = e.target.closest('[data-action]');
    if (!item) return;
    const id = item.dataset.id;
    const action = item.dataset.action;

    if (action === 'view') {
      openTaskDetail(id);
    }
    if (action === 'edit') {
      const task = loadTasks().find(function (t) { return t.id === id; });
      if (task) openForm(task);
    }
    if (action === 'toggle-status') {
      const task = loadTasks().find(function (t) { return t.id === id; });
      if (task) {
        const next = cycleStatus(task.status);
        updateTask(id, { status: next });
        showToast('Updated status to ' + next, 'success');
        refresh();
      }
    }
    if (action === 'toggle-priority') {
      const task = loadTasks().find(function (t) { return t.id === id; });
      if (task) {
        const next = cyclePriority(task.priority);
        updateTask(id, { priority: next });
        showToast('Updated priority to ' + next, 'info');
        refresh();
      }
    }
    if (action === 'delete') {
      confirmThen('Delete Task', 'Are you sure you want to delete this task?', function () {
        const tasks = loadTasks();
        const task = tasks.find(function (t) { return t.id === id; });
        if (task) {
          lastDeleted = task;
          if (undoTimeout) clearTimeout(undoTimeout);
          undoTimeout = setTimeout(function () { lastDeleted = null; }, 5000);
        }
        deleteTask(id);
        confirmModal.hide();
        showUndoDeleteToast(task ? task.name : 'Task');
        currentPage = 1;
        refresh();
      }, 'danger');
    }
    if (action === 'copy') {
      confirmThen('Duplicate Task', 'Create a copy of this task?', function () {
        duplicateTask(id);
        confirmModal.hide();
        showToast('Task duplicated!', 'info');
        currentPage = 1;
        refresh();
      }, 'info');
    }
  }

  taskList.addEventListener('click', handleTaskAction);
  mobileTaskList.addEventListener('click', handleTaskAction);
  kanbanBoard.addEventListener('click', handleTaskAction);

  // Drag & drop wiring for the Kanban board (event delegation so it
  // survives the innerHTML re-renders done by renderKanban).
  let draggedKanbanId = null;

  kanbanBoard.addEventListener('dragstart', function (e) {
    if (e.target.closest('.task-action-menu')) { e.preventDefault(); return; }
    const card = e.target.closest('.kanban-card');
    if (!card) return;
    draggedKanbanId = card.dataset.id;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', draggedKanbanId);
    card.classList.add('dragging');
  });

  kanbanBoard.addEventListener('dragend', function () {
    const card = kanbanBoard.querySelector('.kanban-card.dragging');
    if (card) card.classList.remove('dragging');
    kanbanBoard.querySelectorAll('.kanban-cards-dropzone.drag-over')
      .forEach(function (dz) { dz.classList.remove('drag-over'); });
    draggedKanbanId = null;
  });

  kanbanBoard.addEventListener('dragover', function (e) {
    const dz = e.target.closest('.kanban-cards-dropzone');
    if (!dz) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!dz.classList.contains('drag-over')) {
      kanbanBoard.querySelectorAll('.kanban-cards-dropzone.drag-over')
        .forEach(function (d) { d.classList.remove('drag-over'); });
      dz.classList.add('drag-over');
    }
  });

  kanbanBoard.addEventListener('dragleave', function (e) {
    const dz = e.target.closest('.kanban-cards-dropzone');
    if (!dz) return;
    // Only clear when the pointer actually leaves the dropzone (not a child).
    if (!dz.contains(e.relatedTarget)) dz.classList.remove('drag-over');
  });

  kanbanBoard.addEventListener('drop', function (e) {
    const dz = e.target.closest('.kanban-cards-dropzone');
    if (!dz) return;
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain') || draggedKanbanId;
    if (!id) return;
    const newStatus = dz.dataset.status;
    const task = loadTasks().find(function (t) { return t.id === id; });
    dz.classList.remove('drag-over');
    if (!task || task.status === newStatus) return;
    updateTask(id, { status: newStatus });
    showToast('Moved "' + task.name + '" to ' + newStatus, 'success');
    refresh();
  });

  // Quick Add button on Kanban column headers
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.kanban-add-btn');
    if (!btn) return;
    const defaultStatus = btn.dataset.addStatus || 'Pending';
    openForm(null, defaultStatus);
  });

  // Daily Standup Generator
  function generateStandupReport() {
    const tasks = loadTasks();
    const today = localDateStr(new Date());

    const completed = tasks.filter(function (t) { return t.status === 'Completed'; });
    const inProgress = tasks.filter(function (t) { return t.status === 'In Progress'; });
    const pending = tasks.filter(function (t) { return t.status === 'Pending'; });
    const blockedOrOverdue = tasks.filter(function (t) {
      return t.blockedBy || (t.dueDate && t.dueDate < today && t.status !== 'Completed');
    });

    let report = '### 🎯 Daily Standup - ' + today + '\n\n';

    report += '#### ✅ Completed Recently\n';
    if (completed.length === 0) report += '- None yet\n';
    else completed.slice(0, 8).forEach(function (t) { report += '- ' + t.name + '\n'; });

    report += '\n#### ⏳ Working On Today (In Progress)\n';
    if (inProgress.length === 0) report += '- None in progress\n';
    else inProgress.forEach(function (t) { report += '- ' + t.name + (t.priority === 'High' ? ' [HIGH PRIORITY]' : '') + '\n'; });

    report += '\n#### 📋 Pending / Backlog\n';
    if (pending.length === 0) report += '- Backlog clean\n';
    else pending.slice(0, 5).forEach(function (t) { report += '- ' + t.name + '\n'; });

    if (blockedOrOverdue.length > 0) {
      report += '\n#### ⚠️ Blockers & Overdue Items\n';
      blockedOrOverdue.forEach(function (t) {
        const reason = t.blockedBy ? 'Blocked by: ' + t.blockedBy : 'Overdue (' + t.dueDate + ')';
        report += '- ' + t.name + ' (' + reason + ')\n';
      });
    }

    standupTextarea.value = report;
    standupModal.show();
  }

  if (copyStandupBtn) {
    copyStandupBtn.addEventListener('click', function () {
      standupTextarea.select();
      navigator.clipboard.writeText(standupTextarea.value).then(function () {
        showToast('Standup summary copied to clipboard!', 'success');
      }).catch(function () {
        showToast('Standup text ready to copy', 'info');
      });
    });
  }

  if (sidebarStandupBtn) {
    sidebarStandupBtn.addEventListener('click', function (e) {
      e.preventDefault();
      generateStandupReport();
    });
  }

  if (sidebarShortcutsBtn) {
    sidebarShortcutsBtn.addEventListener('click', function (e) {
      e.preventDefault();
      shortcutsModal.show();
    });
  }

  function renderManageTagsList() {
    if (globalTags.length === 0) {
      globalTagsList.innerHTML = '<div class="text-muted text-center py-3 small">No tags created yet.</div>';
      return;
    }
    globalTagsList.innerHTML = globalTags.map(function (tag) {
      return '<div class="list-group-item d-flex justify-content-between align-items-center">' +
        '<span>' + escapeHtml(tag) + '</span>' +
        '<div>' +
          '<button class="btn btn-sm btn-outline-secondary edit-tag-btn me-2" data-tag="' + escapeHtml(tag) + '">Edit</button>' +
          '<button class="btn btn-sm btn-outline-danger delete-tag-btn" data-tag="' + escapeHtml(tag) + '">Delete</button>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  if (sidebarManageTagsBtn) {
    sidebarManageTagsBtn.addEventListener('click', function (e) {
      e.preventDefault();
      newTagInputGlobal.value = '';
      renderManageTagsList();
      tagsModalInst.show();
    });
  }

  if (addTagBtnGlobal) {
    addTagBtnGlobal.addEventListener('click', function () {
      const val = newTagInputGlobal.value.trim();
      if (!val) return;
      if (globalTags.some(function(t) { return t.toLowerCase() === val.toLowerCase(); })) {
        showToast('Tag already exists.', 'warning');
        return;
      }
      globalTags.push(val);
      globalTags.sort();
      saveGlobalTags();
      newTagInputGlobal.value = '';
      renderManageTagsList();
    });
  }

  if (globalTagsList) {
    globalTagsList.addEventListener('click', function (e) {
      if (e.target.classList.contains('delete-tag-btn')) {
        const tagToDel = e.target.getAttribute('data-tag');
        globalTags = globalTags.filter(function(t) { return t !== tagToDel; });
        saveGlobalTags();
        
        const tasks = loadTasks();
        let modified = false;
        tasks.forEach(function (t) {
          if (t.tags && t.tags.includes(tagToDel)) {
            t.tags = t.tags.filter(function(tag) { return tag !== tagToDel; });
            modified = true;
          }
        });
        if (modified) {
          saveTasks(tasks);
          refresh();
        }
        renderManageTagsList();
      } else if (e.target.classList.contains('edit-tag-btn')) {
        const oldTag = e.target.getAttribute('data-tag');
        const newTag = prompt('Edit tag name:', oldTag);
        if (newTag !== null && newTag.trim() !== '') {
          const val = newTag.trim();
          if (val === oldTag) return;
          if (globalTags.some(function(t) { return t.toLowerCase() === val.toLowerCase(); })) {
            showToast('Tag already exists.', 'warning');
            return;
          }
          globalTags = globalTags.map(function(t) { return t === oldTag ? val : t; });
          globalTags.sort();
          saveGlobalTags();
          
          const tasks = loadTasks();
          let modified = false;
          tasks.forEach(function (t) {
            if (t.tags && t.tags.includes(oldTag)) {
              t.tags = t.tags.map(function(tag) { return tag === oldTag ? val : tag; });
              modified = true;
            }
          });
          if (modified) {
            saveTasks(tasks);
            refresh();
          }
          renderManageTagsList();
        }
      }
    });
  }

  // Command Palette Engine (Ctrl+K)
  function buildCommandPaletteItems(query) {
    const q = (query || '').toLowerCase().trim();
    const tasks = loadTasks();
    const items = [];

    // Views
    items.push({ category: 'Views', title: 'Switch to List View', icon: '📋', action: function () { switchView('list'); } });
    items.push({ category: 'Views', title: 'Switch to Kanban Board', icon: '📊', action: function () { switchView('kanban'); } });
    items.push({ category: 'Views', title: 'Switch to Metrics / Analytics', icon: '📈', action: function () { switchView('analytics'); } });
    items.push({ category: 'Views', title: 'Switch to Daily Tasks', icon: '📅', kbd: 'D', action: function () { switchView('dailyTasks'); } });

    // Actions
    items.push({ category: 'Actions', title: 'Add New Task', icon: '➕', kbd: 'N', action: function () { if (currentView === 'dailyTasks') dtOpenAddModal(null); else openForm(); } });
    items.push({ category: 'Actions', title: 'Generate Daily Standup Summary', icon: '📝', kbd: 'S', action: generateStandupReport });
    items.push({ category: 'Actions', title: 'Toggle Dark / Light Theme', icon: '🌓', kbd: 'T', action: toggleTheme });
    items.push({ category: 'Actions', title: 'Export Backup as JSON', icon: '💾', action: exportToJson });
    items.push({ category: 'Actions', title: 'Export Spreadsheet as Excel (.xlsx)', icon: '📗', action: exportToExcel });
    items.push({ category: 'Actions', title: 'Export Sprint Checklist as Markdown (.md)', icon: '📄', action: exportToMarkdown });
    items.push({ category: 'Actions', title: 'Clear All Active Filters', icon: '🧹', action: function () { resetFilters(); refresh(); } });

    // Filter shortcuts
    items.push({ category: 'Filter Presets', title: 'Show High Priority Tasks', icon: '🔴', action: function () { filterPriority.value = 'High'; refresh(); } });
    items.push({ category: 'Filter Presets', title: 'Show In Progress Tasks', icon: '🔵', action: function () { filterStatus.value = 'In Progress'; refresh(); } });
    items.push({ category: 'Filter Presets', title: 'Show Completed Tasks', icon: '🟢', action: function () { filterStatus.value = 'Completed'; refresh(); } });

    // Task items matching query
    tasks.forEach(function (t) {
      items.push({
        category: 'Tasks',
        title: t.name,
        icon: t.status === 'Completed' ? '✅' : (t.status === 'In Progress' ? '⏳' : '📋'),
        meta: t.priority + ' • ' + t.status,
        action: function () { openTaskDetail(t.id); }
      });
    });

    if (!q) return items;

    return items.filter(function (it) {
      return it.title.toLowerCase().includes(q) || it.category.toLowerCase().includes(q) || (it.meta && it.meta.toLowerCase().includes(q));
    });
  }

  function renderCommandPaletteResults(items) {
    cmdPaletteItems = items;
    if (items.length === 0) {
      cmdPaletteResults.innerHTML = '<div class="p-3 text-center text-muted small">No commands or tasks found</div>';
      return;
    }
    if (cmdPaletteActiveIndex >= items.length) cmdPaletteActiveIndex = 0;

    let currentCat = '';
    let html = '';

    items.forEach(function (it, idx) {
      if (it.category !== currentCat) {
        currentCat = it.category;
        html += '<div class="cmd-palette-section-title">' + escapeHtml(currentCat) + '</div>';
      }
      const activeCls = idx === cmdPaletteActiveIndex ? ' active' : '';
      html += '<div class="cmd-palette-item' + activeCls + '" data-cmd-idx="' + idx + '">' +
        '<div class="cmd-palette-item-left">' +
          '<span class="me-1">' + it.icon + '</span>' +
          '<span class="fw-medium">' + escapeHtml(it.title) + '</span>' +
          (it.meta ? '<small class="text-muted ms-2">(' + escapeHtml(it.meta) + ')</small>' : '') +
        '</div>' +
        (it.kbd ? '<kbd>' + escapeHtml(it.kbd) + '</kbd>' : '') +
      '</div>';
    });

    cmdPaletteResults.innerHTML = html;
  }

  function openCommandPalette() {
    cmdPaletteInput.value = '';
    cmdPaletteActiveIndex = 0;
    renderCommandPaletteResults(buildCommandPaletteItems(''));
    commandPaletteModal.show();
  }

  if (cmdPaletteBtn) cmdPaletteBtn.addEventListener('click', openCommandPalette);

  if (cmdPaletteInput) {
    cmdPaletteInput.addEventListener('input', function () {
      cmdPaletteActiveIndex = 0;
      renderCommandPaletteResults(buildCommandPaletteItems(this.value));
    });

    cmdPaletteInput.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (cmdPaletteItems.length > 0) {
          cmdPaletteActiveIndex = (cmdPaletteActiveIndex + 1) % cmdPaletteItems.length;
          renderCommandPaletteResults(cmdPaletteItems);
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (cmdPaletteItems.length > 0) {
          cmdPaletteActiveIndex = (cmdPaletteActiveIndex - 1 + cmdPaletteItems.length) % cmdPaletteItems.length;
          renderCommandPaletteResults(cmdPaletteItems);
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (cmdPaletteItems[cmdPaletteActiveIndex]) {
          commandPaletteModal.hide();
          cmdPaletteItems[cmdPaletteActiveIndex].action();
        }
      }
    });
  }

  if (cmdPaletteResults) {
    cmdPaletteResults.addEventListener('click', function (e) {
      const itemEl = e.target.closest('.cmd-palette-item');
      if (!itemEl) return;
      const idx = parseInt(itemEl.dataset.cmdIdx, 10);
      if (cmdPaletteItems[idx]) {
        commandPaletteModal.hide();
        cmdPaletteItems[idx].action();
      }
    });
  }

  // Confirmation Modal Helper
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

  // Tag Filtering row
  function populateTagFilter(allTasks) {
    if (!tagFilter) return;
    const tags = new Set();
    allTasks.forEach(function (t) {
      (t.tags || []).forEach(function (tag) { if (tag) tags.add(tag); });
    });
    const sorted = Array.from(tags).sort(function (a, b) {
      return a.toLowerCase().localeCompare(b.toLowerCase());
    });
    if (sorted.length === 0) {
      tagFilter.innerHTML = '<span class="text-muted small">No tags yet</span>';
      return;
    }
    tagFilter.innerHTML = sorted.map(function (tag) {
      const active = selectedTags.has(tag) ? ' active' : '';
      return '<button type="button" class="tag-chip' + active + '" data-tag="' + escapeHtml(tag) + '">#' + escapeHtml(tag) + '</button>';
    }).join('');
  }

  if (tagFilter) {
    tagFilter.addEventListener('click', function (e) {
      const chip = e.target.closest('.tag-chip');
      if (!chip) return;
      const tag = chip.dataset.tag;
      if (selectedTags.has(tag)) selectedTags.delete(tag);
      else selectedTags.add(tag);
      refresh();
    });
  }

  function renderActiveFilters() {
    const el = document.getElementById('activeFilters');
    if (!el) return;
    const chips = [];
    const state = getFilterState();
    if (state.status) {
      chips.push({ label: 'Status: ' + state.status, clear: function () { filterStatus.value = ''; } });
    }
    if (state.priority) {
      chips.push({ label: 'Priority: ' + state.priority, clear: function () { filterPriority.value = ''; } });
    }
    if (state.dueDateFilter) {
      chips.push({ label: 'Date: ' + formatDate(state.dueDateFilter), clear: function () { filterDueDate.value = ''; } });
    }
    if (selectedTags.size > 0) {
      chips.push({ label: 'Tags: ' + Array.from(selectedTags).join(', '), clear: function () { selectedTags.clear(); } });
    }
    if (chips.length === 0) {
      el.classList.add('d-none');
      el.innerHTML = '';
      return;
    }
    el.classList.remove('d-none');
    el.innerHTML = chips.map(function (c, idx) {
      return '<span class="filter-chip">' + escapeHtml(c.label) +
        '<button type="button" aria-label="Remove filter" data-idx="' + idx + '">' +
        '<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>' +
        '</button></span>';
    }).join('');
    el._chips = chips;
  }

  if (document.getElementById('activeFilters')) {
    document.getElementById('activeFilters').addEventListener('click', function (e) {
      const btn = e.target.closest('button[data-idx]');
      if (!btn) return;
      const chips = this._chips || [];
      const chip = chips[parseInt(btn.dataset.idx, 10)];
      if (chip) { chip.clear(); selectedIds.clear(); currentPage = 1; refresh(); }
    });
  }

  // Sidebar navigation routing
  if (sidebarNav) {
    sidebarNav.addEventListener('click', function (e) {
      const item = e.target.closest('.nav-item');
      if (!item) return;
      const nav = item.dataset.nav;
      if (!nav) return;
      e.preventDefault();

      if (nav === 'kanban') {
        switchView('kanban');
      } else if (nav === 'analytics') {
        switchView('analytics');
      } else if (nav === 'dailyTasks') {
        switchView('dailyTasks');
      } else {
        switchView('list');
        filterStatus.value = nav === 'all' ? '' : nav;
      }
      selectedIds.clear();
      currentPage = 1;
      refresh();
    });
  }

  function updateSidebarNavigation() {
    if (!sidebarNav) return;
    const currentStatus = filterStatus.value;
    sidebarNav.querySelectorAll('.nav-item[data-nav]').forEach(function (item) {
      const nav = item.dataset.nav;
      if (currentView === 'dailyTasks') {
        item.classList.toggle('active', nav === 'dailyTasks');
      } else if (currentView === 'kanban') {
        item.classList.toggle('active', nav === 'kanban');
      } else if (currentView === 'analytics') {
        item.classList.toggle('active', nav === 'analytics');
      } else {
        const active = (nav === 'all' && !currentStatus) || (nav === currentStatus);
        item.classList.toggle('active', active);
      }
    });
  }

  function refresh() {
    let all = loadTasks();
    let filtered = applyFilters(all);
    populateTagFilter(all);
    renderActiveFilters();
    updateSidebarNavigation();
    render(all, filtered);
  }

  // View switchers event listeners
  viewListBtn.addEventListener('click', function () { switchView('list'); });
  viewBoardBtn.addEventListener('click', function () { switchView('kanban'); });
  viewAnalyticsBtn.addEventListener('click', function () { switchView('analytics'); });

  // Table Column Sort Click Handlers
  document.addEventListener('click', function (e) {
    const th = e.target.closest('.sortable-header');
    if (!th) return;
    const field = th.dataset.sort;
    const currentVal = sortBySelect.value || 'createdAt-desc';
    const parts = currentVal.split('-');
    const currentField = parts[0];
    const currentDir = parts[1];

    let nextDir = 'asc';
    if (currentField === field && currentDir === 'asc') nextDir = 'desc';

    sortBySelect.value = field + '-' + nextDir;
    refresh();
  });

  // Page Size Selector
  pageSizeSelect.addEventListener('change', function () {
    pageSize = parseInt(this.value, 10) || 10;
    currentPage = 1;
    refresh();
  });

  // Pagination List Click
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

  prevPageBtn.addEventListener('click', function () {
    if (currentPage > 1) { currentPage--; refresh(); }
  });

  nextPageBtn.addEventListener('click', function () {
    let all = loadTasks();
    let filtered = applyFilters(all);
    let totalPages = Math.ceil(filtered.length / pageSize) || 1;
    if (currentPage < totalPages) { currentPage++; refresh(); }
  });

  let searchTimer;
  searchInput.addEventListener('input', function () { clearTimeout(searchTimer); searchTimer = setTimeout(refresh, 200); });
  filterStatus.addEventListener('change', function () { selectedIds.clear(); refresh(); });
  filterPriority.addEventListener('change', function () { selectedIds.clear(); refresh(); });
  filterDueDate.addEventListener('change', function () { selectedIds.clear(); refresh(); });
  sortBySelect.addEventListener('change', function () { refresh(); });
  clearBtn.addEventListener('click', function () { resetFilters(); selectedIds.clear(); currentPage = 1; refresh(); });

  if (clearFiltersFromEmpty) {
    clearFiltersFromEmpty.addEventListener('click', function () { resetFilters(); selectedIds.clear(); currentPage = 1; refresh(); });
  }

  // Checkbox delegation for bulk selection
  document.addEventListener('change', function (e) {
    if (e.target.classList.contains('task-checkbox')) {
      const id = e.target.dataset.id;
      if (!id) return;
      if (e.target.checked) { selectedIds.add(id); }
      else { selectedIds.delete(id); }
      updateBulkActions();
    }
  });

  function syncSelectAll(checked) {
    document.querySelectorAll('.task-checkbox').forEach(function (cb) {
      if (cb.dataset.id) cb.checked = checked;
    });
    selectedIds.clear();
    if (checked) {
      document.querySelectorAll('.task-checkbox').forEach(function (cb) {
        if (cb.dataset.id) selectedIds.add(cb.dataset.id);
      });
    }
    updateBulkActions();
  }

  if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener('change', function () { syncSelectAll(this.checked); });
  }
  if (selectAllCheckboxHeader) {
    selectAllCheckboxHeader.addEventListener('change', function () {
      if (selectAllCheckbox) selectAllCheckbox.checked = this.checked;
      syncSelectAll(this.checked);
    });
  }

  // Bulk actions
  bulkDeleteBtn.addEventListener('click', function () {
    if (selectedIds.size === 0) return;
    const count = selectedIds.size;
    confirmThen('Delete ' + count + ' Task' + (count > 1 ? 's' : ''), 'Are you sure you want to delete ' + count + ' selected task' + (count > 1 ? 's' : '') + '?', function () {
      taskCache = loadTasks().filter(function (t) { return !selectedIds.has(t.id); });
      saveTasks(taskCache);
      selectedIds.clear();
      confirmModal.hide();
      showUndoDeleteToast('Deleted ' + count + ' tasks');
      currentPage = 1;
      refresh();
    }, 'danger');
  });

  bulkCompleteBtn.addEventListener('click', function () {
    if (selectedIds.size === 0) return;
    const tasks = loadTasks();
    for (let i = 0; i < tasks.length; i++) {
      if (selectedIds.has(tasks[i].id)) {
        tasks[i].status = 'Completed';
      }
    }
    saveTasks(tasks);
    const count = selectedIds.size;
    selectedIds.clear();
    showToast('Marked ' + count + ' task' + (count > 1 ? 's' : '') + ' as Completed.', 'success');
    refresh();
  });

  if (bulkInProgressBtn) {
    bulkInProgressBtn.addEventListener('click', function () {
      if (selectedIds.size === 0) return;
      const tasks = loadTasks();
      for (let i = 0; i < tasks.length; i++) {
        if (selectedIds.has(tasks[i].id)) {
          tasks[i].status = 'In Progress';
        }
      }
      saveTasks(tasks);
      const count = selectedIds.size;
      selectedIds.clear();
      showToast('Marked ' + count + ' task' + (count > 1 ? 's' : '') + ' as In Progress.', 'info');
      refresh();
    });
  }

  // Data Export & Import Engines
  function exportToExcel() {
    if (typeof XLSX === 'undefined') {
      showToast('Excel library failed to load. Please refresh.', 'danger');
      return;
    }
    const tasks = loadTasks();
    if (tasks.length === 0) {
      showToast('No tasks to export.', 'warning');
      return;
    }
    const today = localDateStr(new Date());
    const fileName = 'tasks_export_' + today + '.xlsx';

    function safeStr(val) {
      let s = String(val || '');
      return /^[=+\-@]/.test(s) ? "'" + s : s;
    }

    loadingOverlay.classList.remove('d-none');

    requestAnimationFrame(function () {
      const data = [
        ['Sr No', 'Task Name', 'Description', 'Priority', 'Status', 'Assign Date', 'Tags', 'Time Spent (Mins)', 'Subtasks Count']
      ];
      for (let i = 0; i < tasks.length; i++) {
        const t = tasks[i];
        data.push([
          i + 1,
          safeStr(t.name),
          safeStr(t.description),
          t.priority || '',
          t.status || '',
          t.dueDate || '',
          safeStr((t.tags || []).join(', ')),
          t.timeSpent || 0,
          (t.subtasks || []).length
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
      showToast('Exported ' + tasks.length + ' tasks to Excel!', 'success');
    });
  }

  function importFromExcel(file) {
    if (typeof XLSX === 'undefined') {
      showToast('Excel library failed to load. Please refresh.', 'danger');
      return;
    }
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
          'assigndate': 'dueDate',
          'tags': 'tags',
          'tag': 'tags'
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
          let tags = '';

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
            else if (field === 'tags') tags = val;
          }

          if (!name) continue;

          const nameKey = name.trim().toLowerCase();
          if (fileNames.has(nameKey)) { skippedFileDup++; continue; }
          fileNames.add(nameKey);

          if (existingNames.has(nameKey)) { skippedExistDup++; continue; }

          if (!validPriorities[priority.toLowerCase()]) priority = 'Medium';
          if (!validStatuses[status.toLowerCase()]) status = 'Pending';

          const now = new Date().toISOString();
          toAdd.push({
            id: generateID(),
            name: name,
            description: description,
            tags: parseTags(tags),
            priority: priority,
            status: status,
            dueDate: dueDate,
            subtasks: [],
            timeSpent: 0,
            blockedBy: '',
            createdAt: now,
            updatedAt: now,
            history: [{ action: 'Imported from Excel', timestamp: now }]
          });
          imported++;
        }

        const totalSkipped = skippedFileDup + skippedExistDup;

        if (imported === 0 && totalSkipped === 0) {
          showToast('No valid tasks found in the file.', 'warning');
          return;
        }

        if (imported === 0 && totalSkipped > 0) {
          showToast('No new tasks — all rows are duplicates.', 'warning');
          return;
        }

        taskCache = existing.concat(toAdd);
        saveTasks(taskCache);

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
        showToast('Failed to read Excel file. Check format.', 'danger');
      }
    };
    reader.readAsArrayBuffer(file);
  }

  // JSON Full Backup & Restore
  function exportToJson() {
    const tasks = loadTasks();
    const today = localDateStr(new Date());
    const dataStr = JSON.stringify(tasks, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'task_tracker_backup_' + today + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Saved full JSON backup (' + tasks.length + ' tasks)', 'success');
  }

  function importFromJson(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const parsed = JSON.parse(e.target.result);
        if (!Array.isArray(parsed)) {
          showToast('Invalid backup file. Array of tasks expected.', 'danger');
          return;
        }
        const valid = parsed.filter(isValidTask);
        if (valid.length === 0) {
          showToast('No valid tasks found in JSON file.', 'warning');
          return;
        }

        const existing = loadTasks();
        const existingNames = new Set(existing.map(function (t) { return t.name.trim().toLowerCase(); }));
        let imported = 0;
        let skipped = 0;

        valid.forEach(function (t) {
          const nameKey = t.name.trim().toLowerCase();
          if (existingNames.has(nameKey)) {
            skipped++;
          } else {
            existingNames.add(nameKey);
            existing.push({
              ...t,
              id: generateID()
            });
            imported++;
          }
        });

        saveTasks(existing);
        showToast('Restored ' + imported + ' tasks from JSON (' + skipped + ' duplicates skipped)', 'success');
        refresh();
      } catch (err) {
        showToast('Failed to parse JSON file.', 'danger');
      }
    };
    reader.readAsText(file);
  }

  // CSV Export
  function exportToCsv() {
    const tasks = loadTasks();
    if (tasks.length === 0) {
      showToast('No tasks to export.', 'warning');
      return;
    }
    const today = localDateStr(new Date());
    let csv = 'Sr No,Task Name,Description,Priority,Status,Assign Date,Tags,Time Spent\n';

    tasks.forEach(function (t, i) {
      const row = [
        i + 1,
        '"' + (t.name || '').replace(/"/g, '""') + '"',
        '"' + (t.description || '').replace(/"/g, '""') + '"',
        '"' + (t.priority || '') + '"',
        '"' + (t.status || '') + '"',
        '"' + (t.dueDate || '') + '"',
        '"' + (t.tags || []).join(', ') + '"',
        t.timeSpent || 0
      ];
      csv += row.join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tasks_' + today + '.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Exported ' + tasks.length + ' tasks to CSV', 'success');
  }

  // Markdown Checklist Export
  function exportToMarkdown() {
    const tasks = loadTasks();
    if (tasks.length === 0) {
      showToast('No tasks to export.', 'warning');
      return;
    }
    const today = localDateStr(new Date());
    let md = '# Project Tasks Checklist - ' + today + '\n\n';

    tasks.forEach(function (t) {
      const check = t.status === 'Completed' ? '[x]' : '[ ]';
      md += '- ' + check + ' **' + t.name + '** (`' + t.priority + '` | `' + t.status + '`' + (t.dueDate ? ' | Due: ' + t.dueDate : '') + ')\n';
      if (t.description) {
        md += '  > ' + t.description.replace(/\n/g, '\n  > ') + '\n';
      }
      if (Array.isArray(t.subtasks) && t.subtasks.length > 0) {
        t.subtasks.forEach(function (st) {
          md += '  - ' + (st.completed ? '[x]' : '[ ]') + ' ' + st.text + '\n';
        });
      }
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tasks_checklist_' + today + '.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Exported Markdown checklist', 'success');
  }

  // Data Actions Event Listeners
  exportBtn.addEventListener('click', exportToExcel);
  exportJsonBtn.addEventListener('click', exportToJson);
  exportCsvBtn.addEventListener('click', exportToCsv);
  exportMarkdownBtn.addEventListener('click', exportToMarkdown);

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

  importJsonBtn.addEventListener('click', function () {
    jsonFileInput.value = '';
    jsonFileInput.click();
  });

  jsonFileInput.addEventListener('change', function () {
    if (this.files && this.files[0]) {
      importFromJson(this.files[0]);
    }
  });

  themeToggle.addEventListener('click', toggleTheme);

  // ===========================================================================
  // Daily Tasks Module — independent habit tracker (own localStorage key).
  // Spreadsheet-like grid: rows = habits, columns = days.
  // ===========================================================================
  const DT_STORAGE_KEY = 'dailyTasksData';

  // DOM Elements
  const statsContainer   = document.getElementById('statsContainer');
  const activeFiltersEl  = document.getElementById('activeFilters');
  const viewSwitcher     = document.getElementById('viewSwitcher');
  const addTaskBtnDesktop = document.getElementById('addTaskBtnDesktop');
  const addTaskFab       = document.getElementById('addTaskFab');
  const dailyTasksView   = document.getElementById('dailyTasksView');
  const dtSummaryGrid    = document.getElementById('dtSummaryGrid');
  const dtGridWrap       = document.getElementById('dtGridWrap');
  const dtEmptyState     = document.getElementById('dtEmptyState');
  const dtDateLabel      = document.getElementById('dtDateLabel');
  const dtPrevBtn        = document.getElementById('dtPrevBtn');
  const dtTodayBtn       = document.getElementById('dtTodayBtn');
  const dtNextBtn        = document.getElementById('dtNextBtn');
  const dtViewDaysSelect = document.getElementById('dtViewDays');
  const dtAddTaskBtn     = document.getElementById('dtAddTaskBtn');
  const dtEmptyAddBtn    = document.getElementById('dtEmptyAddBtn');
  const dtModalEl        = document.getElementById('dailyTaskModal');
  const dtModalTitle     = document.getElementById('dtModalTitle');
  const dtTaskName       = document.getElementById('dtTaskName');
  const dtTaskIcon       = document.getElementById('dtTaskIcon');
  const dtSaveTaskBtn    = document.getElementById('dtSaveTaskBtn');

  // State
  let dtData = { dailyTasks: [], dailyTaskEntries: {} };
  let dtCurrentStartDate = null; // ISO date of the first visible day
  let dtViewDays = 7;            // 7, 14, or 30
  let dtSelectedCell = null;     // { taskId, date }
  let dtModalTaskId = null;

  const dtModalInst = new bootstrap.Modal(dtModalEl);

  function dtLoadData() {
    try {
      const raw = localStorage.getItem(DT_STORAGE_KEY);
      if (raw === null) {
        dtData = { dailyTasks: [], dailyTaskEntries: {} };
        return;
      }
      const parsed = JSON.parse(raw);
      dtData = {
        dailyTasks: Array.isArray(parsed.dailyTasks) ? parsed.dailyTasks : [],
        dailyTaskEntries: parsed.dailyTaskEntries && typeof parsed.dailyTaskEntries === 'object' ? parsed.dailyTaskEntries : {}
      };
    } catch (e) {
      showToast('Could not load daily tasks data.', 'danger');
      dtData = { dailyTasks: [], dailyTaskEntries: {} };
    }
  }

  function dtSaveData() {
    try {
      localStorage.setItem(DT_STORAGE_KEY, JSON.stringify(dtData));
      return true;
    } catch (e) {
      showToast('Failed to save daily tasks data.', 'danger');
      return false;
    }
  }

  function dtSetToToday() {
    const today = new Date();
    const dow = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() + (dow === 0 ? -6 : 1 - dow));
    dtCurrentStartDate = localDateStr(monday);
  }

  function dtGetDates() {
    if (!dtCurrentStartDate) dtSetToToday();
    const start = new Date(dtCurrentStartDate + 'T00:00:00');
    const dates = [];
    for (let i = 0; i < dtViewDays; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      dates.push(localDateStr(d));
    }
    return dates;
  }

  function dtGoToPrevPeriod() {
    if (!dtCurrentStartDate) dtSetToToday();
    const d = new Date(dtCurrentStartDate + 'T00:00:00');
    d.setDate(d.getDate() - dtViewDays);
    dtCurrentStartDate = localDateStr(d);
    dtRender();
  }

  function dtGoToNextPeriod() {
    if (!dtCurrentStartDate) dtSetToToday();
    const d = new Date(dtCurrentStartDate + 'T00:00:00');
    d.setDate(d.getDate() + dtViewDays);
    dtCurrentStartDate = localDateStr(d);
    dtRender();
  }

  function dtGoToToday() {
    dtSetToToday();
    dtRender();
  }

  function dtCalculateStreak(taskId) {
    const entries = dtData.dailyTaskEntries[taskId] || {};
    const today = new Date();
    let cur = new Date(today);
    if (entries[localDateStr(cur)] !== 'completed') {
      cur = new Date(today);
      cur.setDate(cur.getDate() - 1);
    }
    let streak = 0;
    while (entries[localDateStr(cur)] === 'completed') {
      streak++;
      cur.setDate(cur.getDate() - 1);
    }
    return streak;
  }

  function dtCalculateWeekCompleted() {
    const today = new Date();
    const dow = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() + (dow === 0 ? -6 : 1 - dow));
    let completed = 0;
    let total = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const iso = localDateStr(d);
      dtData.dailyTasks.forEach(function (t) {
        total++;
        if (dtData.dailyTaskEntries[t.id] && dtData.dailyTaskEntries[t.id][iso] === 'completed') completed++;
      });
    }
    return { pct: total > 0 ? Math.round((completed / total) * 100) : 0, completed: completed, total: total };
  }

  function dtCalculateCompletionRate(dates) {
    let completed = 0;
    let total = 0;
    dates.forEach(function (dateStr) {
      dtData.dailyTasks.forEach(function (t) {
        total++;
        if (dtData.dailyTaskEntries[t.id] && dtData.dailyTaskEntries[t.id][dateStr] === 'completed') completed++;
      });
    });
    return { pct: total > 0 ? Math.round((completed / total) * 100) : 0, completed: completed, total: total };
  }

  function dtMakeSummaryCard(label, value, sub) {
    const card = document.createElement('div');
    card.className = 'dt-summary-card';
    const l = document.createElement('span');
    l.className = 'dt-summary-label';
    l.textContent = label;
    const v = document.createElement('div');
    v.className = 'dt-summary-value';
    v.textContent = value;
    const s = document.createElement('div');
    s.className = 'dt-summary-sub';
    s.textContent = sub;
    card.appendChild(l);
    card.appendChild(v);
    card.appendChild(s);
    return card;
  }

  function dtRenderSummaryCards(dates) {
    const today = localDateStr(new Date());
    const totalTasks = dtData.dailyTasks.length;
    let doneToday = 0;
    dtData.dailyTasks.forEach(function (t) {
      if (dtData.dailyTaskEntries[t.id] && dtData.dailyTaskEntries[t.id][today] === 'completed') doneToday++;
    });
    const todayPct = totalTasks > 0 ? Math.round((doneToday / totalTasks) * 100) : 0;

    let bestStreak = 0;
    dtData.dailyTasks.forEach(function (t) { bestStreak = Math.max(bestStreak, dtCalculateStreak(t.id)); });
    const week = dtCalculateWeekCompleted();
    const rate = dtCalculateCompletionRate(dates);

    dtSummaryGrid.innerHTML = '';
    dtSummaryGrid.appendChild(dtMakeSummaryCard(
      'Today\'s Progress',
      todayPct + '%',
      doneToday + ' of ' + totalTasks + ' habits done today'
    ));
    dtSummaryGrid.appendChild(dtMakeSummaryCard(
      'Best Streak',
      bestStreak + ' day' + (bestStreak === 1 ? '' : 's'),
      'Longest active streak'
    ));
    dtSummaryGrid.appendChild(dtMakeSummaryCard(
      'This Week',
      week.pct + '%',
      week.completed + ' of ' + week.total + ' task-days complete'
    ));
    dtSummaryGrid.appendChild(dtMakeSummaryCard(
      'Completion Rate',
      rate.pct + '%',
      rate.completed + ' of ' + rate.total + ' task-days in view'
    ));
  }

  function dtUpdateDateLabel(dates) {
    if (!dates.length) return;
    dtDateLabel.textContent = formatDate(dates[0]) + ' — ' + formatDate(dates[dates.length - 1]);
  }

  function dtApplySelection() {
    if (!dtSelectedCell) return;
    const cell = dtGridWrap.querySelector('.dt-cell[data-task-id="' + dtSelectedCell.taskId + '"][data-date="' + dtSelectedCell.date + '"]');
    if (cell) cell.classList.add('dt-cell-selected');
    else dtSelectedCell = null;
  }

  function dtClearSelection() {
    dtSelectedCell = null;
    dtGridWrap.querySelectorAll('.dt-cell-selected').forEach(function (el) { el.classList.remove('dt-cell-selected'); });
  }

  function dtRenderGrid(dates) {
    const today = localDateStr(new Date());
    let html = '<table class="dt-table"><thead><tr>';
    html += '<th class="dt-col-fixed">Habit</th>';
    dates.forEach(function (dateStr) {
      const d = new Date(dateStr + 'T00:00:00');
      html += '<th class="' + (dateStr === today ? 'dt-col-today' : '') + '">' +
        '<span class="dt-day-name">' + d.toLocaleDateString('en-US', { weekday: 'short' }) + '</span>' +
        '<span class="dt-day-num">' + d.getDate() + '</span>' +
      '</th>';
    });
    html += '</tr></thead><tbody>';

    dtData.dailyTasks.forEach(function (task) {
      const streak = dtCalculateStreak(task.id);
      html += '<tr><td class="dt-col-fixed"><div class="dt-task-name">';
      if (task.icon) html += '<span class="dt-task-icon">' + escapeHtml(task.icon) + '</span>';
      html += '<span class="dt-task-label">' + escapeHtml(task.name) + '</span>';
      if (streak > 0) html += '<span class="dt-streak-badge" title="Day streak">🔥 ' + streak + '</span>';
      html += '<div class="dt-task-menu">' +
        '<button class="dt-menu-btn dt-menu-edit" type="button" data-id="' + task.id + '" title="Edit habit">' +
          '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>' +
        '</button>' +
        '<button class="dt-menu-btn dt-menu-delete" type="button" data-id="' + task.id + '" title="Delete habit">' +
          '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z"/></svg>' +
        '</button>' +
      '</div></div></td>';

      dates.forEach(function (dateStr) {
        const entry = dtData.dailyTaskEntries[task.id] ? dtData.dailyTaskEntries[task.id][dateStr] : '';
        const cls = entry === 'completed' ? 'dt-cell-completed' : (entry === 'not-completed' ? 'dt-cell-not-completed' : 'dt-cell-empty');
        let content = '';
        if (entry === 'completed') {
          content = '<svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><path d="M13.485 1.431a1.473 1.473 0 0 1 2.104 2.062l-7.84 9.801a1.473 1.473 0 0 1-2.12.04L.431 8.138a1.473 1.473 0 0 1 2.084-2.083l4.111 4.112 6.82-8.69a1.476 1.476 0 0 1 .039-.046z"/></svg>';
        } else if (entry === 'not-completed') {
          content = '<svg viewBox="0 0 16 16" width="13" height="13" fill="currentColor"><path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/></svg>';
        }
        html += '<td class="' + (dateStr === today ? 'dt-col-today' : '') + '">' +
          '<button type="button" class="dt-cell ' + cls + '" data-task-id="' + task.id + '" data-date="' + dateStr + '"' +
            ' title="' + escapeHtml(task.name) + ' — ' + formatDate(dateStr) + '">' + content + '</button>' +
        '</td>';
      });
      html += '</tr>';
    });

    html += '</tbody></table>';
    dtGridWrap.innerHTML = html;
    dtApplySelection();
  }

  function dtRender() {
    const dates = dtGetDates();
    dtUpdateDateLabel(dates);
    dtRenderSummaryCards(dates);

    const hasTasks = dtData.dailyTasks.length > 0;
    dtGridWrap.classList.toggle('d-none', !hasTasks);
    dtEmptyState.classList.toggle('d-none', hasTasks);
    if (hasTasks) dtRenderGrid(dates);
  }

  function dtAddTask(name, icon) {
    const key = name.trim().toLowerCase();
    if (dtData.dailyTasks.some(function (t) { return t.name.trim().toLowerCase() === key; })) return false;
    dtData.dailyTasks.push({
      id: generateID(),
      name: name.trim(),
      icon: icon,
      createdAt: localDateStr(new Date()),
      order: dtData.dailyTasks.length
    });
    return dtSaveData();
  }

  function dtUpdateTask(id, name, icon) {
    const task = dtData.dailyTasks.find(function (t) { return t.id === id; });
    if (!task) return false;
    const key = name.trim().toLowerCase();
    if (dtData.dailyTasks.some(function (t) { return t.id !== id && t.name.trim().toLowerCase() === key; })) return false;
    task.name = name.trim();
    task.icon = icon;
    return dtSaveData();
  }

  function dtDeleteTask(id) {
    dtData.dailyTasks = dtData.dailyTasks.filter(function (t) { return t.id !== id; });
    delete dtData.dailyTaskEntries[id];
    return dtSaveData();
  }

  function dtToggleCell(taskId, dateStr) {
    const task = dtData.dailyTasks.find(function (t) { return t.id === taskId; });
    if (!task) return;
    const entry = dtData.dailyTaskEntries[taskId] || {};
    const cur = entry[dateStr] || '';
    const next = cur === '' ? 'completed' : (cur === 'completed' ? 'not-completed' : '');
    if (next === '') delete entry[dateStr];
    else entry[dateStr] = next;
    dtData.dailyTaskEntries[taskId] = entry;
    dtSaveData();
    dtRender();
  }

  function dtOpenAddModal(taskId) {
    dtModalTaskId = taskId || null;
    if (taskId) {
      const task = dtData.dailyTasks.find(function (t) { return t.id === taskId; });
      if (!task) return;
      dtTaskName.value = task.name;
      dtTaskIcon.value = task.icon || '';
      dtModalTitle.textContent = 'Edit Habit';
    } else {
      dtTaskName.value = '';
      dtTaskIcon.value = '';
      dtModalTitle.textContent = 'Add New Habit';
    }
    dtModalInst.show();
  }

  function dtSaveTask() {
    const name = dtTaskName.value.trim();
    if (!name) {
      dtTaskName.classList.add('is-invalid');
      dtTaskName.focus();
      return;
    }
    const icon = dtTaskIcon.value.trim();
    const ok = dtModalTaskId ? dtUpdateTask(dtModalTaskId, name, icon) : dtAddTask(name, icon);
    if (!ok) {
      showToast('A habit with this name already exists.', 'warning');
      return;
    }
    showToast(dtModalTaskId ? 'Habit updated!' : 'Habit added!', 'success');
    dtModalInst.hide();
    dtRender();
  }

  function dtInitEvents() {
    if (dtPrevBtn) dtPrevBtn.addEventListener('click', dtGoToPrevPeriod);
    if (dtNextBtn) dtNextBtn.addEventListener('click', dtGoToNextPeriod);
    if (dtTodayBtn) dtTodayBtn.addEventListener('click', dtGoToToday);
    if (dtViewDaysSelect) {
      dtViewDaysSelect.addEventListener('change', function () {
        dtViewDays = parseInt(this.value, 10) || 7;
        dtRender();
      });
    }
    if (dtAddTaskBtn) dtAddTaskBtn.addEventListener('click', function () { dtOpenAddModal(null); });
    if (dtEmptyAddBtn) dtEmptyAddBtn.addEventListener('click', function () { dtOpenAddModal(null); });

    if (dtGridWrap) {
      dtGridWrap.addEventListener('click', function (e) {
        const cell = e.target.closest('.dt-cell');
        if (cell) {
          dtSelectedCell = { taskId: cell.dataset.taskId, date: cell.dataset.date };
          dtToggleCell(cell.dataset.taskId, cell.dataset.date);
          return;
        }
        const editBtn = e.target.closest('.dt-menu-edit');
        if (editBtn) { dtOpenAddModal(editBtn.dataset.id); return; }
        const delBtn = e.target.closest('.dt-menu-delete');
        if (delBtn) {
          const task = dtData.dailyTasks.find(function (t) { return t.id === delBtn.dataset.id; });
          if (!task) return;
          confirmThen('Delete Habit', 'Delete "' + task.name + '" and all of its history?', function () {
            dtDeleteTask(task.id);
            confirmModal.hide();
            showToast('Habit deleted.', 'success');
            dtRender();
          }, 'danger');
        }
      });
    }

    if (dtSaveTaskBtn) dtSaveTaskBtn.addEventListener('click', dtSaveTask);
    if (dtTaskName) {
      dtTaskName.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); dtSaveTask(); }
      });
    }
    if (dtModalEl) {
      dtModalEl.addEventListener('hidden.bs.modal', function () {
        dtTaskName.classList.remove('is-invalid');
        dtModalTaskId = null;
      });
      dtModalEl.addEventListener('shown.bs.modal', function () { dtTaskName.focus(); });
    }

    if (addTaskBtnDesktop) {
      addTaskBtnDesktop.addEventListener('click', function () {
        if (currentView === 'dailyTasks') dtOpenAddModal(null);
        else openForm();
      });
    }
    if (addTaskFab) {
      addTaskFab.addEventListener('click', function () {
        if (currentView === 'dailyTasks') dtOpenAddModal(null);
        else openForm();
      });
    }

    // Grid keyboard navigation (arrows / Enter / Space / Escape)
    document.addEventListener('keydown', function (e) {
      const activeEl = document.activeElement;
      const isTyping = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.tagName === 'SELECT' || activeEl.isContentEditable);
      if (isTyping) return;
      if (dailyTasksView.classList.contains('d-none')) return;

      const dates = dtGetDates();
      const taskIds = dtData.dailyTasks.map(function (t) { return t.id; });
      if (taskIds.length === 0 || dates.length === 0) return;

      if (!dtSelectedCell) {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
          e.preventDefault();
          dtSelectedCell = { taskId: taskIds[0], date: dates[0] };
          dtApplySelection();
          e.target.blur && e.target.blur();
        }
        return;
      }

      let row = taskIds.indexOf(dtSelectedCell.taskId);
      let col = dates.indexOf(dtSelectedCell.date);
      if (row === -1 || col === -1) { dtClearSelection(); return; }

      if (e.key === 'ArrowRight') { e.preventDefault(); col = (col + 1) % dates.length; }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); col = (col - 1 + dates.length) % dates.length; }
      else if (e.key === 'ArrowDown') { e.preventDefault(); row = (row + 1) % taskIds.length; }
      else if (e.key === 'ArrowUp') { e.preventDefault(); row = (row - 1 + taskIds.length) % taskIds.length; }
      else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        dtToggleCell(dtSelectedCell.taskId, dtSelectedCell.date);
        return;
      } else if (e.key === 'Escape') {
        e.preventDefault();
        dtClearSelection();
        return;
      } else {
        return;
      }

      dtSelectedCell = { taskId: taskIds[row], date: dates[col] };
      dtApplySelection();
      const cell = dtGridWrap.querySelector('.dt-cell[data-task-id="' + dtSelectedCell.taskId + '"][data-date="' + dtSelectedCell.date + '"]');
      if (cell) cell.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    });
  }

  dtLoadData();
  dtInitEvents();

  // Keyboard Shortcuts Handler
  document.addEventListener('keydown', function (e) {
    const activeEl = document.activeElement;
    const isTyping = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable);

    // Ctrl+K or Cmd+K: Command Palette
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openCommandPalette();
      return;
    }

    if (isTyping) return;

    // Search focus
    if (e.key === '/') {
      e.preventDefault();
      searchInput.focus();
    }
    // New task
    if (e.key === 'n' || e.key === 'N') {
      e.preventDefault();
      if (currentView === 'dailyTasks') dtOpenAddModal(null);
      else openForm();
    }
    // Switch views
    if (e.key === 'l' || e.key === 'L') {
      e.preventDefault();
      switchView('list');
    }
    if (e.key === 'b' || e.key === 'B') {
      e.preventDefault();
      switchView('kanban');
    }
    if (e.key === 'a' || e.key === 'A') {
      e.preventDefault();
      switchView('analytics');
    }
    // Daily Tasks
    if (e.key === 'd' || e.key === 'D') {
      e.preventDefault();
      switchView('dailyTasks');
    }
    // Theme toggle
    if (e.key === 't' || e.key === 'T') {
      e.preventDefault();
      toggleTheme();
    }
    // Daily Standup
    if (e.key === 's' || e.key === 'S') {
      e.preventDefault();
      generateStandupReport();
    }
    // Shortcuts guide
    if (e.key === '?') {
      e.preventDefault();
      shortcutsModal.show();
    }
  });

  // Modal Instances
  const taskModal       = new bootstrap.Modal(modalTask);
  const taskDetailModal = new bootstrap.Modal(taskDetailModalEl);
  const confirmModal    = new bootstrap.Modal(confirmModalEl);
  const instrModal      = new bootstrap.Modal(excelModalEl);
  const commandPaletteModal = new bootstrap.Modal(commandPaletteModalEl);
  const standupModal    = new bootstrap.Modal(standupModalEl);
  const shortcutsModal  = new bootstrap.Modal(shortcutsModalEl);
  const tagsModalInst   = new bootstrap.Modal(tagsModalEl);

  modalTask.addEventListener('hidden.bs.modal', resetForm);
  modalTask.addEventListener('shown.bs.modal', function () {
    fieldName.focus();
  });

  commandPaletteModalEl.addEventListener('shown.bs.modal', function () {
    cmdPaletteInput.focus();
  });

  // ---------------------------------------------------------------------------
  // Module Namespaces (references to the function declarations above).
  // Grouped for readability; runtime behavior is unchanged.
  // ---------------------------------------------------------------------------
  const Utilities = {
    escapeHtml: escapeHtml, slugify: slugify, localDateStr: localDateStr,
    formatDate: formatDate, formatDateTime: formatDateTime, priorityWeight: priorityWeight,
    getDueDateInfo: getDueDateInfo, parseMarkdown: parseMarkdown,
    isValidTask: isValidTask, generateID: generateID
  };
  const StorageUtils = { readRaw: readRaw, writeRaw: writeRaw, loadTasks: loadTasks, saveTasks: saveTasks };
  const TaskState = {
    all: loadTasks,
    add: addTask,
    update: updateTask,
    remove: deleteTask,
    duplicate: duplicateTask,
    replaceAll: function (tasks) { taskCache = tasks; return saveTasks(taskCache); }
  };
  const DOMRenderer = {
    renderRow: renderRow, renderMobileCard: renderMobileCard, renderKanbanCard: renderKanbanCard,
    renderKanban: renderKanban, renderAnalytics: renderAnalytics, render: render,
    buildActionMenu: buildActionMenu, tagChipsHtml: tagChipsHtml, subtaskMiniHtml: subtaskMiniHtml
  };
  const EventHandlers = {
    handleTaskAction: handleTaskAction,
    confirmThen: confirmThen, renderCommandPaletteResults: renderCommandPaletteResults
  };

  // Init Theme
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark') setTheme('dark');
  } catch (e) {}

  // Initialize App
  taskCache = readRaw();   // load tasks from localStorage once into the in-memory cache
  loadGlobalTags();
  refresh();
})();
