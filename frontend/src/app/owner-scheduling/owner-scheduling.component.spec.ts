import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerSchedulingComponent } from './owner-scheduling.component';

describe('OwnerSchedulingComponent', () => {
  let component: OwnerSchedulingComponent;
  let fixture: ComponentFixture<OwnerSchedulingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OwnerSchedulingComponent]
    });
    fixture = TestBed.createComponent(OwnerSchedulingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
