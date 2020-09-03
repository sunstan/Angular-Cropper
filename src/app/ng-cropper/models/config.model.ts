export interface ConfigModel {
    readonly width: number;
    readonly height: number;

    readonly slider: boolean;
    readonly controls: boolean;
    readonly rotation: boolean;
    readonly scallable: boolean;
    readonly draggable: boolean;
    readonly scrollable: boolean;
}
