import { Router, ActivatedRoute } from '@angular/router';

import { ElementRef, ViewChild, Component, OnInit, AfterViewInit } from '@angular/core';

import { AuthenticationService } from '../../authentication.service'
import { QuizService, Question, Submission } from '../../quiz.service'
import { PubService } from 'src/app/pub.service';

import { Observable } from 'rxjs';


import { flatMap } from 'rxjs/operators';

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


  activeQuestion: Question;
  activeSubmission: Submission;
  questions: Observable<Question[]>;
  submissions: Observable<Submission[]>
  bar: string;
  quiz: string;
  group: string;


  currentAnswer:string = '';


  constructor(
    private authService:AuthenticationService,
    private route: ActivatedRoute,
    private quizService: QuizService,
    public pubService: PubService,
    private router: Router,
    private db: AngularFireDatabase

              ) {}

  ngOnInit(): void {
    this.bar = this.route.snapshot.paramMap.get('name');
    this.quiz = this.route.snapshot.paramMap.get('quizname');
    this.group = this.route.snapshot.paramMap.get('groupname');
    this.questions = this.quizService.getQuestions(this.bar, this.quiz);

    
    this.authService.user$.subscribe((user) => { 
      if(!user){
        this.router.navigate(['/bar/'+this.bar+'/'+this.quiz+'/'+this.group+'/welcome']);
      }else{
        this.router.navigate(['/bar/'+this.bar+'/'+this.quiz+'/'+this.group]);
      }
    })


    this.questions.subscribe((questions:Question[])=>{

        this.activeQuestion = questions.filter((q) => q.active)[0]
        this.submissions = this.quizService.getSubmissions(this.bar, this.quiz, this.activeQuestion.id)
        this.submissions.subscribe((submissions:Submission[])=>{
        this.activeSubmission = submissions.filter((s) => s.questionId == this.activeQuestion.id && s.groupId == this.group)[0]
        this.currentAnswer = this.activeSubmission.answer
        

      })

    })



    

    

    

  }
  
  getCurrentSubmission(question:Question): Observable<Submission>{
    return this.quizService.getSubmission(this.bar, this.quiz, this.group, question.id)
  }

  ngAfterViewInit(): void {

    this.authService.afAuth.authState.subscribe((user) => {
      setupStreams(this.db, this.quiz, this.quiz, user.email, this.pubService.isOwner, this.videoElement.nativeElement, document.body);
    });
  }

  submit(question, answer) {
    this.quizService.addSubmission(this.bar, this.quiz, question.id, this.group, answer)
  }

  nextQuestion(question) {
    this.quizService.setQuestionActive(this.bar, this.quiz, question.id, false)
    this.questions.subscribe(questions => {
      const next_question = questions.find(q=>q.index === question.index+1)
      this.quizService.setQuestionActive(this.bar, this.quiz, next_question.id, true)
    })
  }
}