import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import {FormGroup, FormControl, Validator} from "@angular/forms"
import {ProjectService} from '../../service/project/project.service'
import {Project} from '../../model/Project'
import { Validators } from '@angular/forms';
import { OuterSubscriber } from 'rxjs/internal/OuterSubscriber';
//import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
projects:Project[]=[];
projectForm:FormGroup;
responseStr:string;
searchProjectName:number;
editFlag:boolean;

  constructor(private projectService:ProjectService) {
       this.editFlag = false;
    this.projectForm=new FormGroup({
       projectId:new FormControl(0),
       project:new FormControl('',Validators.pattern('[A-Za-z]{2,20}')),
       startDate:new FormControl('',Validators.required),
       endDate:new FormControl('',Validators.required),
       priority:new FormControl("30",Validators.pattern('[1-9]{1,20}')),
       status:new FormControl('',Validators.pattern('[A-Za-z]{2,20}')),
       searchProjectName:new FormControl('',Validators.pattern('[A-Za-z]{2,20}')),
       manager:new FormControl('',Validators.required),
       userId:new FormControl('',Validators.required)
    });

   }

   dateLessThan(from: string, to: string) {
    return (group: FormGroup): {[key: string]: any} => {
      let f = group.controls[from];
      let t = group.controls[to];
      if (f.value > t.value) {
        return {
          dates: "Date from should be less than Date to"
        };
      }
      return {};
    }
}
  

  ngOnInit() {
    this.loadProjects();
  }

 loadProjectById(projectId:number){
    this.editFlag = true;
    var editProject = this.projects.find(p1=>p1.projectId===projectId);
    this.projectForm=new FormGroup({
       projectId:new FormControl(editProject.projectId),
       project:new FormControl(editProject.project),
       startDate:new FormControl(editProject.startDate),
       endDate:new FormControl(editProject.endDate),
       priority:new FormControl(editProject.priority),
       status:new FormControl(editProject.status),
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
    this.projectService.addProject(this.projectForm.value).subscribe(
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

}
