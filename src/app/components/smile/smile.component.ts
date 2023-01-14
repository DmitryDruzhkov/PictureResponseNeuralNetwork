import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material';
import { CanvasService } from 'src/app/services/canvas.service';
import { TrainOutput } from '../../shared/interfaces';
const brain = require("brain.js");

@Component({
  selector: 'app-smile',
  standalone: true,
  imports: [CommonModule, MatButtonModule,],
  templateUrl: './smile.component.html',
  styleUrls: ['./smile.component.scss']
})
export class SmileComponent {
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

  public onTrain(isPositive: boolean): void {
    const vector: any[] = this.canvasService.calculate(true);
    let output: TrainOutput = isPositive ? { positive: 1 } : { negative: 1 };

    this.train_data.push({
      input: vector,
      output
    });

    console.log(this.train_data);
  }

  public onResponce(): void {
    this.net = new brain.NeuralNetwork();
    this.net.train(this.train_data);

    const result = brain.likely(this.canvasService.calculate(), this.net);
    alert(result);
  }
  

  public ngAfterViewInit(): void {
    this.canvasService.setCanvasElement(this.canv.nativeElement);
  }
}
