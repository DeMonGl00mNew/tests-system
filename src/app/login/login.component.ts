import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RequestsService } from '../services/requests.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

// Определение компонента для страницы входа
@Component({
  selector: 'app-login', // Селектор компонента
  standalone: true, // Указывает, что компонент является самостоятельным
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterLink], // Импортируем необходимые модули
  templateUrl: './login.component.html', // Шаблон компонента
  styleUrl: './login.component.scss', // Стили компонента
})
export class LoginComponent {
  loginForm: FormGroup; // Форма для входа
  errorMessage: string | null = null; // Сообщение об ошибке

  constructor(
    private fb: FormBuilder, // Сервис для построения форм
    private authService: RequestsService, // Сервис для аутентификации
    private router: Router // Сервис для маршрутизации
  ) {
    // Инициализация формы с двумя полями: username и password
    this.loginForm = this.fb.group({
      username: ['', Validators.required], // Поле для имени пользователя, обязательное
      password: ['', Validators.required], // Поле для пароля, обязательное
    });
  }
  
  // Метод для обработки отправки формы
  onSubmit(): void {
    // Проверяем, валидна ли форма
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value; // Извлекаем значения из формы
      // Вызываем метод входа из сервиса аутентификации
      this.authService.login(username, password).subscribe({
        next: (response) => {
          // Если в ответе есть ошибка, отображаем сообщение об ошибке
          if (response.error) {
            this.errorMessage = response.error;
          } else {
            // Если вход успешен, сохраняем данные пользователя
            this.authService.userData = response; // Сохраняем данные пользователя
            this.authService.saveUserDataToCookies(this.authService.userData); // Сохраняем данные в куки
            this.authService.setUserData(response); // Устанавливаем данные пользователя в сервисе
            this.router.navigate(['/test']); // Перенаправляем на другую страницу
          }
        },
        error: (error) => {
          // Если произошла ошибка, отображаем сообщение об ошибке
          this.errorMessage = 'Неверный логин или пароль';
        },
      });
    }
  }
}