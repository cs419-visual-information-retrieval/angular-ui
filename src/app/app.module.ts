import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { NgxFlexMasonryGridModule } from "@offensichtbar-codestock/ngx-flex-masonry-grid";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxFlexMasonryGridModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
