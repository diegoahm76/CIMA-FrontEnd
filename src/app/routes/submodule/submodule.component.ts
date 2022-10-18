import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-submodule',
  templateUrl: './submodule.component.html',
  styleUrls: ['./submodule.component.scss'],
})
export class SubmoduleComponent implements OnInit {
  dataUrlConstructor: any;
  module: string = '';
  constructor(private router: Router) {
    this.dataUrlConstructor = this.router.getCurrentNavigation();
  }

  ngOnInit(): void {
    this.module = this.dataUrlConstructor.extras.state.module;
  }

  redirectToLink(submodule) {
    this.router.navigateByUrl('develop/visor', {
      state: {module: this.module, submodule: submodule},
    });
  }
}
