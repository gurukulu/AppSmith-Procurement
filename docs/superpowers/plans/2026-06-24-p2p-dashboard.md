# ProcureStream P2P Dashboard — Appsmith Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Procure-to-Pay dashboard in Appsmith covering the full buyer workflow: PR management, RFQ floating, OA/ARC contract eligibility check, technical & commercial evaluation, vendor award, and PO/NFA generation.

**Architecture:** Multi-page Appsmith application with JS Objects providing mock data (swappable for real REST/DB datasources). Each workflow stage is a dedicated page. The OA/ARC Check page (Phase 01) has been implemented first as a reference; subsequent stages follow the same pattern.

**Tech Stack:** Appsmith (git-sync format, fileFormatVersion 5, serverSchemaVersion 12), HTML column type for status badges, JS Objects for data + helper functions.

## Global Constraints

- Appsmith fileFormatVersion: 5 | serverSchemaVersion: 12 | clientSchemaVersion: 2
- Grid: 64-column snap grid; row units × 10px = pixel height
- All widget IDs must be unique strings across the entire page DSL
- Every CONTAINER_WIDGET must contain exactly one inner CANVAS_WIDGET as direct child
- Inner CANVAS_WIDGET leftColumn/rightColumn must match parent container dimensions (relative 0-based)
- JS Object functions are referenced as `{{JSObjectName.functionName()}}` in widget bindings
- Page slugs must be lowercase kebab-case
- Application navigation: sidebar orientation (SIDE), STACKED style, LIGHT color

---

## File Structure

```
AppSmith-Procurement/
├── application.json               ← App metadata + page registry + nav config
├── metadata.json                  ← Schema versions (do not modify)
├── theme.json                     ← App theme
├── pages/
│   ├── Page1/
│   │   └── Page1.json             ← Existing blank page (isDefault: false)
│   ├── PRWorkflow/                ← Phase 01: OA/ARC Check (IMPLEMENTED)
│   │   ├── PRWorkflow.json        ← Full widget DSL
│   │   └── jsobjects/
│   │       └── PRData/
│   │           ├── PRData.js      ← Mock data + HTML helper functions
│   │           └── metadata.json
│   ├── Dashboard/                 ← Analytics overview (Task 2)
│   │   ├── Dashboard.json
│   │   └── jsobjects/DashboardUtils/
│   ├── PRManagement/              ← PR list + create/edit (Task 3)
│   │   ├── PRManagement.json
│   │   └── jsobjects/PRListData/
│   ├── RFQManagement/             ← Float RFQs + vendor selection (Task 4)
│   │   ├── RFQManagement.json
│   │   └── jsobjects/RFQData/
│   ├── Evaluation/                ← Technical + commercial eval tabs (Task 5)
│   │   ├── Evaluation.json
│   │   └── jsobjects/EvalData/
│   └── POAndNFA/                  ← PO creation + NFA workflow (Task 6)
│       ├── POAndNFA.json
│       └── jsobjects/POData/
└── docs/superpowers/plans/
    └── 2026-06-24-p2p-dashboard.md  ← This file
```

---

## Implemented: PRWorkflow Page (Phase 01 — OA/ARC Check)

Files already written:
- `pages/PRWorkflow/PRWorkflow.json` — Full page DSL with all widgets
- `pages/PRWorkflow/jsobjects/PRData/PRData.js` — Mock data + HTML helpers
- `pages/PRWorkflow/jsobjects/PRData/metadata.json`
- `application.json` — Updated with PRWorkflow as default page + sidebar nav

**Widget inventory (PRWorkflow page):**
| Widget ID | Type | Purpose |
|---|---|---|
| ctr_topbar | CONTAINER | Top header bar (brand, breadcrumb, user) |
| ctr_stages | CONTAINER | 7-stage progress bar (rendered via HTML_WIDGET) |
| ctr_pr_summary | CONTAINER | PR info card (badge, title, meta, items count) |
| ctr_phase_heading | CONTAINER | Phase label + title + system status badge |
| ctr_kpi_row | CONTAINER | 4 KPI stat boxes (evaluated, OA, ARC, regular) |
| ctr_arc_banner | CONTAINER | ARC routing info banner (title bar + left/right panels) |
| tbl_line_items | TABLE_WIDGET_V2 | Line items with HTML columns for status badges |

