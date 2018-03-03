import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'canvas#image-displayer',
  templateUrl: './scribbler.component.html',
  styleUrls: ['./scribbler.component.css']
})


export class LogoComponent implements OnInit {
	@ViewChild('imageCanvas') canvasRef: ElementRef;

	ngOnInit() {}
}
