Now let me analyze both use case diagrams carefully and create a comprehensive Figma prompt.

Looking at your diagrams, I can identify:

**Image 1 — Actors:** Citizen, Government Official
**Image 2 — Actor:** Admin

Let me compile the full system:Now I have everything I need. Let me create a comprehensive, detailed Figma/UI prompt based on your use case diagrams.Here is your complete, detailed Figma prompt — ready to paste:

---

## 🧩 Complete Figma UI Prompt — Citizen Complaint Management System

---

### SYSTEM OVERVIEW
Design a **Citizen Complaint Management System** web application with **role-based access control** for 3 distinct user roles: **Citizen**, **Government Official**, and **Admin**. The system handles the full lifecycle of public complaints — submission, tracking, resolution, and reporting.

---

### DESIGN SYSTEM & VISUAL LANGUAGE

**Color Palette:**
- Primary: `#1A56DB` (action blue)
- Citizen accent: `#2563EB`
- Official accent: `#0D9488`
- Admin accent: `#DC2626`
- Success: `#16A34A` | Warning: `#D97706` | Danger: `#DC2626`
- Background: `#F8FAFC` | Surface: `#FFFFFF` | Border: `#E2E8F0`
- Text Primary: `#0F172A` | Text Secondary: `#64748B`

**Typography:**
- Font: `Inter` (or `DM Sans`)
- H1: 28px/600 | H2: 22px/600 | H3: 18px/500
- Body: 14px/400 | Label: 12px/500 uppercase | Caption: 12px/400

**Component Standards:**
- Border radius: 8px (cards), 6px (inputs), 4px (badges/chips)
- Card shadow: `0 1px 3px rgba(0,0,0,0.10)`
- All inputs: 40px height, full border, focus ring in primary blue
- Primary buttons: filled blue, 8px radius, 36px height
- Status badges: pill shape, colored background + matching dark text

---

### PAGE 1 — LANDING / LOGIN PAGE

**Layout:** Centered split — left side branding, right side form card.

**Left panel (brand):**
- Government logo / shield icon (SVG)
- Headline: "File & Track Your Complaints"
- Subtext: "Transparent grievance redressal for every citizen"
- 3 feature bullets with icons: "Real-time tracking", "Secure uploads", "Instant notifications"

**Right panel (auth card):**
- Card with shadow, white bg, 400px wide
- Tab switcher: **Login** | **Register** (active tab = underline in primary blue)

**Login tab fields:**
- Email input (with mail icon)
- Password input (with eye toggle for show/hide)
- "Forgot password?" link (right-aligned)
- Primary button: "Login" (full width)
- Divider "— OR —"
- Google OAuth button (outlined, with Google icon)
- "New user? Register here" link

**Register tab fields:**
- Full Name input
- Email input
- Phone Number input (with country code dropdown `+91`)
- Password input (strength meter below: weak/medium/strong)
- Confirm Password input
- Checkbox: "I agree to Terms & Privacy Policy"
- Primary button: "Create Account" (full width)

**2FA Modal (triggered after login for Officials/Admin):**
- Overlay modal, centered
- Title: "Two-Factor Authentication"
- Subtitle: "Enter the 6-digit OTP sent to your email"
- 6 separate 1-digit input boxes in a row (auto-focus next)
- Timer: "Resend OTP in 00:45" (countdown)
- Button: "Verify OTP" (full width, blue)
- Small link: "Resend OTP"

---

### PAGE 2 — CITIZEN DASHBOARD

**Top Navbar:**
- Logo left | "Complaint Portal" text
- Center: search bar (global search)
- Right: Bell icon (notification count badge) | Avatar with dropdown (Profile, Settings, Logout)
- Role chip next to avatar: "CITIZEN" in blue pill

**Left Sidebar (collapsible, 220px wide):**
- Menu items with icons:
  - 🏠 Dashboard (active)
  - 📝 Submit Complaint
  - 📋 My Complaints
  - 🔍 Search Complaints
  - 🕒 Complaint History
  - 🔔 Notifications
  - 👤 My Profile
- Bottom: "Logout" link with icon

**Main Content — Dashboard Overview:**

**Stats row (4 cards horizontal):**
- Card 1: "Total Complaints" — count number large, subtitle "submitted by you" — blue icon
- Card 2: "Pending" — amber/orange icon, count
- Card 3: "In Progress" — blue icon, count
- Card 4: "Resolved" — green icon, count

**Quick Action buttons (horizontal row):**
- "+ Submit New Complaint" (primary blue, filled)
- "Track Complaint" (outlined blue)
- "Download Report" (outlined gray)

**Recent Complaints Table:**
- Table title: "My Recent Complaints"
- Columns: `Complaint ID | Title | Category | Date | Status | Actions`
- Status badges:
  - `Pending` = amber pill
  - `In Progress` = blue pill
  - `Resolved` = green pill
  - `Closed` = gray pill
  - `Needs Info` = orange pill
- Actions column: Eye icon (view), Edit icon (if pending)
- Pagination at bottom: "Showing 1–10 of 47"

