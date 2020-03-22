import { Component, OnInit } from '@angular/core';
import { Quiz, Question, QuizService } from 'src/app/quiz.service';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { first, filter } from 'rxjs/operators';

@Component({
  selector: 'app-creator',
  templateUrl: './creator.component.html',
  styleUrls: ['./creator.component.css']
})
export class CreatorComponent implements OnInit {
  showAddQuestion: boolean;
  newQuiz: Quiz;
  newQuestion: Question;
  questions: Question[];

  constructor(private route: ActivatedRoute,
              private quizService: QuizService) {
    this.route = route
    this.barId = this.route.snapshot.paramMap.get('name');
    this.newQuiz = new Quiz();
    this.questions = new Array<Question>();
  }
  barId: string;

  ngOnInit(): void {
  }

  clickAddNewQuestion(): void {
    this.newQuestion = new Question()
    this.showAddQuestion = true;
  }

  clickSaveNewQuestion(): void {
    this.showAddQuestion = false;
    this.questions.push(this.newQuestion)
  }

  clickDeleteQuestion(question: Question): void {
    // this.quizService.deleteQuestion(this.barId, this.newQuiz, question);
  }

  clickSaveQuiz() {
    const quizId = this.quizService.addQuiz(this.barId, this.newQuiz.name)
    this.questions.forEach(question => {
      this.quizService.addQuestion(this.barId, quizId, question)      
    });
  }
}
