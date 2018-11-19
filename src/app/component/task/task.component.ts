import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validator, ValidationErrors } from "@angular/forms"
import { UserServiceService } from '../../service/User/user-service.service';
import { ProjectService } from '../../service/project/project.service';
import { TaskServiceService } from '../../service/Task/task-service.service';
import { Project } from '../../model/Project';
import { Task } from '../../model/Task';
import { ParentTask } from '../../model/ParentTask';
import { User } from '../../model/User';
import { Validators } from '@angular/forms';
import { OuterSubscriber } from 'rxjs/internal/OuterSubscriber';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, ParamMap } from "@angular/router";
import { TranslateService } from '@ngx-translate/core';


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

  projects: Project[] = [];
  tasks: Task[] = [];
  taskOwners: User[] = [];
  parentTasks: ParentTask[] = [];
  taskForm: FormGroup;
  responseStr: string;
  searchProjectName: number;
  editFlag: boolean;
  display: string
  //selectedTaskOwner:string;
  selectedOwnerId: number;
  //selectedProjectName:string;
  selectedProjectId: number;
  selectedParentTaskId: number;
  selectParentTaskName: string;
  selectedTaskId: number;
  editTaskId: string;
  editLoadtask: Task;
  message: string;
  queryString: string;
  constructor(private projectService: ProjectService, private datePipe: DatePipe,
    private userService: UserServiceService, private taskService: TaskServiceService,
    private activatedRoute: ActivatedRoute, private translate: TranslateService) {
    this.editFlag = false;
    this.display = 'none';
    var today = new Date();
    var tomorrow = today.setDate(today.getDate() + 1);
    this.editTaskId = (this.activatedRoute.snapshot.paramMap.get('id'));
    if (this.editTaskId != null && this.editTaskId != undefined && this.editTaskId != "0") {
      this.editFlag = true;
    }
    if (!this.editFlag) {
      this.taskForm = new FormGroup({
        taskId: new FormControl(0),
        projectName: new FormControl({ value: '', disabled: true }, Validators.required),
        taskName: new FormControl('', Validators.required),
        isParent: new FormControl(true),
        priority: new FormControl({ value: 0, disabled: true }),
        parentTaskName: new FormControl({ value: '', disabled: true }, Validators.required),
        startDate: new FormControl({ value: this.datePipe.transform(new Date(), 'y-MM-dd'), disabled: true }, Validators.required),
        endDate: new FormControl({ value: this.datePipe.transform(tomorrow, 'y-MM-dd'), disabled: true }, Validators.required),
        taskOwner: new FormControl({ value: '', disabled: true }, Validators.required),
        userId: new FormControl('')
      });
    } else {
      this.taskForm = new FormGroup({
        taskId: new FormControl(0),
        projectName: new FormControl({ value: '', disabled: true }, Validators.required),
        taskName: new FormControl('', Validators.required),
        isParent: new FormControl(false),
        priority: new FormControl(0),
        parentTaskName: new FormControl({ value: '', disabled: true }),
        startDate: new FormControl(this.datePipe.transform(new Date(), 'y-MM-dd'), Validators.required),
        endDate: new FormControl(this.datePipe.transform(tomorrow, 'y-MM-dd'), Validators.required),
        taskOwner: new FormControl({ value: '', disabled: true }, Validators.required),
        userId: new FormControl('')
      });
    }
  }

  dateLessThan() {
    //console.log("onblur");
    let f = this.taskForm.value.startDate;
    let t = this.taskForm.value.endDate;
    //console.log("from:" + f);
    //if((f!=null && (t==null || t==undefined )) || ( t!=null && (f==null || f==undefined ))
    if (!this.taskForm.controls["isParent"].value && (t == null || t == undefined || f == null || f == undefined)) {
      this.taskForm.controls["startDate"].setErrors({ 'invalid': true });
      this.taskForm.controls["endDate"].setErrors({ 'invalid': true });
    }
    if (this.datePipe.transform(this.taskForm.value.startDate, 'y-MM-dd') >
      this.datePipe.transform(this.taskForm.value.endDate, 'y-MM-dd')) {
      //console.log("error>>>");
      this.taskForm.controls["startDate"].setErrors({ 'invalid': true });
      this.taskForm.controls["endDate"].setErrors({ 'invalid': true });
    } else {
      this.taskForm.controls["startDate"].setErrors(null);
      this.taskForm.controls["endDate"].setErrors(null);
    }
  }

  ngOnInit() {
    this.editTaskId = (this.activatedRoute.snapshot.paramMap.get('id'));
    this.selectedTaskId = +this.editTaskId;
    if (this.editTaskId != null && this.editTaskId != undefined && this.editTaskId != "0") {
      this.editFlag = true;
    }
    //    if(!this.editFlag){
    this.loadTaskOwners();
    this.loadProjects();
    this.loadParentTasks();
    //}else{
    if (this.editFlag) {
      this.loadEditFormData();
    }
  }

  loadEditFormData() {
    //var editLoadtask;
    this.taskService.getTaskByTaskId(this.editTaskId).subscribe(
      (responseData: Task) => {
        this.editLoadtask = responseData;
        //console.log('editLoadtask>>>>' + JSON.stringify(this.editLoadtask));
        this.selectedOwnerId = this.editLoadtask.user.userId;
        this.selectedProjectId = this.editLoadtask.project.projectId;
        var localParentTaskName = '';
        if (this.editLoadtask.parentTask != null && this.editLoadtask.parentTask != undefined) {
          this.selectedParentTaskId = this.editLoadtask.parentTask.parentTaskId;
          localParentTaskName = this.editLoadtask.parentTask.parentTaskName;
        }
        var userName = this.editLoadtask.user.firstName + ' ' + this.editLoadtask.user.lastName;
        this.taskForm = new FormGroup({
          taskId: new FormControl(this.editLoadtask.taskId),
          projectName: new FormControl({ value: this.editLoadtask.project.project, disabled: true }, Validators.required),
          taskName: new FormControl(this.editLoadtask.taskName, Validators.required),
          isParent: new FormControl(false),
          priority: new FormControl(this.editLoadtask.priority),
          parentTaskName: new FormControl({ value: localParentTaskName, disabled: true }),
          startDate: new FormControl(this.datePipe.transform(this.editLoadtask.startDate, 'y-MM-dd'), Validators.required),
          endDate: new FormControl(this.datePipe.transform(this.editLoadtask.endDate, 'y-MM-dd'), Validators.required),
          taskOwner: new FormControl({ value: userName, disabled: true }, Validators.required),
          userId: new FormControl(this.editLoadtask.user.userId)
        });
        /* this.taskForm.controls['startDate'].enable();
         this.taskForm.controls["endDate"].enable();
         this.taskForm.controls["priority"].enable();
         this.taskForm.controls["isParent"].disable();*/
        //this.checkBoxClicked();
      },
      (error) => {
        //console.log('error');
        //console.log(error);
        this.responseStr = error;
      }
    );

    /*  var userName = this.editLoadtask.user.firstName+' '+this.editLoadtask.user.lastName;
      this.taskForm=new FormGroup({
      taskId:new FormControl(this.editLoadtask.taskId),
      projectName:new FormControl({value:this.editLoadtask.project.projectId,disabled:true},Validators.required),
      taskName:new FormControl(this.editLoadtask.taskName,Validators.required),
      isParent:new FormControl(false),
      priority:new FormControl({value:this.editLoadtask.priority,disabled:true}),
      parentTaskName:new FormControl({value:this.editLoadtask.parentTask.parentTaskName,disabled:true},Validators.required),
      startDate:new FormControl({value:this.datePipe.transform(this.editLoadtask.startDate,'y-MM-dd'),disabled:true} ,Validators.required),
      endDate:new FormControl({value:this.datePipe.transform(this.editLoadtask.endDate,'y-MM-dd'),disabled:true},Validators.required),
      taskOwner:new FormControl({value:userName,disabled:true},Validators.required),
      userId:new FormControl(this.editLoadtask.user.userId,Validators.required)
   });*/

  }

  loadParentTasks() {
    this.taskService.getParentTasks().subscribe(
      (responseData: ParentTask[]) => {
        this.parentTasks = responseData;
      },
      (error) => {
        //console.log('error');
        //console.log(error);
        this.responseStr = error;
      }
    );
    //console.log('parentTasks>>>' + this.parentTasks);
  }

  loadProjects() {
    this.projectService.getProjects().subscribe(
      (responseData: Project[]) => {
        this.projects = responseData;
      },
      (error) => {
        //console.log('error');
        //console.log(error);
        this.responseStr = error;
      }
    );
    //console.log('projects>>>' + this.projects);
  }

  loadTaskOwners() {
    this.userService.getUsers().subscribe(
      (responseData: User[]) => {
        this.taskOwners = responseData;
      },
      (error) => {
        //console.log('error');
        //console.log(error);
        this.responseStr = error;
      }
    );
    //console.log('projects>>>' + this.taskOwners);
  }

  getFormValidationErrors() {
    //console.log("Get errors>")
    //this.message  = '';
    Object.keys(this.taskForm.controls).forEach(key => {

      const controlErrors: ValidationErrors = this.taskForm.get(key).errors;
      var errorStr;
      this.translate.get('MESSAGES.ERRORHEADER').subscribe(
        (responseData: string) => {
          errorStr = responseData;
        });
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          if (this.message != '' && this.message != null && this.message != undefined) {
            this.message = this.message + '<br/>' + key + '-' + keyError;
          } else {
            this.message = errorStr + '<br/>' + key + '-' + keyError;
          }
        });
      }
    });
    var errorStr = null;
    if (this.selectedOwnerId == null || this.selectedProjectId == undefined) {
      this.translate.get('MESSAGES.TASKERR').subscribe(
        (responseData: string) => {
          errorStr = responseData;
        });
      this.message = this.message + '<br/>' + errorStr;
    }
  }

  addTask() {
    this.message = '';
    this.dateLessThan();
    //console.log(this.selectedProjectId);
    if (this.taskForm.invalid || (!this.taskForm.value.isParent &&
      (this.selectedOwnerId == null || this.selectedOwnerId == undefined || this.selectedProjectId == null || this.selectedProjectId == undefined))) {
      this.getFormValidationErrors();
      // this.message = "Correct the Errors in the Form"
      return;
    }
    //console.log(this.taskForm.value);
    if (this.taskForm.value.isParent) {
      let addParentTask = new ParentTask(0, this.taskForm.value.taskName);
      //console.log("addParentTask:" + addParentTask);
      this.taskService.addParentTask(addParentTask).subscribe(
        (responseData: string) => {
          this.message = responseData;
          this.selectedProjectId = null;
          this.selectedOwnerId = null;
          this.loadParentTasks();
        },
        (error) => {
          //console.log('error');
          //console.log(error);
          this.responseStr = error;
        }
      );
    } else {
      //console.log('Form vale>>>:' + this.selectedOwnerId + ',' + this.selectedProjectId + ',' + this.selectedParentTaskId);
      var taskAssignedTo = this.taskOwners.find(m1 => m1.userId === this.selectedOwnerId);
      var selectedTaskProject = this.projects.find(p1 => p1.projectId === this.selectedProjectId);
      var selectedParentTask = this.parentTasks.find(p2 => p2.parentTaskId === this.selectedParentTaskId);
      var parentId = null;
      var parentTaskName = null;
      if (selectedParentTask != null && selectedParentTask != undefined) {
        parentId = selectedParentTask.parentTaskId;
        parentTaskName = selectedParentTask.parentTaskName;
      }
      //var parentTask = new ParentTask(parentId,parentTaskName);
      //console.log("selectedParentTask in addTask >>>" + selectedParentTask)
      //console.log("startdate>>>" + this.taskForm.value.startDate);
      let addTask = new Task(
        this.taskForm.value.taskId,
        this.taskForm.value.taskName,
        this.taskForm.value.priority,
        this.taskForm.value.startDate,
        this.taskForm.value.endDate,
        'InPrgress',
        new ParentTask(parentId, parentTaskName),
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
        new User(
          taskAssignedTo.userId,
          taskAssignedTo.firstName,
          taskAssignedTo.lastName,
          taskAssignedTo.employeeId
        )
      );
      //console.log("addTask>>>:" + JSON.stringify(addTask));

      if (!this.editFlag) {
        this.taskService.addTask(addTask).subscribe(
          (responseData: string) => {
            this.message = responseData;
            this.selectedProjectId = null;
            this.selectedOwnerId = null;
            //resetForm();
          },
          (error) => {
            //console.log('error');
            //console.log(error);
            this.responseStr = error;
          }
        );
        //console.log('insert success');
      } else {
        //this.selectedUserId =this.userForm.value.userId;
        //console.log("selectedProjectId>>");
        this.editTask(this.selectedTaskId, addTask);
        this.editFlag = false;
      }
      //this.loadUsers();
      ////console.log('loaded success');
    }

  }

  editTask(selectedTaskId: number, editTask: Task) {
    this.taskService.editTask(selectedTaskId, editTask).subscribe(
      (responseData: string) => {
        this.message = responseData;
      },
      (error) => {
        //console.log('error');
        //console.log(error);
        this.responseStr = error;
      }
    );
  }

  resetForm() {
    var today = new Date();
    var tomorrow = today.setDate(today.getDate() + 1);
    this.taskForm = new FormGroup({
      taskId: new FormControl(0),
      projectName: new FormControl({ value: '', disabled: true }, Validators.required),
      taskName: new FormControl('', Validators.required),
      isParent: new FormControl(true),
      priority: new FormControl(0),
      parentTaskName: new FormControl({ value: '', disabled: true }, Validators.required),
      startDate: new FormControl(this.datePipe.transform(new Date(), 'y-MM-dd'), Validators.required),
      endDate: new FormControl(this.datePipe.transform(tomorrow, 'y-MM-dd'), Validators.required),
      taskOwner: new FormControl({ value: '', disabled: true }, Validators.required),
      userId: new FormControl('', Validators.required)
    });
  }

  selectParentTask(parentTaskId: number, parentTaskName: string) {
    //console.log("selectParentTask>>>" + parentTaskId);
    this.selectedParentTaskId = parentTaskId;
    this.taskForm.patchValue({
      'parentTaskName': parentTaskName
    });
    this.closeParentTaskModal.nativeElement.click();

  }

  selectTaskOwners(userId: number, taskOwnerName: string) {
    this.selectedOwnerId = userId;
    this.taskForm.patchValue({
      'taskOwner': taskOwnerName
    });
    this.closeUserModal.nativeElement.click();

  }

  selectProjectsForTask(projectId: number, projectName: string) {
    this.selectedProjectId = projectId;
    //console.log("selected projectName" + projectName);
    this.taskForm.patchValue({
      'projectName': projectName
    });
    this.closeProjectModal.nativeElement.click();

  }

  checkBoxClicked() {
    //console.log("clicked");
    if (!this.taskForm.controls["isParent"].value) {
      this.taskForm.controls["priority"].disable();
      this.taskForm.controls["startDate"].disable();
      this.taskForm.controls["endDate"].disable();
    } else {
      this.taskForm.controls["priority"].enable();
      this.taskForm.controls["startDate"].enable();
      this.taskForm.controls["endDate"].enable();
    }
  }

}
