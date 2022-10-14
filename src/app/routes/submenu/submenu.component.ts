import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-submenu',
  templateUrl: './submenu.component.html',
  styleUrls: ['./submenu.component.scss'],
})
export class SubmenuComponent implements OnInit {
  dataUrlConstructor: any;
  option: any;
  constructor(private router: Router) {
    this.dataUrlConstructor = this.router.getCurrentNavigation();
  }

  ngOnInit(): void {
    this.option = this.dataUrlConstructor.extras.state;
  }
}
