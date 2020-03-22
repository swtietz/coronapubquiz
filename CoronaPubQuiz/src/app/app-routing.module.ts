import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuizComponent } from './pages/quiz/quiz.component';
import { AppComponent } from './app.component';
import { PubComponent } from './pages/pub/pub.component';
import { LoginComponent } from './pages/login/login.component';
import { CreatorComponent } from './pages/creator/creator.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';

//import {HasnameGuard} from './guards/hasname.guard';

//import { AngularFireAuthGuard, isNotAnonymous, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

//const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(["login"]);

const routes: Routes = [
  { path: 'bar/login', component: LoginComponent },
  { path: 'bar/:name/create', component: CreatorComponent },
  { path: 'bar/:name/:quizname/:groupname/welcome', component: WelcomeComponent },  
  { path: 'bar/:name/:quizname', component: QuizComponent},

  { path: 'bar/:name', component: PubComponent },
  

  { path: 'login', component: WelcomeComponent },  
  { path: '', component: AppComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
