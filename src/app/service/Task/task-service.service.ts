import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import {ParentTask} from '../../model/ParentTask';
import {Task} from '../../model/Task';
import { HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class TaskServiceService {

  constructor(private httpClient:HttpClient) { }

 getTasks():Observable<any>{
   let observables=this.httpClient.get('http://localhost:9090/task/viewTasks/')
    return observables
  }

   getParentTasks():Observable<any>{
   let observables=this.httpClient.get('http://localhost:9090/task/viewParentTasks/')
    return observables
  }

  addTask(task:Task):Observable<any>{
    console.log('insert method>>>');
    console.log(JSON.stringify(task));
   return this.httpClient.post('http://localhost:9090/task/addTask',JSON.stringify(task),httpOptions);
  }

addParentTask(parenttask:ParentTask):Observable<any>{
    console.log('parenttask insert method>>>');
    console.log(JSON.stringify(parenttask));
   return this.httpClient.post('http://localhost:9090/task/addParentTask',JSON.stringify(parenttask),httpOptions);
  }

  editTask(selectedTaskId:number,task:Task):Observable<any>{
    console.log('edit method>>>');
    console.log(JSON.stringify(task));
   return this.httpClient.put('http://localhost:9090/task/editTask/'+selectedTaskId,JSON.stringify(task),httpOptions);
  }

  getTaskByName(taskName:String):Observable<any>{
    console.log("taskName"+taskName);
   return this.httpClient.get('http://localhost:9090/task/searchTask?taskName='+taskName);
  }
   
   getTaskByProjectId(projectId:number):Observable<any>{
     return this.httpClient.get('http://localhost:9090/task/searchTask?projectId='+projectId);
   }
   sortTasks(sortType:number):Observable<any>{
   return this.httpClient.get('http://localhost:9090/task/sortTasks/'+sortType);
  }

}
