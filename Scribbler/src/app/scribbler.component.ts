import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/take';

@Component({
  selector:     'app-root',
  templateUrl:  './scribbler.component.html',
  styleUrls:   ['./scribbler.component.css']
})
export class ScribblerComponent implements AfterViewInit {
  @ViewChild('undo')      public undoButton:      ElementRef;
  @ViewChild('redo')      public redoButton:      ElementRef;
  @ViewChild('grayscale') public grayscaleButton: ElementRef;

  title = 'Scribbler';
  canvasMessage : string = '';

  constructor() {

  }

  public ngAfterViewInit() {
    const undoButton = this.undoButton.nativeElement;
    const redoButton = this.redoButton.nativeElement;
    const grayscaleButton = this.grayscaleButton.nativeElement;

    Observable
    .fromEvent(grayscaleButton, 'click')
    .subscribe((event) => {
      this.changeMessage('grayscale');
    });

    Observable
    .fromEvent(redoButton, 'click')
    .subscribe((event) => {
      this.changeMessage('redo');
    });

    Observable
    .fromEvent(undoButton, 'click')
    .subscribe((event) => {
      this.changeMessage('undo');
    });
  }

  private changeMessage(message) {
    this.canvasMessage = message;
    Observable
    .interval(10)
    .take(1)
    .subscribe(() => {
      this.canvasMessage = '';
    });
  }

}