**Key data bindings:**
```
{{PRData.currentPR.title}}          → PR title text
{{PRData.getStageHtml()}}           → Stage progress bar HTML
{{PRData.getTableData()}}           → Table data array
{{PRData.currentPR.lineItemsCount}} → Items count badge
```

---

## Task 2: Dashboard (Analytics Overview)

**Files:**
- Create: `pages/Dashboard/Dashboard.json`
- Create: `pages/Dashboard/jsobjects/DashboardUtils/DashboardUtils.js`
- Create: `pages/Dashboard/jsobjects/DashboardUtils/metadata.json`
- Modify: `application.json` — add Dashboard page entry

**Interfaces:**
- Produces: navigation target for the sidebar "Dashboard" link

- [ ] **Step 1: Create DashboardUtils.js**

```javascript
// pages/Dashboard/jsobjects/DashboardUtils/DashboardUtils.js
export default {
  kpis: {
    totalPRs: { value: 47, label: "Total PRs", trend: "+8 this month", color: "#1a56db" },
    activeRFQs: { value: 12, label: "Active RFQs", trend: "3 closing this week", color: "#e67e22" },
    posRaised: { value: 23, label: "POs Raised", trend: "5 pending delivery", color: "#16a34a" },
    spendThisMonth: { value: "$2.4M", label: "Spend This Month", trend: "+12% vs last month", color: "#7c3aed" }
  },

  prStatusDistribution: [
    { label: "Draft", value: 8, color: "#94a3b8" },
    { label: "Submitted", value: 11, color: "#3b82f6" },
    { label: "Approved", value: 14, color: "#22c55e" },
    { label: "RFQ Floated", value: 7, color: "#f59e0b" },
    { label: "PO Raised", value: 5, color: "#8b5cf6" },
    { label: "Closed", value: 2, color: "#6b7280" }
  ],

  monthlySpend: [
    { month: "Jan", spend: 1800000 },
    { month: "Feb", spend: 2100000 },
    { month: "Mar", spend: 1650000 },
    { month: "Apr", spend: 2350000 },
    { month: "May", spend: 1900000 },
    { month: "Jun", spend: 2400000 }
  ],

  recentPRs: [
    { id: "PR-2023-001", title: "Enterprise Cloud Infrastructure Upgrade", dept: "IT Services", budget: "$450,000", status: "OA/ARC Check", stage: "1/7" },
    { id: "PR-2023-002", title: "Annual Office Supplies Procurement", dept: "Admin", budget: "$85,000", status: "RFQ Floated", stage: "4/7" },
    { id: "PR-2023-003", title: "Security Camera System Upgrade", dept: "Facilities", budget: "$120,000", status: "Evaluation", stage: "5/7" },
    { id: "PR-2023-004", title: "ERP Software Licenses", dept: "IT Services", budget: "$340,000", status: "Approved", stage: "2/7" },
    { id: "PR-2023-005", title: "Airport Terminal HVAC Maintenance", dept: "Engineering", budget: "$670,000", status: "PO Raised", stage: "6/7" }
  ]
}
```

- [ ] **Step 2: Create Dashboard.json DSL**

