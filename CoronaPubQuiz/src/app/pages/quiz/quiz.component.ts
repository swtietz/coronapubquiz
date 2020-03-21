import { Component, OnInit } from '@angular/core';

import { QuizService, Quiz } from '../../quiz.service'

import { Observable } from 'rxjs';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {

  quizzes: Observable<Quiz[]>;

  constructor(quizService: QuizService) { 
     this.quizzes = quizService.getQuizzes();
  }

  ngOnInit(): void {
  }

}
