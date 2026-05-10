import ExcelJS from "exceljs";

const getSafeFileName = (fileName = "excel-output") => {
  return String(fileName)
    .replace(/\.[^/.]+$/, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase();
};

const getSafeSheetName = (sheetName = "Processed Sheet") => {
  const cleaned = String(sheetName)
    .replace(/[\\/*[\]:?]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return (cleaned || "Processed Sheet").slice(0, 31);
};

const buildOutputFileName = ({ originalFileName, actionType }) => {
  const baseName = getSafeFileName(originalFileName);

  const suffixMap = {
    "clean-data": "cleaned",
    "remove-blanks": "blank-rows-columns-removed",
    "merge-sheets": "merged-sheets",
  };

  const suffix = suffixMap[actionType] || "processed";

  return `${baseName}-${suffix}.xlsx`;
};

const applyHeaderStyle = (worksheet) => {
  const headerRow = worksheet.getRow(1);

  headerRow.font = {
    bold: true,
  };

  headerRow.alignment = {
    vertical: "middle",
    horizontal: "center",
    wrapText: true,
  };

  headerRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFEFF6FF" },
    };

    cell.border = {
      top: { style: "thin", color: { argb: "FFD7E3F4" } },
      left: { style: "thin", color: { argb: "FFD7E3F4" } },
      bottom: { style: "thin", color: { argb: "FFD7E3F4" } },
      right: { style: "thin", color: { argb: "FFD7E3F4" } },
    };
  });
};

const autoFitColumns = (worksheet, headers = [], rows = []) => {
  headers.forEach((header, index) => {
    const columnValues = rows.map((row) => row[index]);

    const maxLength = [header, ...columnValues].reduce((max, value) => {
      if (value instanceof Date) {
        return Math.max(max, 12);
      }

      const text = value === null || value === undefined ? "" : String(value);
      return Math.max(max, text.length);
    }, 10);

    worksheet.getColumn(index + 1).width = Math.min(
      Math.max(maxLength + 2, 12),
      45,
    );
  });
};

const applyBasicCellFormatting = (worksheet) => {
  worksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell) => {
      cell.alignment = {
        vertical: "top",
        wrapText: true,
      };

      if (rowNumber > 1 && cell.value instanceof Date) {
        cell.numFmt = "dd/mm/yyyy";
      }
    });
  });
};

const downloadBlob = (blob, fileName) => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();

  anchor.remove();
  URL.revokeObjectURL(url);
};

export const downloadResultWorkbook = async ({
  result,
  originalFileName,
  sheetName = "Processed Sheet",
}) => {
  if (!result?.headers?.length) {
    throw new Error("No result is available for download.");
  }

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Undersigned Excel Utility";
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet(getSafeSheetName(sheetName));

  worksheet.addRow(result.headers);

  (result.rows || []).forEach((row) => {
    worksheet.addRow(row);
  });

  applyHeaderStyle(worksheet);
  applyBasicCellFormatting(worksheet);
  autoFitColumns(worksheet, result.headers, result.rows || []);

  worksheet.views = [{ state: "frozen", ySplit: 1 }];

  const buffer = await workbook.xlsx.writeBuffer();

  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const fileName = buildOutputFileName({
    originalFileName,
    actionType: result.type,
  });

  downloadBlob(blob, fileName);
};
