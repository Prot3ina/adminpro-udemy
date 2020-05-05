import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// Rutas
import { AppRoutingModule } from './app-routing.module';

// Modulos
import { PagesModule } from './pages/pages.module';

// Componentes
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './login/register.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Servicios
import { ServiceModule } from './services/service.module';





@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent

  ],
  imports: [
    BrowserModule,
    PagesModule,
    FormsModule,
    ReactiveFormsModule,
    ServiceModule,
    AppRoutingModule
  ],
  providers: [  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
