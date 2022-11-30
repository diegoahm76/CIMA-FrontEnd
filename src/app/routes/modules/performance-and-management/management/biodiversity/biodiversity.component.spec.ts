import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BiodiversityComponent} from './biodiversity.component';

describe('BiodiversityComponent', () => {
  let component: BiodiversityComponent;
  let fixture: ComponentFixture<BiodiversityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BiodiversityComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BiodiversityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
