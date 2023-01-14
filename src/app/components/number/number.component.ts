import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CanvasService } from 'src/app/services/canvas.service';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import {MatRadioModule} from '@angular/material/radio';
const brain = require('brain.js');

@Component({
  selector: 'app-number',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatRadioModule,
    MatButtonModule,
    MatNativeDateModule,
    ReactiveFormsModule,
  ],
  templateUrl: './number.component.html',
  styleUrls: ['./number.component.scss'],
})
export class NumberComponent {
  public numbers: { key: string; value: number }[] = [
    { key: 'Zero', value: 0 },
    { key: 'One', value: 1 },
    { key: 'Two', value: 2 },
    { key: 'Three', value: 3 },
    { key: 'Four', value: 4 },
    { key: 'Five', value: 5 },
    { key: 'Six', value: 6 },
    { key: 'Seven', value: 7 },
    { key: 'Eight', value: 8 },
    { key: 'Nine', value: 9 },
  ];

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
  };

  public chousenNumber!: number;

  @ViewChild('canv') canv!: ElementRef<HTMLCanvasElement>;

  @HostListener('mousedown') onMouseDown() {
    this.canvasService.onMouseDown();
  }

  @HostListener('mouseup') onMouseUp() {
    this.canvasService.onMouseUp();
  }

  @HostListener('mousemove', ['$event']) onMouseMove(event: MouseEvent) {
    this.canvasService.onMouseMove(event);
  }

  private net!: any;
  private train_data: any[] = [];

  constructor(private canvasService: CanvasService) {}

  public onClear(): void {
    this.canvasService.clear();
  }

  public ngAfterViewInit(): void {
    this.canvasService.setCanvasElement(this.canv.nativeElement);
  }

  public onTrain(): void {
    const vector: any[] = this.canvasService.calculate(true);

    const locOutput = { ...this.output };
    (locOutput as any)[this.chousenNumber] = 1;

    this.train_data.push({
      input: vector,
      output: locOutput,
    });

    console.log(this.train_data);
  }

  public onResponce(): void {
    this.net = new brain.NeuralNetwork();
    this.net.train(this.train_data);

    const result = brain.likely(this.canvasService.calculate(), this.net);
    alert(result);
  }
}
