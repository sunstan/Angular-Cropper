import {Component} from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    edit: boolean;
    cropped: HTMLCanvasElement;

    toggleEdit(): void {
        this.edit = !this.edit;
    }
}
