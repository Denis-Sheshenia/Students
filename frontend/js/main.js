import Student from "./student.js"
import validation from "./valid.js"

// получить список студентов
async function allStudents() {
  const response = await fetch('http://localhost:3000/api/students')
  const serverStudentList = await response.json()
  // console.log(serverStudentList)
  return serverStudentList
}

async function createStudents(obj) {
  // создание нового студента на сервере
  const response = await fetch('http://localhost:3000/api/students', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(obj),
  })

  const data = await response.json()
  console.log(data);
  return data
}

async function getStudents() {
  const response = await fetch('http://localhost:3000/api/students', {
    method: 'GET',
    headers: {'Content-Type': 'application/json'},
  })

  const data = await response.json()
  console.log(data);
  return data
}

let serverData = await getStudents()

let students = []

if(serverData!==null) {
  students = serverData
}


// // вызываем функцию конструктора, создаем массив студентов
// const students = [
//   new Student('Иван', 'Иванов', 'Иванович', new Date(1990, 1, 11), 2019, 'физкультурный'),
//   new Student('Семен', 'Смирнов', 'Сергеевич', new Date(1998, 2, 20), 2020, 'экономический'),
//   new Student('Стас', 'Сидоров', 'Спиридонович', new Date(1991, 3, 13), 2021, 'архитектурный'),
//   new Student('Алиса', 'Селезнева', 'Игоревна', new Date(1991, 3, 13), 2021, 'театральный'),
//   new Student('Гадя', 'Хренова', 'Петрович', new Date(1991, 3, 13), 2021, 'астрономический')
// ]

// создадим таблицу
const $studentsList = document.getElementById('students-list'),
      $studentsListTHAll = document.querySelectorAll('.studentsTable th')


const $filterForm = document.getElementById('filter-form'),
      $fioFilterInp = document.getElementById('inp-fio'),
      $facultyFilterInp = document.getElementById('inp-faculty'),
      $startDateFilterInp = document.getElementById('inp-studyStart'),
      $finishDateFilterInp = document.getElementById('inp-finishDate')

  
// по умолчанию сортировка по ФИО
let column = 'fio'
let columnDir = true

// напишем функцию, добавим элементы в DOM
function newStudentTR(student) {
  const $studentTR = document.createElement('tr'),
        $fioTD = document.createElement('td'),
        $birthDateTD = document.createElement('td'),
        $startDateTD = document.createElement('td'),
        $facultyTD = document.createElement('td')
        
  $fioTD.textContent = student.fio
  $birthDateTD.textContent = student.getBirthdayString() + ' (' + student.getAge() + ' лет)'
  $startDateTD.textContent = getCourse(student.studyStart)
  $facultyTD.textContent = student.faculty
 
  $studentTR.append($fioTD)
  $studentTR.append($birthDateTD)
  $studentTR.append($startDateTD)
  $studentTR.append($facultyTD)

  return $studentTR;
}
// создадим фунцию период обучения
function getCourse(studyStart) {
  let now = new Date()
  let nowYear = now.getFullYear(),
      nowMonth = now.getMonth(),
      nowDate = now.getDate()
  let course = nowYear - studyStart - (0 > (nowMonth - 8 || nowDate - 1))
  course = ++course > 4 ? 'закончил' : `${course} курс`
  let range = `${studyStart} - ${studyStart + 4} (${course})`
  return range
}

// создадим функцию сортировки по параметрам
function getSortStudents(prop, dir) {
  const studentsCopy = [...students]
  return studentsCopy.sort(function(studentA, studentB) {
    if ((!dir === false ? studentA[prop] < studentB[prop] : studentA[prop] > studentB[prop]))
    return -1;
  })
}

// создадим функцию фильтрации по параметрам
function filter(prop, value) {
  const studentsCopy = [...students]
  return studentsCopy.filter(function(student) {
    if (String(student[prop]).includes(value.trim())) 
    return true
  })
}

