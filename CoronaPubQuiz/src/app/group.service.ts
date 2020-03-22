import { Injectable } from '@angular/core';

import { Observable, of, pipe } from 'rxjs';
import { map} from 'rxjs/operators';

import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore';


export class Group{
	name:string;
}

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(private firestore: AngularFirestore) { 
  	this.getGroups('anze','history_quiz').subscribe(console.log)
  }


  getGroups(bar:string, quiz:string): Observable<Group[]>{
  	return this.firestore.collection<Group>('pubs/'+bar+'/quizzes/'+quiz+'/groups').valueChanges()
  }

  addGroup(bar:string, quiz:string, group:string){
  	 let quizzes = this.firestore.collection<Group>('pubs/'+bar+'/quizzes/'+quiz+'/groups').add({
	    name: group,
    })
  }
}

