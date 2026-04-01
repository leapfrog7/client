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

  if (latest.remark) return latest.remark.slice(0, 120);

  if (latest.type === "stage_change") {
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

// ---------- Stage order ----------
const STAGE_ORDER = [
  "Pending",
  "Under submission",
  "To be discussed",
  "Sent to IFD",
  "Comments awaited",
  "Approved",
  "Draft Issued",
  "In Abeyance",
];

// ---------- Main function ----------
export function exportTaskSummaryPdf(tasks, userName = "User") {
  const doc = new jsPDF();

  const activeTasks = tasks.filter((t) => !t.isArchived);

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
    (t) => t.currentStage === "Comments awaited",
  ).length;

  // ---------- Header ----------
  doc.setFontSize(16);
  doc.text("Task Summary", 14, 15);

  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 22);
  doc.text(`User: ${userName}`, 14, 27);

  doc.text(
    `Total: ${total} | Overdue: ${overdue} | Due ≤3d: ${dueSoon} | Comments awaited: ${commentsAwaited}`,
    14,
    32,
  );

  let y = 38;

  // ---------- Group by stage ----------
  const grouped = {};

  activeTasks.forEach((t) => {
    const stage = t.currentStage || "Other";
    if (!grouped[stage]) grouped[stage] = [];
    grouped[stage].push(t);
  });

  // ---------- Render each stage ----------
  STAGE_ORDER.forEach((stage) => {
    const list = grouped[stage];
    if (!list || list.length === 0) return;

    // Sort: overdue → due soon → age desc
    list.sort((a, b) => {
      const da = daysUntil(a.dueAt);
      const db = daysUntil(b.dueAt);

      if (da < 0 && db >= 0) return -1;
      if (db < 0 && da >= 0) return 1;

      if (da <= 3 && db > 3) return -1;
      if (db <= 3 && da > 3) return 1;

      return new Date(a.createdAt) - new Date(b.createdAt);
    });

    // Stage title
    doc.setFontSize(12);
    doc.text(stage, 14, y);

    y += 4;

    // Table
    autoTable(doc, {
      startY: y,
      head: [["S. No.", "Title", "Age", "Due on", "Last Update", "File No."]],
      body: list.map((t, i) => [
        i + 1,
        t.title || "Untitled",
        getAge(t.createdAt),
        formatDue(t.dueAt),
        getLastUpdate(t),
        t.identifiers?.fileNo || "—",
      ]),
      styles: {
        fontSize: 8,
        cellPadding: 2,
        valign: "top",
      },
      headStyles: {
        fillColor: [240, 240, 240],
        textColor: 20,
      },
      columnStyles: {
        0: { cellWidth: 12 },
        1: { cellWidth: 50 },
        2: { cellWidth: 12 },
        3: { cellWidth: 22 },
        4: { cellWidth: 60 },
        5: { cellWidth: 25 },
      },
      didDrawPage: () => {},
    });

    y = doc.lastAutoTable.finalY + 10;
  });

  // ---------- Save ----------
  doc.save("task-summary.pdf");
}
