import { Injectable } from '@angular/core';

import { Observable, of, pipe } from 'rxjs';
import { map, switchMap, combineLatest, flatMap, take} from 'rxjs/operators';

import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore';


export class Submission{
  answer:string;
  quizId: string;
  groupId:string;
  questionId:string

}

export class Quiz{
  name: string;
  id: any
  complete: boolean = false;
}

export class Order{
  drink: string;
  user: string;
  group: string;
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
  submissions:any[]
}


@Injectable({
  providedIn: 'root'
})
export class QuizService {
  quizzes$: Observable<Quiz[]>;
  questions$: Observable<Question[]>;

  bar: string;
  quiz: string;

  constructor(private firestore: AngularFirestore) {}


  setComplete(bar, quiz){
    this.firestore.doc<Quiz>('pubs/'+bar+'/quizzes/'+quiz).update({complete: true})
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
                    questions.submissions = b.submissions;
                    
                    console.log(questions);
                    return questions;
                });
            }));
    return questions$
  }




  getQuizzes(bar): Observable<Quiz[]> {
    this.quizzes$ = this.firestore.collection('pubs').doc(bar).collection('quizzes').snapshotChanges()
    		      .pipe(map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as Quiz;
            const id = a.payload.doc.id;
            return { id, ...data } as Quiz;
          });
          }))
    return this.quizzes$
  }

  getQuizByName(barId, quizName): Observable<any[]> {
    console.log(barId, quizName)
    return this.firestore.collection('pubs').doc(barId).collection('quizzes', ref => ref.where('name', '==', quizName)).valueChanges()
  }

  getQuiz(barId, quizId): Observable<Quiz> {
    console.log(barId, quizId)
    return this.firestore.collection('pubs').doc(barId).collection('quizzes').doc<Quiz>(quizId)
    		.valueChanges()
  }

  getQuestions(bar, quiz): Observable<Question[]> {
    this.questions$ = this.loadQuestionsWithID(bar, quiz)
    //this.questions$.subscribe(console.log);
    return this.questions$
  }

  orderDrink(bar, quiz, user, group, drink) {
    console.log(drink, group)
    const orderId = this.firestore.createId()
    this.firestore.collection('pubs/'+bar+'/quizzes/'+quiz+'/orders/').doc(orderId).set({
      user: user.uid,
      drink: drink,
      group: group
    })
  }

  getOrders(bar, quiz): Observable<Order[]> {
    const orderId = this.firestore.createId()
    return this.firestore.collection<Order>('pubs/'+bar+'/quizzes/'+quiz+'/orders/').valueChanges()
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

  addQuiz(barId, quizName): string {
    const quizId = this.firestore.createId()
  	let quizzes = this.firestore.collection<Quiz>('pubs/'+barId+'/quizzes/').doc(quizId).set({
	    name: quizName,
    })
    return quizId
  }

  addQuestion(bar, quiz, question:Question): void {
  	this.firestore.collection<Question>('pubs/'+bar+'/quizzes/'+quiz+'/questions').doc(this.firestore.createId()).set(Object.assign({}, question))
  }

  

  getSubmissions(bar, quiz): Observable<Submission[]>{
    return this.firestore.collection<Submission>('pubs/'+bar+'/quizzes/'+quiz+'/submissions').valueChanges();
  }

  /*
  getSubmission(bar, quiz, group, question, ): Observable<Submission>{
    return this.firestore.doc<Submission>('pubs/'+bar+'/quizzes/'+quiz+'/questions/'+question+'/submissions/'+group).valueChanges()
  }
  */


  addSubmission(bar, quiz, questionId, groupId, answer): void {
    console.log('Adding submission', groupId+questionId)
  	this.firestore.collection<Submission>('pubs/'+bar+'/quizzes/'+quiz+'/submissions/').doc(groupId+'_'+questionId).set(Object.assign({}, {answer: answer,
        barId: bar,
        quizId: quiz,
        groupId: groupId,
        questionId:questionId
      }))
  		
  	
  }


  async resetQuiz(bar, quiz,): Promise<any> {


    this.getQuestions(bar, quiz).pipe(take(1)).subscribe(
      (questions:Question[]) => {
        questions.map((question:Question) => {
          this.setQuestionActive(bar, quiz, question.id, question.index == 0)
        })
        this.firestore.doc<Quiz>('pubs/'+bar+'/quizzes/'+quiz).update({complete: false})
      }
    )

    const qry = await this.firestore.collection<Submission>('pubs/'+bar+'/quizzes/'+quiz+'/submissions').ref.get();
    qry.forEach(doc => {
      doc.ref.delete();
    });

    const qry_order = await this.firestore.collection<Order>('pubs/'+bar+'/quizzes/'+quiz+'/orders').ref.get();
    qry_order.forEach(doc => {
      doc.ref.delete();
    });
    
  }


}
