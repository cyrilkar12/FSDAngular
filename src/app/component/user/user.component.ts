import { Component, OnInit, Input, EventEmitter, Output, } from '@angular/core';
import { FormGroup, FormControl, Validator, ValidationErrors } from "@angular/forms"
import { UserServiceService } from '../../service/User/user-service.service'
import { User } from '../../model/User'
import { Validators } from '@angular/forms';
import { OuterSubscriber } from 'rxjs/internal/OuterSubscriber';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  users: User[] = [];
  userForm: FormGroup;
  responseStr: string;
  selectedUserId: number;
  editFlag: boolean;
  message: string;

  constructor(private userService: UserServiceService, private translate: TranslateService) {
    this.editFlag = false;
    this.userForm = new FormGroup({
      userId: new FormControl(0),
      firstName: new FormControl('', [Validators.required, Validators.pattern('[A-Za-z]{2,20}')]),
      lastName: new FormControl('', [Validators.required, Validators.pattern('[A-Za-z]{2,20}')]),
      employeeId: new FormControl(1, [Validators.required, Validators.pattern('[1-9]{1,20}')]),
      searchUserName: new FormControl('', Validators.pattern('[A-Za-z]{2,20}'))
    });
    //   this.searchUserName='';
  }

  ngOnInit() {
    this.loadUsers()
  }

  loadUserById(userId: number) {
    this.message = '';
    this.editFlag = true;
    var editUser = this.users.find(u1 => u1.userId === userId);
    this.userForm = new FormGroup({
      userId: new FormControl(editUser.userId),
      firstName: new FormControl(editUser.firstName, [Validators.required, Validators.pattern('[A-Za-z]{2,20}')]),
      lastName: new FormControl(editUser.lastName, [Validators.required, Validators.pattern('[A-Za-z]{2,20}')]),
      employeeId: new FormControl(editUser.employeeId, [Validators.required, Validators.pattern('[1-9]{1,20}')]),
      searchUserName: new FormControl('', Validators.pattern('[A-Za-z]{2,20}'))
    });
  }

  loadUsers() {
    this.userService.getUsers().subscribe(
      (responseData: User[]) => {
        this.users = responseData;
      },
      (error) => {
        //console.log('error');
        //console.log(error);
        this.responseStr = error;
      }
    );
  }
  resetForm() {
    this.message = '';
    this.userForm = new FormGroup({
      userId: new FormControl(0),
      firstName: new FormControl('', [Validators.required, Validators.pattern('[A-Za-z]{2,20}')]),
      lastName: new FormControl('', [Validators.required, Validators.pattern('[A-Za-z]{2,20}')]),
      employeeId: new FormControl(1, [Validators.required, Validators.pattern('[1-9]{1,20}')]),
      searchUserName: new FormControl('', Validators.pattern('[A-Za-z]{2,20}'))
    });
  }

  getFormValidationErrors() {
    //console.log("Get errors>")
    //this.message  = '';
    Object.keys(this.userForm.controls).forEach(key => {

      const controlErrors: ValidationErrors = this.userForm.get(key).errors;
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
  }

  addUser(editFlag: boolean) {
    this.message = '';
    // console.log(this.userForm);
    if (!this.userForm.valid) {
      this.getFormValidationErrors();
      return;
    }
    if (!editFlag) {
      this.userService.insertUser(this.userForm.value).subscribe(
        (responseData: User[]) => {
          this.users = responseData;
          this.translate.get('MESSAGES.ADDUSER').subscribe(
            (responseData: string) => {
              this.message = responseData;
            });
        },
        (error) => {
          // console.log('error');
          // console.log(error);
          this.responseStr = error;
        }
      );
      //console.log('inset success');
    } else {
      //this.selectedUserId =this.userForm.value.userId;
      //console.log("selectedUserId>>"+this.selectedUserId);
      this.editUser(this.userForm.value.userId);
      this.editFlag = false;
    }
    //this.loadUsers();
    //console.log('loaded success');
  }

  deleteUser(userId: number) {
    this.message = '';
    this.userService.deleteUser(userId).subscribe(
      (responseData: User[]) => {
        this.users = responseData;
        this.translate.get('MESSAGES.DELUSER').subscribe(
          (responseData: string) => {
            this.message = responseData;
          });
      },
      (error) => {
        //  console.log('error');
        //console.log(error);
        this.responseStr = error;
      }
    );

  }

  editUser(editUserId: number) {
    this.message = '';
    this.userService.editUser(editUserId, this.userForm.value).subscribe(
      (responseData: User[]) => {
        this.users = responseData;
        this.translate.get('MESSAGES.MODUSER').subscribe(
          (responseData: string) => {
            this.message = responseData;
          });
      },
      (error) => {
        //  console.log('error');
        // console.log(error);
        this.responseStr = error;
      }
    );
  }


  searchUser() {
    this.message = '';
    // console.log("search>>"+this.userForm.value.searchUserName)
    this.userService.getUserByName(this.userForm.value.searchUserName).subscribe(
      (responseData: User[]) => {
        this.users = responseData;
      },
      (error) => {
        // console.log('error');
        //console.log(error);
        this.responseStr = error;
        this.message = 'Search failed' + this.responseStr;
      }
    );
  }

  sortUser(sortType: number) {
    this.message = '';
    //console.log(sortType);
    this.userService.sortUsers(sortType).subscribe(
      (responseData: User[]) => {
        this.users = responseData;
      },
      (error) => {
        // console.log('error');
        // console.log(error);
        this.responseStr = error;
      }
    );
  }

}
