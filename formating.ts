function FormatRubricResult_(result: Rubric) {

  let output: string[][] = [];

  /* ---------------------------------------------------------------------------
      CRITERIA
  ----------------------------------------------------------------------------*/

  // Go through all lines that should be added (1 criteria/line)
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

function FormatRubricAsMatrixLine_(result: Rubric, grades: string[]) {

  let line: string[] = [];

  /* ---------------------------------------------------------------------------
      GRADES
  ----------------------------------------------------------------------------*/
  let higherAchieved = false;

  // Go through all the grades, in reverse (right to left)
  for (let i = grades.length - 1; i >= 0; i--) {
    const grade = grades[i];

    // If this grade, or a higher one, has been achieved
    if (result.studentGrade.includes(grade) || higherAchieved) {

      // Add a question mark if the grade comes with a question mark
      if (result.studentGrade.includes("?")) line.push("?");

      else line.push("x");
      higherAchieved = true;
    }

    // If the 'grade' is just a -, add a -
    else if (i == 0 && result.studentGrade.includes("-")) line.push("-");

    // Or just push an empty string
    else line.push("");
  }

  /* ---------------------------------------------------------------------------
      RUBRIC NAME
  ----------------------------------------------------------------------------*/
  // Rubric's name
  line.push(result.name);
  line.reverse();

  return line;
}