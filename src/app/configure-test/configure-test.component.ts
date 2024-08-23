import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Question } from '../test-viewver/test-viewver.component';
import { RequestsService, Test } from '../services/requests.service';

@Component({
  selector: 'app-configure-test',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './configure-test.component.html',
  styleUrl: './configure-test.component.scss',
})
export class ConfigureTestComponent {
  // Конструктор, который принимает сервис для работы с запросами
  constructor(private authService: RequestsService) {}

  // Переменная для хранения сообщения о результате операции
  responseMessage: string | null = null;

  // Заголовок теста
  titleTest = '';

  // Индекс правильного ответа
  right_answer: number = 0;

  // Массив для хранения вопросов теста
  questionsConfigure: Question[] = [];

  // Массив для хранения вариантов ответов
  answers: string[] = ['']; // начальное значение для первого варианта ответа

  // Индекс текущего вопроса
  questionIndex: number = 0;

  // Метод для добавления нового варианта ответа
  addAnswer() {
    this.answers.push(''); // добавляем пустую строку для нового варианта
  }

  // Метод для удаления варианта ответа по индексу
  removeAnswer(index: number) {
    this.answers.splice(index, 1); // удаляем вариант ответа по индексу
  }

  // Метод для добавления вопроса в тест
  addQuestion(myForm: NgForm): void {
    const questionConfigure: Question = {
      question: myForm.value.question, // текст вопроса
      answers: this.getAllAnswers(myForm), // получение всех вариантов ответов
      rightAnswer: myForm.value[`answer${this.right_answer}`], // правильный ответ
      pathImage: myForm.value.image_path, // путь к изображению (если есть)
    };
    this.questionsConfigure.push(questionConfigure); // добавляем вопрос в массив
    this.questionIndex++; // увеличиваем индекс вопроса

    this.resetForm(myForm); // Сброс формы после добавления вопроса
  }

  // Метод для сброса формы
  resetForm(form: NgForm) {
    form.resetForm(); // сброс формы
    this.answers = []; // сброс массива ответов
    this.right_answer = 0; // сброс выбранного правильного ответа
  }

  // Метод для получения всех вариантов ответов из формы
  getAllAnswers(data: NgForm): string[] {
    const answers: string[] = [];
    for (const key in data.value) {
      // Проверяем, является ли ключ свойством объекта и начинается ли он с 'answer'
      if (data.value.hasOwnProperty(key) && key.startsWith('answer')) {
        answers.push(data.value[key]); // добавляем вариант ответа в массив
      }
    }
    return answers; // возвращаем массив вариантов ответов
  }

  // Метод для создания теста
  createTest(): Test {
    return {
      title: this.titleTest, // заголовок теста
      id_creator: 14, // идентификатор создателя теста
      duration: 10, // продолжительность теста
      image: '', // изображение (если есть)
      content: JSON.stringify({
        "questions": this.questionsConfigure // вопросы теста в формате JSON
      }),
    };
  }

  // Метод для отправки теста на сервер
  SendTest(): void {
    // Вызываем метод регистрации из сервиса
    this.authService.setTest(this.createTest()).subscribe({
      // Обрабатываем успешный ответ
      next: (response) => {
        // Если есть ошибка в ответе, сохраняем сообщение об ошибке
        if (response.error) {
          this.responseMessage = response.error;
          console.log(this.responseMessage);
        } else {
          // В противном случае сохраняем сообщение об успешной регистрации
          this.responseMessage = response.message;
          console.log(this.responseMessage);
        }
      },
      // Обрабатываем ошибку запроса
      error: () => {
        this.responseMessage = 'Неожиданная ошибка'; // сообщение об ошибке
        console.log(this.responseMessage);
      },
    });
  }
}