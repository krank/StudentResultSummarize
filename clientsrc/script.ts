/// <reference path="../components/interfaces.ts" />

var studentData: Student;
var nextButton: HTMLButtonElement;
var prevButton: HTMLButtonElement;
var saveButton: HTMLButtonElement;
var undoButton: HTMLButtonElement;

var studentNameSpan: HTMLElement;
var mainBlock: HTMLElement;


var getStudent = (index: number) => {
  google.script.run.withSuccessHandler(OnSuccess)
    .getStudentResultsJson(index);
}

if (module.hot) {
  getStudent = (index: number) => {
    alert(index);
  }
}

document.addEventListener("DOMContentLoaded", function () {

  nextButton = GetElement(document, "button#next");
  prevButton = GetElement(document, "button#prev");
  saveButton = GetElement(document, "button#save");
  undoButton = GetElement(document, "button#undo");

  studentNameSpan = GetElement(document, "#studentname");
  mainBlock = GetElement(document, "main");



  // NEXT BUTTON
  nextButton.addEventListener("click", (event: Event) => {
    getStudent(studentData.nextIndex);

    event.preventDefault();
  });

  // PREV BUTTON
  prevButton.addEventListener("click", (event) => {
    getStudent(studentData.nextIndex - 1);

    event.preventDefault();
  });


  getStudent(0);
});


function GetElement<Type extends Element>(parent: HTMLElement | Document, query: string): Type {
  let element = parent.querySelector<Type>(query);
  if (element == null) throw new Error("Element not found!");

  return element;
}

function OnSuccess(studentDataString: string) {
  studentData = JSON.parse(studentDataString)
  populateFormWithStudentData(studentData);

  // console.log(studentData);

}

function populateFormWithStudentData(studentData: Student) {
  // TODO: If structure is already in place, only replace data

  studentNameSpan.textContent = studentData.name;

  const rubricBlockTemplate = GetElement<HTMLTemplateElement>(document, "#rubric_block");
  const criterionBlockTemplate = GetElement<HTMLTemplateElement>(document, "#criterium_block");

  mainBlock.innerHTML = "";

  studentData.rubrics.forEach(rubric => {
    let rubricBlock = rubricBlockTemplate.content.cloneNode(true) as HTMLElement;

    GetElement<HTMLHeadingElement>(rubricBlock, "h2").textContent = rubric.name;

    rubric.criteria.forEach(criterium => {
      let criterionBlock = criterionBlockTemplate.content.cloneNode(true) as HTMLElement;

      GetElement(criterionBlock, ".name").textContent = criterium.name;
      GetElement(criterionBlock, ".grade").textContent = criterium.grade;
      GetElement<HTMLInputElement>(criterionBlock, ".check input[type='checkbox']").checked = criterium.studentPassed;
      GetElement<HTMLInputElement>(criterionBlock, ".check input[type='checkbox']").setAttribute("name", criterium.shortform);

      GetElement(rubricBlock, "table").append(criterionBlock);
    });

    mainBlock.append(rubricBlock);
  });

  prevButton.disabled = studentData.index <= 0;
}

function SetLoadingState() {
  mainBlock.textContent = "…";
  studentNameSpan.textContent = "Loading…";
  nextButton.disabled = true;
  prevButton.disabled = true;
  saveButton.disabled = true;
  undoButton.disabled = true;
}
