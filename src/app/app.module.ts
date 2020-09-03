import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {NgCropperModule} from './ng-cropper/ng-cropper.module';

@NgModule({
    imports: [
        BrowserModule,
        NgCropperModule,
    ],
    declarations: [
        AppComponent,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
