/**
 * Holds canvas action history.
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class CanvasHistoryService {
  private historyList: CanvasHistoryObject[];
  private currentIndex: number;
  private historyAction = new Subject<any>();

  constructor() {
    this.reset();
  }

  public addHistory(item: CanvasHistoryObject) {
      // Overwrite history.
      this.historyList.length = this.currentIndex + 1;
      this.historyList.push(item);
      this.currentIndex++;
      console.log(this.getJSON());
  }

  public getCurrent() {
    return this.historyList[this.currentIndex];
  }

  public getHistory() {
    return this.historyList;
  }

  public reset() {
    this.historyList = [];
    this.currentIndex = -1;
  }

  /**
   * Redos  X steps.
   **/
  public redo(steps : number) {
    if (this.currentIndex + steps < this.historyList.length) {
      this.currentIndex += steps;
    }
    return this.getCurrent();
  }
  /**
   * Goes back X steps.
   **/
  public undo(steps : number) {
    if (this.currentIndex - steps > -1) {
      this.currentIndex -= steps;
    }
    return this.getCurrent();
  }


  public getJSON() {
    var foreground = [];
    // Not sure what to generate here.
    var background = [];
    var currentPath = [];

    for (var index = 0; index < this.historyList.length; index ++) {
      currentPath = this.historyList[index].path;
      for (var pathIndex = 0; pathIndex < currentPath.length; pathIndex++) {
        var currentCoordinates = currentPath[pathIndex];
        var added = {
          cor: {
            x: currentCoordinates.to.x,
            y: currentCoordinates.to.y
          }
        };
        foreground.push(added);
      }
    }

    return JSON.stringify({
      fore: [foreground],
      back: [background]
    });
  }
}

export class CanvasHistoryObject {
  path: any[];
  action: string;
  image: any;
}
