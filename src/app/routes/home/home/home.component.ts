import {Component, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {SurveyPopulationComponent} from '../survey-population/survey-population.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  @ViewChild('surveyPopulation') surveyPopulation: SurveyPopulationComponent;
  constructor(private router: Router) {}

  ngAfterViewInit(): void {
    this.showModalSurveyPopulation();
  }

  redirectToLink(module) {
    this.router.navigateByUrl(module + '/submodule', {state: {module: module}});
  }

  showModalSurveyPopulation() {
    this.surveyPopulation.showModal();
  }
}
