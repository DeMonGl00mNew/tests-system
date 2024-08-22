import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Question } from '../test-viewver/test-viewver.component';

@Component({
  selector: 'app-configure-test',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './configure-test.component.html',
  styleUrl: './configure-test.component.scss',
})
export class ConfigureTestComponent {
  titleTest = '';

  right_answer: number = 0;

  questionsConfigure: Question[] = [];

  answers: string[] = ['']; // начальное значение для первого варианта ответа

  questionIndex: number = 0;

  addAnswer() {
    this.answers.push(''); // добавляем пустую строку для нового варианта
  }

  removeAnswer(index: number) {
    this.answers.splice(index, 1); // удаляем вариант ответа по индексу
  }

  addQuestion(myForm: NgForm): void {
    const questionConfigure: Question = {
      question: myForm.value.question,
      answers: this.getAllAnswers(myForm),
      rightAnswer: myForm.value[`answer${this.right_answer}`],
      pathImage: myForm.value.image_path,
    };
    this.questionsConfigure.push(questionConfigure);
    this.questionIndex++;

    this.resetForm(myForm); // Сброс формы после добавления вопроса
  }

  resetForm(form: NgForm) {
    form.resetForm();
    this.answers = []; // Если нужно сбросить массив ответов
    this.right_answer = 0; // Сбросить выбранный правильный ответ
  }

  getAllAnswers(data: NgForm): string[] {
    const answers: string[] = [];
    for (const key in data.value) {
      if (data.value.hasOwnProperty(key) && key.startsWith('answer')) {
        answers.push(data.value[key]);
      }
    }
    return answers;
  }

  SendTest(): void {}
}
