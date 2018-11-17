import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import {User} from '../../model/User';
import { HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  constructor(private httpClient:HttpClient) { }

   getUsers():Observable<any>{
   let observables=this.httpClient.get('http://localhost:9090/FSDFinal/user/viewUsers/')
    return observables
  }

  insertUser(user:User):Observable<any>{
    console.log('insert method>>>');
    console.log(JSON.stringify(user));
   return this.httpClient.post('http://localhost:9090/FSDFinal/user/addUser',JSON.stringify(user),httpOptions);
  }

  deleteUser(userId:number):Observable<any>{
   return this.httpClient.delete('http://localhost:9090/FSDFinal/user/deleteUser/'+userId)
  }

 editUser(userId:number,user:User):Observable<any>{
    console.log(JSON.stringify(user));
   return this.httpClient.put('http://localhost:9090/FSDFinal/user/editUser/'+userId,
   user,httpOptions );
  }

  getUserByName(userName:String):Observable<any>{
   return this.httpClient.get('http://localhost:9090/FSDFinal/user/searchUser?userName='+userName);
  }
   
   sortUsers(sortType:number):Observable<any>{
   return this.httpClient.get('http://localhost:9090/FSDFinal/user/sortUsers/'+sortType);
  }

  

}
