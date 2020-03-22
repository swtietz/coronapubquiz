import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';

import { AuthenticationService } from 'src/app/authentication.service'

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  bar: string;
  quiz:string;
  group:string;
    
  constructor(private authService:AuthenticationService, private router: Router, private route: ActivatedRoute, ) {
  	this.bar = this.route.snapshot.paramMap.get('name');
    this.quiz = this.route.snapshot.paramMap.get('quizname');
    this.group = this.route.snapshot.paramMap.get('groupname');

    console.log(this.route.snapshot.paramMap)
  }

  ngOnInit(): void {

  }

  clickConfirm(name, emoji): void {

  	this.authService.registerAnonymous(name, emoji).then((result:any) => {
  		this.authService.createUser(result.user.uid, '', name, emoji);
  		this.router.navigate(['/bar/'+this.bar+'/'+this.quiz+ '/'+ this.group]);
  		console.log('navigated', this.group);

  		
  	})
    
    
  }

}
