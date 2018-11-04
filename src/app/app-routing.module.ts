import { NgModule } from '@angular/core';
import {  RouterModule, Routes } from '@angular/router';
import {AppComponent} from './app.component';
import {UserComponent} from './component/user/user.component';

const routes: Routes = [
  { path: '', redirectTo: '/users', pathMatch: 'full' },
  { path: 'users', component: UserComponent }
  /*{ path: 'insert', component: AppComponent },
  { path: 'modify/:id', component: AppComponent },
  { path: 'delete/:id', component: AppComponent },
   { path: 'getBook/:id', component: AppComponent }*/
];


@NgModule({
   imports: [RouterModule.forRoot(routes)],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
