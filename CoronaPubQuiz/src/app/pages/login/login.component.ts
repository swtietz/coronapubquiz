import { Component, OnInit } from '@angular/core';

import { NgForm } from '@angular/forms'; 

import { AuthenticationService } from 'src/app/authentication.service'


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


	email: string;
	password: string;

  constructor(public authService: AuthenticationService) { }

	ngOnInit(): void {
	}






}
