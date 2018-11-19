import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validator, ValidationErrors } from "@angular/forms"
import { UserServiceService } from '../../service/User/user-service.service';
import { ProjectService } from '../../service/project/project.service';
import { Project } from '../../model/Project';
import { User } from '../../model/User';
import { Validators } from '@angular/forms';
import { OuterSubscriber } from 'rxjs/internal/OuterSubscriber';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css'],
  providers: [DatePipe]
})

export class ProjectComponent implements OnInit {
  @ViewChild('closeAddExpenseModal') closeAddExpenseModal: ElementRef;

  projects: Project[] = [];
  managers: User[] = [];
  projectForm: FormGroup;
  responseStr: string;
  searchProjectName: number;
  editFlag: boolean;
  display: string
  selectedManager: string;
  selectedManagerId: number;
  queryString: string;
  message: string;

  constructor(private projectService: ProjectService, private datePipe: DatePipe,
    private userService: UserServiceService, private translate: TranslateService) {
    this.editFlag = false;
    this.display = 'none';
    this.projectForm = new FormGroup({
      projectId: new FormControl(0),
      project: new FormControl('', [Validators.required, Validators.pattern('[A-Za-z1-9]{2,20}')]),
      startDate: new FormControl(''),
      endDate: new FormControl(''),
      priority: new FormControl("0", Validators.pattern('[1-9]{1,100}')),
      //status:new FormControl('',Validators.pattern('[A-Za-z]{2,20}')),
      searchProjectName: new FormControl(''),
      manager: new FormControl({ value: '', disabled: true }, Validators.required),
      userId: new FormControl(''),
      dateCheckbox: new FormControl(true)
    });

  }

  checkBoxClicked() {
    //console.log("clicked");
    if (this.projectForm.controls["dateCheckbox"] != undefined &&
      this.projectForm.controls["dateCheckbox"].value) {
      this.projectForm.controls["endDate"].disable();
      this.projectForm.controls["startDate"].disable();
    } else {
      this.projectForm.controls["endDate"].enable();
      this.projectForm.controls["startDate"].enable();
    }
  }

  dateLessThan() {
    //console.log("onblur");
    let f = this.projectForm.value.startDate;
    let t = this.projectForm.value.endDate;
    //console.log("from:"+f);
    //if((f!=null && (t==null || t==undefined )) || ( t!=null && (f==null || f==undefined ))
    if (!this.projectForm.controls["dateCheckbox"].value && (t == null || t == undefined || f == null || f == undefined)) {
      this.projectForm.controls["startDate"].setErrors({ 'invalid': true });
    }
    if (this.datePipe.transform(this.projectForm.value.startDate, 'y-MM-dd') >
      this.datePipe.transform(this.projectForm.value.endDate, 'y-MM-dd')) {
      //console.log("error>>>");
      this.projectForm.controls["startDate"].setErrors({ 'invalid': true });
    } else {
      this.projectForm.controls["startDate"].setErrors(null);
    }
  }


  ngOnInit() {
    this.loadProjects();
    this.loadManagers();
  }

  loadManagers() {
    this.userService.getUsers().subscribe(
      (responseData: User[]) => {
        this.managers = responseData;
      },
      (error) => {
        // console.log('error');
        //console.log(error);
        this.responseStr = error;
      }
    );
  }