**Notification panel (right side, 280px):**
- Title: "Recent Notifications"
- List of notifications with timestamp, each with unread dot indicator
- "Mark all as read" link

---

### PAGE 3 — SUBMIT COMPLAINT (Citizen)

**Layout:** Full-width form in a card, max-width 760px centered.

**Breadcrumb:** Home > Submit Complaint

**Form Card — "Submit a New Complaint":**

**Step Progress Bar at top:** 3 steps — `1. Basic Info → 2. Upload Evidence → 3. Review & Submit`
(active step highlighted in blue, completed steps show checkmark)

**Step 1 — Basic Info:**
- Complaint Title: text input, placeholder "Briefly describe the issue"
- Category dropdown: Road/Water/Electricity/Sanitation/Other (with icons per option)
- Department: auto-populated based on category, editable dropdown
- Priority: radio buttons — Low | Medium | High | Urgent
- Description: textarea (6 rows), character count bottom right "240/1000"
- Location: text input + "Use my location" button with GPS icon
- Pin on Map (optional): embed small map widget, click to drop pin

**Step 2 — Upload Evidence (<<includes>> from Submit Complaint):**
- Drag & drop upload zone: dashed border, cloud upload icon, "Drag files here or click to browse"
- Accepted formats: "JPG, PNG, PDF, MP4 — Max 10MB each"
- Uploaded files list: filename, size, remove (×) button, preview thumbnail for images
- Max 5 files indicator

**Step 3 — Review & Submit:**
- Summary card showing all entered details (read-only)
- Checkbox: "I confirm the information above is accurate"
- Two buttons: "← Back" (outlined) and "Submit Complaint" (primary filled)
- Success state after submit: Green checkmark icon, "Complaint Submitted!", auto-generated ID `#CMP-2024-00847`, "Track your complaint" link

---

### PAGE 4 — TRACK COMPLAINT STATUS (Citizen)

**Search bar at top:** Enter complaint ID or keywords

**Complaint Detail Card:**
- Header row: `#CMP-2024-00847` | Badge: "In Progress" | Date: "Dec 15, 2024"
- Title: "Broken streetlight near Market Road"
- Category chip | Department chip | Priority chip

**Status Timeline (vertical stepper):**
- Step 1: ✅ "Submitted" — Dec 15, 10:30 AM — green check
- Step 2: ✅ "Verified" — Dec 16, 9:00 AM — assigned to official name
- Step 3: 🔵 "In Progress" — Dec 17 — current step (animated pulsing dot)
- Step 4: ⬜ "Pending Review"
- Step 5: ⬜ "Closed"

**Comments/Notes section:**
- Thread-style comments from officials
- Input box at bottom: "Add a comment…" with Send button

**Evidence thumbnails:** Grid of uploaded files with lightbox preview on click

**Action for citizen:** "Request Status Update" button (outlined)

---

### PAGE 5 — GOVERNMENT OFFICIAL DASHBOARD

**Navbar:** Same structure but role chip = `OFFICIAL` in teal/green

**Left Sidebar:**
- 🏠 Dashboard
- 📬 View Complaints (with count badge)
- ✅ Verify Complaints
- 🔄 Update Ticket Status
- ❌ Close Complaint
- 💬 Provide Feedback
- ℹ️ Request Additional Info
- 📊 My Reports
- 👤 Profile

**Dashboard Stats (4 cards):**
- "Assigned to Me" | "Pending Verification" | "Resolved This Week" | "Avg. Resolution Time"

**Complaints Queue Table:**
- Columns: `ID | Citizen Name | Category | Submitted | Priority | Status | Assigned To | Actions`
- Filter bar above table: All | Pending | In Progress | Needs Info | Resolved
- Sort: by date / priority / status
- Actions: View (eye) | Verify (tick) | Update Status (pencil) | Request Info (info icon)

**Complaint Detail Modal / Drawer (slide from right, 480px wide):**
- Full complaint info
- Evidence gallery
- Status update dropdown: `Pending → Verified → In Progress → Needs More Info → Resolved → Closed`
- Note/comment field: "Add official note…"
- Two buttons: "Request Additional Info" | "Update Status" (primary)
- "Close Complaint" button (red outlined) at bottom

**Provide Feedback panel:**
- Rating widget (1–5 stars for resolution quality)
- Text area for official remarks
- Submit button

---

### PAGE 6 — ADMIN DASHBOARD

**Navbar:** Role chip = `ADMIN` in red

**Left Sidebar:**
- 🏠 Dashboard
- 👥 Manage Users
- 🎭 Assign Roles
- 📊 Generate Reports
- 📤 Export Reports
- 📡 Monitor Activity
- 🔔 Configure Notifications
- 🏢 Manage Departments
- ⚙️ System Settings
- 🔐 Security (2FA Config)

**Dashboard Stats (6 cards, 3+3 grid):**
- Total Users | Active Officials | Total Complaints | Pending Complaints | Resolved This Month | System Uptime

