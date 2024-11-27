export default function validation(form) {

  // создаем поле для отображения ошибки
  function createError(input, text) {
    const parent = input.parentNode; // обращаемся к родителю input
    const errorLabel = document.createElement('label')
    errorLabel.classList.add('error-label')
    errorLabel.textContent = text

    parent.classList.add('error') // добавляем класс родителю

    parent.append(errorLabel)
  }

  // удаляем поле с ошибкой
  function removeError(input) {
    const parent = input.parentNode;

    if (parent.classList.contains('error')) {  // метод 'contains' проверяет существует ли указанный класс
      parent.querySelector('.error-label').remove() 
      parent.classList.remove('error')
    }
  }

  let result = true; // по умолчанию результат валидации 'true'

  const allInputs = form.querySelectorAll('input'); // находим все элементы с названием 'input'

  for (const input of allInputs) { // перебираем значения с помощью цикла 'for of'

    removeError(input) // функция проверяет, существует ли поле с ошибкой и удаляет его
    
    if (input.dataset.indexBirthdate) {
       if (new Date(input.value) < new Date(input.dataset.indexBirthdate) || new Date(input.value) > new Date()){
        removeError(input)
        createError(input, `Дата рождения с ${input.dataset.indexBirthdate} г. по настоящее время`)
        result = false
      }
    }

    if (input.dataset.indexYear) {
      if (input.value < input.dataset.indexYear || input.value > new Date().getFullYear()) {
        removeError(input)
        createError(input, `Начало обучения с ${input.dataset.indexYear} г. по настоящее время`) 
        result = false
      }
    }

    if (input.dataset.minLength) { // поиск 'input' по дата атрибуту
      if (input.value.length < input.dataset.minLength) {
        removeError(input)
        createError(input, `Минимальное количество символов: ${input.dataset.minLength}`) 
        result = false
      }
    }

    if (input.dataset.required == 'true') {
      if (input.value.trim() == "") { // если значение поля 'input' равно пустому полю, 
        removeError(input)
        createError(input, 'Поле не заполнено!') // то запускается функция и добавляется текстовое поле
        result = false
      }
    }

  }

  return result
}