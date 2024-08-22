import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from "@angular/forms";
interface Question {
  text: string;
  answers: string[];
  correctAnswer: string;
}
@Component({
  selector: 'app-configure-test',
  standalone: true,
  imports: [FormsModule,CommonModule], 
  templateUrl: './configure-test.component.html',
  styleUrl: './configure-test.component.scss'
})  
export class ConfigureTestComponent {
 


  answers: string[] = ['']; // начальное значение для первого варианта ответа

  addAnswer() {
    this.answers.push(''); // добавляем пустую строку для нового варианта
  }

  removeAnswer(index: number) {
    this.answers.splice(index, 1); // удаляем вариант ответа по индексу
  }



  onAnswerChange():void{}

  submit(form:any):void{}
}
