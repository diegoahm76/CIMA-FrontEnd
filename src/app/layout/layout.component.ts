import {Component, OnInit} from '@angular/core';

import {environment} from '@environments/environment';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  footer: string;

  ngOnInit() {
    this.footer = environment.footer;
  }
}
