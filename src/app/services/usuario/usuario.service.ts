import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';

import 'rxjs/add/operator/map';
import Swal from 'sweetalert2';

import { Router } from '@angular/router';



@Injectable()
export class UsuarioService {

  usuario: Usuario;
  token: string;

  constructor(
    public http: HttpClient,
    public router: Router,
    public _subirArchivoService: SubirArchivoService
  ) {
    this.cargarStorage();
  }

  estaLogueado() {
    return ( this.token.length > 5 ) ? true : false;
  }

  cargarStorage() {

    if ( localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse( localStorage.getItem('usuario') );
    } else {
      this.token = '';
      this.usuario = null;
    }

  }

  guardarStorage( id: string, token: string, usuario: Usuario ) {

    localStorage.setItem('id', id );
    localStorage.setItem('token', token );
    localStorage.setItem('usuario', JSON.stringify(usuario) );

    this.usuario = usuario;
    this.token = token;
  }

  logout() {
    this.usuario = null;
    this.token = '';

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    this.router.navigate(['/login']);
  }

  loginGoogle( token: string ) {

    let url = URL_SERVICIOS + '/login/google';

    return this.http.post( url, { token } )
                .map( (resp: any) => {
                  this.guardarStorage( resp.id, resp.token, resp.usuario );
                  return true;
                });


  }

  login( usuario: Usuario, recordar: boolean = false ) {

    if ( recordar ) {
      localStorage.setItem('email', usuario.email );
    } else {
      localStorage.removeItem('email');
    }

    let url = URL_SERVICIOS + '/login';
    return this.http.post( url, usuario )
                .map( (resp: any) => {

                  this.guardarStorage( resp.id, resp.token, resp.usuario );

                  return true;
                });

  }


  crearUsuario( usuario: Usuario ) {

    let url = URL_SERVICIOS + '/usuario';

    return this.http.post( url, usuario )
              .map( (resp: any) => {

                Swal.fire({
                  position: 'top-end',
                  icon: 'success',
                  title: 'Usuario creado',
                  text: usuario.email,
                  showConfirmButton: true,
                  // timer: 1800
                });
              });
  }

  actualizarUsuario( usuario: Usuario ) {

    let url = URL_SERVICIOS + '/usuario/' + usuario._id;
    url += '?token=' + this.token;

    return this.http.put( url, usuario )
                .map( (resp: any) => {

                  // this.usuario = resp.usuario;
                  let usuarioDB: Usuario = resp.usuario;

                  this.guardarStorage( usuarioDB._id, this.token, usuarioDB );
                  Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Usuario actualizado',
                    text: usuario.nombre,
                    showConfirmButton: true,
                    // timer: 1800
                  });

                  return true;
                });

  }

  cambiarImagen( archivo: File, id: string) {

    this._subirArchivoService.subirArchivo( archivo, 'usuarios', id )
                  .then((resp: any) => {
                    this.usuario.img = resp.usuario.img;
                    Swal.fire({
                      position: 'top-end',
                      icon: 'success',
                      title: 'Imagen actualizada',
                      text: this.usuario.nombre,
                      showConfirmButton: true,
                      // timer: 1800
                    });
                    this.guardarStorage(id, this.token, this.usuario);

                  })
                  .catch( resp => {
                    console.log( resp );

                  });
  }


}
