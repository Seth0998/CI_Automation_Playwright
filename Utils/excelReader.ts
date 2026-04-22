import * as XLSX from 'xlsx';
import * as path from 'path';

export function readExcel(fileName: string, sheetName: string) {

  const filePath = path.join(
    "C:/Users/Sidharath/source/repos/CI Automation/test_data",
    fileName
  );

  const workbook = XLSX.readFile(filePath);

  const sheet = workbook.Sheets[sheetName];

  if (!sheet) {
    throw new Error(`Sheet "${sheetName}" not found in Excel file`);
  }

  return XLSX.utils.sheet_to_json(sheet);
}