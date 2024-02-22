import "google-apps-script"

function SUMMARIZERESULTS(resultsPage: string, firstRubricColumnNumber: number, studentName: string, studentColumnNumber: number) {

  // Get the sheet (page)
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(resultsPage);
  if (sheet == null) throw new Error("Sheet not found!");

  const rubricMeta: RubricMetaData = {
    "criteriaActiveRow": 2,
    "criteriaGradeRow": 3,
    "criteriaShortNameRow": 4,
    "criteriaNameRow": 5,
    "firstColumnNumber": firstRubricColumnNumber,
    "rangeWidth": sheet.getMaxColumns() - firstRubricColumnNumber
  };

  const studentMeta: StudentMetaData = {
    "rowStart": 6,
    "columnNumber": studentColumnNumber
  }

  // Only use the first(only) row
  let studentResults: string[] = GetStudentResults_(studentName, studentMeta, rubricMeta, sheet);


  // (1-based column counting)
  let rubricRange = sheet?.getRange(
    1, firstRubricColumnNumber, // rows, column offset
    5, rubricMeta.rangeWidth // Size
  );

  if (rubricRange == undefined) throw new Error("rubric range undefined");

  let rubrics: Rubric[] = [];

  // Go through all the columns in the rubricRange
  for (let cNum = 1; cNum < rubricRange.getWidth(); cNum++) {
    const rubricRowCell = rubricRange.getCell(1, cNum);

    // Check if it's a rubric
    let value: string = rubricRowCell.getValue();
    if (value.length > 0) {

      // Create base object
      let rubric: Rubric = {
        "columnNumber": cNum,
        "rubric": value,
        "combinedResult": "",
        "criteria": []
      }

      while (rubricRange.getCell(5, cNum + 1).getValue().length > 0) {

        rubric.criteria.push(
          {
            "columnNumber": cNum,
            "name": rubricRange.getCell(rubricMeta.criteriaNameRow, cNum).getValue(),
            "active": rubricRange.getCell(rubricMeta.criteriaActiveRow, cNum).getValue(),
            "grade": rubricRange.getCell(rubricMeta.criteriaGradeRow, cNum).getValue(),
            "shortform": rubricRange.getCell(rubricMeta.criteriaShortNameRow, cNum).getValue(),
            "studentPassed": studentResults[cNum-1] == "✔"
          }
        );

        cNum++;
      }

      // Get the combined grade for the rubric (last non-empty cell)
      rubric.combinedResult = studentResults[cNum-1];

      rubrics.push(rubric)
    }
  }


  // Logger.log(rubrics);
  // Logger.log(studentResults);

  return rubrics[1].criteria[0].studentPassed;
}

function FormatRubricResult(result: Rubric[]) {
  // Go through each rubric
  // Make rows for each criteria
  // Columns: Rubric, criteria, studentresult, rubricresult
}

function GetStudentResults_(studentName: string,
  studentMeta: StudentMetaData,
  rubricMeta: RubricMetaData,
  sheet: GoogleAppsScript.Spreadsheet.Sheet): string[] {

  // Get range of students
  let students = sheet?.getRange(
    studentMeta.rowStart, studentMeta.columnNumber,
    sheet.getMaxRows() - studentMeta.rowStart, 1)
    .getValues();
  if (students == undefined) throw new Error("No students found!");

  // Find row of student
  let studentRowNumber: number = students.findIndex((student) => student[0] == studentName);
  if (studentRowNumber < 0) throw new Error("Student not found!");

  // Get results for the student
  let studentTmpResults = sheet?.getRange(
    studentMeta.rowStart + studentRowNumber, rubricMeta.firstColumnNumber,
    1, rubricMeta.rangeWidth
  ).getValues();
  if (studentTmpResults == undefined) throw new Error("Failed to get student results");

  // Only use the first(only) row
  return studentTmpResults[0];
}