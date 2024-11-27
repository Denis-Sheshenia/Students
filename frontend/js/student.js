// создаем класс, переносим параметры в глобальную область видимости
export default class Student {
    constructor(surname, name, lastname, birthday, studyStart, faculty) {
    this.name = name
    this.surname = surname
    this.lastname = lastname
    this.birthday = birthday
    this.studyStart = studyStart
    this.finishDate = (studyStart + 4)
    this.faculty = faculty
    this.id = id
  }

  // функция вернет ФИО студента
  get fio() {
    return this.surname + ' ' + this.name + ' ' + this.lastname
  }

  // функция вернет сколько лет учится студент
  getEduPeriod() {
    const currentTime = new Date()
    return currentTime.getFullYear() - this.studyStart
  }

  getBirthday = new Date()

  // функция переведет дату в строку
  getBirthdayString() {
    const yyyy = this.birthday.getFullYear();
    let mm = this.birthday.getMonth() + 1         // месяц начинается с 0
    let dd = this.birthday.getDate();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    return dd + '.' + mm + '.' + yyyy;
  }

  // функция вернет возраст студента
  getAge() {
    const today = new Date();
    let age = today.getFullYear() - this.birthday.getFullYear();
    let m = today.getMonth() - this.birthday.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < this.birthday.getDate())) {
        age--;
    }

  return age;
  }

}
