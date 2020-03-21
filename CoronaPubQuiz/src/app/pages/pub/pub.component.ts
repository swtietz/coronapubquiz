import { Component, OnInit } from '@angular/core';
import { Quiz, QuizService } from 'src/app/quiz.service';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pub',
  templateUrl: './pub.component.html',
  styleUrls: ['./pub.component.css']
})
export class PubComponent implements OnInit {
  quizzes: Observable<Quiz[]>;

  constructor(
    private route: ActivatedRoute,
    private quizService: QuizService,
  ) {}

  ngOnInit(): void {
    this.quizzes = this.quizService.getQuizzes();
  }
}
