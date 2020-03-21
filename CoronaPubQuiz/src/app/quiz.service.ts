import { Injectable } from '@angular/core';

import { Observable, of, pipe } from 'rxjs';
import { map} from 'rxjs/operators';

import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore';

export class Quiz{
  name: string;
  id: any
}

export class Question extends Object{
  id: string;
  question: string;
  index: number;
  A: String;
  B: String;
  C: String;
  D: String;
  answer: String;
  active: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class QuizService {
  quizzes$: Observable<Quiz[]>;
  questions$: Observable<Question[]>;

  bar: string;
  quiz: string;

  firestore: AngularFirestore;

  constructor(firestore: AngularFirestore) { 

  	this.firestore = firestore;

    //this.bar = 'anze'
    //this.quiz = 'history_quiz'


    //this.setQuestionActive('anze','history_quiz','q1')

    this.addQuiz('anze', 'test2')
    
    let question = new Question();
    question.id = 'q1';
    question.question = 'Wie spät ist es?';
    question.index = 1;
    question.A = 'AAA';
    question.B = 'BBB';
    question.C = 'CCC';
    question.D = 'DDD';
    question.answer = 'C';
    question.active = true;
    
    this.addQuestion('anze', 'test2', question)

    this.addSubmission('anze', 'test2', question.id, 'Füchse','A');

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
                    questions.answer = b.answer;
                    
                    console.log(questions);
                    return questions;
                });
            }));
    return questions$
  }

  getQuizzes(bar): Observable<Quiz[]> {
    this.quizzes$ = this.firestore.collection('pubs').doc(bar).collection('quizzes')
    		.valueChanges()
    		.pipe(map(collection => {
                return collection.map(b => {
                    let quiz = new Quiz();
                    quiz.name = b.name;
                    console.log(quiz);
                    return quiz;
                });
            }));
    return this.quizzes$
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

  addQuestion(bar, quiz, question:Question): void {
  	this.firestore.collection<Question>('pubs/'+bar+'/quizzes/'+quiz+'/questions').doc(question.id).set(Object.assign({}, question))
  }

  addSubmission(bar, quiz, questionId, groupId, answer): void {
  	this.firestore.collection<Question>('pubs/'+bar+'/quizzes/'+quiz+'/questions/'+questionId+'/submissions/').doc(groupId).set(
  		{answer: answer}
  	)
  }
}
