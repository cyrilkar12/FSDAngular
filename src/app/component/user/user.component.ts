import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import {FormGroup, FormControl, Validator} from "@angular/forms"
import {UserServiceService} from '../../service/User/user-service.service'
import {User} from '../../model/User'
import { Validators } from '@angular/forms';
import { OuterSubscriber } from 'rxjs/internal/OuterSubscriber';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
users:User[]=[];
userForm:FormGroup;
responseStr:string;
selectedUserId:number;
editFlag:boolean;
  constructor(private userService:UserServiceService) { 
    this.editFlag = false;
    this.userForm=new FormGroup({
       userId:new FormControl(0),
       firstName:new FormControl('',Validators.pattern('[A-Za-z]{2,20}')),
       lastName:new FormControl('',Validators.pattern('[A-Za-z]{2,20}')),
       employeeId:new FormControl(1,Validators.pattern('[1-9]{1,20}')),
       searchUserName:new FormControl('',Validators.pattern('[A-Za-z]{2,20}'))
    });
 //   this.searchUserName='';
  }

  ngOnInit() {
    this.loadUsers()
  }

  loadUserById(userId:number){
    this.editFlag = true;
    var editUser = this.users.find(u1=>u1.userId===userId);
    this.userForm=new FormGroup({
       userId:new FormControl(editUser.userId),
       firstName:new FormControl(editUser.firstName,Validators.pattern('[A-Za-z]{2,20}')),
       lastName:new FormControl(editUser.lastName,Validators.pattern('[A-Za-z]{2,20}')),
       employeeId:new FormControl(editUser.employeeId,Validators.pattern('[1-9]{1,20}')),
       searchUserName:new FormControl('',Validators.pattern('[A-Za-z]{2,20}'))
    });
  }

  loadUsers(){
     this.userService.getUsers().subscribe(
      (responseData:User[])=>{
        this.users=responseData;
      },
      (error)=>{
        console.log('error');
        console.log(error);
        this.responseStr = error;
      }
    );
  }
  resetForm(){
   this.userForm=new FormGroup({
       userId:new FormControl(0),
       firstName:new FormControl('',Validators.pattern('[A-Za-z]{2,20}')),
       lastName:new FormControl('',Validators.pattern('[A-Za-z]{2,20}')),
       employeeId:new FormControl(1,Validators.pattern('[1-9]{1,20}')),
       searchUserName:new FormControl('',Validators.pattern('[A-Za-z]{2,20}'))
   }); 
  }

  addUser(editFlag:boolean){
    console.log(this.userForm);
    if(!editFlag){
    this.userService.insertUser(this.userForm.value).subscribe(
      (responseData:User[])=>{
        this.users=responseData;
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
      console.log("selectedUserId>>"+this.selectedUserId);
      this.editUser(this.userForm.value.userId); 
      this.editFlag=false;     
    }
    //this.loadUsers();
    //console.log('loaded success');
  }

 deleteUser(userId:number){
      this.userService.deleteUser(userId).subscribe(
      (responseData:User[])=>{
        this.users=responseData;
      },
      (error)=>{
        console.log('error');
        console.log(error);
        this.responseStr = error;
      }
    );

  }

editUser(editUserId:number){
 this.userService.editUser(editUserId,this.userForm.value).subscribe(
      (responseData:User[])=>{
        this.users=responseData;
      },
      (error)=>{
        console.log('error');
        console.log(error);
        this.responseStr = error;
      }
    );
 }


 searchUser(){
   console.log("search>>"+this.userForm.value.searchUserName)
  this.userService.getUserByName(this.userForm.value.searchUserName).subscribe(
      (responseData:User[])=>{
        this.users=responseData;
      },
      (error)=>{
        console.log('error');
        console.log(error);
        this.responseStr = error;
      }
    );
 }

 sortUser(sortType:number){
   console.log(sortType);
  this.userService.sortUsers(sortType).subscribe(
      (responseData:User[])=>{
        this.users=responseData;
      },
      (error)=>{
        console.log('error');
        console.log(error);
        this.responseStr = error;
      }
    );
 }

}