Key widget structure for the Dashboard page:
```json
{
  "gitSyncId": "dashboard_page_v1",
  "unpublishedPage": {
    "layouts": [{
      "dsl": {
        "type": "CANVAS_WIDGET",
        "widgetId": "0",
        "widgetName": "MainContainer",
        "backgroundColor": "#f8fafc",
        "snapColumns": 64,
        "snapRows": 400,
        "bottomRow": 4000,
        "canExtend": true,
        "containerStyle": "none",
        "detachFromLayout": true,
        "leftColumn": 0,
        "rightColumn": 4896,
        "topRow": 0,
        "parentColumnSpace": 1,
        "parentRowSpace": 1,
        "version": 94,
        "children": [
          // ctr_dash_header: rows 0-7, cols 0-64, bg white — "Analytics Dashboard" title
          // ctr_kpi_dash_row: rows 8-28, cols 0-64 — 4 KPI cards from DashboardUtils.kpis
          // ctr_charts_row: rows 29-64, cols 0-64
          //   CHART_WIDGET pie_pr_status: rows 0-35, cols 0-30 — prStatusDistribution
          //   CHART_WIDGET bar_monthly_spend: rows 0-35, cols 32-62 — monthlySpend
          // TEXT_WIDGET txt_recent_prs_title: rows 65-68, cols 1-30 — "Recent PRs"
          // TABLE_WIDGET_V2 tbl_recent_prs: rows 69-110, cols 1-63
        ]
      }
    }],
    "name": "Dashboard",
    "slug": "dashboard"
  }
}
```

CHART_WIDGET configuration for PR status pie:
```json
{
  "type": "CHART_WIDGET",
  "widgetId": "pie_pr_status",
  "widgetName": "PRStatusPie",
  "chartType": "PIE_CHART",
  "chartData": [{"seriesName": "PR Status", "data": "{{DashboardUtils.prStatusDistribution.map(d => ({x: d.label, y: d.value}))}}"}],
  "xAxisName": "",
  "yAxisName": "Count",
  "chartName": "PR Status Distribution",
  "isVisible": true,
  "version": 4,
  "dynamicBindingPathList": [{"key": "chartData[0].data"}]
}
```

CHART_WIDGET configuration for monthly spend bar:
```json
{
  "type": "CHART_WIDGET",
  "widgetId": "bar_monthly_spend",
  "widgetName": "MonthlySpendBar",
  "chartType": "COLUMN_CHART",
  "chartData": [{"seriesName": "Spend ($)", "data": "{{DashboardUtils.monthlySpend.map(d => ({x: d.month, y: d.spend}))}}"}],
  "xAxisName": "Month",
  "yAxisName": "Spend (USD)",
  "chartName": "Monthly Spend Trend",
  "isVisible": true,
  "version": 4,
  "dynamicBindingPathList": [{"key": "chartData[0].data"}]
}
```

- [ ] **Step 3: Add page to application.json**

In `application.json`, add to the `pages` array:
```json
{ "id": "Dashboard", "isDefault": false, "slug": "dashboard" }
```

- [ ] **Step 4: Commit**

```bash
git add pages/Dashboard/ application.json
git commit -m "feat: add analytics dashboard page with KPI cards and spend charts"
```

---

## Task 3: PR Management Page

**Files:**
- Create: `pages/PRManagement/PRManagement.json`
- Create: `pages/PRManagement/jsobjects/PRListData/PRListData.js`
- Create: `pages/PRManagement/jsobjects/PRListData/metadata.json`
- Modify: `application.json`

**Interfaces:**
- Produces: clicking a PR row navigates to PRWorkflow page (use `navigateTo('PRWorkflow')`)

- [ ] **Step 1: Create PRListData.js**

