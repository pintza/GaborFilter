import { Injectable } from '@angular/core';

@Injectable()
export class ImageProcessorService {

    constructor() {
    }

    // private getPixel(x :number, y: number, height) : CanvasPixel {
    //   let index = (y * height + x) * 4;
    //   let data = this.pixels.data;
    //   return {
    //     x: x,
    //     y: y,
    //     red: data[index],
    //     green: data[index + 1],
    //     blue: data[index + 2],
    //     alpha: data[index + 3]
    //   }
    // }

    public applyToAll(filter : any) {

    }

    public grayscale(image : CanvasRenderingContext2D, width, height) : ImageData {
      console.log("grayscaling");
      var pixels = image.getImageData(0, 0, width, height);
      var d = pixels.data;
      for (var i=0; i<d.length; i+=4) {
        var r = d[i];
        var g = d[i+1];
        var b = d[i+2];
        // CIE luminance for the RGB
        // The human eye is bad at seeing red and blue, so we de-emphasize them.
        var v = 0.2126*r + 0.7152*g + 0.0722*b;
        d[i] = d[i+1] = d[i+2] = v
      }
      return pixels;
    }
}

export class CanvasPixel {
  x : number;
  y : number;
  red : number;
  green : number;
  blue : number;
  alpha : number;
}
