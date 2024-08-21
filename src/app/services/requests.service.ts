import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class RequestsService {
  // Переменная для хранения данных пользователя
  public userData: userData = this.setEmptyUserData();

  // URL для API аутентификации
  private apiUrlAuth: string =
    'https://eisk1848.ru/system-tests-scripts/authentification.php';
  // URL для API регистрации
  private apiUrlRegistration: string =
    'https://eisk1848.ru/system-tests-scripts/registration.php';
  // URL для API сохранения результатов
  private apiUrlScoreSave: string =
    'https://eisk1848.ru/system-tests-scripts/score-save.php';
  // URL для API получения всех результатов
  private apiUrlgetAllResults: string =
    'https://eisk1848.ru/system-tests-scripts/get-results.php';
  // URL для API получения содержания теста
  private apiUrlgetTest: string =
    'https://eisk1848.ru/system-tests-scripts/get-test.php';
  // URL для API получения данных о всех тестах
  private apiUrlgetDataTests: string =
    'https://eisk1848.ru/system-tests-scripts/get-data-about-tests.php';

  constructor(
    private http: HttpClient,
    private router: Router,
    private cookieService: CookieService
  ) {}

  // Метод для входа пользователя
  login(username: string, password: string): Observable<any> {
    return this.http.post(this.apiUrlAuth, {
      username: username,
      password: password,
    });
  }

  // Создаем объект BehaviorSubject для хранения данных пользователя
  private userDataSubject = new BehaviorSubject<userData>(this.userData);
  // Observable для подписки на изменения данных пользователя
  userData$ = this.userDataSubject.asObservable();

  // Метод для установки данных пользователя
  setUserData(data: userData) {
    this.userDataSubject.next(data);
  }

  // Метод для регистрации пользователя
  register(userData?: userData): Observable<any> {
    return this.http.post(this.apiUrlRegistration, userData);
  }

  // Метод для сохранения данных пользователя в куки
  saveUserDataToCookies(userData: userData) {
    Object.entries(userData).forEach(([key, value]) => {
      this.cookieService.set(key, value ? value.toString() : '');
    });
  }

  // Метод для получения данных пользователя из куки
  getUserDataFromCookies(userData: Record<string, any>) {
    const userKeys = this.cookieService.getAll();
    Object.entries(userKeys).forEach(([key, value]) => {
      if (key in userData) {
        userData[key] = value;
      }
    });
  }

  // Метод для удаления данных пользователя из куки
  deleteUserDataFromCookies(userData: Record<string, any>) {
    const userKeys = this.cookieService.getAll();
    Object.entries(userKeys).forEach(([key, value]) => {
      if (key in userData) {
        this.cookieService.delete(key);
      }
    });
  }

  // Метод для сохранения результатов теста
  scoreSave(scoreData?: scoreData): Observable<any> {
    return this.http.post(this.apiUrlScoreSave, scoreData);
  }

  // Метод для получения всех результатов тестов пользователя
  getResults(id_user: number, id_test: number): Observable<any> {
    return this.http.post(this.apiUrlgetAllResults, {
      id_user: id_user,
      id_test: id_test,
    });
  }

  // Метод для получения содержания теста
  getTest(id_test: number): Observable<any> {
    return this.http.post(this.apiUrlgetTest, {
      id_test: id_test,
    });
  }
getDataAboutTests():Observable<any>{
    return this.http.get (this.apiUrlgetDataTests);
}
  // Метод для выхода пользователя
  logout(): void {
    this.userData = this.setEmptyUserData(); // Сбрасываем данные пользователя
    this.setUserData(this.setEmptyUserData()); // Устанавливаем пустые данные пользователя
    this.deleteUserDataFromCookies(this.userData); // Удаляем данные из куки
    this.router.navigate(['/']); // Перенаправляем на главную страницу
  }

  // Метод для установки пустых данных пользователя
  setEmptyUserData(): userData {
    return {
      id_user: 0,
      username: '',
      password: '',
      email: '',
      grade: '',
      role: 'pupil',
    };
  }
}

// Интерфейс для данных о результатах теста
export interface scoreData {
  id_result?: number;
  id_user: number | null;
  id_test: number | null;
  score: number | null;
  completed_at?: string;
}

// Интерфейс для данных пользователя
interface userData {
  id_user: number;
  username: string;
  password: string;
  email: string;
  grade: string;
  role: string;
}