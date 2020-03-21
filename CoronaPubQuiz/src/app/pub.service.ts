import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

import 'firebase/firestore';


@Injectable({
  providedIn: 'root'
})
export class PubService {


  pubs: Observable<any[]>;


  constructor(firestore: AngularFirestore) { 
    this.pubs = firestore.collection('pubs').valueChanges();
  }
}
