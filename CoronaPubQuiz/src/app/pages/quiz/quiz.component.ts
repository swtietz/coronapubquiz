import { Component, OnInit } from '@angular/core';

import { QuizService, Question } from '../../quiz.service'

import { Observable } from 'rxjs';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})

export class QuizComponent implements OnInit {

  question: Observable<Question>;

  constructor(quizService: QuizService) { 
     this.question = quizService.getQuestion();
  }

  ngOnInit(): void {
  }

}
