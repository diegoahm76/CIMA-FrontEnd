import {ComponentFixture, TestBed} from '@angular/core/testing';

import {IEDIComponent} from './iedi.component';

describe('IEDIComponent', () => {
  let component: IEDIComponent;
  let fixture: ComponentFixture<IEDIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IEDIComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IEDIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
