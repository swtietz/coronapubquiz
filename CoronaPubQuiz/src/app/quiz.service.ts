import { Injectable } from '@angular/core';

import { Observable, of, pipe } from 'rxjs';
import { map} from 'rxjs/operators';

import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore';

export class Quiz{
  name: String;
  id: any
}

export class Question{
  id: String;
  question: String;
  A: String;
  B: String;
  C: String;
  D: String;
  active: boolean;
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

    //this.bar = 'anze'
    //this.quiz = 'history_quiz'


    //this.setQuestionActive('anze','history_quiz','q1')

    //this.addQuiz('anze', 'test2')

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
    this.questions$ = this.loadQuestionsWithID(bar, quiz)
    //this.questions$.subscribe(console.log);
    return this.questions$
  }


  loadQuestionsWithID(bar, quiz): Observable<Question[]> {
    //let questions$ = this.firestore.collection('pubs').doc(bar).collection('quizzes').doc(quiz).collection('questions').doc(id)
    let questions$ = this.firestore.collection('pubs').doc(bar).collection('quizzes').doc(quiz).collection('questions').snapshotChanges()
	    .pipe(map(actions => {
		  return actions.map(a => {
		    const data = a.payload.doc.data() as Question;
		    const id = a.payload.doc.id;
		    return { id, ...data } as Question;
		  });
		}));
	return questions$
  }
  	

  setQuestionActive(bar, quiz, id, status=true): void {

  	let question = this.firestore.doc<Question>('pubs/'+bar+'/quizzes/'+quiz+'/questions/'+id);

    question.update({'active':status});
    //let questions$ = this.firestore.collection('pubs').doc(bar).collection('quizzes').doc(quiz).collection('questions').doc(quiz).
	
  }


  addQuiz(bar, quiz): void {
  	let quizzes = this.firestore.collection<Quiz>('pubs/'+bar+'/quizzes/').doc(quiz).set({
	    name: quiz,
	})


  }


}
