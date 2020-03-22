import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { environment } from '../environments/environment';
import { QuizComponent } from './pages/quiz/quiz.component';
import { PubComponent } from './pages/pub/pub.component';

import { LoginComponent } from './pages/login/login.component';
import { CreatorComponent } from './pages/creator/creator.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { LobbyComponent } from './pages/lobby/lobby.component';
import { ResultComponent } from './pages/result/result.component';

//import {HasnameGuard } from './guards/hasname.guard'

@NgModule({
  declarations: [
    AppComponent,
    QuizComponent,
    PubComponent,
    LoginComponent,
    CreatorComponent,
    WelcomeComponent,
    LobbyComponent,
    ResultComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    NgbModule,
    FormsModule
  ],
  providers: [
    //HasnameGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
