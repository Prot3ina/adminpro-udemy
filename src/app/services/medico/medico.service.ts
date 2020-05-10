import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UsuarioService } from '../usuario/usuario.service';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';
import { URL_SERVICIOS } from '../../config/config';
import Swal from 'sweetalert2';
import { Medico } from '../../models/medico.model';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  totalMedicos: number = 0;

  constructor(
    public http: HttpClient,
    public router: Router,
    public _usuarioService: UsuarioService,
    public _subirArchivoService: SubirArchivoService
  ) { }



  cargarMedicos( desde: number = 0 ) {

    let url = URL_SERVICIOS + '/medico?desde=' + desde;
    return this.http.get( url )
            .map( (resp: any) => {
              this.totalMedicos = resp.total;
              return resp.medicos;
            });
  }

  cargarMedico( id: string ) {

    let url = URL_SERVICIOS + '/medico/' + id;

    return this.http.get( url )
              .map( (resp: any) => resp.medico );

  }

  buscarMedicos( termino: string ) {

    let url = URL_SERVICIOS + '/busqueda/coleccion/medicos/' + termino;
    return this.http.get( url )
                   .map((resp: any) => resp.medicos );

  }

  borrarMedico(id: string) {
    let url = URL_SERVICIOS + '/medico/' + id;
    url += '?token=' + this._usuarioService.token;
    return this.http.delete( url )
               .map( resp => {
                Swal.fire(
                  'Medico Borrado',
                  'El medico ha sido eliminado correctamente',
                  'success'
                );
                return true;
               });
  }

  guardarMedico( medico: Medico ) {

    let url = URL_SERVICIOS + '/medico';

    if ( medico._id ) {
      // actualizando
      url += '/' + medico._id;
      url += '?token=' + this._usuarioService.token;

      return this.http.put( url, medico )
                .map( (resp: any) => {
                      Swal.fire({
                        icon: 'success',
                        title: 'Medico Actualizado',
                        text: medico.nombre,
                        showConfirmButton: false,
                        timer: 1500
                      });
                      return resp.medico;

                    });

    } else {
      url += '?token=' + this._usuarioService.token;
      return this.http.post( url, medico )
          .map( (resp: any) => {

            Swal.fire({
              icon: 'success',
              title: 'Medico creado',
              text: medico.nombre,
              showConfirmButton: false,
              timer: 1500
            });

            return resp.medico;
          });

    }





  }




}


