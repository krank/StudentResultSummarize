function getRubricBlock(rubricMeta: RubricMetaData, sheet?: GoogleAppsScript.Spreadsheet.Sheet): string[][] {

  if (sheet == undefined) sheet = SpreadsheetApp.getActiveSheet();

  let rubricBlock = sheet?.getRange(
    1, rubricMeta.firstColumnNumber, // rows, column offset
    5, rubricMeta.rangeWidth // Size
  ).getValues();
  if (rubricBlock == undefined) throw new Error("rubric range undefined");

  return rubricBlock;
}

function getRubricMetadata(firstRubricColumnNumber: number, resultsSheet?: GoogleAppsScript.Spreadsheet.Sheet): RubricMetaData {

  if (resultsSheet == undefined) resultsSheet = SpreadsheetApp.getActiveSheet();

  return {
    "criteriaActiveRow": 1,
    "criteriaGradeRow": 2,
    "criteriaShortNameRow": 3,
    "criteriaNameRow": 4,
    "firstColumnNumber": firstRubricColumnNumber,
    "rangeWidth": resultsSheet.getMaxColumns() - firstRubricColumnNumber
  };
}