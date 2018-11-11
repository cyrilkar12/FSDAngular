import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'TaskPipe',
})
export class TaskPipe implements PipeTransform {
    transform(value: any, input: string) {
        if (input) {
            input = input.toLowerCase();
            return value.filter(function (el: any) {
                return el.taskName.toLowerCase().indexOf(input) > -1;
            })
        }
        return value;
    }
}