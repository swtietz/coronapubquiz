import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore';

export class Quiz{
  name: String;
}

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  //quizzes: Observable<any[]>;
  quizzes: Quiz[];

  constructor(firestore: AngularFirestore) { 
    this.quizzes = [new Quiz(), new Quiz()]
    //this.quizzes = firestore.collection('pubs').valueChanges();;
  }


  getQuizzes(): Observable<Quiz[]> {
    return of(this.quizzes);
  }



}
