function getStudentNames(sheet?: GoogleAppsScript.Spreadsheet.Sheet): string[] {

  if (sheet == undefined) sheet = SpreadsheetApp.getActiveSheet();

  // Get named ranges
  let namedRanges = sheet.getNamedRanges();

  // Find "StudentNames" named range
  let studentNameRange = namedRanges.find(s => s.getName() == "StudentNames")
    ?.getRange().getValues();

  if (studentNameRange == undefined) throw new Error("Named range 'StudentNames not found'");

  // Map twodimensional range to onedimensional array – should only be one col anyway
  let studentNames: string[] = studentNameRange.map((x) => x[0]);

  return studentNames;
}

function findStudentNameByIndex(index: number, sheet?: GoogleAppsScript.Spreadsheet.Sheet): string {

  if (sheet == undefined) sheet = SpreadsheetApp.getActiveSheet();

  let studentNames = getStudentNames(sheet);
  let studentName = studentNames[index];

  return studentName;
}

function findStudentIndexByName(studentName: string, sheet?: GoogleAppsScript.Spreadsheet.Sheet): number {

  if (sheet == undefined) sheet = SpreadsheetApp.getActiveSheet();

  let studentNames = getStudentNames(sheet);

  let index = studentNames.findIndex(n => n == studentName);

  if (index < 0) throw new Error("Student not found!");

  return index;
}