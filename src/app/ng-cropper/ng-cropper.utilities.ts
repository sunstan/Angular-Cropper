import {min, max} from 'lodash';

export function getMinScale(image: HTMLImageElement, cropWidth: number, cropHeight: number, angle: number = 0): number {
    if (angle % 180 === 0) {
        const minScaleWidth = cropWidth / image.naturalWidth;
        const minScaleHeight = cropHeight / image.naturalHeight;
        return max([minScaleWidth, minScaleHeight]);
    } else {
        const minScaleWidth = cropWidth / image.naturalHeight;
        const minScaleHeight = cropHeight / image.naturalWidth;
        return max([minScaleWidth, minScaleHeight]);
    }
}

export function valueIn(value: number, min: number, max: number): number {
    return value < min ? min : value > max ? max : value;
}

export function valueOut(value: number, min: number, max: number): number {
    return value > max ? max : value < min ? min : value;
}

export function valueMax(value: number, max: number): number {
    return value > max ? max : value;
}

export function limitTop(image: HTMLImageElement, top: number, height: number, scale: number): number {
    const limit = (image.naturalHeight * scale - height) / 2 / scale;
    return top < -limit ? -limit : top > limit ? limit : top;
}

export function limitLeft(image: HTMLImageElement, left: number, width: number, scale: number): number {
    const limit = (image.naturalWidth * scale - width) / 2 / scale;
    return left < -limit ? -limit : left > limit ? limit : left;
}

export function fill(width: number, height: number, cropWidth: number, cropHeight: number): boolean {
    return min([width, height]) >= max([cropWidth, cropHeight]);
}

export async function getImageFromFile(file: File): Promise<HTMLImageElement> {

    const image = new Image();
    const reader = new FileReader();

    return new Promise<HTMLImageElement>(resolve => {
        reader.readAsDataURL(file);
        reader.onerror = err => this.onClose(err);
        reader.onload = () => {
            image.src = reader.result as string;
            image.onerror = err => this.onClose(err);
            image.onload = () => resolve(image);
        };
    });
}
