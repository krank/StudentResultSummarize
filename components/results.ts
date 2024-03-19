function getStudentResults(resultsSheet: GoogleAppsScript.Spreadsheet.Sheet, studentRowNumber: number, studentName: string, rubricMeta: RubricMetaData): Student {

  // Get the array for the student [COST: 2]
  let studentResults: string[] = GetStudentResultsArray(studentRowNumber, rubricMeta, resultsSheet);
  // Get the rubric block [COST: 2]
  let rubricBlock: string[][] = getRubricBlock(rubricMeta, resultsSheet);

  let rubrics: Rubric[] = [];

  // COMBINE

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
            "active": rubricBlock[rubricMeta.criteriaActiveRow][cNum] == "true",
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

  let student: Student = {
    "name": studentName,
    "index": 1,
    "rubrics": rubrics
  }

  return student;
}

function GetStudentResultsByInputs(resultsSheetName: string, firstRubricColumnNumber: number, studentName?: string, studentRowNumber?: number): Student {
  // Make sure the specified results sheet exists, get it [COST: 1]
  let resultsSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(resultsSheetName);
  if (resultsSheet == null) throw new Error("Sheet not found!");

  if (studentName == undefined && studentRowNumber == undefined) throw new Error("Need to specify either student name or row number");
  else if (studentName == undefined && studentRowNumber != undefined) studentName = findStudentNameByIndex(studentRowNumber); // COST: 2
  else if (studentName != undefined && studentRowNumber == undefined) studentRowNumber = findStudentIndexByName(studentName, resultsSheet); // COST: 2
  else throw new Error("Something has gone seriously wrong. Send help!");

  // Prepare the rubric metadata [COST: 1]
  let rubricMeta = getRubricMetadata(firstRubricColumnNumber, resultsSheet);

  // Get the student's results [COST: 4]
  let student = getStudentResults(resultsSheet, studentRowNumber + resultsSheet.getFrozenRows() + 1, studentName, rubricMeta);

  return student; // Total cost: 8(6)
  // Getting the sheet: 1
  // Finding what row the student is on OR the name OR neither: 2/0
  // Finding the limits of the rubric block's right side (width of sheet) || REMOVABLE?
  // Get the rubric block: 2
  // Get the student's row of results: 2
}

function GetStudentResultsArray(studentRowNumber: number,
  rubricMeta: RubricMetaData,
  sheet: GoogleAppsScript.Spreadsheet.Sheet): string[] {

  // Get the results
  let studentResults = sheet?.getRange(
    studentRowNumber, rubricMeta.firstColumnNumber, // row, col
    1, rubricMeta.rangeWidth // size: rows, cols
  ).getValues();

  if (studentResults == undefined) throw new Error("Failed to get student results");

  // Return first (only) row
  return studentResults[0];
}