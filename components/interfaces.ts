interface Student {
  name: string;
  index: number;
  nextIndex: number;
  rubrics: Rubric[];
}

interface Rubric {
  name: string;
  studentGrade: string;
  criteria: Criteria[];
  columnNumber: number;
}

interface Criteria {
  name: string;
  shortform: string;
  active: boolean;
  grade: string;
  studentPassed: boolean;
  columnNumber: number;
}

interface RubricMetaData {
  criteriaActiveRow: number,
  criteriaGradeRow: number,
  criteriaShortNameRow: number,
  criteriaNameRow: number,
  firstColumnNumber: number
  rangeWidth: number
}