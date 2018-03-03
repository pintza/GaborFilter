/**
  * Holds current action selected by the user.
  */
import { Injectable } from '@angular/core';

@Injectable()
export class ActionDeciderServiceService {

  private currentAction : string;

  constructor() {
    this.currentAction = 'scribble';
  }

  public getAction() {
      return this.currentAction;
  }

  public setAction(action : string) {
    const validActions = [
      'scribble', 'direction'
    ];

    if (validActions.indexOf(action) != -1) {
      // Filter out other values.
      this.currentAction = action;
    }
  }
}
