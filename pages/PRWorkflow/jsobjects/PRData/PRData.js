export default {
  currentPR: {
    id: "PR-2023-001",
    title: "Enterprise Cloud Infrastructure Upgrade",
    requestor: "Sarah Miller",
    requestorRole: "IT Infrastructure Lead",
    department: "IT Services",
    estimatedBudget: "$450,000",
    createdDate: "Oct 12, 2023",
    targetDelivery: "Oct 30, 2023",
    currentStage: 1,
    totalStages: 7,
    lineItemsCount: 4,
    lastUpdated: "Oct 24, 2023"
  },

  stages: [
    { num: "01", label: "OA/ARC Check", status: "active" },
    { num: "02", label: "Consistency Check", status: "pending" },
    { num: "03", label: "Vendor Recomme...", status: "pending" },
    { num: "04", label: "RFP Generation", status: "pending" },
    { num: "05", label: "Technical Evaluat...", status: "pending" },
    { num: "06", label: "Commercial", status: "pending" },
    { num: "07", label: "ENFA", status: "pending" }
  ],

  oarcStats: {
    evaluated: {
      value: "4 / 4",
      label: "EVALUATED LINE ITEMS",
      detail: "Sequential contract routing check complete.",
      valueColor: "#1a1a2e"
    },
    outlineAgreements: {
      value: "2 Found",
      label: "OUTLINE AGREEMENTS (OA)",
      detail: "1 went to PO on Day 1; 1 unconverted",
      valueColor: "#e67e22"
    },
    arcMatches: {
      value: "1 Matched",
      label: "ANNUAL RATE CONTRACTS (ARC)",
      detail: "Whole PR routed to Buyer Bucket",
      valueColor: "#27ae60"
    },
    regularSourcing: {
      value: "0 Items",
      label: "REGULAR SOURCING PROCESS",
      detail: "Bypassed classification due to ARC rule",
      valueColor: "#e74c3c"
    }
  },

  lineItems: [
    {
      lineId: "LIT-001-01",
      description: "Compute Optimised VM Clusters",
      prRef: "PR-2023-001 • Quantity 2",
      estCost: "$259,000",
      oaCode: "OA-88392",
      oaRate: "Cost: $118,750 / unit",
      oaStatus: "PO_CREATION_FAILED",
      oaLabel: "PO Creation Failed",
      arcCode: "",
      arcStatus: "NOT_CHECKED",
      arcLabel: "Not checked (OA found first)",
      eligibilityStatus: "PO_CREATION_FAILED",
      statusNote: "Draft unconverted. To be taken care of manually by buyer."
    },
    {
      lineId: "LIT-001-02",
      description: "High Elastic Block Storage",
      prRef: "PR-2023-001 • Quantity 1",
      estCost: "$85,000",
      oaCode: "OA-88392",
      oaRate: "Cost: $80,750 / unit",
      oaStatus: "CONVERTED",
      oaLabel: "Day 1 Auto-PO Success",
      arcCode: "",
      arcStatus: "NOT_CHECKED",
      arcLabel: "Not checked (OA found first)",
      eligibilityStatus: "CONVERTED",
      statusNote: "Automatic Purchase Order issued successfully."
    },
    {
      lineId: "LIT-001-03",
      description: "Dynamic DDoS Shield & WAF",
      prRef: "PR-2023-001 • Quantity 1",
      estCost: "$65,000",
      oaCode: "",
      oaRate: "",
      oaStatus: "NO_OA",
      oaLabel: "No matched OA agreement",
      arcCode: "ARC-4402",
      arcRate: "Cost: $65,000 / unit",
      arcStatus: "ARC_MATCH",
      arcLabel: "Rate contract active",
      eligibilityStatus: "ARC_MATCH",
      statusNote: "Whole PR routed to Buyer Bucket"
    },
    {
      lineId: "LIT-001-04",
      description: "Cloud Security Posture Mgmt",
      prRef: "PR-2023-001 • Quantity 1",
      estCost: "$41,000",
      oaCode: "",
      oaRate: "",
      oaStatus: "NO_OA",
      oaLabel: "No matched OA agreement",
      arcCode: "",
      arcRate: "",
      arcStatus: "NO_ARC",
      arcLabel: "No active contract matched",
      eligibilityStatus: "NO_CONTRACT",
      statusNote: "Will proceed to regular sourcing"
    }
  ],

  getStageHtml: () => {
    const stages = PRData.stages;
    const cells = stages.map((s, i) => {
      const isActive = s.status === "active";
      const numBg = isActive ? "#1a56db" : "#e2e8f0";
      const numColor = isActive ? "#fff" : "#64748b";
      const labelColor = isActive ? "#1a56db" : "#64748b";
      const fontWeight = isActive ? "700" : "400";
      const divider = i < stages.length - 1
        ? `<div style="position:absolute;top:14px;left:100%;width:calc(100% - 28px);height:2px;background:#e2e8f0;z-index:0;"></div>`
        : "";
      return `<div style="display:flex;flex-direction:column;align-items:center;flex:1;position:relative;">
        ${divider}
        <div style="width:28px;height:28px;border-radius:50%;background:${numBg};color:${numColor};font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;z-index:1;">${s.num}</div>
        <span style="font-size:11px;color:${labelColor};font-weight:${fontWeight};margin-top:4px;text-align:center;">${s.label}</span>
      </div>`;
    });
    return `<div style="display:flex;align-items:flex-start;padding:8px 16px;">${cells.join("")}</div>`;
  },

  getOAStatusHtml: (oaCode, oaRate, oaStatus, oaLabel) => {
    if (!oaCode) {
      return `<span style="color:#94a3b8;font-size:12px;font-style:italic;">${oaLabel}</span>`;
    }
    const badge = oaStatus === "CONVERTED"
      ? `<span style="background:#dcfce7;color:#16a34a;padding:2px 7px;border-radius:12px;font-size:11px;font-weight:600;">● ${oaLabel}</span>`
      : `<span style="background:#fee2e2;color:#dc2626;padding:2px 7px;border-radius:12px;font-size:11px;font-weight:600;">● ${oaLabel}</span>`;
    return `<div style="font-size:12px;">
      <span style="color:#1a56db;font-weight:600;">● ${oaCode}</span><br>
      <span style="color:#64748b;">${oaRate}</span><br>
      ${badge}
    </div>`;
  },

  getARCStatusHtml: (arcCode, arcRate, arcStatus, arcLabel) => {
    if (!arcCode) {
      return `<span style="color:#94a3b8;font-size:12px;font-style:italic;">${arcLabel}</span>`;
    }
    return `<div style="font-size:12px;">
      <span style="color:#1a56db;font-weight:600;">● ${arcCode}</span><br>
      <span style="color:#64748b;">${arcRate}</span><br>
      <span style="color:#16a34a;font-size:11px;">Rate contract active</span>
    </div>`;
  },

  getEligibilityBadgeHtml: (status, note) => {
    const badges = {
      PO_CREATION_FAILED: `<div><span style="background:#fee2e2;border:1px solid #fca5a5;color:#dc2626;padding:3px 10px;border-radius:4px;font-size:11px;font-weight:700;">▲ PO CREATION FAILED</span><br><span style="font-size:11px;color:#64748b;margin-top:4px;display:block;">${note}</span></div>`,
      CONVERTED: `<div><span style="background:#dcfce7;border:1px solid #86efac;color:#16a34a;padding:3px 10px;border-radius:4px;font-size:11px;font-weight:700;">✓ CONVERTED ON DAY 1</span><br><span style="font-size:11px;color:#64748b;margin-top:4px;display:block;">${note}</span></div>`,
      ARC_MATCH: `<div><span style="background:#dbeafe;border:1px solid #93c5fd;color:#1d4ed8;padding:3px 10px;border-radius:4px;font-size:11px;font-weight:700;">ANNUAL RATE CONTRACT (ARC) MATCH</span><br><span style="font-size:11px;color:#64748b;margin-top:4px;display:block;">${note}</span></div>`,
      NO_CONTRACT: `<div><span style="background:#f1f5f9;border:1px solid #cbd5e1;color:#475569;padding:3px 10px;border-radius:4px;font-size:11px;font-weight:700;">NO ACTIVE CONTRACT MATCHED</span><br><span style="font-size:11px;color:#64748b;margin-top:4px;display:block;">${note}</span></div>`
    };
    return badges[status] || badges["NO_CONTRACT"];
  },

  getTableData: () => {
    return PRData.lineItems.map(item => ({
      "LINE ID": item.lineId,
      lineDescription: item.description,
      prRef: item.prRef,
      "EST. COST": item.estCost,
      oaHtml: PRData.getOAStatusHtml(item.oaCode, item.oaRate, item.oaStatus, item.oaLabel),
      arcHtml: PRData.getARCStatusHtml(item.arcCode, item.arcRate || "", item.arcStatus, item.arcLabel),
      eligibilityHtml: PRData.getEligibilityBadgeHtml(item.eligibilityStatus, item.statusNote)
    }));
  }
}
