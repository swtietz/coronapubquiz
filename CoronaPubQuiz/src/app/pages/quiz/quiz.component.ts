import { Router, ActivatedRoute } from '@angular/router';

import { ElementRef, ViewChild, Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';

import { AuthenticationService, User } from '../../authentication.service'
import { QuizService, Question, Submission } from '../../quiz.service'
import { PubService } from 'src/app/pub.service';

import { Observable } from 'rxjs';


import { flatMap } from 'rxjs/operators';


import { AngularFireDatabase } from '@angular/fire/database';
import 'firebase/database';
import { GroupService, Group } from 'src/app/group.service';

declare function setupStreams(database: any, quiz: any, group: any, user: any, isModerator: boolean, videoElement: any, audioParent: any): any;


@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})

export class QuizComponent implements OnInit, AfterViewInit {

  @ViewChild('moderatorVideo') videoElement: ElementRef;
  @ViewChild('audioParent') audioParent: ElementRef;


  activeQuestion: Question;
  activeSubmission: Submission;
  questions: Observable<Question[]>;
  groupMembers: Observable<User[]>;
  submissions: Observable<Submission[]>
  bar: string;
  quiz: string;
  group: string;
  groups: Observable<Group[]>
  groupOrders: object;
  destroyStreams: any;


  currentAnswer:string = '';


  constructor(
    private authService:AuthenticationService,
    private route: ActivatedRoute,
    private quizService: QuizService,
    private groupService: GroupService,
    public pubService: PubService,
    private router: Router,
    private db: AngularFireDatabase
              ) {
                this.groupOrders = {}
              }

  ngOnInit(): void {
    this.bar = this.route.snapshot.paramMap.get('name');
    this.quiz = this.route.snapshot.paramMap.get('quizname');
    this.group = this.route.snapshot.paramMap.get('groupname');
    
    this.questions = this.quizService.getQuestions(this.bar, this.quiz);

    this.submissions = this.quizService.getSubmissions(this.bar, this.quiz)
    

    this.groupMembers = this.authService.usersByGroup(this.group);
    console.log(this.groupMembers);

    this.authService.user$.subscribe((user) => { 
      if(!user){
        this.router.navigate(['/bar/'+this.bar+'/'+this.quiz+'/'+this.group+'/welcome']);
      }else{
        this.router.navigate(['/bar/'+this.bar+'/'+this.quiz+'/'+this.group]);
      }
    })

    this.questions.subscribe((questions:Question[])=>{

        this.activeQuestion = questions.filter((q) => q.active)[0]
        
        this.submissions.subscribe((submissions:Submission[])=>{
        this.activeSubmission = submissions.filter((s) => s.questionId == this.activeQuestion.id && s.groupId == this.group)[0]
        if (this.activeSubmission){
          this.currentAnswer = this.activeSubmission.answer
        }
      })
    })
    
    this.groups = this.groupService.getGroups(this.bar, this.quiz);
    this.quizService.getOrders(this.bar, this.quiz).subscribe(orders=>{
      this.groups.subscribe(groups => {
        groups.forEach(group => {
          console.log('orders', group, orders)
          this.groupOrders[group.name] = ""+orders.filter(o => o.group === group.name).length
          console.log('sum',this.groupOrders[group.name], orders.filter(o => o.group === group.name).length)
        });
      })
    })
  }
  
  /*
  getCurrentSubmission(question:Question): Observable<Submission>{
    return this.quizService.getSubmission(this.bar, this.quiz, this.group, question.id)
  }
  */

  order(drink): void {
    var user = this.authService.getUser();
    this.quizService.orderDrink(this.bar, this.quiz, user, this.group, drink)
  }
  
  ngAfterViewInit(): void {
    var user = this.authService.getUser();
    if(user) {
      //this.destroyStreams = setupStreams(this.db, this.quiz, this.quiz + "_" + this.group, user.uid, this.pubService.isOwner, this.videoElement.nativeElement, this.audioParent.nativeElement);
    }
  }

  ngOnDestroy(): void {
    if(this.destroyStreams) {
      this.destroyStreams();
    }
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