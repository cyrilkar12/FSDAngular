import { NgModule } from '@angular/core';
import {  RouterModule, Routes } from '@angular/router';
import {AppComponent} from './app.component';
import {UserComponent} from './component/user/user.component';
import {ProjectComponent} from './component/project/project.component';
import {TaskComponent} from './component/task/task.component';
import {ViewtaskComponent} from './component/viewtask/viewtask.component';

const routes: Routes = [
  { path: '', redirectTo: 'users', pathMatch: 'full' },
  { path: 'users', component: UserComponent },
   { path: 'projects', component: ProjectComponent },
    { path: 'tasks', component: TaskComponent },
    { path: 'viewtasks', component: ViewtaskComponent }
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
