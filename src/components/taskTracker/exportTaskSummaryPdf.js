import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ---------- Helpers ----------
function daysUntil(dueAt) {
  if (!dueAt) return null;
  const now = new Date();
  const due = new Date(dueAt);
  const ms = due.getTime() - now.getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

function formatDue(dueAt) {
  if (!dueAt) return "—";

  const d = daysUntil(dueAt);
  const due = new Date(dueAt);

  if (d < 0) return `Overdue (${Math.abs(d)}d)`;

  return due.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
}

function getLastUpdate(task) {
  if (!task.events?.length) return "No updates";

  const latest = [...task.events].sort(
    (a, b) => new Date(b.at) - new Date(a.at),
  )[0];

  if (latest.remark?.trim()) return latest.remark.trim().slice(0, 140);

  if (latest.type === "stage_change" && latest.toStage) {
    return `Moved to "${latest.toStage}"`;
  }

  return "Updated";
}

function getAge(createdAt) {
  const now = new Date();
  const created = new Date(createdAt);
  const diff = Math.ceil((now - created) / (1000 * 60 * 60 * 24));
  return `${diff}d`;
}

function normalizeStage(stage) {
  return String(stage || "").trim();
}

function sortTasksForPdf(list) {
  return [...list].sort((a, b) => {
    const da = daysUntil(a.dueAt);
    const db = daysUntil(b.dueAt);

    const aOverdue = da !== null && da < 0;
    const bOverdue = db !== null && db < 0;
    if (aOverdue && !bOverdue) return -1;
    if (!aOverdue && bOverdue) return 1;

    const aDueSoon = da !== null && da >= 0 && da <= 3;
    const bDueSoon = db !== null && db >= 0 && db <= 3;
    if (aDueSoon && !bDueSoon) return -1;
    if (!aDueSoon && bDueSoon) return 1;

    return new Date(a.createdAt) - new Date(b.createdAt);
  });
}

// ---------- Known stage order ----------
const KNOWN_STAGE_ORDER = [
  "Pending",
  "Under submission",
  "To be discussed",
  "Sent to IFD",
  "Comments awaited",
  "Approved",
  "Draft Issued",
  "In Abeyance",
  "No Action needed",
  "Completed",
];

// ---------- Main ----------
export function exportTaskSummaryPdf(tasks, userName = "User") {
  const doc = new jsPDF({ orientation: "landscape" });

  // Active only
  const activeTasks = (tasks || []).filter((t) => !t.isArchived);

  // ---------- Summary ----------
  const total = activeTasks.length;

  const overdue = activeTasks.filter((t) => {
    const d = daysUntil(t.dueAt);
    return d !== null && d < 0;
  }).length;

  const dueSoon = activeTasks.filter((t) => {
    const d = daysUntil(t.dueAt);
    return d !== null && d >= 0 && d <= 3;
  }).length;

  const commentsAwaited = activeTasks.filter(
    (t) => normalizeStage(t.currentStage) === "Comments awaited",
  ).length;

  const miscCount = activeTasks.filter((t) => {
    const stage = normalizeStage(t.currentStage);
    return !KNOWN_STAGE_ORDER.includes(stage);
  }).length;

  // ---------- Header ----------
  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);

  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 22);
  doc.text(`User: ${userName}`, 14, 27);

  doc.setFont("helvetica", "bold");
  doc.text(`Total Active: ${total}`, 14, 33);
  doc.text(`Overdue: ${overdue}`, 60, 33);
  doc.text(`Due within 3d: ${dueSoon}`, 100, 33);

  doc.text(`Comments awaited: ${commentsAwaited}`, 14, 39);
  doc.text(`Misc.: ${miscCount}`, 100, 39);

  doc.setFont("helvetica", "normal");

  let y = 46;

  // ---------- Group tasks ----------
  const knownGroups = {};
  const miscGroups = {};

  activeTasks.forEach((task) => {
    const stage = normalizeStage(task.currentStage) || "Misc.";

    if (KNOWN_STAGE_ORDER.includes(stage)) {
      if (!knownGroups[stage]) knownGroups[stage] = [];
      knownGroups[stage].push(task);
    } else {
      if (!miscGroups[stage]) miscGroups[stage] = [];
      miscGroups[stage].push(task);
    }
  });

  // ---------- Render helper ----------
  function renderStageTable(stageTitle, list, includeActualStage = false) {
    if (!list?.length) return;

    if (y > 185) {
      doc.addPage();
      y = 18;
    }

    doc.setFontSize(12);
    doc.text(stageTitle, 14, y);
    y += 4;

    const head = includeActualStage
      ? [
          [
            "S. No.",
            "Title",
            "Age",
            "Due on",
            "Last Update",
            "File No.",
            "Stage",
          ],
        ]
      : [["S. No.", "Title", "Age", "Due on", "Last Update", "File No."]];

    const body = sortTasksForPdf(list).map((t, i) => {
      const row = [
        i + 1,
        t.title || "Untitled",
        getAge(t.createdAt),
        formatDue(t.dueAt),
        getLastUpdate(t),
        t.identifiers?.fileNo || "—",
      ];

      if (includeActualStage) {
        row.push(normalizeStage(t.currentStage) || "—");
      }

      return row;
    });

    autoTable(doc, {
      startY: y,
      head,
      body,
      styles: {
        fontSize: 11,
        cellPadding: 2.2,
        valign: "top",
        overflow: "linebreak",
      },
      headStyles: {
        fillColor: [240, 240, 240],
        textColor: 20,
      },
      columnStyles: includeActualStage
        ? {
            0: { cellWidth: 12 },
            1: { cellWidth: 80 },
            2: { cellWidth: 14 },
            3: { cellWidth: 22 },
            4: { cellWidth: 80 },
            5: { cellWidth: 28 },
            6: { cellWidth: 35 },
          }
        : {
            0: { cellWidth: 12 },
            1: { cellWidth: 78 },
            2: { cellWidth: 14 },
            3: { cellWidth: 22 },
            4: { cellWidth: 100 },
            5: { cellWidth: 20 },
          },
      margin: { left: 14, right: 14 },
    });

    y = doc.lastAutoTable.finalY + 10;
  }

  // ---------- Render known stages in order ----------
  KNOWN_STAGE_ORDER.forEach((stage) => {
    renderStageTable(stage, knownGroups[stage] || []);
  });

  // ---------- Render Misc. ----------
  const miscStageNames = Object.keys(miscGroups);

  if (miscStageNames.length > 0) {
    const miscTasks = miscStageNames.flatMap((stage) => miscGroups[stage]);

    renderStageTable("Misc.", miscTasks, true);
  }

  doc.save("task-summary.pdf");
}
