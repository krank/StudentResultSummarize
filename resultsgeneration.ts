function GetStudentResults_(studentName: string,
  studentMeta: StudentMetaData,
  rubricMeta: RubricMetaData,
  sheet: GoogleAppsScript.Spreadsheet.Sheet): string[] {

  /* ---------------------------------------------------------------------------
      GET STUDENT NAMES FROM COLUMN
  ----------------------------------------------------------------------------*/
  let students = sheet?.getRange(
    studentMeta.rowStart, studentMeta.columnNumber,
    sheet.getMaxRows() - studentMeta.rowStart, 1)
    .getValues();
  if (students == undefined) throw new Error("No students found!");

  /* ---------------------------------------------------------------------------
      FIND ROW NUMBER OF NAMED STUDENT
  ----------------------------------------------------------------------------*/
  let studentRowNumber: number = students.findIndex((student) => student[0] == studentName);
  if (studentRowNumber < 0) throw new Error("Student not found!");

  /* ---------------------------------------------------------------------------
      GET RESULTS OF NAMED STUDENT
  ----------------------------------------------------------------------------*/
  let studentResults = sheet?.getRange(
    studentMeta.rowStart + studentRowNumber, rubricMeta.firstColumnNumber,
    1, rubricMeta.rangeWidth
  ).getValues();
  if (studentResults == undefined) throw new Error("Failed to get student results");

  /* ---------------------------------------------------------------------------
      RETURN FIRST (ONLY) ROW
  ----------------------------------------------------------------------------*/
  return studentResults[0];
}

function GetRubricsForStudent_(resultsPage: string, firstRubricColumnNumber: number, studentColumnNumber: number, studentName: string) {
  
  /* ---------------------------------------------------------------------------
      READ NAMED SHEET FROM SPREADSHEET
  ----------------------------------------------------------------------------*/
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(resultsPage);
  if (sheet == null) throw new Error("Sheet not found!");

  /* ---------------------------------------------------------------------------
      COLLECT DATA & MAGIC NUMBERS
  ----------------------------------------------------------------------------*/
  const rubricMeta: RubricMetaData = {
    "criteriaActiveRow": 1,
    "criteriaGradeRow": 2,
    "criteriaShortNameRow": 3,
    "criteriaNameRow": 4,
    "firstColumnNumber": firstRubricColumnNumber,
    "rangeWidth": sheet.getMaxColumns() - firstRubricColumnNumber
  };

  const studentMeta: StudentMetaData = {
    "rowStart": 6,
    "columnNumber": studentColumnNumber
  };

  /* ---------------------------------------------------------------------------
      GET ARRAY OF STUDENT'S RESULTS FROM SHEET
  ----------------------------------------------------------------------------*/

  let studentResults: string[] = GetStudentResults_(studentName, studentMeta, rubricMeta, sheet);

  /* ---------------------------------------------------------------------------
      GET RUBRIC BLOCK
  ----------------------------------------------------------------------------*/
  let rubricBlock = sheet?.getRange(
    1, rubricMeta.firstColumnNumber, // rows, column offset
    5, rubricMeta.rangeWidth // Size
  ).getValues();
  if (rubricBlock == undefined) throw new Error("rubric range undefined");

  /* ---------------------------------------------------------------------------
      READ RUBRIC BLOCK INTO DATA STRUCTURE
  ----------------------------------------------------------------------------*/
  let rubrics: Rubric[] = [];

  // Go through all the columns in the rubricBlock
  for (let cNum = 0; cNum < rubricBlock[0].length; cNum++) {
    const rubricNameCell: string = rubricBlock[0][cNum];

    // Check if it's a rubric
    if (rubricNameCell.length > 0) {

      // Create base object
      let rubric: Rubric = {
        "columnNumber": cNum,
        "name": rubricNameCell,
        "studentGrade": "",
        "criteria": []
      };

      // Go through all criteria under the rubric
      while (rubricBlock[rubricMeta.criteriaNameRow][cNum + 1].length > 0) {
        rubric.criteria.push(
          {
            "columnNumber": cNum,
            "name": rubricBlock[rubricMeta.criteriaNameRow][cNum],
            "active": rubricBlock[rubricMeta.criteriaActiveRow][cNum],
            "grade": rubricBlock[rubricMeta.criteriaGradeRow][cNum],
            "shortform": rubricBlock[rubricMeta.criteriaShortNameRow][cNum],
            "studentPassed": studentResults[cNum] == "✔"
          }
        );

        cNum++;
      }

      // Get the combined grade for the rubric (last non-empty cell)
      rubric.studentGrade = studentResults[cNum];

      rubrics.push(rubric);
    }
  }

  return rubrics;
}