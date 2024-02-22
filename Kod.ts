import "google-apps-script"

function SUMMARIZERESULTS(resultsPage: string, firstRubricColumnNumber: number, studentName: string, studentColumnNumber: number) {

  // Get the sheet (page)
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(resultsPage);
  if (sheet == null) throw new Error("Sheet not found!");

  // Collect data & magic numbers
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
  }

  // Get student's results
  let rubrics: Rubric[] = GenerateResultsDataForStudent(
    studentName,
    studentMeta, rubricMeta,
    sheet);

  Logger.log(rubrics);
  // Logger.log(studentResults);

  let output: string[][] = [];

  rubrics.forEach(rubric => {
    output.push(...FormatRubricResult(rubric));
    output.push([]);
  });

  return output;
}

function FormatRubricResult(result: Rubric) {

  let output: string[][] = [];

  // Go through all lines that should be added
  for (let i = 0; i < result.criteria.length; i++) {
    const criteria = result.criteria[i];

    let line: string[] = [];
    
    // If we're the first, add the rubric name. Otherwise add empty string.
    line.push(i == 0 ? result.name : "");

    // Add the criteria info
    line.push(criteria.name);
    line.push(criteria.grade);
    line.push(criteria.studentPassed ? "✔" : "✘");

    // If we're the first, also add the rubric grade
    line.push(i == 0 ? result.studentGrade : "");

    output.push(line);
  }

  return output;
}
