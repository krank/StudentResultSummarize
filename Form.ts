function onOpen() {
  let ui = SpreadsheetApp.getUi();
  ui.createMenu("StudentResult")
    .addItem("Grade using form", "GradeUsingForm")
    .addToUi();
}

function include(filename: string) {
  return HtmlService.createHtmlOutputFromFile(filename)
    .getContent();
}

function GradeUsingForm() {
  let widget = HtmlService.createHtmlOutputFromFile("html/index").setHeight(2000);

  SpreadsheetApp.getUi().showModalDialog(widget, "Grading form");
}