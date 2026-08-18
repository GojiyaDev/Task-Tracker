# Developer Task Tracker Pro

A modern, fast, and feature-packed task management & productivity suite tailored for developers. Built with **HTML5, CSS3, Vanilla JavaScript, Bootstrap 5, and SheetJS**.

The application runs 100% locally in the browser with **localStorage** persistence — zero backend, zero build tools, zero telemetry, and maximum data safety.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?logo=bootstrap&logoColor=white)
![Local-First](https://img.shields.io/badge/Storage-LocalFirst-success)

---

## 🚀 Key Features

### 📋 Multi-View Workspace
- **Table View**: Compact, high-density desktop data table & mobile responsive cards.
- **Kanban Board**: Drag-and-drop workflow across *Pending*, *In Progress*, and *Completed* columns with live task counts and quick-add shortcuts.
- **Productivity Metrics**: Real-time project velocity, urgent task tracking, subtask completion rates, time logged counter, priority distribution bars, and top tag cloud.

### ⚡ Developer Productivity & Automation
- **Universal Command Palette (`Ctrl+K` / `Cmd+K`)**: Instant fuzzy search over all tasks, filter presets, views, and actions with arrow-key navigation.
- **Pomodoro Focus Timer (25m)**: Pinned topbar timer widget with play/pause/reset, automatic time logging to active tasks, and Web Audio chime alert.
- **Git Branch & Commit Generator**: 1-click clipboard helpers to generate clean `feature/task-slug` branch names and conventional commit messages (`feat:` / `fix:`).
- **Daily Standup Generator**: One-click generation of structured Markdown standup updates categorized by Completed, Working On, Backlog, and Blockers.

### 🧩 Subtasks & Checklists
- **Dynamic Subtask Builder**: Add and remove step-by-step checklist items directly in the task form.
- **Interactive Checklist in Details**: Toggle subtask completion in the task detail modal with live progress bars.
- **Mini Progress Indicators**: Compact progress bar widgets directly inside table rows and Kanban cards.

### 🔍 Sorting, Filtering & Bulk Actions
- **Multi-Column Sorting**: Sort by Created Date, Task Name, Priority, Due Date, or Status (Ascending/Descending).
- **Multi-Field Instant Search**: Search across task names, descriptions, tags, and subtasks.
- **Customizable Page Size**: View 10, 25, 50, or All tasks per page.
- **Batch Operations**: Bulk delete, bulk mark as Completed, or bulk move to In Progress with select-all support.

### 💾 Data Safety & Portability
- **JSON Backup & Restore**: Export full database backups and restore them anytime with automatic duplicate deduplication.
- **Excel (.xlsx) Import & Export**: Fast spreadsheet data exchange powered by SheetJS with formula injection sanitization.
- **CSV & Markdown Export**: Download standard CSV files or GitHub-flavored Markdown checklist sprint summaries.
- **Undo Delete**: 5-second undo toast recovery for accidental deletions.

---

## 🛠 Tech Stack

- **HTML5 & Semantic Markup**
- **Vanilla JavaScript (ES6+ IIFE Architecture)**
- **Bootstrap 5.3** (Responsive Layouts & Modals)
- **Custom CSS** (Dark/Light Themes, Kanban Drag & Drop, Command Palette)
- **SheetJS (xlsx.full.min.js)** (Spreadsheet import/export)
- **Web Audio API** (Zero-dependency sound synthesis)
- **Browser LocalStorage** (Local-first persistence)

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl + K` / `Cmd + K` | Open Universal Command Palette |
| `/` | Quick focus Search input |
| `N` | Create a New Task |
| `L` | Switch to List / Table View |
| `B` | Switch to Kanban Board View |
| `A` | Switch to Metrics & Analytics View |
| `T` | Toggle Dark / Light Theme |
| `S` | Open Daily Standup Summary Generator |
| `?` | Open Keyboard Shortcuts Cheat Sheet |
| `Esc` | Close active modal |

---

## 📥 Excel Import Format

When importing tasks from Excel (`.xlsx` or `.xls`), use the following column headers (case-insensitive):

| Column Header | Required | Notes |
|---|---|---|
| `Task Name` | **Required** | Must be unique (duplicates are skipped) |
| `Description` | Optional | Supports markdown formatting |
| `Priority` | Optional | `Low`, `Medium`, or `High` (default: `Medium`) |
| `Status` | Optional | `Pending`, `In Progress`, or `Completed` (default: `Pending`) |
| `Assign Date` / `Due Date` | Optional | Format: `YYYY-MM-DD` |
| `Tags` | Optional | Comma or semicolon separated (e.g. `frontend, bug, api`) |

---

## 💻 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/GojiyaDev/Task-Tracker.git
cd Task-Tracker
```

### 2. Run the application
Simply double-click or open `index.html` in any modern web browser.

Alternatively, serve it with any local static HTTP server:
```bash
# Python 3
python -m http.server 8000

# Node
npx serve .
```

---

## 🌐 Live Demo & Deployment

The application is fully compatible with GitHub Pages:
```
https://gojiyadev.github.io/Task-Tracker/
```

---

## 👨‍💻 Author

**Gojiya Dev**  
GitHub: [https://github.com/GojiyaDev](https://github.com/GojiyaDev)

