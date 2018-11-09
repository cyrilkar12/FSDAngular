import { Component, OnInit, Input, EventEmitter, Output,ViewChild, ElementRef } from '@angular/core';
import {FormGroup, FormControl, Validator} from "@angular/forms"
import {UserServiceService} from '../../service/User/user-service.service';
import {ProjectService} from '../../service/project/project.service';
import {Project} from '../../model/Project';
import {User} from '../../model/User';
import { Validators } from '@angular/forms';
import { OuterSubscriber } from 'rxjs/internal/OuterSubscriber';
import { DatePipe } from '@angular/common';

//import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css'],
  providers: [DatePipe]
})

export class ProjectComponent implements OnInit {
 @ViewChild('closeAddExpenseModal') closeAddExpenseModal: ElementRef;

projects:Project[]=[];
managers:User[]=[];
projectForm:FormGroup;
responseStr:string;
searchProjectName:number;
editFlag:boolean;
display:string
selectedManager:string;
selectedManagerId:number;

  constructor(private projectService:ProjectService,private datePipe: DatePipe,
      private userService:UserServiceService) {
       this.editFlag = false;
       this.display='none';
    this.projectForm=new FormGroup({
       projectId:new FormControl(0),
       project:new FormControl('',Validators.pattern('[A-Za-z1-9]{2,20}')),
       startDate:new FormControl('',Validators.required),
       endDate:new FormControl('',Validators.required),
       priority:new FormControl("30",Validators.pattern('[1-9]{1,100}')),
       //status:new FormControl('',Validators.pattern('[A-Za-z]{2,20}')),
       searchProjectName:new FormControl('',Validators.pattern('[A-Za-z]{2,20}')),
       manager:new FormControl({value:'',disabled:true},Validators.required),
       userId:new FormControl('',Validators.required)
    });

   }

   dateLessThan() {
     console.log("onblur");
      let f = this.projectForm.value.startDate;
      let t = this.projectForm.value.endDate;
      console.log("from:"+f);
      if (this.datePipe.transform(this.projectForm.value.startDate,'y-MM-dd') > 
      this.datePipe.transform(this.projectForm.value.endDate,'y-MM-dd')) { 
        console.log("error>>>");
        this.projectForm.controls["startDate"].setErrors({'invalid': true});
      }
      this.projectForm.controls["startDate"].setErrors(null);
    
}
  

  ngOnInit() {
    this.loadProjects();
    this.loadManagers();
  }

  loadManagers(){
    this.userService.getUsers().subscribe(
      (responseData:User[])=>{
        this.managers=responseData;
      },
      (error)=>{
        console.log('error');
        console.log(error);
        this.responseStr = error;
      }
    );
    }

 loadProjectById(projectId:number){
    this.editFlag = true;
    var editProject = this.projects.find(p1=>p1.projectId===projectId);
    console.log(editProject.priority);
    this.projectForm=new FormGroup({
       projectId:new FormControl(editProject.projectId),
       project:new FormControl(editProject.project),
       startDate:new FormControl(this.datePipe.transform(editProject.startDate,'y-MM-dd')),
       endDate:new FormControl(this.datePipe.transform(editProject.endDate,'y-MM-dd')),
       priority:new FormControl(editProject.priority),
       manager:new FormControl({value:'',disabled:true},Validators.required),
        searchProjectName:new FormControl('',Validators.pattern('[A-Za-z]{2,20}')),
       userId:new FormControl('',Validators.required)
       //status:new FormControl(editProject.status),
    });
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
  resetForm(){
   this.projectForm=new FormGroup({
      projectId:new FormControl(0),
       project:new FormControl('',Validators.pattern('[A-Za-z]{2,20}')),
       startDate:new FormControl('',Validators.required),
       endDate:new FormControl('',Validators.required),
       priority:new FormControl(30,Validators.pattern('[1-9]{1,20}')),
       status:new FormControl('',Validators.pattern('[A-Za-z]{2,20}')),
       searchProjectName:new FormControl('',Validators.pattern('[A-Za-z]{2,20}'))
   }); 
  }

  addProject(editFlag:boolean){
    console.log(this.projectForm.value);
    if(!editFlag){
    var projectManger = this.managers.find(m1=>m1.userId===this.selectedManagerId);
    console.log('addManager:'+projectManger);
    let addProject = new Project(
        this.projectForm.value.projectId,
        this.projectForm.value.project,
        this.projectForm.value.startDate,
        this.projectForm.value.endDate,
        this.projectForm.value.priority,
     this.projectForm.value.numberOfTasks,
     this.projectForm.value.completedTasks,
     new User(
       projectManger.userId,
       projectManger.firstName,
       projectManger.lastName,
       projectManger.employeeId
     )
    );
    console.log("addProject:"+addProject);
    this.projectService.addProject(addProject).subscribe(
      (responseData:Project[])=>{
        this.projects=responseData;
      },
      (error)=>{
        console.log('error');
        console.log(error);
        this.responseStr = error;
      }
    );
    console.log('inset success');
  }else{
      //this.selectedUserId =this.userForm.value.userId;
      console.log("selectedProjectId>>");
      this.editProject(this.projectForm.value.userId); 
      this.editFlag=false;     
    }
    //this.loadUsers();
    //console.log('loaded success');
  }

 suspendProject(projectId:number){
      this.projectService.suspendProject(projectId).subscribe(
      (responseData:Project[])=>{
        this.projects=responseData;
      },
      (error)=>{
        console.log('error');
        console.log(error);
        this.responseStr = error;
      }
    );

  }

editProject(editProjectId:number){
 this.projectService.editProject(editProjectId,this.projectForm.value).subscribe(
      (responseData:Project[])=>{
        this.projects=responseData;
      },
      (error)=>{
        console.log('error');
        console.log(error);
        this.responseStr = error;
      }
    );
 }


 searchProject(){
   console.log("search>>"+this.projectForm.value.searchProjectName)
  this.projectService.getProjectByName(this.projectForm.value.searchUserName).subscribe(
      (responseData:Project[])=>{
        this.projects=responseData;
      },
      (error)=>{
        console.log('error');
        console.log(error);
        this.responseStr = error;
      }
    );
 }

 sortProject(sortType:number){
   console.log(sortType);
  this.projectService.sortProjects(sortType).subscribe(
      (responseData:Project[])=>{
        this.projects=responseData;
      },
      (error)=>{
        console.log('error');
        console.log(error);
        this.responseStr = error;
      }
    );
 }

 selectManager(userId:number,managerName:string){
   this.selectedManager = managerName;
   this.selectedManagerId = userId;
   this.projectForm.patchValue({
    'manager':managerName
   });
   console.log(">>>"+this.projectForm.value.manager);
   console.log("Manager:"+this.selectedManagerId+':'+ this.selectedManager);
   /*this.display='none';*/
   this.closeAddExpenseModal.nativeElement.click();
 }

 displayModal(){
   this.display='block';
 }

}
