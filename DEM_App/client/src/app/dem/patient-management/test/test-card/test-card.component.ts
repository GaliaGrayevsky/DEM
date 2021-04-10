import { Component, OnInit, Input } from '@angular/core';
import { COLORS } from 'src/app/core/domain/constants';
import { HORIZONTAL_TRANSCRIPT, HORIZONTAL_TRANSCRIPT_X, VERTICAL_A_TRANSCRIPT_DISPLAY, VERTICAL_B_TRANSCRIPT_DISPLAY } from '../../../../util/lev-dem.util';

@Component({
  selector: 'app-test-card',
  templateUrl: './test-card.component.html',
  styleUrls: ['./test-card.component.scss']
})
export class TestCardComponent implements OnInit {

  @Input() card_type:string;
  @Input() mistakes: any[] = []; 
  sentence: string[] = [];
  mistakes_marks: any = {};
  map_C_positions: any;


  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {

    let tmp:string;
    let adj: boolean = true;
    this.mistakes_marks = {};

    switch (this.card_type) {
      case 'A':
        tmp = VERTICAL_A_TRANSCRIPT_DISPLAY;
        break;
      case 'B':
        tmp = VERTICAL_B_TRANSCRIPT_DISPLAY;
        break;
    
      default:
        tmp = HORIZONTAL_TRANSCRIPT_X;
        adj = false;
        break;
    }

    if (!this.map_C_positions) {

      this.map_C_positions = {};
      let i:number = 0;
      let c:number = 0;

      for (let i = 0; i < HORIZONTAL_TRANSCRIPT_X.length; i++) {
        if (HORIZONTAL_TRANSCRIPT_X[i] != 'x'){
          this.map_C_positions[c] = i;
          c += 1;
        }
      }
    }
    console.log(this.map_C_positions);

    this.sentence = tmp.split("");

    for (let i= 0; i < this.mistakes.length; i++) {
      let tmp = this.mistakes[i];
      switch (tmp[0]) {
        case 'insert': 
          this.mistakes_marks[this.getIndex(tmp[1], adj)] = {color: COLORS.INSERT, tooltip: tmp};
          break;
        case 'replace': 
          this.mistakes_marks[this.getIndex(tmp[1], adj)] = {color: COLORS.REPLACE, tooltip: tmp};
          break;
        case 'delete': 
          this.mistakes_marks[this.getIndex(tmp[1], adj)] = {color: COLORS.DELETE, tooltip: tmp};
          break;
        case 'transpose': 
          this.mistakes_marks[this.getIndex(tmp[1], adj)] = {color: COLORS.TRANSPOSE, tooltip: tmp};
          this.mistakes_marks[this.getIndex(tmp[2], adj)] = {color: COLORS.TRANSPOSE, tooltip: tmp};
          break;
      }
    }

    console.log(this.mistakes_marks);
  }

  private getIndex(i:number, adj: boolean): number {
    let ind: number = i;

    if (adj){
      ind = (i % 20)*2 + Math.floor(i/20);
    } else {
      ind = this.map_C_positions[i];
    }

    console.log(ind);
    return ind;
  }

  highLight(event$): void {
    console.log(event$);
  }
}
