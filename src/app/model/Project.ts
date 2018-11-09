export class Project{

    constructor(public projectId:number,public project:string, public startDate:string,public endDate:string, public priority:string,
     public numberOfTasks:number,public completedTasks:number,public user:User)
    {

    }
}

export class User{


    constructor(public userId:number,public firstName:string, public lastName:string, public employeeId:number)
    {

    }
}