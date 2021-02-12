import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-navigation-top-bar',
  templateUrl: './navigation-top-bar.component.html',
  styleUrls: ['./navigation-top-bar.component.scss']
})
export class NavigationTopBarComponent {

  @Input() isLoggedIn: boolean;
  @Input() userName: string;

  @Output() action: EventEmitter<string> = new EventEmitter();

  constructor(){}

  fireAction($event: string){
    this.action.emit($event);
  }
}
