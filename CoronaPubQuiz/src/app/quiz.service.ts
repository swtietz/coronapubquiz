import { Injectable } from '@angular/core';

import { Observable, of, pipe } from 'rxjs';
import { map} from 'rxjs/operators';

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
  questions$: Observable<Question[]>;

  bar: string;
  quiz: string;

  firestore: AngularFirestore;

  constructor(firestore: AngularFirestore) { 

  	this.firestore = firestore;

    this.quizzes = [new Quiz(), new Quiz()];

    this.bar = 'anze'
    this.quiz = 'history_quiz'

    console.log('Executed')
    


  }


  private loadQuestions(bar, quiz): Observable<Question[]> {
    let questions$ = this.firestore.collection('pubs').doc(bar).collection('quizzes').doc(quiz).collection('questions')
    		.valueChanges()
    		.pipe(map(collection => {
                return collection.map(b => {
                    let questions = new Question();
                    questions.question = b.Question;
                    questions.A = b.A;
                    questions.B = b.B;
                    questions.C = b.C;
                    questions.D = b.D;
                    
                    console.log(questions);
                    return questions;
                });
            }));
    return questions$
  }

  getQuizzes(): Observable<Quiz[]> {
    return of(this.quizzes);
  }


  getQuestions(bar, quiz): Observable<Question[]> {
    this.questions$ = this.loadQuestions(bar, quiz)
    return this.questions$
  }
  	



}
