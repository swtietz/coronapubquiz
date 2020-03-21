import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

    private user: firebase.User;
    
    constructor(public afAuth: AngularFireAuth) {
		this.afAuth.authState.subscribe(user => {
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
	}

	async logout(){
	    await this.afAuth.signOut();
	    localStorage.removeItem('user');
	}

	get isLoggedIn(): boolean {
	    const  user  =  JSON.parse(localStorage.getItem('user'));
	    return  user  !==  null;
	}

}
