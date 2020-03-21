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
  bar: string;
  quiz: string;

  constructor(
    private route: ActivatedRoute,
              private quizService: QuizService,
              ) {}

  ngOnInit(): void {
    this.bar = this.route.snapshot.paramMap.get('name');
    this.quiz = this.route.snapshot.paramMap.get('quizname');
    this.questions = this.quizService.getQuestions(this.bar, this.quiz);
  }

  submit(question, answer) {
    this.quizService.addSubmission(this.bar, this.quiz, question.id, "2bgXVXpdMOZhoFSsejLU", answer)
  }

  nextQuestion(question) {
    this.quizService.setQuestionActive(this.bar, this.quiz, question.id, false)
    this.questions.subscribe(questions => this.quizService.setQuestionActive(this.bar, this.quiz, questions.find(q=>q.index === question.index+1).id, true))
  }
}