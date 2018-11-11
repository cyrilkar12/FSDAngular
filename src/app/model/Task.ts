export class Task{

    constructor(public project:Project,public taskId:number,public taskName:string,priority:number,public parentTask:ParentTask,startDate:string,endDate:string,status:string,user:User)
    {

    }
}

export class ParentTask{


    constructor(parentId:number,parentTask:string)
    {

    }
}

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