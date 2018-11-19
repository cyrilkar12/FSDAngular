import { NgModule } from '@angular/core';
import {  RouterModule, Routes } from '@angular/router';
import {AppComponent} from './app.component';
import {UserComponent} from './component/user/user.component';
import {ProjectComponent} from './component/project/project.component';
import {TaskComponent} from './component/task/task.component';
import {ViewtaskComponent} from './component/viewtask/viewtask.component';

const routes: Routes = [
  { path: '', redirectTo: 'ProjectManager/users', pathMatch: 'full' },
  { path: 'ProjectManager/users', component: UserComponent },
   { path: 'ProjectManager/projects', component: ProjectComponent },
    { path: 'ProjectManager/tasks', component: TaskComponent },
    { path: 'ProjectManager/viewtasks', component: ViewtaskComponent },
    { path: 'ProjectManager/editTask/:id', component: TaskComponent }
];


@NgModule({
   imports: [RouterModule.forRoot(routes)],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
