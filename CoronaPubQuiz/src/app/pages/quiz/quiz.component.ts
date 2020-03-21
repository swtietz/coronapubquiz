import { Component, OnInit } from '@angular/core';

import { QuizService, Question } from '../../quiz.service'

import { Observable } from 'rxjs';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})

export class QuizComponent implements OnInit {

  questions: Observable<Question[]>;

  constructor(quizService: QuizService) { 
     this.questions = quizService.getQuestions('anze', 'history_quiz');
  }

  ngOnInit(): void {
  }

}
