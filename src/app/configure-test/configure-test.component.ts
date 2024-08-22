import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
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
 
}
