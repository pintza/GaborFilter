import {
  Component,
  Input,
  ElementRef,
  AfterViewInit,
  ViewChild,
  OnInit,
  OnChanges, SimpleChanges, SimpleChange
} from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/pairwise';
import 'rxjs/add/operator/switchMap';

import { CanvasHistoryService, CanvasHistoryObject }  from '../../services/canvashistory.service'
import { ActionDeciderServiceService }                from '../../services/actiondeciderservice.service'
import { ImageProcessorService }                      from '../../services/image-processor.service'


@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})

export class CanvasComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('canvas')       public canvas: ElementRef;
  @ViewChild('imagebrowser') public imageBrowser: ElementRef;

  @Input() canvasMessage: string;
  @Input() public width = 720;
  @Input() public height = 400;

  private cx: CanvasRenderingContext2D;

  path            : any[];
  historyList     : any[];
  drag            : boolean;
  processedImage  : ImageBitmap;

  constructor(private history : CanvasHistoryService,
              private currentAction: ActionDeciderServiceService,
              private imageProcessor: ImageProcessorService) {

  }

  ngOnInit() {
    this.path = [];
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (!changes.canvasMessage) {
      return;
    }

    // Send to handler.
    this.observeMessage(changes.canvasMessage.currentValue);
  }


  public ngAfterViewInit() {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;

    this.cx = canvasEl.getContext('2d');

    canvasEl.width = this.width;
    canvasEl.height = this.height;
    canvasEl.style.border = "1px solid black";

    this.cx.lineWidth = 3;
    this.cx.lineCap = 'round';
    this.cx.strokeStyle = '#000';

    this.captureCanvasEvents(canvasEl);

    const imageFileBrowser : HTMLInputElement = this.imageBrowser.nativeElement;
    this.captureFileEvents(imageFileBrowser);
  }


  /**
   * Handle commands from other modules.
   **/
  private observeMessage(message) {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;

    if (message == 'grayscale') {
      let grayscaled = this.imageProcessor.grayscale(this.cx, canvasEl.width, canvasEl.height);
      this.cx.clearRect(0,0, canvasEl.width, canvasEl.height)
      this.cx.putImageData(grayscaled, 0, 0);
      this.history.addHistory({
        path: [],
        action: 'grayscale',
        image: canvasEl.toDataURL()
      })
    }
    if (message == 'redo') {
      let historyItem = this.history.redo(1);
      this.restoreHistory(historyItem);
    }
    if (message == 'undo') {
      let historyItem = this.history.undo(1);
      this.restoreHistory(historyItem);
    }
  }

  /**
   * Handle file events - image selected and uploaded.
   */
  private captureFileEvents(imageFileBrowser : HTMLInputElement) {
    if (!this.cx) {
      // No canvas!
      return;
    }

    Observable
      .fromEvent(imageFileBrowser, 'change')
      .subscribe((event : any) => {

        const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
        var reader = new FileReader();
        reader.onload = (loadEvent : any) => {
            var img = new Image();
            img.onload = () => {
              canvasEl.width = img.width;
              canvasEl.height = img.height;
              this.cx.drawImage(img, 0, 0);
              // Add an empty path to history [for undo/redo]
              let saved : CanvasHistoryObject = {
                path: [],
                action: 'upload',
                image: canvasEl.toDataURL()
              };
              this.history.reset();
              this.history.addHistory(saved);
            }
            img.src = loadEvent.target.result;

        }
        reader.readAsDataURL(event.target.files[0]);
      });
  }

  private captureCanvasEvents(canvasEl: HTMLCanvasElement) {
    const stopEvent = Observable.merge(
      Observable.fromEvent(canvasEl, 'mouseup'),
      Observable.fromEvent(canvasEl, 'mouseleave')
    );
    Observable
      .fromEvent(canvasEl, 'mousedown')
      .switchMap((e) => {
        return Observable
          .fromEvent(canvasEl, 'mousemove')
          .takeUntil(stopEvent)
          .pairwise();
      })
      .subscribe((res: [MouseEvent, MouseEvent]) => {
        const rect = canvasEl.getBoundingClientRect();

        const prevPos = {
          x: res[0].clientX - rect.left,
          y: res[0].clientY - rect.top
        };

        const currentPos = {
          x: res[1].clientX - rect.left,
          y: res[1].clientY - rect.top
        };
        this.path.push({from: prevPos, to: currentPos});
        this.drawOnCanvas(prevPos, currentPos);
      });
      stopEvent
      .subscribe((res: [MouseEvent, MouseEvent]) => {

        if (!this.path.length) {
          // Ignore empty paths.
          return;
        }

        let item : CanvasHistoryObject = {
          path:   this.path,
          action: this.currentAction.getAction(),
          image:  canvasEl.toDataURL()
        };

        // Add to history list.
        this.history.addHistory(item);
        // Clear path for next run.
        this.path = [];
      });
  }


  // Redraw an existing history item.
  public restoreHistory(item : CanvasHistoryObject) {
    let canvasEl : HTMLCanvasElement = this.canvas.nativeElement;
    var image = new Image();

    // When we have the image, draw it on the canvas.
    image.onload = () => {
      Promise.all(
        [createImageBitmap(image, 0, 0, canvasEl.width, canvasEl.height)],
      ).then((loadedImage) => {
        this.drawPicture(loadedImage[0]);
      })
    };

    // Load the history image.
    image.src = item.image;
  }

  private drawPicture(image : ImageBitmap) {
    if (!this.cx) {
      // No canvas context!
      return;
    }
    let canvasEl :HTMLCanvasElement = this.canvas.nativeElement;
    this.cx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    this.cx.drawImage(image, 0,0);
  }

  private drawOnCanvas(prevPos: { x: number, y: number }, currentPos: { x: number, y: number }) {
    if (!this.cx) { return; }
    this.cx.beginPath();

    var getRandomColor = () => {
      var letters = '0123456789ABCDEF';
      var color = '#';
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    };

    if (prevPos) {
      this.cx.moveTo(prevPos.x, prevPos.y);
      this.cx.lineTo(currentPos.x, currentPos.y);
      this.cx.strokeStyle = getRandomColor();
      this.cx.stroke();
    }
  }
}