  loadProjectById(projectId: number) {
    this.message='';
    this.editFlag = true;
    var editProject = this.projects.find(p1 => p1.projectId === projectId);
    let editmanagerName: string;
    if (editProject.user != null && editProject.user.firstName != null) {
      editmanagerName = editProject.user.firstName + ' ' + editProject.user.lastName;
      this.selectedManagerId = editProject.user.userId;
    } else {
      editmanagerName = '';
    }
    // console.log(editmanagerName);
    //   this.selectedManagerId=editProject.user.userId;
    //console.log(editProject.priority);
    this.projectForm = new FormGroup({
      projectId: new FormControl(editProject.projectId),
      project: new FormControl(editProject.project),
      startDate: new FormControl(this.datePipe.transform(editProject.startDate, 'y-MM-dd')),
      endDate: new FormControl(this.datePipe.transform(editProject.endDate, 'y-MM-dd')),
      priority: new FormControl(editProject.priority),
      manager: new FormControl({ value: editmanagerName, disabled: true }, Validators.required),
      searchProjectName: new FormControl('', Validators.pattern('[A-Za-z]{2,20}')),
      userId: new FormControl(''),
      dateCheckbox: new FormControl(true)
      //status:new FormControl(editProject.status),
    });
    /*this.projectForm.patchValue({
    'manager':editmanagerName
   });*/
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
    //console.log('projects>>>'+this.projects);
  }
  resetForm() {
    this.message = '';
    this.projectForm = new FormGroup({
      projectId: new FormControl(0),
      project: new FormControl('', Validators.pattern('[A-Za-z1-9]{2,20}')),
      startDate: new FormControl(''),
      endDate: new FormControl(''),
      priority: new FormControl("0"),
      //status:new FormControl('',Validators.pattern('[A-Za-z]{2,20}')),
      searchProjectName: new FormControl('', Validators.pattern('[A-Za-z]{2,20}')),
      manager: new FormControl({ value: '', disabled: true }, Validators.required),
      userId: new FormControl('')
    });
  }
  getFormValidationErrors() {
    //console.log("Get errors>")
    //this.message  = '';
    Object.keys(this.projectForm.controls).forEach(key => {

      const controlErrors: ValidationErrors = this.projectForm.get(key).errors;
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
    if (this.projectForm.value.manager == null || this.projectForm.value.manager == undefined) {
      this.translate.get('MESSAGES.MANAGERERR').subscribe(
        (responseData: string) => {
          errorStr = responseData;
        });
      this.message = this.message + '<br/>' + errorStr;
    }

  }


  addProject(editFlag: boolean) {
    this.message = '';
    //console.log(this.projectForm.value);
    this.dateLessThan();
    //console.log(this.projectForm.invalid);
    //this.findInvalidControls();
    if (this.projectForm.invalid || this.projectForm.controls["startDate"].invalid) {
      this.getFormValidationErrors();
      return;
    }
    var projectManger = this.managers.find(m1 => m1.userId === this.selectedManagerId);
    //console.log('addManager:'+projectManger);
    var startDateJson = null;
    var endDateJson = null;
    if (this.projectForm.value.startDate != null && this.projectForm.value.startDate != undefined) {
      startDateJson = this.projectForm.value.startDate;
    }
    if (this.projectForm.value.endDate != null && this.projectForm.value.endDate != undefined) {
      endDateJson = this.projectForm.value.endDate;
    }
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
    //console.log("addProject:"+addProject);

    if (!editFlag) {
      this.projectService.addProject(addProject).subscribe(
        (responseData: Project[]) => {
          this.projects = responseData;
          this.translate.get('MESSAGES.ADDPROJECT').subscribe(
            (responseData: string) => {
              this.message = responseData;
            });

        },
        (error) => {
          //console.log('error');
          //console.log(error);
          this.responseStr = error;
        }
      );
      //console.log('inset success');
    } else {
      //this.selectedUserId =this.userForm.value.userId;
      //console.log("selectedProjectId>>");
      this.editProject(this.selectedManagerId, addProject);
      this.editFlag = false;
    }
    //this.loadUsers();
    //console.log('loaded success');
  }

  suspendProject(projectId: number) {
    this.message='';
    this.projectService.suspendProject(projectId).subscribe(
      (responseData: Project[]) => {
        this.projects = responseData;
        this.translate.get('MESSAGES.SUSPENDPROJECT').subscribe(
          (responseData: string) => {
            this.message = responseData;
          });
      },
      (error) => {
        //console.log('error');
        //console.log(error);
        this.responseStr = error;
      }
    );

  }

  editProject(editProjectId: number, editPorject: Project) {
    this.message='';
    this.projectService.editProject(editProjectId, editPorject).subscribe(
      (responseData: Project[]) => {
        this.projects = responseData;
        this.translate.get('MESSAGES.MODPROJECT').subscribe(
          (responseData: string) => {
            this.message = responseData;
          });
      },
      (error) => {
        //console.log('error');
        //console.log(error);
        this.responseStr = error;
      }
    );
  }


  searchProject() {
    this.message='';
    //console.log("search>>"+this.projectForm.value.searchProjectName)
    this.projectService.getProjectByName(this.projectForm.value.searchProjectName).subscribe(
      (responseData: Project[]) => {
        this.projects = responseData;
      },
      (error) => {
        //console.log('error');
        //console.log(error);
        this.responseStr = error;
      }
    );
  }

  sortProject(sortType: number) {
    this.message='';
    //console.log(sortType);
    this.projectService.sortProjects(sortType).subscribe(
      (responseData: Project[]) => {
        this.projects = responseData;
      },
      (error) => {
        // console.log('error');
        //console.log(error);
        this.responseStr = error;
      }
    );
  }

  selectManager(userId: number, managerName: string) {
    this.selectedManager = managerName;
    this.selectedManagerId = userId;
    this.projectForm.patchValue({
      'manager': managerName
    });
    //console.log(">>>"+this.projectForm.value.manager);
    //console.log("Manager:"+this.selectedManagerId+':'+ this.selectedManager);
    /*this.display='none';*/
    this.closeAddExpenseModal.nativeElement.click();
  }

  displayModal() {
    this.display = 'block';
  }

}