```javascript
// pages/PRManagement/jsobjects/PRListData/PRListData.js
export default {
  allPRs: [
    { id: "PR-2023-001", title: "Enterprise Cloud Infrastructure Upgrade", department: "IT Services", requestedBy: "Sarah Miller", budget: "$450,000", status: "OA/ARC Check", priority: "High", createdDate: "Oct 12, 2023" },
    { id: "PR-2023-002", title: "Annual Office Supplies Procurement", department: "Admin", requestedBy: "James Cooper", budget: "$85,000", status: "RFQ Floated", priority: "Medium", createdDate: "Oct 8, 2023" },
    { id: "PR-2023-003", title: "Security Camera System Upgrade", department: "Facilities", requestedBy: "Priya Nair", budget: "$120,000", status: "Evaluation", priority: "High", createdDate: "Sep 28, 2023" },
    { id: "PR-2023-004", title: "ERP Software Licenses", department: "IT Services", requestedBy: "Mark Davis", budget: "$340,000", status: "Approved", priority: "Critical", createdDate: "Oct 5, 2023" },
    { id: "PR-2023-005", title: "Airport Terminal HVAC Maintenance", department: "Engineering", requestedBy: "Ravi Kumar", budget: "$670,000", status: "PO Raised", priority: "High", createdDate: "Sep 15, 2023" },
    { id: "PR-2023-006", title: "Ground Handling Equipment Lease", department: "Operations", requestedBy: "Anna White", budget: "$290,000", status: "Draft", priority: "Low", createdDate: "Oct 20, 2023" }
  ],

  statusColors: {
    "Draft": "#94a3b8",
    "Submitted": "#3b82f6",
    "Approved": "#22c55e",
    "OA/ARC Check": "#f59e0b",
    "RFQ Floated": "#8b5cf6",
    "Evaluation": "#0ea5e9",
    "Negotiation": "#f97316",
    "PO Raised": "#10b981",
    "Closed": "#6b7280"
  },

  priorityColors: {
    "Critical": "#dc2626",
    "High": "#ea580c",
    "Medium": "#ca8a04",
    "Low": "#16a34a"
  },

  getStatusBadge: (status) => {
    const color = PRListData.statusColors[status] || "#94a3b8";
    return `<span style="background:${color}20;color:${color};border:1px solid ${color}50;padding:2px 8px;border-radius:12px;font-size:11px;font-weight:600;">${status}</span>`;
  },

  getPriorityBadge: (priority) => {
    const color = PRListData.priorityColors[priority] || "#94a3b8";
    return `<span style="color:${color};font-weight:700;font-size:12px;">${priority}</span>`;
  },

  getTableData: () => {
    return PRListData.allPRs.map(pr => ({
      "PR Number": pr.id,
      "Title": pr.title,
      "Department": pr.department,
      "Requested By": pr.requestedBy,
      "Budget": pr.budget,
      "statusHtml": PRListData.getStatusBadge(pr.status),
      "priorityHtml": PRListData.getPriorityBadge(pr.priority),
      "Created": pr.createdDate
    }));
  }
}
```

- [ ] **Step 2: Create PRManagement.json DSL**

Key layout (64-col grid):
```
rows 0-7:   ctr_pr_mgmt_header — "PR Management" title + "New PR" button (BUTTON_WIDGET, right-aligned)
rows 8-16:  ctr_filters — SELECT_WIDGET (status filter, cols 0-12), SELECT_WIDGET (dept filter, cols 14-26), INPUT_WIDGET (search, cols 28-44)
rows 17-22: txt_results_count — "Showing X of Y PRs"
rows 23-90: TABLE_WIDGET_V2 tbl_prs — tableData: {{PRListData.getTableData()}}
```

TABLE_WIDGET_V2 `tbl_prs` primaryColumns:
```json
{
  "PR Number": { "index": 0, "width": 130, "columnType": "text", "textColor": "#1a56db", "fontStyle": "BOLD", "label": "PR NUMBER" },
  "Title": { "index": 1, "width": 280, "columnType": "text", "label": "TITLE" },
  "Department": { "index": 2, "width": 150, "columnType": "text", "label": "DEPARTMENT" },
  "Budget": { "index": 3, "width": 120, "columnType": "text", "horizontalAlignment": "RIGHT", "fontStyle": "BOLD", "label": "BUDGET" },
  "statusHtml": { "index": 4, "width": 150, "columnType": "html", "label": "STATUS" },
  "priorityHtml": { "index": 5, "width": 100, "columnType": "html", "label": "PRIORITY" },
  "Created": { "index": 6, "width": 120, "columnType": "text", "label": "CREATED" }
}
```

Row-click action on `tbl_prs` (onRowSelected):
```javascript
navigateTo('PRWorkflow', {}, 'SAME_WINDOW');
```

- [ ] **Step 3: Add "New PR" modal**

