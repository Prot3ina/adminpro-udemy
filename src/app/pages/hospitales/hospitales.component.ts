import { Component, OnInit } from '@angular/core';
import { HospitalService } from '../../services/service.index';
import { Hospital } from '../../models/hospital.model';
import Swal from 'sweetalert2';
import { ModalUploadService } from 'src/app/components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit {

  hospitales: Hospital[] = [];
  desde: number = 0;

  cargando: boolean = true;

  constructor(
    public _hospitalService: HospitalService,
    public _modalUploadService: ModalUploadService
  ) { }

  ngOnInit(): void {
    this.cargarHospitales();

    this._modalUploadService.notificacion
             .subscribe( (resp: any) => this.cargarHospitales());

  }

  mostrarModal( hospital: Hospital) {

    this._modalUploadService.mostrarModal('hospitales', hospital._id);

  }

  cargarHospitales() {

    this.cargando = true;

    this._hospitalService.cargarHospitales( this.desde )
             .subscribe( (hospitales: any) => {
               this.hospitales = hospitales;
               this.cargando = false;
             });
  }

  cambiarDesde( valor: number ) {
    let desde = this.desde + valor;

    if ( desde >= this._hospitalService.totalHospitales ) {
      return;
    }

    if ( desde < 0 ) {
      return;
    }
    this.desde += valor;
    this.cargarHospitales();
  }

  buscarHospital( termino: string ) {
    if ( termino.length <= 0 ) {
      this.cargarHospitales();
      return;
    }

    this.cargando = true;

    this._hospitalService.buscarHospitales( termino )
            .subscribe( (hospitales: Hospital[]) => {
              this.hospitales = hospitales;
              this.cargando = false;
            });
  }

  borrarHospital( hospital: Hospital ) {

    Swal.fire({
      title: '¿Estas seguro?',
      text: 'Estas a punto de borrar ' + hospital.nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#229954',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrar hospital'
    }).then((borrar) => {
      console.log( borrar );
      if (borrar.value === true ) {

        this._hospitalService.borrarHospital( hospital._id)
                      .subscribe(borrado => {
                        this.cargarHospitales();
                      });
      }
    });

  }

  guardarHospital(hospital: Hospital) {

    this._hospitalService.actualizarHospital( hospital)
                     .subscribe();

  }

  crearHospital() {
    Swal.fire({
      title: 'Crear hospital',
      text: 'Ingrese el nombre del Hospital',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Crear Hospital',
      showLoaderOnConfirm: true,
    }).then((valor) => {
      if ( !valor.value || valor.value.length === 0) {
        return;
      }

      this._hospitalService.crearHospital( valor.value )
            .subscribe( () => this.cargarHospitales());
    });
  }


}
