import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpClientModule,HttpClient } from '@angular/common/http';
import {RouterModule} from '@angular/router'
import { AppRoutingModule } from './app-routing.module';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {APP_BASE_HREF} from '@angular/common';
import { UserComponent } from './component/user/user.component';
import { HeaderComponent } from './component/header/header.component';
import { ProjectComponent } from './component/project/project.component';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

//import {AppComponent} from '.app';
// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
   // return new TranslateHttpLoader(http);
   return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    HeaderComponent,
    ProjectComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: (HttpLoaderFactory),
            deps: [HttpClient]
          }
     }),
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule
  ],
 providers: [{provide: APP_BASE_HREF, useValue : '/' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
