import { ActivatedRoute } from '@angular/router';

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

  constructor(
    private route: ActivatedRoute,
              private quizService: QuizService,
              ) {}

  ngOnInit(): void {
    const bar = this.route.snapshot.paramMap.get('name');
    const quiz = this.route.snapshot.paramMap.get('quizname');
    this.questions = this.quizService.getQuestions(bar, quiz);
  }
}