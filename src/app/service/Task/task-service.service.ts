import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { ParentTask } from '../../model/ParentTask';
import { Task } from '../../model/Task';
import { HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class TaskServiceService {

  constructor(private httpClient: HttpClient, private translateService: TranslateService) {
    httpOptions.headers =
      httpOptions.headers.set('Accept-Language', this.translateService.currentLang);
    ////console.log("lang>>>" + this.translateService.currentLang);
  }

  getTasks(): Observable<any> {
    let observables = this.httpClient.get('http://localhost:9090/FSDFinal/task/viewTasks/')
    return observables
  }

  getParentTasks(): Observable<any> {
    let observables = this.httpClient.get('http://localhost:9090/FSDFinal/task/viewParentTasks/')
    return observables
  }

  addTask(task: Task): Observable<any> {
    //console.log('insert method>>>');
    //console.log(JSON.stringify(task));
    return this.httpClient.post('http://localhost:9090/FSDFinal/task/addTask', JSON.stringify(task), httpOptions);
  }

  addParentTask(parenttask: ParentTask): Observable<any> {
    //console.log('parenttask insert method>>>');
    //console.log(JSON.stringify(parenttask));
    return this.httpClient.post('http://localhost:9090/FSDFinal/task/addParentTask', JSON.stringify(parenttask), httpOptions);
  }

  editTask(selectedTaskId: number, task: Task): Observable<any> {
    //console.log('edit method>>>');
    //console.log(JSON.stringify(task));
    return this.httpClient.put('http://localhost:9090/FSDFinal/task/editTask/' + selectedTaskId, JSON.stringify(task), httpOptions);
  }

  getTaskByName(taskName: String): Observable<any> {
    //console.log("taskName" + taskName);
    return this.httpClient.get('http://localhost:9090/FSDFinal/task/searchTask?taskName=' + taskName);
  }

  getTaskByProjectId(projectId: number): Observable<any> {
    return this.httpClient.get('http://localhost:9090/FSDFinal/task/searchTask?projectId=' + projectId);
  }

  getTaskByTaskId(taskId: string): Observable<any> {
    return this.httpClient.get('http://localhost:9090/FSDFinal/task/getTask/' + taskId);
  }

  sortTasks(sortType: number): Observable<any> {
    return this.httpClient.get('http://localhost:9090/FSDFinal/task/sortTasks/' + sortType);
  }

}
