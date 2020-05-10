import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { URL_SERVICIOS } from '../../config/config';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';

import 'rxjs/add/operator/map';
import Swal from 'sweetalert2';
import { Hospital } from '../../models/hospital.model';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  // token: string;
  hospital: Hospital;
  totalHospitales: number = 0;


  constructor(
    public http: HttpClient,
    public router: Router,
    public _usuarioService: UsuarioService,
    public _subirArchivoService: SubirArchivoService
  ) {

  }




  cargarHospitales( desde: number = 0 ) {

    let url = URL_SERVICIOS + '/hospital?desde=' + desde;
    return this.http.get( url )
            .map( (resp: any) => {
              this.totalHospitales = resp.total;
              return resp.hospitales;
            });
  }

  obtenerHospitales( id: string ) {

    let url = URL_SERVICIOS + '/hospital/' + id;
    return this.http.get( url )
                   .map((resp: any) => resp.hospital );
  }

  borrarHospital(id: string) {
    let url = URL_SERVICIOS + '/hospital/' + id;
    url += '?token=' + this._usuarioService.token;
    return this.http.delete( url )
               .map( resp => {
                Swal.fire(
                  'Hospital Borrado',
                  'El hospital a sido eliminado correctamente',
                  'success'
                );
                return true;
               });
  }

  crearHospital( nombre: string ) {

    let url = URL_SERVICIOS + '/hospital';
    url += '?token=' + this._usuarioService.token;

    return this.http.post( url, { nombre } )
              .map( (resp: any) => {

                Swal.fire({
                  icon: 'success',
                  title: 'Hospital creado',
                  text: resp.nombre,
                  showConfirmButton: true,
                  // timer: 1800
                });
                return resp.hospital;
              });
  }



  buscarHospitales( termino: string ) {

    let url = URL_SERVICIOS + '/busqueda/coleccion/hospitales/' + termino;
    return this.http.get( url )
                   .map((resp: any) => resp.hospitales );

  }

  actualizarHospital( hospital: Hospital ) {

    let url = URL_SERVICIOS + '/hospital/' + hospital._id;
    url += '?token=' + this._usuarioService.token;

    return this.http.put( url, hospital )
                .map( (resp: any) => {

                  Swal.fire({
                    icon: 'success',
                    title: 'Usuario actualizado',
                    text: hospital.nombre,
                    showConfirmButton: true,
                    timer: 1500
                  });

                  return resp.hospital;
                });

  }

  cambiarImagen( archivo: File, id: string) {

    this._subirArchivoService.subirArchivo( archivo, 'hospitales', id )
                  .then((resp: any) => {
                    this.hospital.img = resp.hospital.img;
                    Swal.fire({
                      icon: 'success',
                      title: 'Imagen actualizada',
                      text: this.hospital.nombre,
                      showConfirmButton: true,
                      // timer: 1800
                    });

                  })
                  .catch( resp => {
                    console.log( resp );

                  });
  }

}
