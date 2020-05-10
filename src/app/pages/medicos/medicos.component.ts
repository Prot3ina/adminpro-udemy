import { Component, OnInit } from '@angular/core';
import { Medico } from '../../models/medico.model';
import { MedicoService } from '../../services/service.index';
import Swal from 'sweetalert2';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';


@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: []
})
export class MedicosComponent implements OnInit {

  medicos: Medico[] = [];
  desde: number = 0;

  cargando: boolean = true;


  constructor(
    public _medicoService: MedicoService,
    public _modalUploadService: ModalUploadService
  ) { }

  ngOnInit(): void {
    this.cargarMedicos();
  }


  cargarMedicos() {

    this.cargando = true;

    this._medicoService.cargarMedicos( this.desde )
             .subscribe( (medicos: any) => {
               this.medicos = medicos;
               this.cargando = false;
             });
  }

  cambiarDesde( valor: number ) {
    let desde = this.desde + valor;

    if ( desde >= this._medicoService.totalMedicos ) {
      return;
    }

    if ( desde < 0 ) {
      return;
    }
    this.desde += valor;
    this.cargarMedicos();
  }

  mostrarModal( medico: Medico) {

    this._modalUploadService.mostrarModal('medicos', medico._id);

  }

  buscarMedico( termino: string ) {

    if ( termino.length <= 0 ) {
      this.cargarMedicos();
      return;
    }

    this._medicoService.buscarMedicos( termino )
             .subscribe( (medicos: Medico[]) => {
               this.medicos = medicos;
               this.cargando = false;

             });

  }

  borrarMedico( medico: Medico ) {

    Swal.fire({
      title: '¿Estas seguro?',
      text: 'Estas a punto de borrar ' + medico.nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#229954',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrar hospital'
    }).then((borrar) => {
      console.log( borrar );
      if (borrar.value === true ) {

        this._medicoService.borrarMedico( medico._id)
                      .subscribe(borrado => {
                        this.cargarMedicos();
                      });
      }
    });

  }


}
