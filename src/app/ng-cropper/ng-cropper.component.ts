import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {NgCropperService} from './ng-cropper.service';

@Component({
    selector: 'app-ng-cropper',
    templateUrl: './ng-cropper.component.html',
    styleUrls: ['./ng-cropper.component.scss'],
})
export class NgCropperComponent implements OnInit {

    @Input() width      = 300;
    @Input() height     = 300;

    @Input() slider     = true;
    @Input() controls   = true;
    @Input() rotation   = true;
    @Input() scallable  = true;
    @Input() draggable  = true;
    @Input() scrollable = true;

    @Output() exit      = new EventEmitter<any>();
    @Output() cropped   = new EventEmitter<any>();
    @Output() original  = new EventEmitter<any>();

    @ViewChild('canvas', {static: false}) canvas: ElementRef;
    @ViewChild('container', {static: false}) container: ElementRef;

    constructor(public cropper: NgCropperService) {}

    ngOnInit(): void {

        this.cropper.config = {
            width: this.width,
            height: this.height,
            slider: this.slider,
            controls: this.controls,
            rotation: this.rotation,
            scallable: this.scallable,
            draggable: this.draggable,
            scrollable: this.scrollable,
        };
    }

    onSubmit(): void {

        const original = this.cropper.image;
        const cropped = this.cropper.cropped();

        this.cropper.image = null;
        this.cropped.emit(cropped);
        this.original.emit(original);
        this.exit.emit();
    }

    onCancel(): void {
        if (this.cropper.image) this.cropper.image = null;
        else this.exit.emit();
    }
}
