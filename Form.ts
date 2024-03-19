function onOpen() {
  let ui = SpreadsheetApp.getUi();
  ui.createMenu("StudentResult")
    .addItem("Grade using form", "GradeUsingForm")
    .addToUi();
}

function GradeUsingForm() {
  let widget = HtmlService.createHtmlOutputFromFile("form.html");

  SpreadsheetApp.getUi().showModalDialog(widget, "Grading form");
}

function GetStudentResultsJson(index: number) {
  let student: Student = GetStudentResultsByInputs("Bedömning", 12, undefined, index);

  return JSON.stringify(student);
}