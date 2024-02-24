import "google-apps-script"

/**
 * Generates a results overview for a given student
 * 
 * @param {string} resultsPage The name of the sheet containing all results
 * @param firstRubricColumnNumber Which column the rubrics start
 * @param studentName The name of the student
 * @param studentColumnNumber The column where student names are found
 * @returns A results overview; 5 columns wide
 * @customfunction
 */
function SUMMARIZERESULTS(resultsPage: string, firstRubricColumnNumber: number, studentName: string, studentColumnNumber: number) {

  /* ---------------------------------------------------------------------------
      GET THE STUDENT'S RESULTS AS RUBRIC ARRAY
  ----------------------------------------------------------------------------*/
  let rubrics: Rubric[] = GetRubricsForStudent_(resultsPage, firstRubricColumnNumber, studentColumnNumber, studentName);

  /* ---------------------------------------------------------------------------
      CREATE STUDENT RESULTS ROWS
  ----------------------------------------------------------------------------*/

  let output: string[][] = [];

  rubrics.forEach(rubric => {
    output.push(...FormatRubricResult_(rubric));
    output.push([]);
  });

  return output;
}

/**
 * Generates an overview matrix of the student's results
 * 
 * @param {string} resultsPage The name of the sheet containing all results
 * @param firstRubricColumnNumber Which column the rubrics start
 * @param studentName The name of the student
 * @param studentColumnNumber The column where student names are found
 * @param grades An array of strings describing the possible grades (eg {"E"; "C"; "A"})
 * @returns A matrix; 1 + (number of possible grades) wide
 * @customfunction
 */
function SHOWRESULTSASMATRIX(resultsPage: string, firstRubricColumnNumber: number, studentName: string, studentColumnNumber: number, grades: string[]) {

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
      CREATE STUDENT RESULTS ROWS
  ----------------------------------------------------------------------------*/

  let rubrics: Rubric[] = GetRubricsForStudent_(resultsPage, firstRubricColumnNumber, studentColumnNumber, studentName);

  // Add all the rubrics, as lines, to the output
  rubrics.forEach(rubric => output.push(FormatRubricAsMatrixLine_(rubric, grades)));

  Logger.log(output);

  return output
}