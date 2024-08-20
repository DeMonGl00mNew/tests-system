import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterLink } from '@angular/router';
import { RequestsService } from './services/requests.service';

@Component({
  selector: 'app-root', // Селектор компонента
  standalone: true, // Указывает, что компонент является независимым
  imports: [RouterOutlet, RouterLink], // Импортируем необходимые модули
  templateUrl: './app.component.html', // Шаблон компонента
  styleUrl: './app.component.scss', // Стили компонента
})
export class AppComponent implements OnInit {
  username: string = ''; // Переменная для хранения имени пользователя
  title = 'tests-system'; // Заголовок приложения

  constructor(private authService: RequestsService) {} // Инъекция сервиса для работы с запросами

  ngOnInit() {
    // Метод, который вызывается при инициализации компонента

    // Получаем данные пользователя из cookies
    this.authService.getUserDataFromCookies(this.authService.userData);
    
    // Проверяем, если имя пользователя не пустое
    if (this.authService.userData.username !== '') {
      // Устанавливаем данные пользователя
      this.authService.setUserData(this.authService.userData);
    }

    // Подписываемся на изменения данных пользователя
    this.authService.userData$.subscribe((data) => {
      this.username = data.username; // Обновляем имя пользователя при изменении данных
    });
  }

  logout() {
    // Метод для выхода из системы
    this.authService.logout();
  }
}