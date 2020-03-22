import { Router, ActivatedRoute } from '@angular/router';

import { ElementRef, ViewChild, Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';

import { GroupService, Group } from 'src/app/group.service'
import { AuthenticationService } from '../../authentication.service'
import { QuizService, Question, Submission, Order } from '../../quiz.service'
import { PubService } from 'src/app/pub.service';

import { Observable } from 'rxjs';


import { flatMap, map } from 'rxjs/operators';


import { AngularFireDatabase } from '@angular/fire/database';
import 'firebase/database';


@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {

  bar: string;
  quiz: string;
  groupId: string;

  groups$: Observable<Group[]>
  questions$: Observable<Question[]>
  submissions$: Observable<Submission[]>
  orders: string[]
  orderCounts: string;
  paymentAmount: number;
  barPaymentLink: string;



  constructor(    

    private groupService: GroupService,
  	private authService:AuthenticationService,
    private route: ActivatedRoute,
    private quizService: QuizService,
    public pubService: PubService,
    private router: Router,
    private db: AngularFireDatabase) { 
    this.bar = this.route.snapshot.paramMap.get('name');
    this.quiz = this.route.snapshot.paramMap.get('quizname');
    this.groupId = this.route.snapshot.paramMap.get('groupname');


    this.groups$ = this.groupService.getGroupsWithId(this.bar, this.quiz)

    this.questions$ = this.quizService.getQuestions(this.bar, this.quiz);

    this.questions$.subscribe((qs) => {
    	console.log('qs:',qs)
    })


    this.submissions$ = this.quizService.getSubmissions(this.bar, this.quiz);

    
    this.submissions$.subscribe((qs) => {
      console.log('subs:',qs)
    })

    this.pubService.getPub(this.bar).subscribe(b=>this.barPaymentLink = b.paymentLink)

    this.quizService.getOrders(this.bar, this.quiz).subscribe(orders=>{
      console.log('orders', orders)
      var user = this.authService.getUser();
      this.orders = orders.filter(o => (o.user === user.uid)).map(o=>o.drink)//.reduce((str, x) => str + " " + x, "")
      var counts = this.orders.reduce((b,c)=>((b[b.findIndex(d=>d.el===c)]||b[b.push({el:c,count:0})-1]).count++,b),[])
      console.log(counts)
      this.orderCounts = counts.reduce((b, c)=> c.el + "⨉" + c.count + "  " + b, "")
      console.log(this.orderCounts)

      pubService.getMenuItems(this.bar).subscribe(menu=>{
        this.paymentAmount = orders.filter(o => (o.user === user.uid)).map(o=> menu.find(i => i.name === o.drink)).filter(Boolean).reduce((sum, x)=> sum+x.price, 0);
      })
      console.log('sum', this.orders)
    })




  }

  ngOnInit(): void {
  }


}
