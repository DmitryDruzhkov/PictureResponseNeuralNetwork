import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { TrainOutput } from './shared/interfaces';
const brain = require("brain.js");

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('canv') canv!: ElementRef<HTMLCanvasElement>;

  @HostListener('mousedown') onMouseDown() {
    this.is_mouse_down = true;
    this.ctx.beginPath();
  }

  @HostListener('mouseup') onMouseUp() {
    this.is_mouse_down = false;
  }

  @HostListener('mousemove', ['$event']) onMouseMove(event: MouseEvent) {
    if (this.is_mouse_down) {
      this.ctx.fillStyle = 'red';
      this.ctx.strokeStyle = 'red';
      this.ctx.lineWidth = this.pixel;

      this.ctx.lineTo(event.offsetX, event.offsetY);
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.arc(event.offsetX, event.offsetY, this.pixel / 2, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.beginPath();
      this.ctx.moveTo(event.offsetX, event.offsetY);
    }
  }

  @HostListener('document:keydown', ['$event']) onKeydown(event: KeyboardEvent) {
    console.log(event);

    if (event.key.toLowerCase() == 'c') {
      this.clear();
    }

    if (event.key.toLowerCase() == 'v') {
      const vector: any[] = this.calculate(true);
      let output: TrainOutput = { negative: 1 };

      if (confirm('Positive?')) {
        output = { positove: 1 };
      } 

      this.train_data.push({
        input: vector,
        output
      });

      console.log(this.train_data);
    }

    if (event.key.toLowerCase() == 'b') {
      this.net = new brain.NeuralNetwork();
      this.net.train(this.train_data);

      const result = brain.likely(this.calculate(), this.net);
      alert(result);
    }
  }

  ctx!: CanvasRenderingContext2D;
  canvasElement!: HTMLCanvasElement;

  pixel = 20;
  is_mouse_down = false;

  /* vector: any[] = []; */
  net!: any/* NeuralNetwork<INeuralNetworkData, INeuralNetworkData> */;
  train_data: any[] = [];

  public ngAfterViewInit(): void {
    this.canvasElement = this.canv.nativeElement;
    this.ctx = this.canvasElement.getContext('2d') as CanvasRenderingContext2D;
    this.dCanvas();
    /* this.drawGrid(); */
  }

  private dCanvas(): void {
    this.canvasElement.width = 500;
    this.canvasElement.height = 500;
  }

  private drawLine(x1: number, y1: number, x2: number, y2: number, color = 'gray'): void {
    this.ctx.beginPath();
    this.ctx.strokeStyle = color;
    this.ctx.lineJoin = 'miter';
    this.ctx.lineWidth = 1;
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
  }

  private drawCell(x: number, y: number, w: number, h: number): void {
    this.ctx.fillStyle = 'blue';
    this.ctx.strokeStyle = 'blue';
    this.ctx.lineJoin = 'miter';
    this.ctx.lineWidth = 1;
    this.ctx.rect(x, y, w, h);
    this.ctx.fill();
  }

  private drawGrid(): void {
    const w = this.canvasElement.width;
    const h = this.canvasElement.height;
    const p = w / this.pixel;

    const xStep = w / p;
    const yStep = h / p;

    for (let x = 0; x < w; x += xStep) {
      this.drawLine(x, 0, x, h);
    }

    for (let y = 0; y < w; y += yStep) {
      this.drawLine(0, y, w, y);
    }
  }

  private clear(): void {
    this.ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
  }

  private calculate(draw = false): number[] {
    const w = this.canvasElement.width;
    const h = this.canvasElement.height;
    const p = w / this.pixel;

    const xStep = w / p;
    const yStep = h / p;

    const vector: number[] = [];
    let __draw = [];

    for (let x = 0; x < w; x += xStep) {
      for (let y = 0; y < h; y += yStep) {
        const data = this.ctx.getImageData(x, y, xStep, yStep);

        let nonEmptyPixelsCount = 0;
        for (let i = 0; i < data.data.length; i += 10) {
          const isEmpty = data.data[i] == 0;

          if (!isEmpty) {
            nonEmptyPixelsCount += 1;
          }
        }

        if (nonEmptyPixelsCount > 1 && draw) {
          __draw.push([x, y, xStep, yStep]);
        }

        vector.push(nonEmptyPixelsCount > 1 ? 1 : 0);
      }
    }

    if (draw) {
      this.clear();
      this.drawGrid();

      for (let _d in __draw) {
        this.drawCell(__draw[_d][0], __draw[_d][1], __draw[_d][2], __draw[_d][3])
      }
    }

    return vector;
  }
}
