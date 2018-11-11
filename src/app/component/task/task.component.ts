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
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
  providers: [DatePipe]
})
export class TaskComponent implements OnInit {
 @ViewChild('closeParentTaskModal') closeParentTaskModal: ElementRef;
 @ViewChild('closeProjectModal') closeProjectModal: ElementRef;
 @ViewChild('closeUserModal') closeUserModal: ElementRef;

projects:Project[]=[];
tasks:Task[]=[];
taskOwners:User[]=[];
parentTasks:ParentTask[]=[];
taskForm:FormGroup;
responseStr:string;
searchProjectName:number;
editFlag:boolean;
display:string
//selectedTaskOwner:string;
selectedOwnerId:number;
//selectedProjectName:string;
selectedProjectId:number;
selectedParentTaskId:number;
selectParentTaskName:string;
selectedTaskId:number;

  constructor(private projectService:ProjectService,private datePipe: DatePipe,
      private userService:UserServiceService,private taskService:TaskServiceService) { 
        this.editFlag = false;
       this.display='none';
    this.taskForm=new FormGroup({
       taskId:new FormControl(0),
       projectName:new FormControl({value:'',disabled:true},Validators.required),
       taskName:new FormControl({value:'',disabled:true},Validators.required),
       isParent:new FormControl(true),
       priority:new FormControl(0),
       parentTaskName:new FormControl({value:'',disabled:true},Validators.required),
       startDate:new FormControl('',Validators.required),
       endDate:new FormControl('',Validators.required),
       taskOwner:new FormControl({value:'',disabled:true},Validators.required),
       userId:new FormControl('',Validators.required)
    });
      }

  ngOnInit() {
    this.loadTaskOwners();
    this.loadProjects();
    this.loadParentTasks();
  }

loadParentTasks(){
this.taskService.getParentTasks().subscribe(
      (responseData:ParentTask[])=>{
        this.parentTasks=responseData;
      },
      (error)=>{
        console.log('error');
        console.log(error);
        this.responseStr = error;
      }
    );
    console.log('parentTasks>>>'+this.parentTasks);
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

loadTaskOwners(){
  this.userService.getUsers().subscribe(
      (responseData:User[])=>{
        this.taskOwners=responseData;
      },
      (error)=>{
        console.log('error');
        console.log(error);
        this.responseStr = error;
      }
    );
     console.log('projects>>>'+this.taskOwners);
}

addTask(editFlag:boolean){
    console.log(this.taskForm.value);
    if(this.taskForm.value.isParent){
      let addParentTask =  new ParentTask(0,this.taskForm.value.taskName);
      console.log("addParentTask:"+addParentTask);  
      this.taskService.addParentTask(addParentTask);
    }else{
   // console.log('addTask:'+projectManger);
     var taskAssignedTo = this.taskOwners.find(m1=>m1.userId===this.selectedOwnerId);
     var selectedTaskProject = this.projects.find(p1=>p1.projectId===this.selectedProjectId);
     var selectedParentTask = this.parentTasks.find(p2=>p2.parentTaskId===this.selectedParentTaskId);

    let addTask = new Task(
        new Project(
          selectedTaskProject.projectId,
          selectedTaskProject.project,
          selectedTaskProject.startDate,
          selectedTaskProject.endDate,
          selectedTaskProject.priority,
          selectedTaskProject.numberOfTasks,
          selectedTaskProject.completedTasks,
          new User(
            taskAssignedTo.userId,
            taskAssignedTo.firstName,
            taskAssignedTo.lastName,
            taskAssignedTo.employeeId
     )
        ),
        this.taskForm.value.taskId,
        this.taskForm.value.taskName,
        this.taskForm.value.priority,
        new ParentTask(
          this.selectedParentTaskId,
          this.selectParentTaskName
        ),
        this.taskForm.value.startDate,
        this.taskForm.value.endDate,
        this.taskForm.value.status,
     new User(
            taskAssignedTo.userId,
            taskAssignedTo.firstName,
            taskAssignedTo.lastName,
            taskAssignedTo.employeeId
     )
    );
    console.log("addTask:"+addTask);
   
    if(!editFlag){
    this.taskService.addTask(addTask).subscribe(
      (responseData:Task[])=>{
        this.tasks=responseData;
      },
      (error)=>{
        console.log('error');
        console.log(error);
        this.responseStr = error;
      }
    );
    console.log('insert success');
  }else{
      //this.selectedUserId =this.userForm.value.userId;
      console.log("selectedProjectId>>");
      this.editTask(this.selectedTaskId,addTask); 
      this.editFlag=false;     
    }
    //this.loadUsers();
    //console.log('loaded success');
    }
 
  }

editTask(selectedTaskId:number,editTask:Task){
 this.taskService.editTask(selectedTaskId,editTask).subscribe(
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

resetForm(){
  this.taskForm=new FormGroup({
      taskId:new FormControl(0),
       projectName:new FormControl({value:'',disabled:true},Validators.required),
       taskName:new FormControl({value:'',disabled:true},Validators.required),
       isParent:new FormControl(true),
       priority:new FormControl(0),
       parentTaskName:new FormControl({value:'',disabled:true},Validators.required),
       startDate:new FormControl('',Validators.required),
       endDate:new FormControl('',Validators.required),
       taskOwner:new FormControl({value:'',disabled:true},Validators.required),
       userId:new FormControl('',Validators.required)
    });
  }

selectParentTask(){
}

selectTaskOwners(){

}

selectProjectsForTask(){

}

}
