import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import {Project} from '../../model/Project';
import { HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private httpClient:HttpClient) { }

     getProjects():Observable<any>{
   let observables=this.httpClient.get('http://localhost:9090/project/viewProjects/')
    return observables
  }

  addProject(project:Project):Observable<any>{
    console.log('insert method>>>');
    console.log(JSON.stringify(project));
   return this.httpClient.post('http://localhost:9090/project/addProject',JSON.stringify(project),httpOptions);
  }

  suspendProject(projectId:number):Observable<any>{
   return this.httpClient.delete('http://localhost:9090/project/deleteProject/'+projectId);
  }

 editProject(projectId:number,project:Project):Observable<any>{
    console.log(JSON.stringify(project));
   return this.httpClient.put('http://localhost:9090/project/editProject/'+projectId,
   project,httpOptions );
  }

  getProjectByName(projectName:String):Observable<any>{
   return this.httpClient.get('http://localhost:9090/project/searchProject?projectName='+projectName);
  }
   
   sortProjects(sortType:number):Observable<any>{
   return this.httpClient.get('http://localhost:9090/project/sortProjects/'+sortType);
  }

}
