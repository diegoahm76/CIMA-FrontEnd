import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MmamaTressComponent} from './mmama-tress.component';

describe('MmamaTressComponent', () => {
  let component: MmamaTressComponent;
  let fixture: ComponentFixture<MmamaTressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MmamaTressComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MmamaTressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
