export class Task {

    constructor(public taskId: number, public taskName: string, public priority: number, public startDate: string, public endDate: string, public status: string, public parentTask: ParentTask, public project: Project, public user: User) {

    }
}

export class ParentTask {

    constructor(public parentTaskId: number, public parentTaskName: string) {

    }
}

export class Project {

    constructor(public projectId: number, public project: string, public startDate: string, public endDate: string, public priority: string,
        public numberOfTasks: number, public completedTasks: number, public user: User) {

    }
}

export class User {


    constructor(public userId: number, public firstName: string, public lastName: string, public employeeId: number) {

    }
}