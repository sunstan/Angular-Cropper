import {ElementRef, Directive, HostListener, Output, EventEmitter, Input} from '@angular/core';

@Directive({selector: '[appDraggable]'})
export class DraggableDirective {

    private offsetX: number;
    private offsetY: number;
    private dragging = false;

    @Input() appDraggable: boolean;
    @Output() Drag = new EventEmitter<number[]>();
    @Output() DragEnd = new EventEmitter<number[]>();

    constructor(private element: ElementRef) {}

    @HostListener('pointerdown', ['$event'])
    onPointerStart(event: PointerEvent): void {
        if (!this.appDraggable) return;
        this.dragging = true;
        this.offsetX = event.clientX;
        this.offsetY = event.clientY;
    }

    @HostListener('document:pointermove', ['$event'])
    onPointerMove(event: PointerEvent): void {
        if (!this.dragging) return;
        this.Drag.emit([
            event.clientX - this.offsetX,
            event.clientY - this.offsetY,
        ]);
    }

    @HostListener('document:pointerup', ['$event'])
    onPointerEnd(event: PointerEvent): void {
        if (this.dragging) {
            this.dragging = false;
            this.DragEnd.emit([
                event.clientX - this.offsetX,
                event.clientY - this.offsetY,
            ]);
        }
    }
}
