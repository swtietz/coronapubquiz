import { Injectable } from '@angular/core';

import { Observable, of, pipe } from 'rxjs';
import { map} from 'rxjs/operators';

import { AngularFirestore } from '@angular/fire/firestore';

import {AuthenticationService} from './authentication.service';

import 'firebase/firestore';


export class Pub{
  id: string;
  name: string;
}

export class MenuItem{
  id: string;
  name: string;
  price: number;
}


@Injectable({
  providedIn: 'root'
})
export class PubService {


  isOwner: boolean;

  firestore: AngularFirestore

  constructor(firestore: AngularFirestore, auth: AuthenticationService) { 
  	this.firestore = firestore;
    
    
  	let pub = new Pub();
  	pub.id = 'FreyaFuchs'
  	pub.name = 'Freya Fuchs'
  	//this.addPub(pub)

  	let item = new MenuItem();
  	item.id = 'Bier'
  	item.price = 1.0
  	item.name = 'Bier'
  	this.addMenuItem(pub.id, item)

    

    auth.afAuth.authState.subscribe((user) => {
      this.checkOwner(pub.id, user)
    })


  }

  
  private checkOwner(pubId:string, user:firebase.User){

    if(!user){
      this.isOwner = false;
      return
    }

    this.firestore.collection<Pub>('pubs/'+pubId+'/owners', ref => ref.where('email', '==', user.email)).valueChanges().subscribe(
      (users) => {
        if(users.length>0){
          this.isOwner = true;
        }else{
          this.isOwner = false;
        }
        
      })
  }

  addPub(pub:Pub, user:firebase.User): void {
  	this.firestore.collection<Pub>('/pubs').doc(pub.id).set(Object.assign({}, pub))
    this.firestore.collection<any>('/pubs'+pub.id+'/owners/').add({email:user.email})
  }


  addMenuItem(pubId, menuItem:MenuItem): void {
  	this.firestore.collection<Pub>('/pubs/'+pubId+'/menu').doc(menuItem.id).set(Object.assign({}, menuItem))
  }

  deleteMenuItem(pubId, menuItem:MenuItem): void {
  	this.firestore.collection<Pub>('/pubs/'+pubId+'/menu').doc(menuItem.id).delete()
  }

  getMenuItems(pubId): Observable<MenuItem[]> {
  	let menu$ = this.firestore.collection('pubs/'+pubId+'/menu').snapshotChanges()
	    .pipe(map(actions => {
		  return actions.map(a => {
		    const data = a.payload.doc.data() as MenuItem;
		    const id = a.payload.doc.id;
		    return { id, ...data } as MenuItem;
		  });
		}));
	return menu$
  }

}