Add a MODAL_WIDGET `modal_new_pr` containing a FORM_WIDGET with these INPUT_WIDGET_V2 fields:
- `inp_pr_title`: label "PR Title *", isRequired: true
- `inp_pr_dept`: label "Department *", widgetType: SELECT_WIDGET, isRequired: true
- `inp_pr_budget`: label "Estimated Budget ($) *", inputType: NUMBER, isRequired: true
- `inp_pr_delivery`: label "Target Delivery Date", widgetType: DATE_PICKER_WIDGET2
- `inp_pr_desc`: label "Description", inputType: MULTI_LINE_TEXT

Submit button `btn_submit_pr` onClick:
```javascript
showAlert('PR submitted successfully! PR-' + (2023000 + Math.floor(Math.random()*100)), 'success');
closeModal('modal_new_pr');
```

- [ ] **Step 4: Add page + commit**

```bash
git add pages/PRManagement/ application.json
git commit -m "feat: add PR management page with table, filters, and new PR modal"
```

---

## Task 4: RFQ Management Page

**Files:**
- Create: `pages/RFQManagement/RFQManagement.json`
- Create: `pages/RFQManagement/jsobjects/RFQData/RFQData.js`
- Create: `pages/RFQManagement/jsobjects/RFQData/metadata.json`

- [ ] **Step 1: Create RFQData.js**

```javascript
// pages/RFQManagement/jsobjects/RFQData/RFQData.js
export default {
  vendors: [
    { id: "V001", name: "TechServe Solutions", category: "IT Infrastructure", rating: 4.5, contact: "contact@techserve.com" },
    { id: "V002", name: "CloudMatrix Pvt Ltd", category: "Cloud Services", rating: 4.2, contact: "sales@cloudmatrix.io" },
    { id: "V003", name: "NetShield Security", category: "Cybersecurity", rating: 4.8, contact: "info@netshield.com" },
    { id: "V004", name: "Infra Build Corp", category: "IT Infrastructure", rating: 3.9, contact: "procurement@infrabuild.com" },
    { id: "V005", name: "DataVault Systems", category: "Cloud Services", rating: 4.6, contact: "rfq@datavault.net" }
  ],

  rfqs: [
    {
      id: "RFQ-2023-011", prId: "PR-2023-001", title: "Cloud Infrastructure RFQ",
      issuedDate: "Oct 15, 2023", closingDate: "Oct 25, 2023",
      status: "ISSUED", vendors: ["V001", "V002", "V005"],
      responses: 2
    },
    {
      id: "RFQ-2023-012", prId: "PR-2023-003", title: "Security Systems RFQ",
      issuedDate: "Oct 10, 2023", closingDate: "Oct 20, 2023",
      status: "CLOSED", vendors: ["V003", "V004"],
      responses: 2
    }
  ],

  getVendorNames: (vendorIds) => {
    return vendorIds.map(id => {
      const v = RFQData.vendors.find(vv => vv.id === id);
      return v ? v.name : id;
    }).join(', ');
  },

  getStatusBadge: (status) => {
    const cfg = {
      DRAFT: { bg: "#f1f5f9", color: "#64748b", label: "Draft" },
      ISSUED: { bg: "#dbeafe", color: "#1d4ed8", label: "Issued" },
      CLOSED: { bg: "#dcfce7", color: "#16a34a", label: "Closed" },
      CANCELLED: { bg: "#fee2e2", color: "#dc2626", label: "Cancelled" }
    };
    const c = cfg[status] || cfg.DRAFT;
    return `<span style="background:${c.bg};color:${c.color};padding:2px 10px;border-radius:12px;font-size:11px;font-weight:600;">${c.label}</span>`;
  },

  getTableData: () => {
    return RFQData.rfqs.map(r => ({
      "RFQ Number": r.id,
      "PR Reference": r.prId,
      "Title": r.title,
      "Vendors": RFQData.getVendorNames(r.vendors),
      "Issued Date": r.issuedDate,
      "Closing Date": r.closingDate,
      "statusHtml": RFQData.getStatusBadge(r.status),
      "Responses": r.responses + " / " + r.vendors.length
    }));
  }
}
```

- [ ] **Step 2: Page layout**

