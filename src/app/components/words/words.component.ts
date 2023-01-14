import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanvasService } from 'src/app/services/canvas.service';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
const brain = require('brain.js');

@Component({
  selector: 'app-words',
  standalone: true,
  imports: [CommonModule, FormsModule, MatRadioModule, MatButtonModule],
  templateUrl: './words.component.html',
  styleUrls: ['./words.component.scss'],
})
export class WordsComponent {
  public words: string[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'q'];

  public chousenWord!: string;

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

    const output = {};

    this.words.forEach((word: string) => {
      (output as any)[word] = word === this.chousenWord ? 1 : 0;
    })

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
}
