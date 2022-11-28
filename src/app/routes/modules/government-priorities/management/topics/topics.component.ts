import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.scss'],
})
export class TopicsComponent implements OnInit {
  dataUrlConstructor: any;
  module: string = '';
  submodule: string = '';
  constructor(private router: Router) {
    this.dataUrlConstructor = this.router.getCurrentNavigation();
  }

  ngOnInit(): void {
    this.module = this.dataUrlConstructor.extras.state.module;
    this.submodule = this.dataUrlConstructor.extras.state.submodule;
  }

  redirectToLink(modulo, submodule, topic) {
    this.router.navigateByUrl(modulo + '/' + submodule + '/' + topic, {
      state: {module: this.module, submodule: submodule, topic: topic},
    });
  }
}
