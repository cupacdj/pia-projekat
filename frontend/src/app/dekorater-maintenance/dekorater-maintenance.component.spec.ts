import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DekoraterMaintenanceComponent } from './dekorater-maintenance.component';

describe('DekoraterMaintenanceComponent', () => {
  let component: DekoraterMaintenanceComponent;
  let fixture: ComponentFixture<DekoraterMaintenanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DekoraterMaintenanceComponent]
    });
    fixture = TestBed.createComponent(DekoraterMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
