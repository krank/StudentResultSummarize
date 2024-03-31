/// <reference path="../components/interfaces.ts" />
/// <reference path="randomword.ts" />

import { mulberry32 } from "./random";

import { GenerateRandomWord } from "./randomword";

export function GenerateStudent(num: number): Student {

  let grades = ["F", "E", "C", "A"];
  let rng = mulberry32(num);

  let rubrics: Rubric[] = [];

  for (let i: number = 0; i < 3; i++) {
    let criteria: Criteria[] = [];

    for (let j: number = 0; j < 5; j++) {
      let criterion: Criteria = {
        name: GenerateRandomWord(j, 4),
        shortform: GenerateRandomWord(j, 4).toLocaleLowerCase(),
        active: true,
        studentPassed: rng() > 0.5,
        columnNumber: j,
        grade: grades[Math.min(j+1, grades.length-1)]
      }

      criteria.push(criterion);
    }


    let rubric: Rubric = {
      name: GenerateRandomWord(50+i, 4),
      studentGrade: grades[Math.floor(rng() * grades.length)],
      columnNumber: 4,
      criteria: criteria
    }

    rubrics.push(rubric);
  }


  let fakeStudent: Student = {
    name: GenerateRandomWord(num, 4) + " " + GenerateRandomWord(num + 1, 5),
    index: num,
    nextIndex: num + 1,
    rubrics: rubrics
  }

  return fakeStudent;
}