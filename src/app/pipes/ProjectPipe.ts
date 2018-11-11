import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'ProjectPipe',
})
export class ProjectPipe implements PipeTransform {
    transform(value: any, input: string) {
        if (input) {
            input = input.toLowerCase();
            return value.filter(function (el: any) {
                return el.project.toLowerCase().indexOf(input) > -1;
            })
        }
        return value;
    }
}