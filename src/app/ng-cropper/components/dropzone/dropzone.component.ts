import {AfterViewInit, Component, ElementRef, Input, Renderer2, ViewChild} from '@angular/core';
import {NgCropperService} from '../../ng-cropper.service';

@Component({
    selector: 'app-dropzone',
    templateUrl: 'dropzone.component.html',
    styleUrls: ['./../../ng-cropper.component.scss'],
})
export class DropzoneComponent implements AfterViewInit {

    public error: any;
    public dropping: boolean;

    @Input() btn = 'Rechercher votre photo';
    @Input() text = 'Déposer votre photo ici';

    @ViewChild('input', {static: false}) input: ElementRef;
    @ViewChild('dropzone', {static: false}) dropzone: ElementRef;

    constructor(
        private renderer: Renderer2,
        private cropper: NgCropperService,
    ) {
    }

    ngAfterViewInit(): void {

        const {width, height} = this.cropper.config;
        this.dropzone.nativeElement.style.width = width + 'px';
        this.dropzone.nativeElement.style.height = height + 'px';

        this.renderer.listen(this.dropzone.nativeElement, 'dragend', () => false);
        this.renderer.listen(this.dropzone.nativeElement, 'dragover', () => false);
        this.renderer.listen(this.dropzone.nativeElement, 'dragenter', () => this.dropping = true);
        this.renderer.listen(this.dropzone.nativeElement, 'dragleave', () => this.dropping = false);
        this.renderer.listen(this.dropzone.nativeElement, 'drop', event => {
            event.preventDefault();
            this.dropping = false;
            this.drop(event.dataTransfer.files);
        });

        this.renderer.listen(this.input.nativeElement, 'change', event => {
            if (event.target.files) this.drop(event.target.files);
            this.input.nativeElement.value = null;
        });
    }

    public emptyError(): void {
        this.error = null;
    }

    private drop(files: FileList): void {
        // Si files[0] !isValidFile => ngCropperService.image = file

        const image = new Image();
        const reader = new FileReader();

        reader.readAsDataURL(files[0]);
        reader.onerror = err => this.error = err;
        reader.onload = () => {
            image.src = reader.result as string;
            image.onerror = err => this.error = err;
            image.onload = () => this.cropper.image = image;
        };
    }

    private isValidFile(file: File): boolean {
        return true;
    }
}
