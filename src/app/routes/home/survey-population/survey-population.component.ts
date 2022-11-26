import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Model} from '@app/shared/models';
import {environment} from '@environments/environment';
import {PopulationService} from '@app/api/populationServices/population.service';

@Component({
  selector: 'survey-population',
  templateUrl: './survey-population.component.html',
  styleUrls: ['./survey-population.component.scss'],
})
export class SurveyPopulationComponent implements OnInit {
  @ViewChild('template') modal: TemplateRef<any>;

  form: FormGroup;
  typeDocumentList: Array<Model | {strId: string; _label: string}> =
    environment.typeDocumentList;
  modalRef?: BsModalRef;

  typeDocumentMessage: string = '';
  documentNumberMessage: string = '';
  firstNameMessage: string = '';
  secondNameMessage: string = '';
  surnameMessage: string = '';
  secondSurnameMessage: string = '';
  emailMessage: string = '';
  phoneNumberMessage: string = '';

  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private populationService: PopulationService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = this.formBuilder.group({
      typeDocument: [''],
      documentNumber: [''],
      firstName: [''],
      secondName: [''],
      surname: [''],
      secondSurname: [''],
      email: [''],
      phoneNumber: [''],
      address: [''],
    });
  }

  showModal() {
    this.modalRef = this.modalService.show(
      this.modal,
      Object.assign({}, {class: 'gray modal-xl'})
    );
  }

  validateForm() {
    this.typeDocumentMessage =
      this.form.value.typeDocument != ''
        ? ''
        : 'El campo Tipo de Documento es requerido.';
    this.documentNumberMessage =
      this.form.value.documentNumber == ''
        ? 'El campo Numero de Documento es requerido.'
        : this.validateRegExp('^[0-9]{8,12}?$', this.form.value.documentNumber)
        ? ''
        : 'Numero de documento no válido.';
    this.firstNameMessage =
      this.form.value.firstName == ''
        ? 'El campo Primer Nombre es requerido.'
        : this.validateRegExp('^[a-zA-Z]{3,}?$', this.form.value.firstName)
        ? ''
        : 'Primer Nombre no válido.';
    this.secondNameMessage =
      this.form.value.secondName != ''
        ? this.validateRegExp('^[a-zA-Z]{3,}?$', this.form.value.secondName)
          ? ''
          : 'Segundo Nombre no válido.'
        : '';
    this.surnameMessage =
      this.form.value.surname == ''
        ? 'El campo Primer Apellido es requerido.'
        : this.validateRegExp('^[a-zA-Z]{3,}?$', this.form.value.surname)
        ? ''
        : 'Primer Apellido no válido.';
    this.secondSurnameMessage =
      this.form.value.secondSurname != ''
        ? this.validateRegExp('^[a-zA-Z]{3,}?$', this.form.value.secondSurname)
          ? ''
          : 'Segundo Apellido no válido.'
        : '';
    this.emailMessage =
      this.form.value.email == ''
        ? ''
        : this.validateRegExp(
            '^([da-z_.0-9]+)@([da-z.-]+)([.]+)([a-z.]{2,6})$',
            this.form.value.email
          )
        ? ''
        : 'Correo electronico no válido.';
    this.phoneNumberMessage =
      this.form.value.phoneNumber == ''
        ? ''
        : this.validateRegExp(
            '^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{3,6}$',
            this.form.value.phoneNumber
          )
        ? ''
        : 'Numero telefonico no válido.';

    return (
      this.typeDocumentMessage == '' &&
      this.documentNumberMessage == '' &&
      this.firstNameMessage == '' &&
      this.secondNameMessage == '' &&
      this.surnameMessage == '' &&
      this.secondSurnameMessage == '' &&
      this.emailMessage == '' &&
      this.phoneNumberMessage == ''
    );
  }

  validateRegExp(exp, value) {
    return new RegExp(exp).test(value);
  }

  setPersonModel() {
    return {
      tipodocumento: environment.typeDocumentList.find(
        (itemList) => itemList.strId == this.form.value.typeDocument
      )._label,
      numerodocumento: this.form.value.documentNumber,
      primernombre: this.form.value.firstName,
      segundonombre:
        this.form.value.secondName != '' ? this.form.value.secondName : null,
      primerapellido: this.form.value.surname,
      segundoapellido:
        this.form.value.secondSurname != ''
          ? this.form.value.secondSurname
          : null,
      correo: this.form.value.email != '' ? this.form.value.email : null,
      telefono:
        this.form.value.phoneNumber != '' ? this.form.value.phoneNumber : null,
      direccion: this.form.value.address != '' ? this.form.value.address : null,
    };
  }

  savePerson() {
    if (this.validateForm()) {
      this.populationService.createPerson(this.setPersonModel()).subscribe(
        (message) => {
          this.modalRef.hide();
          console.log(message);
          alert(message);
        },
        (error) => {
          console.log('mostrar modal de error', error);
          alert(error.error);
        }
      );
    }
  }
}