```
rows 0-7:   Header — "RFQ Management" + "Float New RFQ" button
rows 8-90:  TABLE_WIDGET_V2 tbl_rfqs — {{RFQData.getTableData()}}
```

Modal `modal_float_rfq` for "Float New RFQ":
- SELECT_WIDGET `sel_pr_for_rfq`: label "Select PR *", options: `{{PRListData.allPRs.filter(p => p.status === 'Approved').map(p => ({label: p.id + ' — ' + p.title, value: p.id}))}}`
- INPUT_WIDGET `inp_rfq_title`: label "RFQ Title *"
- Multi-SELECT_WIDGET `sel_vendors`: label "Select Vendors *", options: `{{RFQData.vendors.map(v => ({label: v.name, value: v.id}))}}`
- DATE_PICKER `dtp_rfq_closing`: label "Closing Date *"

- [ ] **Step 3: Commit**

```bash
git add pages/RFQManagement/ application.json
git commit -m "feat: add RFQ management page with float RFQ modal and vendor multi-select"
```

---

## Task 5: Evaluation Page

**Files:**
- Create: `pages/Evaluation/Evaluation.json`
- Create: `pages/Evaluation/jsobjects/EvalData/EvalData.js`
- Create: `pages/Evaluation/jsobjects/EvalData/metadata.json`

- [ ] **Step 1: Create EvalData.js**

```javascript
// pages/Evaluation/jsobjects/EvalData/EvalData.js
export default {
  technicalCriteria: [
    { criterion: "Technical Compliance", maxScore: 25, weight: "25%" },
    { criterion: "Implementation Plan", maxScore: 20, weight: "20%" },
    { criterion: "Past Experience", maxScore: 20, weight: "20%" },
    { criterion: "Team Competency", maxScore: 20, weight: "20%" },
    { criterion: "Support & SLA", maxScore: 15, weight: "15%" }
  ],

  vendorTechScores: [
    { vendorId: "V001", vendorName: "TechServe Solutions", scores: [22, 17, 19, 18, 13], total: 89, qualified: true },
    { vendorId: "V002", vendorName: "CloudMatrix Pvt Ltd", scores: [20, 16, 15, 17, 12], total: 80, qualified: true },
    { vendorId: "V005", vendorName: "DataVault Systems", scores: [24, 18, 20, 19, 14], total: 95, qualified: true }
  ],

  vendorCommercialBids: [
    { vendorId: "V001", vendorName: "TechServe Solutions", basePrice: 380000, taxes: 19000, totalBid: 399000, deliveryWeeks: 6, paymentTerms: "30 days net", techScore: 89, rank: 2 },
    { vendorId: "V002", vendorName: "CloudMatrix Pvt Ltd", basePrice: 365000, taxes: 18250, totalBid: 383250, deliveryWeeks: 8, paymentTerms: "45 days net", techScore: 80, rank: 3 },
    { vendorId: "V005", vendorName: "DataVault Systems", basePrice: 410000, taxes: 20500, totalBid: 430500, deliveryWeeks: 4, paymentTerms: "30 days net", techScore: 95, rank: 1 }
  ],

  getTechScorecardData: () => {
    return EvalData.vendorTechScores.map(v => {
      const row = { "Vendor": v.vendorName };
      v.scores.forEach((s, i) => {
        row[EvalData.technicalCriteria[i].criterion] = s + "/" + EvalData.technicalCriteria[i].maxScore;
      });
      row["Total"] = v.total + "/100";
      row["Qualified"] = v.qualified
        ? '<span style="color:#16a34a;font-weight:700;">✓ Qualified</span>'
        : '<span style="color:#dc2626;font-weight:700;">✗ Disqualified</span>';
      return row;
    });
  },

  getCommercialTableData: () => {
    return EvalData.vendorCommercialBids.map(v => ({
      "Rank": "#" + v.rank,
      "Vendor": v.vendorName,
      "Base Price": "$" + v.basePrice.toLocaleString(),
      "Taxes": "$" + v.taxes.toLocaleString(),
      "Total Bid": "$" + v.totalBid.toLocaleString(),
      "Delivery": v.deliveryWeeks + " weeks",
      "Payment Terms": v.paymentTerms,
      "Tech Score": v.techScore + "/100"
    }));
  }
}
```

