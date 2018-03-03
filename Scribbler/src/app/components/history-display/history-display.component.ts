import { Component, OnInit } from '@angular/core';
import { CanvasHistoryService, CanvasHistoryObject }  from '../../services/canvashistory.service'
import { ArrayReversePipe } from '../../pipes/array-reverse.pipe'

@Component({
  selector: 'app-history-display',
  templateUrl: './history-display.component.html',
  styleUrls: ['./history-display.component.css']
})
export class HistoryDisplayComponent implements OnInit {

  constructor(private history: CanvasHistoryService) { }
  currentHistory : CanvasHistoryObject[];

  ngOnInit() {
    this.update();
  }

  getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  public update() {
    this.currentHistory = this.history.getHistory();
  }

}
