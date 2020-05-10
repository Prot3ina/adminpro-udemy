import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ModalUploadService } from '../components/modal-upload/modal-upload.service';




import {
  SidebarService,
  SharedService,
  SettingsService,
  UsuarioService,
  SubirArchivoService,
  HospitalService,
  MedicoService,
  LoginGuardGuard
  } from './service.index';


@NgModule({
  declarations: [

  ],
  providers: [
    SidebarService,
    SharedService,
    SettingsService,
    UsuarioService,
    SubirArchivoService,
    HospitalService,
    ModalUploadService,
    MedicoService,
    LoginGuardGuard
  ],
  imports: [
    CommonModule,
    HttpClientModule
  ]
})
export class ServiceModule { }