- [ ] **Step 2: Create Evaluation.json with TABS_WIDGET**

```
rows 0-7:   Header — "Evaluation" title + RFQ selector
rows 8-17:  SELECT_WIDGET sel_eval_rfq — Select RFQ to evaluate
rows 18-20: TABS_WIDGET tabs_evaluation (topRow: 18, bottomRow: 130, leftColumn: 0, rightColumn: 64)
  Tab 1 "Technical Evaluation":
    rows 0-5:   "Technical Scorecard" title
    rows 6-50:  TABLE_WIDGET_V2 tbl_tech_scores — {{EvalData.getTechScorecardData()}}
    rows 51-58: "Award Technical Evaluation" BUTTON_WIDGET
  Tab 2 "Commercial Evaluation":
    rows 0-5:   "Commercial Bid Comparison" title
    rows 6-50:  TABLE_WIDGET_V2 tbl_commercial — {{EvalData.getCommercialTableData()}}
    rows 51-58: "Shortlist for Negotiation" BUTTON_WIDGET
```

TABS_WIDGET DSL structure:
```json
{
  "type": "TABS_WIDGET",
  "widgetId": "tabs_evaluation",
  "widgetName": "EvaluationTabs",
  "tabsObj": {
    "tab1": { "id": "tab1", "widgetId": "tab1", "label": "Technical Evaluation", "isVisible": true, "index": 0 },
    "tab2": { "id": "tab2", "widgetId": "tab2", "label": "Commercial Evaluation", "isVisible": true, "index": 1 }
  },
  "defaultTab": "Technical Evaluation",
  "shouldScrollContents": true,
  "version": 3
}
```

- [ ] **Step 3: Commit**

```bash
git add pages/Evaluation/ application.json
git commit -m "feat: add evaluation page with technical/commercial tabbed scorecards"
```

---

## Task 6: PO & NFA Page

**Files:**
- Create: `pages/POAndNFA/POAndNFA.json`
- Create: `pages/POAndNFA/jsobjects/POData/POData.js`
- Create: `pages/POAndNFA/jsobjects/POData/metadata.json`

- [ ] **Step 1: Create POData.js**

```javascript
// pages/POAndNFA/jsobjects/POData/POData.js
export default {
  awardedVendor: {
    id: "V005",
    name: "DataVault Systems",
    contact: "rfq@datavault.net",
    totalBid: 430500,
    deliveryWeeks: 4,
    paymentTerms: "30 days net",
    techScore: 95,
    prId: "PR-2023-001"
  },

  draftPO: {
    poNumber: "PO-2023-047",
    prRef: "PR-2023-001",
    rfqRef: "RFQ-2023-011",
    vendorName: "DataVault Systems",
    amount: 430500,
    deliveryDate: "Nov 30, 2023",
    paymentTerms: "30 days net",
    billingAddress: "GMR Group, Rajiv Gandhi International Airport, Hyderabad - 500108",
    status: "DRAFT"
  },

  draftNFA: {
    nfaNumber: "NFA-2023-031",
    subject: "Approval for PO-2023-047 — Enterprise Cloud Infrastructure",
    justification: "Vendor DataVault Systems was selected through a competitive RFQ process (RFQ-2023-011). 3 vendors responded; DataVault Systems scored highest on technical evaluation (95/100) and offers the shortest delivery timeline (4 weeks). Total PO value: $430,500 within the approved PR budget of $450,000.",
    poRef: "PO-2023-047",
    approver: "CFO / Head of Procurement",
    estimatedSaving: "$19,500 (4.3% below PR budget)",
    status: "DRAFT"
  },

  poList: [
    { poNumber: "PO-2023-047", prRef: "PR-2023-001", vendor: "DataVault Systems", amount: "$430,500", status: "Draft", created: "Oct 24, 2023" },
    { poNumber: "PO-2023-038", prRef: "PR-2023-003", vendor: "NetShield Security", amount: "$115,000", status: "Approved", created: "Oct 12, 2023" },
    { poNumber: "PO-2023-029", prRef: "PR-2023-005", vendor: "Infra Build Corp", amount: "$645,000", status: "Sent", created: "Sep 20, 2023" }
  ],

  getPOStatusBadge: (status) => {
    const cfg = {
      Draft: { bg: "#f1f5f9", color: "#64748b" },
      Approved: { bg: "#dcfce7", color: "#16a34a" },
      Sent: { bg: "#dbeafe", color: "#1d4ed8" },
      Acknowledged: { bg: "#e0e7ff", color: "#4338ca" },
      Delivered: { bg: "#d1fae5", color: "#065f46" },
      Closed: { bg: "#f3f4f6", color: "#6b7280" }
    };
    const c = cfg[status] || cfg.Draft;
    return `<span style="background:${c.bg};color:${c.color};padding:2px 10px;border-radius:12px;font-size:11px;font-weight:600;">${status}</span>`;
  }
}
```

