import { Component, OnInit, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RequestsService, scoreData } from '../services/requests.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-test-info-science',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './test-viewver.component.html',
  styleUrls: ['./test-viewver.component.scss'],
})
export class TestViewverComponent implements OnInit {
  id_test = 0; // Идентификатор теста
  responseMessage: string | null = null; // Сообщение о результате запроса
  resultMessage: string  = ''; // Сообщение о результате теста
  questions: Question[] = [ // Массив вопросов теста
    {
      question: '', // Вопрос
      answers: [], // Ответы на вопрос
      rightAnswer: '', // Правильный ответ
      userAnswer: '', // Ответ пользователя
      pathImage: '', // Путь к изображению (если есть)
    },
  ];

  titleTest: string = ''; // Заголовок теста
  testResult: TestResult[] = []; // Результаты теста
  testResultMessage: string = ''; // Сообщение о результатах теста
  isVisible: boolean = false; // Флаг видимости результатов
  calcResult: number = 0; // Рассчитанный результат теста

  constructor(
    private authService: RequestsService, // Сервис для работы с запросами
    private route: ActivatedRoute // Сервис для работы с маршрутами
  ) {}

  ngOnInit() {
    // Подписка на параметры маршрута для получения идентификатора теста
    this.route.params.subscribe((params) => {
      this.id_test = +params['id']; // Преобразование идентификатора в число
    });

    this.getTest(this.id_test); // Получение теста по идентификатору
  }

  // Проверка типа сообщения о результате
  checkTypeResultMessage(): boolean {
    console.log(typeof this.testResultMessage === 'string');
    return typeof this.testResultMessage === 'string'; // Возвращает true, если сообщение - строка
  }

  // Получение теста по идентификатору
  public getTest(id_test: number): void {
    this.authService.getTest(id_test).subscribe({
      next: (response) => {
        this.titleTest = response['title']; // Установка заголовка теста
        this.questions = response['questions']; // Установка вопросов теста
      },
      error: () => this.handleError(), // Обработка ошибки
    });
  }

  // Добавление ответа пользователя на вопрос
  public addUserAnswer(question: Question, answer: string): void {
    question.userAnswer = answer; // Сохранение ответа пользователя
  }

  // Проверка решений пользователя
  public checkSolution(): void {
    const totalQuestions: number = this.questions.length; // Общее количество вопросов
    const countRightAnswer: number = this.questions.reduce(
      (count, curQuestion) => {
        return (
          count + (curQuestion.userAnswer === curQuestion.rightAnswer ? 1 : 0) // Подсчет правильных ответов
        );
      },
      0
    );

    this.calcResult = Math.round((countRightAnswer / totalQuestions) * 5); // Расчет результата
    this.isVisible = true; // Установка флага видимости результатов

    this.saveScore(this.calcResult, this.id_test); // Сохранение результата
  }

  // Сохранение результата теста
  private saveScore(score: number, id_test: number): void {
    const scoreData = this.fillScoreData(score, id_test); // Заполнение данных о результате
    this.authService.scoreSave(scoreData).subscribe({
      next: (response) => this.handleResponse(response), // Обработка ответа
      error: () => this.handleError(), // Обработка ошибки
    });
  }

  // Получение результатов теста
  public ViewResults(id_test: number): void {
    const id_user = this.authService.userData.id_user; // Получение идентификатора пользователя
    this.authService.getResults(id_user, id_test).subscribe({
      next: (response) => {
        if ('message' in response) 
            this.resultMessage = response.message; // Установка сообщения о результате
        else 
            this.testResult = response as TestResult[]; // Установка результатов теста
      },
      error: () => this.handleError(), // Обработка ошибки
    });
  }

  // Обработка ответа от сервера
  private handleResponse(response: any): void {
    if (response.error) {
      this.responseMessage = response.error; // Установка сообщения об ошибке
      console.error(`Error response: ${JSON.stringify(response)}`);
    } else {
      this.responseMessage = response.message; // Установка сообщения об успехе
      console.log(`Success response: ${JSON.stringify(response)}`);
    }
  }

  // Обработка ошибки
  private handleError(): void {
    this.responseMessage = 'Неожиданная ошибка'; // Сообщение об ошибке
    console.error(`Error: ${this.responseMessage}`);
  }

  // Заполнение данных о результате
  private fillScoreData(score: number, id_test: number): scoreData {
    return {
      id_user: this.authService.userData.id_user, // Идентификатор пользователя
      id_test: id_test, // Идентификатор теста
      score: score, // Результат
    };
  }
}

// Интерфейс для вопроса
interface Question {
  question: string; // Вопрос
  answers: string[]; // Ответы на вопрос
  rightAnswer: string; // Правильный ответ
  userAnswer?: string; // Ответ пользователя (необязательное поле)
  pathImage?: string; // Путь к изображению (необязательное поле)
}

// Тип для результата теста
type TestResult = {
  title: string; // Заголовок теста
  score: string; // Результат
  completed_at: string; // Дата завершения
}