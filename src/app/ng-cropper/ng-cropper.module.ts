import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgCropperService} from './ng-cropper.service';
import {ScrollableDirective} from './directives/scrollable.directive';
import {DropzoneComponent} from './components/dropzone/dropzone.component';
import {ControlsComponent} from './components/controls/controls.component';
import {PreviewComponent} from './components/preview/preview.component';
import {NgCropperComponent} from './ng-cropper.component';
import {DraggableDirective} from './directives/draggable.directive';

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        DropzoneComponent,
        ScrollableDirective,
        NgCropperComponent,
        ControlsComponent,
        PreviewComponent,

        DraggableDirective,
    ],
    exports: [
        NgCropperComponent,
    ],
    providers: [
        NgCropperService,
    ]
})
export class NgCropperModule {}
