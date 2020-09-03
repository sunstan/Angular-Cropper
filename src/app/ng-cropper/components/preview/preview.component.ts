import {DataModel} from '../../models/data.model';
import {ElementRef, Component, OnDestroy, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {NgCropperService} from '../../ng-cropper.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
    selector: 'app-preview',
    templateUrl: 'preview.component.html',
    styleUrls: ['./../../ng-cropper.component.scss'],
})
export class PreviewComponent implements OnDestroy, AfterViewInit {

    private destroy$ = new Subject<boolean>();

    @ViewChild('canvas', {static: true}) canvas: ElementRef;
    @ViewChild('preview', {static: true}) preview: ElementRef;

    constructor(public cropper: NgCropperService) {
    }

    ngAfterViewInit(): void {

        const image = this.cropper.image;
        const scale = this.cropper.minScale();
        const ctx = this.canvas.nativeElement.getContext('2d');
        const {width, height} = this.cropper.config;

        ctx.canvas.width = image.naturalWidth;
        ctx.canvas.height = image.naturalHeight;
        ctx.drawImage(this.cropper.image, 0, 0);

        this.preview.nativeElement.style.width = width + 'px';
        this.preview.nativeElement.style.height = height + 'px';
        this.cropper.data = {scale, top: 0, left: 0, angle: 0};

        this.cropper.data$.asObservable()
            .pipe(takeUntil(this.destroy$))
            .subscribe((data: DataModel) => this.transform(data));

        this.onResize();
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    onDrag(translation: number[]): void {
        const data = this.cropper.data;
        const [shiftX, shiftY] = this.cropper.gaps(translation, data);
        const left = this.cropper.left(shiftX, data.scale, data.angle);
        const top = this.cropper.top(shiftY, data.scale, data.angle);

        this.transform({...data, top, left});
    }

    onDragEnd(translation: number[]): void {
        const data = this.cropper.data;
        const [left, top] = this.cropper.gaps(translation, data);
        this.cropper.data = {...data, left, top};
    }

    onResize(): void {
        const {width, height} = this.cropper.config;
        const card = this.preview.nativeElement.parentNode;
        const style = getComputedStyle(card);
        const maxWidth = parseFloat(style.width)
            - parseFloat(style.paddingLeft)
            - parseFloat(style.paddingRight);

        const ratio = maxWidth / width;
        const maxHeight = height * ratio;
        const marginX = -(width - maxWidth) / 2;
        const marginY = -(height - maxHeight) / 2;

        this.preview.nativeElement.style.marginTop = marginY + 'px';
        this.preview.nativeElement.style.marginLeft = marginX + 'px';
        this.preview.nativeElement.style.marginRight = marginX + 'px';
        this.preview.nativeElement.style.marginBottom = marginY + 'px';
        this.preview.nativeElement.style.transform = 'scale(' + ratio + ')';
    }

    private transform(data: DataModel): void {
        const [x, y] = this.cropper.origin(data.top, data.left);
        this.canvas.nativeElement.style.transformOrigin = x + 'px ' + y + 'px';
        this.canvas.nativeElement.style.transform =
            'translate(' + data.left + 'px, ' + data.top + 'px) ' +
            'rotate(' + data.angle + 'deg) ' +
            'scale(' + data.scale + ')';
    }
}
