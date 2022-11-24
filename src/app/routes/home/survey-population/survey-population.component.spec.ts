import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SurveyPopulationComponent} from './survey-population.component';

describe('SurveyPopulationComponent', () => {
  let component: SurveyPopulationComponent;
  let fixture: ComponentFixture<SurveyPopulationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SurveyPopulationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyPopulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
