import { Component, OnInit } from '@angular/core';
import { Quiz, QuizService } from 'src/app/quiz.service';
import { MenuItem, Pub, PubService } from 'src/app/pub.service';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-pub',
  templateUrl: './pub.component.html',
  styleUrls: ['./pub.component.css']
})
export class PubComponent implements OnInit {

  pub: Observable<Pub>;
  quizzes: Observable<Quiz[]>;
  menu: Observable<MenuItem[]>;

  showAddMenuItem: boolean;
  newItemName: string;

  newItem: MenuItem;

  barId: string;

  constructor(
    private route: ActivatedRoute,
    private quizService: QuizService,
    private pubService: PubService
  ) {
    this.newItem = new MenuItem();

  }

  ngOnInit(): void {
    this.barId = this.route.snapshot.paramMap.get('name');

    this.quizzes = this.quizService.getQuizzes();
    this.menu = this.pubService.getMenuItems(this.barId);

  }


  clickAddNewItem(): void {
    this.showAddMenuItem = true;
    this.newItem = new MenuItem();
  }

  clickSaveNewItem(): void {
    this.showAddMenuItem = false;
    this.newItem.id = this.newItem.name;
    this.pubService.addMenuItem(this.barId, this.newItem)
  }

  clickDeleteItem(item: MenuItem): void {
    this.pubService.deleteMenuItem(this.barId, item);
  }


}
