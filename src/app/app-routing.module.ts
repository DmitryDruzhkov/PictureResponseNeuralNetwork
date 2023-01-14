import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NumberComponent } from './components/number/number.component';
import { SmileComponent } from './components/smile/smile.component';
import { WordsComponent } from './components/words/words.component';

export const routes: Routes = [
  {
    path: '',
    component: SmileComponent,
  },
  {
    path: 'smile',
    component: SmileComponent,
  },
  {
    path: 'number',
    component: NumberComponent,
  },
  {
    path: 'words',
    component: WordsComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabledNonBlocking',
      anchorScrolling: 'enabled',
      paramsInheritanceStrategy: 'always',
      scrollPositionRestoration: 'top',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
