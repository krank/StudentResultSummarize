import "google-apps-script"

/**
 * Generates a results overview for a given student
 * 
 * @param {string} resultsSheetName The name of the sheet containing all results
 * @param firstRubricColumnNumber Which column the rubrics start
 * @param studentName The name of the student
 * @returns A results overview; 5 columns wide
 * @customfunction
 */
function SUMMARIZERESULTS(resultsSheetName: string, firstRubricColumnNumber: number, studentName: string) {
  let student = getStudentResultsByInputs(resultsSheetName, firstRubricColumnNumber, studentName);

  let output: string[][] = [];

  student.rubrics.forEach(rubric => {
    output.push(...FormatRubricResult(rubric));
    output.push([]);
  });

  return output;
}

/**
 * Generates an overview matrix of the student's results
 * 
 * @param {string} resultsSheetName The name of the sheet containing all results
 * @param firstRubricColumnNumber Which column the rubrics start
 * @param studentName The name of the student
 * @param grades An array of strings describing the possible grades (eg {"E"; "C"; "A"})
 * @returns A matrix; 1 + (number of possible grades) wide
 * @customfunction
 */
function SHOWRESULTSASMATRIX(resultsSheetName: string, firstRubricColumnNumber: number, studentName: string, grades: string[]) {

  let student = getStudentResultsByInputs(resultsSheetName, firstRubricColumnNumber, studentName);
  
  let output: string[][] = [];
  /* ---------------------------------------------------------------------------
      CREATE HEADER ROW
  ----------------------------------------------------------------------------*/

  let headerLine: string[] = [];
  headerLine.push("");

  // Add all the grades to the header line
  grades.forEach(g => headerLine.push(String(g)));

  output.push(headerLine);

  /* ---------------------------------------------------------------------------
    GET THE STUDENT'S RESULTS AS RUBRIC ARRAY
  ----------------------------------------------------------------------------*/

  // Add all the rubrics, as lines, to the output
  student.rubrics.forEach(rubric => output.push(FormatRubricAsMatrixLine(rubric, grades)));

  return output
}