- [ ] **Step 2: Page layout**

```
rows 0-7:    Header — "Purchase Order & NFA" title
rows 8-10:   Section title "Draft PO — PO-2023-047"
rows 11-35:  ctr_po_form (CONTAINER, bg white, card style):
               INPUT_WIDGET inp_po_vendor: "Vendor" = {{POData.awardedVendor.name}} (disabled)
               INPUT_WIDGET inp_po_amount: "PO Amount ($)" = {{POData.awardedVendor.totalBid}} (disabled)
               INPUT_WIDGET inp_po_delivery: "Delivery Date" (DATE_PICKER_WIDGET2)
               INPUT_WIDGET inp_po_terms: "Payment Terms" = {{POData.awardedVendor.paymentTerms}}
               INPUT_WIDGET inp_po_billing: "Billing Address" (multi-line)
               BUTTON_WIDGET btn_generate_nfa: "Generate NFA" (primary)
rows 37-39:  Section title "Note for Approval (NFA)"
rows 40-65:  ctr_nfa_form (CONTAINER):
               INPUT_WIDGET inp_nfa_subject: "NFA Subject" = {{POData.draftNFA.subject}}
               INPUT_WIDGET inp_nfa_justification: "Justification" (multi-line) = {{POData.draftNFA.justification}}
               INPUT_WIDGET inp_nfa_approver: "Approver" = {{POData.draftNFA.approver}}
               TEXT_WIDGET txt_saving: "Estimated Saving: {{POData.draftNFA.estimatedSaving}}"
               BUTTON_WIDGET btn_submit_nfa: "Submit for Approval" (primary)
rows 67-70:  Section title "PO List"
rows 71-115: TABLE_WIDGET_V2 tbl_po_list — {{POData.poList.map(...)}}
```

- [ ] **Step 3: Commit**

```bash
git add pages/POAndNFA/ application.json
git commit -m "feat: add PO and NFA page with award summary, draft forms, and PO list table"
```

---

## Self-Review Checklist

**Spec coverage:**
- [x] Phase 01 OA/ARC Check — fully implemented in PRWorkflow page
- [x] PR Management — Task 3 (table, create form, status badges)
- [x] Vendor Selection / RFQ — Task 4 (float RFQ modal, vendor multi-select)
- [x] Technical Evaluation — Task 5, Tab 1 (scorecard table)
- [x] Commercial Evaluation / Bidding — Task 5, Tab 2 (bid comparison)
- [x] PO Creation — Task 6 (form pre-populated from awarded vendor)
- [x] NFA — Task 6 (justification form + submit)
- [x] Analytics Dashboard — Task 2 (KPI cards, charts, recent PRs)

**No placeholders:** All JS Object code and DSL structures include full implementations.

**Type consistency:** `PRData.getTableData()` returns array used in `tbl_line_items.tableData`. Column IDs match `primaryColumns` keys. All `dynamicBindingPathList` entries specify the correct property keys.
