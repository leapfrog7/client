const MINUTES_IN_DAY = 24 * 60;

const isBlankValue = (value) => {
  if (value === null || value === undefined) return true;
  return String(value).trim() === "";
};

const normaliseText = (value) => {
  return String(value ?? "")
    .replace(/\u00A0/g, " ")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .trim();
};

const pad2 = (value) => String(value).padStart(2, "0");

const normaliseMinutes = (minutes) => {
  const safeMinutes = Number(minutes);

  if (!Number.isFinite(safeMinutes)) return null;

  const rounded = Math.round(safeMinutes);
  return ((rounded % MINUTES_IN_DAY) + MINUTES_IN_DAY) % MINUTES_IN_DAY;
};

const getFractionalPart = (value) => {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;

  const fraction = value - Math.floor(value);

  if (fraction <= 0 || fraction >= 1) return null;

  return fraction;
};

const parseTimeText = (textValue) => {
  const text = normaliseText(textValue).toLowerCase();

  if (!text) return null;

  // Finds time even inside date-time strings like "01/05/2026 09:30 AM"
  const match = text.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(am|pm)?/i);

  if (!match) return null;

  let hour = Number(match[1]);
  const minute = Number(match[2]);
  const second = match[3] ? Number(match[3]) : 0;
  const meridiem = match[4];

  if (minute > 59 || second > 59) return null;

  if (meridiem) {
    if (hour < 1 || hour > 12) return null;

    if (meridiem === "pm" && hour !== 12) {
      hour += 12;
    }

    if (meridiem === "am" && hour === 12) {
      hour = 0;
    }
  } else if (hour > 23) {
    return null;
  }

  return normaliseMinutes(hour * 60 + minute + second / 60);
};

const parseDateObjectTime = (value) => {
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) return null;

  /*
    Important:
    Excel has no timezone, but JS Date has timezone behaviour.
    For Excel-read Date objects, using local getHours() can shift time.
    Example: 09:30 AM Excel time may become 03:30 PM in India.
    So we use UTC time parts to preserve the Excel clock time.
  */
  const hour = value.getUTCHours();
  const minute = value.getUTCMinutes();
  const second = value.getUTCSeconds();

  if (hour === 0 && minute === 0 && second === 0) {
    return null;
  }

  return normaliseMinutes(hour * 60 + minute + second / 60);
};

const parseExcelTimeNumber = (value) => {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;

  /*
    Time-only cells:
    0.5 = 12:00 PM

    Date-time serials:
    45200.5 = some date + 12:00 PM

    In Time Analysis, if user selects such a column, we extract the time part.
  */
  if (value >= 0 && value < 1) {
    return normaliseMinutes(value * MINUTES_IN_DAY);
  }

  const fraction = getFractionalPart(value);

  if (fraction === null) return null;

  return normaliseMinutes(fraction * MINUTES_IN_DAY);
};

export const parseTimeValue = (value) => {
  if (value instanceof Date) {
    return parseDateObjectTime(value);
  }

  if (typeof value === "number") {
    return parseExcelTimeNumber(value);
  }

  if (isBlankValue(value)) return null;

  return parseTimeText(value);
};

export const formatTimeForDisplay = (minutes, format = "hh:mm-a") => {
  const safeMinutes = normaliseMinutes(minutes);

  if (safeMinutes === null) return "—";

  const hour24 = Math.floor(safeMinutes / 60);
  const minute = safeMinutes % 60;

  if (format === "hh:mm-24") {
    return `${pad2(hour24)}:${pad2(minute)}`;
  }

  if (format === "hh:mm:ss-24") {
    return `${pad2(hour24)}:${pad2(minute)}:00`;
  }

  const meridiem = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 || 12;

  if (format === "hh:mm:ss-a") {
    return `${pad2(hour12)}:${pad2(minute)}:00 ${meridiem}`;
  }

  return `${pad2(hour12)}:${pad2(minute)} ${meridiem}`;
};

const getHourLabel = (hour) => {
  const start = formatTimeForDisplay(hour * 60, "hh:mm-24");
  const end = formatTimeForDisplay(((hour + 1) % 24) * 60, "hh:mm-24");

  return `${start}-${end}`;
};

export const buildTimeAnalysis = ({ sheet, columnIndex }) => {
  if (!sheet || columnIndex === null || columnIndex === undefined) {
    return null;
  }

  const headers = sheet.headers || [];
  const rows = sheet.rows || [];
  const columnName = headers[columnIndex] || `Column ${columnIndex + 1}`;

  const parsedItems = rows.map((row, index) => {
    const rawValue = row[columnIndex];
    const parsedMinutes = parseTimeValue(rawValue);

    return {
      rowNumber: index + 1,
      rawValue,
      parsedMinutes,
    };
  });

  const validItems = parsedItems.filter((item) => item.parsedMinutes !== null);

  const validMinutes = validItems
    .map((item) => item.parsedMinutes)
    .sort((a, b) => a - b);

  const blankCount = parsedItems.filter((item) =>
    isBlankValue(item.rawValue),
  ).length;

  const invalidCount = rows.length - blankCount - validItems.length;

  const hourMap = new Map();
  const periodMap = new Map([
    ["AM", 0],
    ["PM", 0],
  ]);

  validItems.forEach((item) => {
    const hour = Math.floor(item.parsedMinutes / 60);
    const hourKey = String(hour).padStart(2, "0");
    const periodKey = hour < 12 ? "AM" : "PM";

    hourMap.set(hourKey, (hourMap.get(hourKey) || 0) + 1);
    periodMap.set(periodKey, (periodMap.get(periodKey) || 0) + 1);
  });

  const hourWise = Array.from(hourMap.entries())
    .map(([hourKey, count]) => ({
      hourKey,
      label: getHourLabel(Number(hourKey)),
      count,
    }))
    .sort((a, b) => a.hourKey.localeCompare(b.hourKey));

  const periodWise = Array.from(periodMap.entries()).map(([period, count]) => ({
    period,
    count,
  }));

  return {
    type: "time-analysis",
    columnIndex,
    columnName,
    totalRows: rows.length,
    validTimeCount: validItems.length,
    blankCount,
    invalidCount,
    earliestTime: validMinutes[0] ?? null,
    latestTime: validMinutes[validMinutes.length - 1] ?? null,
    hourWise,
    periodWise,
  };
};
