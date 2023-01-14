import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public links = [
    {
      title: 'Smile',
      link: 'smile'
    },
    {
      title: 'Numbers',
      link: 'numbers'
    },
    {
      title: 'Words',
      link: 'words'
    },
  ]
}
