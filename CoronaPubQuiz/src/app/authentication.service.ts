import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

import { Observable, of, pipe, BehaviorSubject } from 'rxjs';

export class User{
	id: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

    private user: firebase.User;

    user$ : BehaviorSubject<firebase.User>;
    
    constructor(
    	public afAuth: AngularFireAuth, 
    	public firestore: AngularFirestore,
    	) {

    	this.user$ = new BehaviorSubject(null) 

		this.afAuth.authState.subscribe(user => {
			this.user$.next(user)
			
			console.log('user changed', user)
			if (user){
				this.user = user;
				localStorage.setItem('user', JSON.stringify(this.user));
			} else {
				localStorage.setItem('user', null);
			}
		})

	}

    



	async login(email: string, password: string) {
		var result = await this.afAuth.signInWithEmailAndPassword(email, password)

	}



	async register(email: string, password: string) {
	    var result = await this.afAuth.createUserWithEmailAndPassword(email, password)
	    this.createUser(email, email, '','');
	}


	registerAnonymous(name, icon){
		let login$ = this.afAuth.signInAnonymously()
		

		//localStorage.setItem('user', JSON.stringify({}));
		return login$

	}
	
	createUser(id:string, email: string, name: string, icon:string):void {
		this.firestore.collection<User>('/users').doc(id).set({
			email: email,
			name:name,
			icon:icon
		})
	}
	

	async logout(){
	    await this.afAuth.signOut();
	    localStorage.removeItem('user');
	}

	get isLoggedIn(): boolean {
	    const  user  =  JSON.parse(localStorage.getItem('user'));
	    return  user  !==  null;
	}

	/**
	 *  WARNING: this is not an observable and is not updated when the value changes. 
	 *  For such usecases use this.afAuth.authState.subscribe((user) => { ... instead
	 */
	getUser(): firebase.User {
		return JSON.parse(localStorage.getItem('user'))
	}

}
