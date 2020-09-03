import {Component, Input} from '@angular/core';
import {NgCropperService} from '../../ng-cropper.service';

@Component({
    selector: 'app-controls',
    templateUrl: 'controls.component.html',
    styleUrls: ['./../../ng-cropper.component.scss'],
})
export class ControlsComponent{

    constructor(public cropper: NgCropperService) {}
}
