import { Component, OnInit } from '@angular/core';
import { Quiz, Question, QuizService } from 'src/app/quiz.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-creator',
  templateUrl: './creator.component.html',
  styleUrls: ['./creator.component.css']
})
export class CreatorComponent implements OnInit {
  route: any;
  showAddQuestion: boolean;
  newQuiz: Quiz;
  newQuestion: Question;
  questions: Observable<Question[]>;

  constructor(private quizService: QuizService) {}
  barId: string;

  ngOnInit(): void {
    this.barId = this.route.snapshot.paramMap.get('name');
    this.newQuiz = new Quiz()
    this.quizService.addQuiz(this.barId, this.newQuiz)
    // this.questions = new Array<Question>();
    // this.questions = this.quizService.getQuestions(this.barId, this.newQuiz)
  }

  clickAddNewQuestion(): void {
    this.showAddQuestion = true;
  }

  clickSaveNewQuestion(): void {
    this.showAddQuestion = false;
    this.quizService.addQuestion(this.barId, this.newQuiz, this.newQuestion)
  }

  clickDeleteQuestion(question: Question): void {
    // this.quizService.deleteQuestion(this.barId, this.newQuiz, question);
  }

}
