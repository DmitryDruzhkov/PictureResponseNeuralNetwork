import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NumberComponent } from './components/number/number.component';
import { SmileComponent } from './components/smile/smile.component';

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
