import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RequestsService } from '../services/requests.service';

@Component({
  selector: 'app-home-page', // Селектор компонента
  standalone: true, // Указывает, что компонент является самостоятельным
  imports: [CommonModule, RouterLink], // Импортируем необходимые модули
  templateUrl: './home-page.component.html', // Шаблон компонента
  styleUrl: './home-page.component.scss', // Стили компонента
})
export class HomePageComponent implements OnInit {
  isLogined: boolean = false; // Переменная для отслеживания статуса входа пользователя
  testTiles: TestTile[] = [];

  constructor(private authService: RequestsService) {} // Инъекция сервиса для работы с данными пользователя

  ngOnInit() {
    // Подписка на данные пользователя при инициализации компонента
    this.authService.userData$.subscribe((data) => {
      // Проверяем, вошел ли пользователь в систему
      this.isLogined = data.id_user != 0 ? true : false; // Если id_user не равен 0, значит пользователь вошел
    });

    this.getDataAboutTests();
  }
  // Метод для получения данных о тестах
  public getDataAboutTests(): void {
    this.authService.getDataAboutTests().subscribe({
      next: (response) => {
        this.testTiles = response; // Сохраняем полученные данные о тестах в массив
      },
      error: (error) => {
        console.error('Ошибка при получении данных о тестах:', error); // Логируем ошибку в консоль
      },
    });
  }
}

// Интерфейс для описания структуры теста
interface TestTile {
  image: string; // Путь к изображению
  title: string; // Заголовок теста
  id_test: number; // Идентификатор теста
}