// создадим функцию, которая будет рендерить таблицу
async function render() {
  // скопируем массив
  $studentsList.textContent = ''
  let studentsCopy = [...students]

  let serverStudentList = await allStudents()

  if(serverStudentList) {
    serverStudentList.forEach(item => {
      studentsCopy.push(new Student(
        item.name,
        item.surname,
        item.lastname,
        new Date(item.birthday),
        Number(item.studyStart),
        item.faculty
      ))
    })
  }

  // myObj.hasOwnProperty('key')
  // сортировка
  studentsCopy = getSortStudents(column, columnDir)
  // фильтрация
  if ($fioFilterInp.value.trim() !== '') {
    studentsCopy = filter('fio', $fioFilterInp.value)
  }

  if ($facultyFilterInp.value.trim() !== '') {
    studentsCopy = filter('faculty', $facultyFilterInp.value)
  }

  if ($startDateFilterInp.value.trim() !== '') {
    studentsCopy = filter('studyStart', $startDateFilterInp.value)
  }

  if ($finishDateFilterInp.value.trim() !== '') {
    studentsCopy = filter('finishDate', $finishDateFilterInp.value)
  }

  // отрисовка
  $studentsList.innerHTML = ''
  for (const student of studentsCopy) {
    $studentsList.append(newStudentTR(student))
  }
}

//добавим события сортировки
$studentsListTHAll.forEach(element => {
  element.addEventListener('click', function() {
    column = this.dataset.column;
    columnDir = !columnDir
    render()
  })
});

// фильтр
$filterForm.addEventListener('submit', function(event) {
  event.preventDefault()
})

$fioFilterInp.addEventListener('input', function() {
  render()
})

$facultyFilterInp.addEventListener('input', function() {
  render()
})

$startDateFilterInp.addEventListener('input', function() {
  render()
})

$finishDateFilterInp.addEventListener('input', function() {
  render()
})

// добавим событие 'submit' для добавления студентов
document.getElementById('add-student').addEventListener('submit', async function(event) {
  event.preventDefault()

    if (validation(this) === true) {

    // добавляем студентов в таблицу

    // students.push(new Student(
    //   document.getElementById('input-surname').value.trim(),
    //   document.getElementById('input-name').value.trim(),
    //   document.getElementById('input-lastname').value.trim(),
    //   new Date(document.getElementById('input-birthday').value.trim()),
    //   Number(document.getElementById('input-studyStart').value.trim()),
    //   document.getElementById('input-faculty').value.trim(),
    // ))

    let studentObj = {
      name: document.getElementById('input-surname').value.trim(),
      surname: document.getElementById('input-name').value.trim(),
      lastname: document.getElementById('input-lastname').value.trim(),
      birthday: new Date(document.getElementById('input-birthday').value.trim()),
      studyStart: Number(document.getElementById('input-studyStart').value.trim()),
      faculty: document.getElementById('input-faculty').value.trim(),
    }
    Object.assign(studentObj, ...students)
    console.log(studentObj);

    // await createStudents({...studentObj, birthday: studentObj.birthday.toISOString(), studyStart: `${studentObj.studyStart}`})

    let serverDataObj = await createStudents(studentObj)
    students.push(new Student(
      serverDataObj.name,
      serverDataObj.surname,
      serverDataObj.lastname,
      new Date(serverDataObj.birthday),
      Number(serverDataObj.studyStart),
      serverDataObj.faculty,
      serverDataObj.id
    ))

    // const newStudent = new Student(
    //   document.getElementById('input-surname').value.trim(),
    //   document.getElementById('input-name').value.trim(),
    //   document.getElementById('input-lastname').value.trim(),
    //   new Date(document.getElementById('input-birthday').value.trim()),
    //   Number(document.getElementById('input-studyStart').value.trim()),
    //   document.getElementById('input-faculty').value.trim(),
    // )

    

    console.log('students', students);
    render(students)
    this.reset()
  }
// очистим поля ввода
  document.getElementById('input-surname').value = ''
  document.getElementById('input-name').value = ''
  document.getElementById('input-lastname').value = ''
  document.getElementById('input-birthday').value = ''
  document.getElementById('input-studyStart').value = ''
  document.getElementById('input-faculty').value = ''

})

render()
