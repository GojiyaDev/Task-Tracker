# Developer Task Tracker

A lightweight, client-side task management app built with vanilla JavaScript and Bootstrap. All data is stored in your browser's `localStorage` — no server, no sign-up, no backend.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?logo=bootstrap&logoColor=white)

---

## Features

- **CRUD operations** — Create, read, update, and delete tasks
- **Duplicate task** — Quick-copy existing tasks
- **Search & filter** — By name, status, and priority
- **Sort** — By task name, assign date, or status
- **Pagination** — 10 tasks per page
- **Excel Import/Export** — Download your tasks as `.xlsx` or upload from Excel
- **Stats row** — See total, in-progress, completed, and pending counts at a glance
- **Toast notifications** — Smooth feedback for every action
- **Mobile responsive** — Works on desktop and mobile
- **Zero dependencies** beyond Bootstrap (CDN) and SheetJS (CDN)

---

## Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 + CSS3 | Structure and styling |
| Vanilla JavaScript | All application logic (734 lines) |
| [Bootstrap 5.3](https://getbootstrap.com/) | UI components, modals, grid |
| [SheetJS](https://sheetjs.com/) | Excel `.xlsx` read/write |
| `localStorage` | Client-side data persistence |

No bundlers, no build step, no server required.

---

## Getting Started

### Use it directly

Open `index.html` in any modern browser. No installation needed.

### Run locally

```bash
git clone https://github.com/YOUR_USERNAME/task-tracker.git
cd task-tracker
# Open index.html in your browser
```

### Deploy to GitHub Pages

1. Push this repo to GitHub
2. Go to **Settings → Pages**
3. Source: **Deploy from branch** → `main` → `/ (root)`
4. Save

Your site will be live at `https://YOUR_USERNAME.github.io/task-tracker/`.

---

## Excel Format

When importing tasks, your file must have a header row with these columns:

| Column | Required | Notes |
|---|---|---|
| **Task Name** | Yes | Main task title |
| Description | No | Task details |
| Priority | No | Low, Medium, or High |
| Status | No | Pending, In Progress, or Completed |
| Assign Date | No | YYYY-MM-DD format |

Column names are case-insensitive. Extra columns are ignored.

---

## Project Structure

```
task-tracker/
├── index.html       # Main HTML page
├── css/
│   └── style.css    # Custom styles
└── js/
    └── script.js    # Application logic
```

---
