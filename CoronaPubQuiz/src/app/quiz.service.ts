import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore';

export class Quiz{
  name: String;
}

export class Question{
  question: String;
  A: String;
  B: String;
  C: String;
  D: String;
}


@Injectable({
  providedIn: 'root'
})
export class QuizService {

  //quizzes: Observable<any[]>;
  quizzes: Quiz[];

  questions: Question[];

  constructor(firestore: AngularFirestore) { 
    this.quizzes = [new Quiz(), new Quiz()]
    //this.quizzes = firestore.collection('pubs').valueChanges();
  }


  getQuizzes(): Observable<Quiz[]> {
    return of(this.quizzes);
  }


  getQuestion(): Observable<Question> {
  	var question = new Question()
  	question.question = 'test'
  	question.A = '1992'
  	question.B = '1992'
  	question.C = '1992'
  	question.D = '1992'
    return of(question);
  }



}
