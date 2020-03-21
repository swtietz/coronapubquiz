import { Injectable } from '@angular/core';

import { Observable, of, pipe } from 'rxjs';
import { map} from 'rxjs/operators';

import { AngularFirestore } from '@angular/fire/firestore';

import 'firebase/firestore';


export class Pub{
  id: string;
  name: string;
}

export class MenuItem{
  id: string;
  name: string;
  price: number;
}


@Injectable({
  providedIn: 'root'
})
export class PubService {




  firestore: AngularFirestore

  constructor(firestore: AngularFirestore) { 
  	this.firestore = firestore;
    

  	let pub = new Pub();
  	pub.id = 'FreyaFuchs'
  	pub.name = 'Freya Fuchs'
  	this.addPub(pub)

  	let item = new MenuItem();
  	item.id = 'Bier'
  	item.price = 1.0
  	item.name = 'Bier'
  	this.addMenuItem(pub.id, item)

  }



  addPub(pub:Pub): void {
  	this.firestore.collection<Pub>('/pubs').doc(pub.id).set(Object.assign({}, pub))
  }


  addMenuItem(pubId, menuItem:MenuItem): void {
  	this.firestore.collection<Pub>('/pubs/'+pubId+'/menu').doc(menuItem.id).set(Object.assign({}, menuItem))
  }

  deleteMenuItem(pubId, menuItem:MenuItem): void {
  	this.firestore.collection<Pub>('/pubs/'+pubId+'/menu').doc(menuItem.id).delete()
  }

  getMenuItems(pubId): Observable<MenuItem[]> {
  	let menu$ = this.firestore.collection('pubs/'+pubId+'/menu').snapshotChanges()
	    .pipe(map(actions => {
		  return actions.map(a => {
		    const data = a.payload.doc.data() as MenuItem;
		    const id = a.payload.doc.id;
		    return { id, ...data } as MenuItem;
		  });
		}));
	return menu$
  }

}
