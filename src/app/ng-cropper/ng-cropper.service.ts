import {DataModel} from './models/data.model';
import {ConfigModel} from './models/config.model';
import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {max} from 'lodash';

@Injectable()
export class NgCropperService {

    range = 0;

    config: ConfigModel;
    image: HTMLImageElement;

    data$ = new BehaviorSubject<DataModel>(null);

    get data(): DataModel {
        return this.data$.getValue();
    }

    set data(data: DataModel) {
        this.data$.next(data);
    }

    cropped(): HTMLCanvasElement {

        const {top, left, scale, angle} = this.data;
        const width = angle % 180 === 0 ? this.config.width : this.config.height;
        const height = angle % 180 === 0 ? this.config.height : this.config.width;

        const [x, y] = this.origin(top, left);
        const sy = y - (height / 2 / scale);
        const sx = x - (width / 2 / scale);
        const sw = width / scale;
        const sh = height / scale;

        const cropped = document.createElement('canvas');
        const ctx = cropped.getContext('2d');

        ctx.canvas.width = this.config.width;
        ctx.canvas.height = this.config.height;
        ctx.translate(this.config.width / 2, this.config.height / 2);
        ctx.rotate(angle * Math.PI / 180);
        ctx.translate(-width / 2, -height / 2);
        ctx.drawImage(this.image, sx, sy, sw, sh, 0, 0, width, height);

        return cropped;
    }

    scale(range: number): void {

        range = Number(range);
        range = this.valueIn(range, 0, 100);

        const data = this.data;
        const minScale = this.minScale(data.angle);
        const scale = minScale + ((1 - minScale) * range / 100);
        const left = this.left(data.left, scale, data.angle);
        const top = this.top(data.top, scale, data.angle);

        this.data = {...data, scale, top, left};
        this.range = range;
    }

    rotate(degrees: number): void {

        const data = this.data;

        let angle = data.angle + degrees;
        if (angle === 360) angle = 0;
        if (angle < 0) angle = 270;

        const minScale = this.minScale(angle);
        const scale = minScale <= data.scale
            ? data.scale
            : minScale;

        const left = this.left(data.left, scale, angle);
        const top = this.top(data.top, scale, angle);
        this.data = {...data, angle, scale, top, left};
        this.range = (scale - minScale) / (1 - minScale) * 100;
    }

    minScale(angle: number = 0): number {
        if (angle % 180 === 0) {
            const minScaleWidth = this.config.width / this.image.naturalWidth;
            const minScaleHeight = this.config.height / this.image.naturalHeight;
            return max([minScaleWidth, minScaleHeight]);
        } else {
            const minScaleWidth = this.config.width / this.image.naturalHeight;
            const minScaleHeight = this.config.height / this.image.naturalWidth;
            return max([minScaleWidth, minScaleHeight]);
        }
    }

    origin(top: number, left: number): number[] {
        const x = this.image.naturalWidth / 2 - left;
        const y = this.image.naturalHeight / 2 - top;
        return [x, y];
    }

    top(top: number, scale: number, angle: number): number {

        const size = angle % 180 === 0
            ? this.config.height
            : this.config.width;

        const limit = Math.floor((this.image.naturalHeight * scale - size) / 2 / scale);
        return top < -limit ? -limit : top > limit ? limit : top;
    }

    left(left: number, scale: number, angle: number): number {

        const size = angle % 180 === 0
            ? this.config.width
            : this.config.height;

        const limit = Math.floor((this.image.naturalWidth * scale - size) / 2 / scale);
        return left < -limit ? -limit : left > limit ? limit : left;
    }

    gaps(translation: number[], data: DataModel): number[]  {
        const [translationX, translationY] = translation;
        const {top, left, angle, scale} = data;
        const X = translationX / scale;
        const Y = translationY / scale;

        switch (angle) {
            case 0  : return [this.left(left + X, scale, angle), this.top(top + Y, scale, angle)];
            case 180: return [this.left(left - X, scale, angle), this.top(top - Y, scale, angle)];
            case 90 : return [this.left(left + Y, scale, angle), this.top(top - X, scale, angle)];
            case 270: return [this.left(left - Y, scale, angle), this.top(top + X, scale, angle)];
        }
    }

    valueIn(value: number, mini: number, maxi: number): number {
        return value < mini ? mini : value > maxi ? maxi : value;
    }
}
