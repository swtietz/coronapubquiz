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






@NgModule({
  declarations: [
    AppComponent,
    QuizComponent,
    PubComponent,
    LoginComponent
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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