**Charts Section (2 columns):**
- Left: Bar chart — "Complaints by Category" (last 30 days)
- Right: Line chart — "Complaint Resolution Trend" (weekly)
- Below: Pie chart — "Status Distribution" (Pending / In Progress / Resolved / Closed)

**Activity Feed (right panel):**
- Real-time log: "User X submitted complaint", "Official Y updated status", timestamps
- Color-coded by action type

---

### PAGE 7 — MANAGE USERS (Admin)

**Header row:** "User Management" title | "+ Add User" button (primary)

**Search + Filter bar:**
- Search by name/email
- Role filter dropdown: All | Citizen | Official | Admin
- Department filter dropdown
- Status filter: Active | Inactive | Suspended

**Users Table:**
- Columns: `Avatar + Name | Email | Role | Department | Status | Created | Actions`
- Role badges: color-coded (blue = Citizen, teal = Official, red = Admin)
- Status toggle: green "Active" / red "Suspended" — click to toggle with confirmation modal
- Actions: Edit (pencil) | Delete (trash, requires confirm) | View Activity (clock)

**Add/Edit User Modal:**
- Full Name | Email | Phone
- Role dropdown: Citizen / Government Official / Admin
- Department dropdown (if Official)
- Password (auto-generate toggle)
- Active checkbox
- Save button

---

### PAGE 8 — GENERATE & EXPORT REPORTS (Admin)

**Report Builder Card:**
- Date range picker (from–to calendar)
- Report type: Complaints Summary | Department Performance | Resolution Time | Category Breakdown
- Format: PDF | Excel | CSV (radio buttons with icons)
- Department filter (multi-select chips)
- Status filter (multi-select chips)
- "Generate Report" button (primary)

**Report Preview area:**
- Inline table preview of data
- Charts embedded (bar + line)
- "Export Now" button

---

### PAGE 9 — CONFIGURE NOTIFICATIONS (Admin)

**Two-column layout:**

**Left — Notification Templates:**
- List of trigger events: "Complaint Submitted", "Status Updated", "Complaint Closed", "OTP Request", etc.
- Each row: toggle ON/OFF | Edit template button
- Edit Template modal: Subject line + Body with `{{variables}}` highlighted

**Right — Notification Channels:**
- Email: toggle + SMTP config link
- SMS: toggle + provider config link
- In-app: always on (grayed toggle)
- Push notifications: toggle

---

### PAGE 10 — MANAGE DEPARTMENTS (Admin)

**Department Cards Grid (3-column):**
Each card:
- Department icon + Name
- Head Official name
- Number of complaints this month
- Number of officials
- Edit button | View button

**Add Department Modal:**
- Name | Code (e.g. PWD, BBMP)
- Head Official dropdown
- Description textarea
- Save button

---

### GLOBAL COMPONENTS (reusable across all roles)

**Notification Drawer (top-right bell):**
- Slide-down panel
- Tabs: All | Unread
- Each item: icon (complaint/system/info) + message + relative time + "Mark read" dot
- "Clear all" link

**Confirmation Modal:**
- Used for: delete, close complaint, status change
- Icon (warning triangle) + title + message
- "Cancel" (outlined) + "Confirm" (red filled) buttons

**Empty State:**
- SVG illustration (simple, friendly)
- Message: "No complaints found"
- CTA button

**Loading Skeleton:**
- Gray animated shimmer bars replacing content during load

**Toast Notifications:**
- Bottom-right, auto-dismiss 4s
- Types: Success (green) | Error (red) | Warning (amber) | Info (blue)
- Each has icon + message + optional "Undo" link

**Search & Filter Bar (reusable):**
- Search input with search icon
- Filter chips (tags, removable)
- "Clear all filters" link

---

### RESPONSIVE NOTES

- **Mobile (< 768px):** Sidebar collapses to bottom tab bar (5 main items), tables become card lists, modals go full-screen
- **Tablet (768–1024px):** Sidebar collapses to icon-only (tooltip on hover)
- **Desktop (> 1024px):** Full sidebar expanded

---

### ACCESS CONTROL SUMMARY (for Figma annotations)

| Feature | Citizen | Official | Admin |
|---|---|---|---|
| Submit complaint | ✅ | ❌ | ❌ |
| Upload evidence | ✅ | ❌ | ❌ |
| View own complaints | ✅ | ❌ | ✅ |
| View all complaints | ❌ | ✅ | ✅ |
| Verify / update status | ❌ | ✅ | ✅ |
| Close complaint | ❌ | ✅ | ✅ |
| Manage users | ❌ | ❌ | ✅ |
| Generate reports | ❌ | ❌ | ✅ |
| Configure notifications | ❌ | ❌ | ✅ |
| Manage departments | ❌ | ❌ | ✅ |
| 2FA on login | Optional | ✅ | ✅ |

---

**Paste this entire prompt into Figma's AI design tool, or use it as a spec for designing each screen manually.** Each page maps 1:1 to the use cases in your diagrams — no use case is missing, and every actor gets their exact set of permissions.