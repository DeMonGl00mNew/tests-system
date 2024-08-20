import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RequestsService } from '../services/requests.service';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
})
export class RegistrationComponent {
  // Конструктор, который принимает сервис для работы с запросами
  constructor(private authService: RequestsService) {}

  // Переменная для хранения сообщения о результате регистрации
  responseMessage: string | null = null;

  // Метод для обработки отправки формы
  submit(form: NgForm) {
    // Сохраняем данные пользователя из формы в сервис
    this.authService.userData = form.value;
    // Устанавливаем email, если он есть, иначе null
    this.authService.userData.email = form.value.email || null;
    // Устанавливаем класс (grade), если он есть, иначе null
    this.authService.userData.grade = form.value.grade || null;
    // Устанавливаем роль (role), если класс не указан, по умолчанию 'pupil'
    this.authService.userData.role = form.value.grade || 'pupil';

    // Вызываем метод регистрации из сервиса
    this.authService.register(this.authService.userData).subscribe({
      // Обрабатываем успешный ответ
      next: (response) => {
        // Если есть ошибка в ответе, сохраняем сообщение об ошибке
        if (response.error) {
          this.responseMessage = response.error;
        } else {
          // В противном случае сохраняем сообщение об успешной регистрации
          this.responseMessage = response.message;
        }
      },
      // Обрабатываем ошибку запроса
      error: () => {
        this.responseMessage = 'Неожиданная ошибка';
      },
    });
  }
}