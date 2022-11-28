import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ClimateChangeManagementComponent} from './climate-change-management.component';

describe('ClimateChangeManagementComponent', () => {
  let component: ClimateChangeManagementComponent;
  let fixture: ComponentFixture<ClimateChangeManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClimateChangeManagementComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClimateChangeManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
