import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatRadioModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TrainOutput } from 'src/app/shared/interfaces';
const brain = require("brain.js");

@Component({
  selector: 'app-number',
  standalone: true,
  imports: [CommonModule, FormsModule, MatRadioModule, MatButtonModule, ReactiveFormsModule ],
  templateUrl: './number.component.html',
  styleUrls: ['./number.component.scss']
})
export class NumberComponent {

  public numbers: { key: string; value: number; }[] = [
      { key: 'Zero', value: 0 },
      { key: 'One', value: 1 },
      { key: 'Two', value: 2 },
      { key: 'Three', value: 3 },
      { key: 'Four', value: 4 },
      { key: 'Five', value: 5 },
      { key: 'Six', value: 6 },
      { key: 'Seven', value: 7 },
      { key: 'Eight', value: 8 },
      { key: 'Nine', value: 9 }
  ]

  private output = {
    Zero: 0,
    One: 0,
    Two: 0,
    Three: 0,
    Four: 0,
    Five: 0,
    Six: 0,
    Seven: 0,
    Eight: 0,
    Nine: 0,
  } 

  public chousenNumber!: number;

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

  private ctx!: CanvasRenderingContext2D;
  private canvasElement!: HTMLCanvasElement;

  private pixel = 20;
  private is_mouse_down = false;

  /* vector: any[] = []; */
  private net!: any/* NeuralNetwork<INeuralNetworkData, INeuralNetworkData> */;
  private train_data: any[] = [];

  public onClear(): void {
    this.clear();
  }

  public onTrain(): void {
    const vector: any[] = this.calculate(true);
    console.log(this.chousenNumber)

    /* this.numbers.keys()
    let output = this.numbers.reduce((result, item) => {
      const property = item.key;
      result[property] = this.chousenNumber === item.value ? 1 : 0
      return result;
    }, {}); */

    const locOutput = {...this.output};
    (locOutput as any)[this.chousenNumber] = 1;

    this.train_data.push({
      input: vector,
      output: locOutput
    });

    console.log(this.train_data);
  }

  public onResponce(): void {
    this.net = new brain.NeuralNetwork();
    this.net.train(this.train_data);

    const result = brain.likely(this.calculate(), this.net);
    alert(result);
  }

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
