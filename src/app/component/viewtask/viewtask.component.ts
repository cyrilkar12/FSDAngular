import { Component, OnInit, Input, EventEmitter, Output,ViewChild, ElementRef } from '@angular/core';
import {FormGroup, FormControl, Validator} from "@angular/forms"
import {UserServiceService} from '../../service/User/user-service.service';
import {ProjectService} from '../../service/project/project.service';
import {TaskServiceService} from '../../service/Task/task-service.service';
import {Project} from '../../model/Project';
import {Task} from '../../model/Task';
import {ParentTask} from '../../model/ParentTask';
import {User} from '../../model/User';
import { Validators } from '@angular/forms';
import { OuterSubscriber } from 'rxjs/internal/OuterSubscriber';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-viewtask',
  templateUrl: './viewtask.component.html',
  styleUrls: ['./viewtask.component.css'],
  providers: [DatePipe]
})
export class ViewtaskComponent implements OnInit {
@ViewChild('closeProjectModal') closeProjectModal: ElementRef;

tasks:Task[]=[];
projects:Project[]=[];
responseStr:string;
viewTaskForm:FormGroup;
//searchTaskName:number;
selectedProjectId:number;

  constructor(private datePipe: DatePipe,private taskService:TaskServiceService,
          private projectService:ProjectService) { 
            this.viewTaskForm=new FormGroup({
              projectName:new FormControl('')
            });
   }


  ngOnInit() {
    this.loadTasks();
    this.loadProjects();
  }

 loadTasks(){
   this.taskService.getTasks().subscribe(
      (responseData:Task[])=>{
        this.tasks=responseData;
      },
      (error)=>{
        console.log('error');
        console.log(error);
        this.responseStr = error;
      }
    );
    console.log('parentTasks>>>'+this.tasks);
 }

 loadProjects(){
this.projectService.getProjects().subscribe(
      (responseData:Project[])=>{
        this.projects=responseData;
      },
      (error)=>{
        console.log('error');
        console.log(error);
        this.responseStr = error;
      }
    );
    console.log('projects>>>'+this.projects);
}


searchByTaskName(searchTaskName:string){
 console.log("search>>"+searchTaskName)
  this.taskService.getTaskByName(searchTaskName).subscribe(
      (responseData:Task[])=>{
        this.tasks=responseData;
      },
      (error)=>{
        console.log('error');
        console.log(error);
        this.responseStr = error;
      }
    );
}

sortTasks(sortType:number){
   console.log(sortType);
  this.taskService.sortTasks(sortType).subscribe(
      (responseData:Task[])=>{
        this.tasks=responseData;
      },
      (error)=>{
        console.log('error');
        console.log(error);
        this.responseStr = error;
      }
    );
 }

endTask(taskId:number){
   console.log(taskId);
  var selectedTask = this.tasks.find(p2=>p2.taskId===taskId);
  this.taskService.editTask(selectedTask.taskId,selectedTask).subscribe(
      (responseData:Task[])=>{
        this.tasks=responseData;
      },
      (error)=>{
        console.log('error');
        console.log(error);
        this.responseStr = error;
      }
    );
}

selectProjectsForTask(projectId:number,projectName:string){
  this.selectedProjectId = projectId;
  console.log("selected projectName"+projectName);
  this.viewTaskForm.patchValue({
    'projectName':projectName
   });
     this.closeProjectModal.nativeElement.click();

}

}
