import { ActivatedRoute } from '@angular/router';

import { ElementRef, ViewChild, Component, OnInit, AfterViewInit } from '@angular/core';

import { AuthenticationService } from '../../authentication.service'
import { QuizService, Question } from '../../quiz.service'
import { PubService } from 'src/app/pub.service';

import { Observable } from 'rxjs';

import { AngularFireDatabase } from '@angular/fire/database';
import 'firebase/database';

declare function setupStreams(database: any, quiz: any, group: any, user: any, isModerator: boolean, videoElement: any, audioParent: any): any;

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})

export class QuizComponent implements OnInit, AfterViewInit {

  @ViewChild('moderatorVideo') videoElement: ElementRef;

  questions: Observable<Question[]>;
  bar: string;
  quiz: string;

  constructor(
    private route: ActivatedRoute,
    private quizService: QuizService,
    private authService: AuthenticationService,
    public pubService: PubService,
    private db: AngularFireDatabase
              ) {}

  ngOnInit(): void {
    this.bar = this.route.snapshot.paramMap.get('name');
    this.quiz = this.route.snapshot.paramMap.get('quizname');
    this.questions = this.quizService.getQuestions(this.bar, this.quiz);
  }

  ngAfterViewInit(): void {
    this.authService.afAuth.authState.subscribe((user) => {
      setupStreams(this.db, this.quiz, this.quiz, user.email, this.pubService.isOwner, this.videoElement.nativeElement, document.body);
    });
  }

  submit(question, answer) {
    this.quizService.addSubmission(this.bar, this.quiz, question.id, "2bgXVXpdMOZhoFSsejLU", answer)
  }

  nextQuestion(question) {
    this.quizService.setQuestionActive(this.bar, this.quiz, question.id, false)
    this.questions.subscribe(questions => {
      const next_question = questions.find(q=>q.index === question.index+1)
      this.quizService.setQuestionActive(this.bar, this.quiz, next_question.id, true)
    })
  }
}