import { Component, OnInit } from '@angular/core';

import { NgForm } from '@angular/forms'; 

import { AuthenticationService } from 'src/app/authentication.service';

import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


	email: string;
	password: string;

  constructor(public authService: AuthenticationService, private router: Router,) { }

	ngOnInit(): void {
	}


  loginClicked(email, password): void{
  	this.authService.login(email.value, password.value).then(() => {
  		this.router.navigate(['/bar/anze/']);
  	})
  }






}
