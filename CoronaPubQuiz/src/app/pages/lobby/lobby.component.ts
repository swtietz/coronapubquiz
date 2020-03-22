import { Component, OnInit } from '@angular/core';

import { Observable, of, pipe } from 'rxjs';
import {GroupService, Group} from 'src/app/group.service';

import { Router, ActivatedRoute } from '@angular/router';


import { AuthenticationService } from '../../authentication.service'
import { QuizService, Question } from '../../quiz.service'
import { PubService } from 'src/app/pub.service';


@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {

  groups:Observable<any>;
  bar:string;
  quiz:string;

  constructor(
  	private groupService:GroupService,
  	private route: ActivatedRoute,
    private quizService: QuizService,
    public pubService: PubService,
    private router: Router,) {

    this.bar = this.route.snapshot.paramMap.get('name');
    this.quiz = this.route.snapshot.paramMap.get('quizname');
  }

  ngOnInit(): void {
	this.groups = this.groupService.getGroups(this.bar, this.quiz)
  }

  join(group:Group):void{
  	console.log('navigated to', group)
  	this.router.navigate(['/bar/'+this.bar+'/'+this.quiz+'/'+group.name]);
  }

}