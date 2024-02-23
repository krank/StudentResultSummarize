import "google-apps-script"

/**
 * Generates a results overview for a given student
 * 
 * @param {string} resultsSheetName The name of the sheet containing all results
 * @param firstRubricColumnNumber Which column the rubrics start
 * @param studentName The name of the student
 * @param studentColumnNumber The column where student names are found
 * @returns A results overview; 5 columns wide
 * @customfunction
 */
function SUMMARIZERESULTS(resultsSheetName: string, firstRubricColumnNumber: number, studentName: string, studentColumnNumber: number) {

  // Get the sheet (page)
  let rubrics: Rubric[] = GetRubricsForStudent_(resultsSheetName, firstRubricColumnNumber, studentColumnNumber, studentName);

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

function SHOWRESULTSASMATRIX(resultsPage: string, firstRubricColumnNumber: number, studentName: string, studentColumnNumber: number, grades: string[]) {
  let rubrics: Rubric[] = GetRubricsForStudent_(resultsPage, firstRubricColumnNumber, studentColumnNumber, studentName);


}