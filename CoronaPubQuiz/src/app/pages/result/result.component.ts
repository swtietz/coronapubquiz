import { Router, ActivatedRoute } from '@angular/router';

import { ElementRef, ViewChild, Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';

import { GroupService, Group } from 'src/app/group.service'
import { AuthenticationService } from '../../authentication.service'
import { QuizService, Question, Submission } from '../../quiz.service'
import { PubService } from 'src/app/pub.service';

import { Observable } from 'rxjs';


import { flatMap, map } from 'rxjs/operators';


import { AngularFireDatabase } from '@angular/fire/database';
import 'firebase/database';


@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {

  bar: string;
  quiz: string;
  groupId: string;

  groups$: Observable<Group[]>
  questions$: Observable<Question[]>
  submissions$: Observable<Submission[]>



  submissions: Submission[] = null;

  constructor(    

    private groupService: GroupService,
  	private authService:AuthenticationService,
    private route: ActivatedRoute,
    private quizService: QuizService,
    public pubService: PubService,
    private router: Router,
    private db: AngularFireDatabase) { 
    this.bar = this.route.snapshot.paramMap.get('name');
    this.quiz = this.route.snapshot.paramMap.get('quizname');
    this.groupId = this.route.snapshot.paramMap.get('groupname');


    this.groups$ = this.groupService.getGroupsWithId(this.bar, this.quiz)

    this.questions$ = this.quizService.getQuestions(this.bar, this.quiz);

    this.questions$.subscribe((qs) => {
    	console.log('qs:',qs)
    })


    this.submissions$ = this.quizService.getSubmissions(this.bar, this.quiz);

    this.submissions$.subscribe((submissions) => {
    	this.submissions = submissions
    })



    




  }

  ngOnInit(): void {
  }


  


}
