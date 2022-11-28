import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-iedi',
  templateUrl: './iedi.component.html',
  styleUrls: ['./iedi.component.scss'],
})
export class IEDIComponent implements OnInit {
  dataUrlConstructor: any;
  module: string = '';
  submodule: string = '';
  topic: string = '';
  constructor(private router: Router) {
    this.dataUrlConstructor = this.router.getCurrentNavigation();
  }
  ngOnInit(): void {
    this.module = this.dataUrlConstructor.extras.state.module;
    this.submodule = this.dataUrlConstructor.extras.state.submodule;
    this.topic = this.dataUrlConstructor.extras.state.topic;
  }
}
