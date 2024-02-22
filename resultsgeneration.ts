
function GenerateResultsDataForStudent(studentName: string, studentMeta: StudentMetaData, rubricMeta: RubricMetaData, sheet: GoogleAppsScript.Spreadsheet.Sheet) {
  
  let studentResults: string[] = GetStudentResults_(studentName, studentMeta, rubricMeta, sheet);

  // Get rubrics range
  let rubricBlock = sheet?.getRange(
    1, rubricMeta.firstColumnNumber, // rows, column offset
    5, rubricMeta.rangeWidth // Size
  ).getValues();
  if (rubricBlock == undefined) throw new Error("rubric range undefined");


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