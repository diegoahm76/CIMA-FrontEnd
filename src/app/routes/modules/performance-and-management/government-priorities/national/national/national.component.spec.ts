import {ComponentFixture, TestBed} from '@angular/core/testing';

import {NationalComponent} from './national.component';

describe('NationalComponent', () => {
  let component: NationalComponent;
  let fixture: ComponentFixture<NationalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NationalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NationalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
