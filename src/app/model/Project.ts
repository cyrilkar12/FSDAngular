export class Project{


    constructor(public projectId:number,public project:string, public startDate:string,public endDate:string, public priority:string,
     public numberOfTasks:number,public completedTasks:number)
    {

    }
}