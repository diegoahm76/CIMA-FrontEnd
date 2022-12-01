import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FSINAComponent} from './fsina.component';

describe('FSINAComponent', () => {
  let component: FSINAComponent;
  let fixture: ComponentFixture<FSINAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FSINAComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FSINAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
