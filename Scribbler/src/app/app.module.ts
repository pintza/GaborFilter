import { BrowserModule }               from '@angular/platform-browser';
import { NgModule }                    from '@angular/core';
import { NgbModule }                   from '@ng-bootstrap/ng-bootstrap';

import { ScribblerComponent }          from './scribbler.component';
import { CanvasComponent }             from './components/canvas/canvas.component';
import { CanvasHistoryService}         from './services/canvashistory.service'
import { ActionDeciderServiceService } from './services/actiondeciderservice.service';
import { HistoryDisplayComponent }     from './components/history-display/history-display.component'
import { ImageProcessorService }       from './services/image-processor.service';
import { ArrayReversePipe } from './pipes/array-reverse.pipe'

@NgModule({
  declarations: [
    ScribblerComponent,
    CanvasComponent,
    HistoryDisplayComponent,
    ArrayReversePipe
  ],
  imports: [
    NgbModule.forRoot(),
    BrowserModule
  ],
  providers: [
    CanvasHistoryService,
    ActionDeciderServiceService,
    ImageProcessorService
  ],
  bootstrap: [
    ScribblerComponent
  ]
})
export class AppModule { }
