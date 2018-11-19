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
import { TranslateService } from '@ngx-translate/core';

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
queryString:string;
message:string;

  constructor(private datePipe: DatePipe,private taskService:TaskServiceService,
          private projectService:ProjectService,private translate:TranslateService) { 
            this.viewTaskForm=new FormGroup({
              projectName:new FormControl('')
            });
            this.queryString = '';
   }


  ngOnInit() {
    this.loadTasks();
    this.loadProjects();
    
  }

 loadTasks(){
   this.taskService.getTasks().subscribe(
      (responseData:Task[])=>{
        this.tasks=responseData;
         //console.log('parentTasks>>>'+JSON.stringify(this.tasks));
      },
      (error)=>{
        //console.log('error');
        //console.log(error);
        this.responseStr = error;
      }
    );
   
 }

 loadProjects(){
this.projectService.getProjects().subscribe(
      (responseData:Project[])=>{
        this.projects=responseData;
      },
      (error)=>{
        //console.log('error');
        //console.log(error);
        this.responseStr = error;
      }
    );
    //console.log('projects>>>'+this.projects);
}


searchTasksByProject(searchProject:number){
 //console.log("search>>"+searchProject)
 this.message='';
  this.taskService.getTaskByProjectId(searchProject).subscribe(
      (responseData:Task[])=>{
        this.tasks=responseData;
      },
      (error)=>{
        //console.log('error');
        //console.log(error);
        this.responseStr = error;
      }
    );
}

sortTasks(sortType:number){
  this.message='';
   //console.log(sortType);
  this.taskService.sortTasks(sortType).subscribe(
      (responseData:Task[])=>{
        this.tasks=responseData;
      },
      (error)=>{
        //console.log('error');
        //console.log(error);
        this.responseStr = error;
      }
    );
 }

endTask(taskId:number){
  this.message='';
   //console.log(taskId);
  var selectedTask = this.tasks.find(p2=>p2.taskId===taskId);
  selectedTask.status = 'Completed';
  this.taskService.editTask(selectedTask.taskId,selectedTask).subscribe(
      (responseData:string)=>{
        this.message=responseData;
        this.translate.get('MESSAGES.TASKCOMP').subscribe(
      (responseData:string)=>{
        this.message=responseData;
      });
      },
      (error)=>{
        //console.log('error');
        //console.log(error);
        this.responseStr = error;
      }
    );
}

selectProjectsForTask(projectId:number,projectName:string){
  this.message='';
  this.selectedProjectId = projectId;
  //console.log("selected projectName"+projectName);
  this.viewTaskForm.patchValue({
    'projectName':projectName
   });
     this.closeProjectModal.nativeElement.click();
     this.searchTasksByProject(projectId);
}

loadAllTasks(){
  if(this.viewTaskForm.value.projectName===null || 
        this.viewTaskForm.value.projectName===''){
          this.loadTasks();
        }
}

}
