import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuizComponent } from './pages/quiz/quiz.component';
import { AppComponent } from './app.component';
import { PubComponent } from './pages/pub/pub.component';


const routes: Routes = [
  { path: 'bar/:name/:quizname', component: QuizComponent },
  { path: 'bar/:name', component: PubComponent },
  { path: '', component: AppComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
