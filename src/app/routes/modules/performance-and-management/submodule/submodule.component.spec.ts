import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SubmoduleComponent} from './submodule.component';

describe('SubmenuComponent', () => {
  let component: SubmoduleComponent;
  let fixture: ComponentFixture<SubmoduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubmoduleComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmoduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
