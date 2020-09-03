import {Directive, EventEmitter, HostListener, Input, Output} from '@angular/core';

@Directive({selector: '[appScrollable]'})
export class ScrollableDirective {

    @Input() appScrollable: boolean;
    @Output() scrollX = new EventEmitter<number>();
    @Output() scrollY = new EventEmitter<number>();

    @HostListener('wheel', ['$event'])
    wheel(event): void {
        if (!this.appScrollable) return;
        this.scrollX.emit(event.deltaX);
        this.scrollY.emit(event.deltaY);
    }
}
