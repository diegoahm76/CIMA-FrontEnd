import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {FormBuilder} from '@angular/forms';

@Component({
  selector: 'survey-population',
  templateUrl: './survey-population.component.html',
  styleUrls: ['./survey-population.component.scss'],
})
export class SurveyPopulationComponent implements OnInit {
  @ViewChild('template') modal: TemplateRef<any>;

  checkoutForm;
  typeDocumentList: Array<any> = [];

  modalRef?: BsModalRef;
  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder
  ) {
    this.checkoutForm = this.formBuilder.group({
      name: '',
      address: '',
    });
  }

  ngOnInit(): void {}

  showModal() {
    this.modalRef = this.modalService.show(
      this.modal,
      Object.assign({}, {class: 'gray modal-xl'})
    );
  }

  onSubmit(customerData) {
    // Process checkout data here
    // this.items = this.cartService.clearCart();
    // this.checkoutForm.reset();
    // console.warn('Your order has been submitted', customerData);
  }
}
