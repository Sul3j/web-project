import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MoviesComponent } from './components/movies/movies.component';
import {HttpClientModule} from "@angular/common/http";
import {FeatherModule} from "angular-feather";
import {Edit, Trash2, Plus} from "angular-feather/icons";
import { ToastrModule } from 'ngx-toastr';
import {ReactiveFormsModule} from "@angular/forms";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

const icons = {
  Trash2,
  Edit,
  Plus
}

@NgModule({
  declarations: [
    AppComponent,
    MoviesComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FeatherModule.pick(icons),
    ToastrModule.forRoot(),
    ReactiveFormsModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
