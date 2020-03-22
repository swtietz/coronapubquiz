import { Router, ActivatedRoute } from '@angular/router';

import { Component, OnInit } from '@angular/core';

import { QuizService, Question } from '../../quiz.service'
import { PubService } from 'src/app/pub.service';

import { Observable } from 'rxjs';

import { AuthenticationService } from 'src/app/authentication.service'

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})

export class QuizComponent implements OnInit {

  questions: Observable<Question[]>;
  bar: string;
  quiz: string;

  constructor(
    private authService:AuthenticationService,
    private route: ActivatedRoute,
    private quizService: QuizService,
    public pubService: PubService,
    private router: Router,
              ) {}

  ngOnInit(): void {
    this.bar = this.route.snapshot.paramMap.get('name');
    this.quiz = this.route.snapshot.paramMap.get('quizname');
    this.questions = this.quizService.getQuestions(this.bar, this.quiz);

    
    this.authService.user$.subscribe((user) => { 
      console.log('user in guard', user)
      if(!user){
        this.router.navigate(['/bar/'+this.bar+'/'+this.quiz+'/'+'group1'+'/welcome']);
      }else{
        this.router.navigate(['/bar/'+this.bar+'/'+this.quiz]);
      }
    })


  }
  


  submit(question, answer) {
    this.quizService.addSubmission(this.bar, this.quiz, question.id, "2bgXVXpdMOZhoFSsejLU", answer)
  }

  nextQuestion(question) {
    this.quizService.setQuestionActive(this.bar, this.quiz, question.id, false)
    this.questions.subscribe(questions => {
      const next_question = questions.find(q=>q.index === question.index+1)
      this.quizService.setQuestionActive(this.bar, this.quiz, next_question.id, true)
    })
  }
}